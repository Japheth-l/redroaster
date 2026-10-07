/*
 * "Ask Rooster" — a menu helper that runs entirely in the browser.
 * It matches keywords against the menu data; it is NOT a large language model.
 * To upgrade it to a real AI later, replace RR_ASSISTANT.reply() with a call to
 * your own server endpoint (never put an AI API key in this public file).
 */
(function () {
  const C = window.RR_CONFIG;
  const money = (n) => `${C.currency}${n}`;
  const has = (q, ...words) => words.some((w) => q.includes(w));

  function numberIn(q) {
    const m = q.match(/(\d{2,4})/);
    return m ? Number(m[1]) : null;
  }

  function reply(raw, ctx) {
    const q = raw.toLowerCase().trim();
    const menu = ctx.available();
    if (!q) return { text: "Ask me about the menu, prices, hours or how to order." };

    if (/^(hi|hello|hey|good (morning|afternoon|evening)|akwaaba)\b/.test(q) && q.length < 20) {
      return { text: "Akwaaba! 🐓 I can suggest food for your budget, find spicy or grilled options, or tell you our hours and location." };
    }
    if (has(q, "hour", "open", "close", "time", "when")) {
      return { text: ctx.hoursText() };
    }
    if (has(q, "where", "location", "address", "direction", "find you")) {
      return { text: `We're at ${C.address}. Tap "Get directions" in the Visit section for the map.` };
    }
    if (has(q, "bolt", "glovo", "delivery", "deliver")) {
      return { text: `Order straight from this site. Choose "Delivery" in your order and send it on WhatsApp, and we'll confirm the delivery cost there. Note: ${C.notes[1].toLowerCase()}.` };
    }
    if (has(q, "phone", "call", "number", "whatsapp", "contact")) {
      return { text: `Call or WhatsApp ${C.phones.join(" or ")}. Instagram: @${C.instagram}.` };
    }
    if (has(q, "pay", "momo", "mobile money", "card", "cash")) {
      return { text: "Payment is arranged when we confirm your order on WhatsApp." };
    }
    if (has(q, "drink", "coke", "soda")) {
      const withDrink = menu.filter((i) => i.tags.includes("drink"));
      return { text: `A drink is included with all burgers, sandwiches, wings, rice bowls and most meals (${withDrink.length} items). Say which drink you'd like in the order notes.` };
    }

    const food = menu.filter((i) => !i.tags.includes("sauce"));
    let pool = food;
    const notes = [];
    const budget = numberIn(q);
    const people = (q.match(/(\d+)\s*(people|persons|of us|pax)/) || [])[1];

    if (people) {
      const n = Number(people);
      pool = pool.filter((i) => (i.serves || 1) >= Math.min(n, 3));
      notes.push(`for ${n}`);
    } else if (budget && budget >= 10) {
      pool = pool.filter((i) => i.price <= budget);
      notes.push(`up to ${money(budget)}`);
    }
    if (has(q, "spicy", "hot", "pepper", "chili", "chilli")) { pool = pool.filter((i) => i.tags.includes("spicy")); notes.push("spicy"); }
    if (has(q, "grill", "healthy", "light")) { pool = pool.filter((i) => i.tags.includes("grilled")); notes.push("grilled"); }
    if (has(q, "crisp", "fried", "crunch")) { pool = pool.filter((i) => i.tags.includes("crispy")); notes.push("crispy"); }
    if (has(q, "share", "family", "group", "friends", "party")) { pool = pool.filter((i) => i.tags.includes("share")); notes.push("for sharing"); }
    if (has(q, "jollof", "rice")) { pool = pool.filter((i) => /rice|jollof/i.test(i.name + i.desc)); notes.push("with rice"); }
    if (has(q, "wing")) { pool = pool.filter((i) => /wing/i.test(i.name + i.desc)); }
    if (has(q, "burger")) { pool = pool.filter((i) => i.cat === "burgers"); }
    if (has(q, "shawarma")) { pool = pool.filter((i) => /shawarma/i.test(i.name + i.desc)); }
    if (has(q, "sandwich", "sub", "wrap")) { pool = pool.filter((i) => i.cat === "sandwiches"); }
    if (has(q, "deal", "promo", "offer", "special", "discount")) {
      pool = menu.filter((i) => i.cat === "deals" || i.promo);
      notes.push("deals");
    }
    if (has(q, "cheap", "budget", "cheapest", "broke", "student")) {
      pool = pool.filter((i) => i.cat !== "sides").sort((a, b) => a.price - b.price);
      notes.push("best value");
    } else if (has(q, "popular", "best", "recommend", "suggest", "should i", "what's good", "hungry")) {
      const pop = pool.filter((i) => i.tags.includes("popular") || i.tags.includes("value"));
      if (pop.length) pool = pop;
    }

    if (pool === food) {
      // No recognised intent: fall back to a plain text search of the menu.
      const words = q.split(/\W+/).filter((w) => w.length > 2);
      pool = menu.filter((i) => words.some((w) => (i.name + " " + i.desc).toLowerCase().includes(w)));
    }

    if (!pool.length) {
      return { text: "I couldn't find a match on our menu. Try a budget (\"under 70\"), a mood (\"spicy\", \"grilled\") or a dish (\"wings\", \"jollof\"). For anything else, chat with us on WhatsApp." };
    }
    const label = notes.length ? `Here's what I'd pick (${notes.join(", ")}):` : "Here's what I found:";
    return { text: label, items: pool.slice(0, 5) };
  }

  window.RR_ASSISTANT = {
    reply,
    suggestions: ["What's good under 70?", "Something spicy", "Food for 3 people", "Opening hours", "Any deals?", "Where are you?"],
  };
})();
