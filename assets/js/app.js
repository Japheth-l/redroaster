(function () {
  const C = window.RR_CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = (n) => `${C.currency}${n}`;
  const img = (name) => `assets/img/${name}.jpg`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Time in Accra ---------- */
  function now() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: C.timezone, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false,
      }).formatToParts(new Date()).map((p) => [p.type, p.value])
    );
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
      weekday: parts.weekday, // Mon, Tue, ...
    };
  }
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt12 = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h < 12 ? "AM" : "PM"}`;
  };
  const isWeekend = () => ["Fri", "Sat", "Sun"].includes(now().weekday);

  function openState() {
    const { open, close } = C.hours;
    const t = now().minutes;
    if (!close) return { known: false, open: t >= toMin(open) };
    const o = toMin(open), c = toMin(close);
    const isOpen = c > o ? t >= o && t < c : t >= o || t < c;
    return { known: true, open: isOpen };
  }
  function hoursText() {
    const { open, close } = C.hours;
    const s = openState();
    const span = close ? `${fmt12(open)} – ${fmt12(close)} daily` : `Daily from ${fmt12(open)}`;
    if (!s.known) return `${span}. Message us on WhatsApp to check closing time tonight.`;
    return `${span}. We're ${s.open ? "open now" : "closed right now"}.`;
  }

  /* ---------- Menu data ---------- */
  const today = now().date;
  const promos = window.RR_PROMOS
    .filter((p) => today >= p.start && today <= p.end)
    .map((p) => ({ ...p, cat: "deals", tags: ["promo", "share"], promo: true, serves: 3 }));
  const MENU = [...promos, ...window.RR_MENU];
  const byId = Object.fromEntries(MENU.map((i) => [i.id, i]));
  const availableNow = (i) => !i.tags.includes("weekend") || isWeekend();

  /* ---------- Header / hero / visit ---------- */
  function renderStatic() {
    const s = openState();
    const st = $("#status");
    st.classList.toggle("is-open", s.known && s.open);
    st.classList.toggle("is-closed", s.known && !s.open);
    $("#statusText").textContent = s.known
      ? (s.open ? `Open now · until ${fmt12(C.hours.close)}` : `Closed · opens ${fmt12(C.hours.open)}`)
      : `Open daily from ${fmt12(C.hours.open)}`;

    $("#heroNotes").innerHTML = [...C.notes, isWeekend() ? "Weekend deals on today" : "Weekend deals Fri–Sun"]
      .map((n) => `<li>${esc(n)}</li>`).join("");

    $("#addr").textContent = C.address;
    $("#hours").textContent = hoursText();
    $("#phones").innerHTML = C.phones.map((p) => `<a href="tel:${p.replace(/\s/g, "")}">${p}</a>`).join("<br>");
    $("#insta").innerHTML = `<a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">@${C.instagram}</a>`;
    $("#waDirect").href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hello Red Rooster! ")}`;
    const q = encodeURIComponent(C.mapQuery);
    $("#directions").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    $("#map").src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;

    $("#flyers").innerHTML = Array.from({ length: 7 }, (_, k) =>
      `<button data-flyer="${k + 1}" aria-label="View menu page ${k + 1}"><img src="${img("menu-page-" + (k + 1))}" alt="" loading="lazy"></button>`
    ).join("");

    const p = promos[0];
    if (p) {
      const end = new Date(p.end + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      $("#promo").hidden = false;
      $("#promo").innerHTML = `
        <div class="promo__text">
          <span class="promo__badge">Ends ${esc(end)}</span>
          <h2>${esc(p.name)}</h2>
          <p>${esc(p.desc)}</p>
          <p class="promo__price">${money(p.price)}</p>
          <button class="btn btn--primary" data-add="${p.id}">Grab the deal</button>
        </div>
        <img src="${img(p.img)}" alt="Five chicken shawarmas">`;
    }
  }

  /* ---------- Menu rendering ---------- */
  const state = { cat: "all", q: "", filters: new Set() };
  const cats = [{ id: "all", label: "All" }, ...window.RR_CATEGORIES];

  function renderTabs() {
    $("#tabs").innerHTML = cats.map((c) =>
      `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === state.cat}">${esc(c.label)}</button>`
    ).join("");
  }

  const TAG_LABEL = { drink: "Drink included", spicy: "Spicy", grilled: "Grilled", crispy: "Crispy", popular: "Popular", value: "Great value", promo: "Limited time" };

  function card(i) {
    const avail = availableNow(i);
    const tags = i.tags.filter((t) => TAG_LABEL[t]).map((t) =>
      `<span class="tag ${t === "spicy" ? "tag--spicy" : ""}">${TAG_LABEL[t]}</span>`);
    if (i.tags.includes("weekend")) tags.unshift(`<span class="tag ${avail ? "tag--weekend" : "tag--off"}">Fri–Sun only</span>`);
    if (i.serves > 1) tags.push(`<span class="tag">Serves ${i.serves}+</span>`);
    return `
      <article class="card">
        <div class="card__img"><img src="${img(i.img)}" alt="${esc(i.name)}" loading="lazy"></div>
        <div class="card__body">
          <h3>${esc(i.name)}</h3>
          <p>${esc(i.desc)}</p>
          <div class="tags">${tags.join("")}</div>
          <div class="card__foot">
            <span class="price">${money(i.price)}</span>
            <button class="add" data-add="${i.id}" ${avail ? "" : "disabled"} aria-label="Add ${esc(i.name)}">${avail ? "Add +" : "Fri–Sun"}</button>
          </div>
        </div>
      </article>`;
  }

  function matches(i) {
    if (state.cat !== "all" && i.cat !== state.cat) return false;
    for (const f of state.filters) {
      if (f === "under70" ? i.price >= 70 || i.cat === "sides" : !i.tags.includes(f)) return false;
    }
    if (state.q) {
      const hay = `${i.name} ${i.desc} ${i.tags.join(" ")} ${i.cat}`.toLowerCase();
      return state.q.split(/\s+/).every((w) => hay.includes(w));
    }
    return true;
  }

  function renderMenu() {
    const shown = MENU.filter(matches);
    const grouped = state.cat === "all" && !state.q && !state.filters.size;
    let html = "";
    if (grouped) {
      for (const c of window.RR_CATEGORIES) {
        const items = shown.filter((i) => i.cat === c.id);
        if (items.length) html += `<h3 class="cat-title" id="cat-${c.id}">${esc(c.label)}</h3>` + items.map(card).join("");
      }
    } else {
      html = shown.map(card).join("");
    }
    $("#grid").innerHTML = html;
    $("#empty").hidden = shown.length > 0;
  }

  /* ---------- Cart ---------- */
  const CART_KEY = "rr-cart-v1";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
  cart = cart.filter((l) => byId[l.id]);

  const save = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage blocked */ } };
  const lineKey = (id, opts) => id + "|" + opts.join("|");
  const cartTotal = () => cart.reduce((s, l) => s + byId[l.id].price * l.qty, 0);

  function addToCart(id, opts = [], qty = 1) {
    const key = lineKey(id, opts);
    const line = cart.find((l) => lineKey(l.id, l.opts) === key);
    if (line) line.qty += qty; else cart.push({ id, opts, qty });
    save(); renderCart();
    toast(`Added ${qty} × ${byId[id].name}`);
    const b = $("#cartOpen"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }

  function renderCart() {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $("#cartCount").textContent = count;
    $("#cartEmpty").hidden = count > 0;
    $("#checkout").hidden = count === 0;
    $("#total").textContent = money(cartTotal());
    $("#lines").innerHTML = cart.map((l, k) => {
      const i = byId[l.id];
      return `<li class="line">
        <img src="${img(i.img)}" alt="">
        <div>
          <div class="line__name">${esc(i.name)}</div>
          ${l.opts.length ? `<div class="line__opts">${esc(l.opts.join(" · "))}</div>` : ""}
          <div class="line__ctrl">
            <button data-line="${k}" data-step="-1" aria-label="One fewer ${esc(i.name)}">−</button>
            <span>${l.qty}</span>
            <button data-line="${k}" data-step="1" aria-label="One more ${esc(i.name)}">+</button>
          </div>
        </div>
        <div class="line__price">${money(i.price * l.qty)}</div>
      </li>`;
    }).join("");
  }

  function orderMessage(form) {
    const d = new FormData(form);
    const rows = cart.map((l) => {
      const i = byId[l.id];
      return `• ${l.qty} × ${i.name}${l.opts.length ? ` (${l.opts.join(", ")})` : ""} — ${money(i.price * l.qty)}`;
    });
    return [
      "Hello Red Rooster! I'd like to order:",
      "",
      ...rows,
      "",
      `Total: ${money(cartTotal())}`,
      `Order type: ${d.get("mode")}`,
      `Name: ${d.get("name")}`,
      d.get("mode") === "Delivery" && d.get("address") ? `Deliver to: ${d.get("address")}` : null,
      d.get("notes") ? `Notes: ${d.get("notes")}` : null,
    ].filter((x) => x !== null).join("\n");
  }

  /* ---------- Item dialog ---------- */
  const dlg = $("#itemDialog");
  let current = null, qty = 1;

  function openItem(id) {
    const i = byId[id];
    if (!i.options) return addToCart(id);
    current = i; qty = 1;
    $("#itemImg").src = img(i.img);
    $("#itemTitle").textContent = i.name;
    $("#itemDesc").textContent = i.desc;
    $("#itemQty").textContent = qty;
    $("#itemAdd").textContent = `Add · ${money(i.price)}`;
    $("#itemOptions").innerHTML = i.options.map((o, k) => `
      <fieldset class="opt"><legend>${esc(o.label)}</legend><div class="opt__choices">
        ${o.choices.map((c, j) => `<label><input type="radio" name="opt${k}" value="${esc(c)}" ${j === 0 ? "checked" : ""}><span>${esc(c)}</span></label>`).join("")}
      </div></fieldset>`).join("");
    dlg.showModal();
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(text) {
    const t = $("#toast");
    t.textContent = text; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- Assistant UI ---------- */
  const chat = $("#chat"), log = $("#chatLog");
  function say(who, text, items) {
    const el = document.createElement("div");
    el.className = `msg msg--${who}`;
    el.textContent = text;
    if (items && items.length) {
      const ul = document.createElement("ul");
      ul.innerHTML = items.map((i) =>
        `<li>${esc(i.name)} — <strong>${money(i.price)}</strong><button class="mini-add" data-add="${i.id}" aria-label="Add ${esc(i.name)}">Add</button></li>`).join("");
      el.appendChild(ul);
    }
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }
  function openChat() {
    chat.hidden = false;
    $(".chat-fab").hidden = true;
    if (!log.children.length) {
      say("bot", "Hi, I'm Rooster 🐓 Tell me your budget, your mood or how many people you're feeding, and I'll pick from the menu.");
      $("#chatSuggest").innerHTML = window.RR_ASSISTANT.suggestions.map((s) => `<button>${esc(s)}</button>`).join("");
    }
    $("#chatInput").focus();
  }
  function ask(text) {
    say("me", text);
    const r = window.RR_ASSISTANT.reply(text, { available: () => MENU.filter(availableNow), hoursText });
    setTimeout(() => say("bot", r.text, r.items), 250);
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.dataset.add) openItem(t.dataset.add);
    else if (t.dataset.cat) {
      state.cat = t.dataset.cat; renderTabs(); renderMenu();
      $("#menu").scrollIntoView({ behavior: "smooth" });
    } else if (t.dataset.filter) {
      const f = t.dataset.filter;
      state.filters.has(f) ? state.filters.delete(f) : state.filters.add(f);
      t.setAttribute("aria-pressed", state.filters.has(f));
      renderMenu();
    } else if (t.dataset.line) {
      const l = cart[Number(t.dataset.line)];
      l.qty += Number(t.dataset.step);
      if (l.qty <= 0) cart.splice(Number(t.dataset.line), 1);
      save(); renderCart();
    } else if (t.dataset.flyer) {
      $("#viewerImg").src = img("menu-page-" + t.dataset.flyer);
      $("#viewerImg").alt = `Red Rooster menu page ${t.dataset.flyer}`;
      $("#viewer").showModal();
    } else if ("openChat" in t.dataset) openChat();
    else if (t.parentElement && t.parentElement.id === "chatSuggest") ask(t.textContent);
  });

  $("#search").addEventListener("input", (e) => {
    state.q = e.target.value.toLowerCase().trim();
    if (state.q && state.cat !== "all") { state.cat = "all"; renderTabs(); }
    renderMenu();
  });

  $$(".qty__btn").forEach((b) => b.addEventListener("click", () => {
    qty = Math.max(1, Math.min(20, qty + Number(b.dataset.step)));
    $("#itemQty").textContent = qty;
    $("#itemAdd").textContent = `Add · ${money(current.price * qty)}`;
  }));
  $("#itemCancel").addEventListener("click", () => dlg.close());
  $("#itemForm").addEventListener("submit", () => {
    const opts = current.options.map((_, k) => $(`input[name="opt${k}"]:checked`, dlg).value);
    addToCart(current.id, opts, qty);
  });

  const cartDlg = $("#cart");
  $("#cartOpen").addEventListener("click", () => cartDlg.showModal());
  $("#cartClose").addEventListener("click", () => cartDlg.close());
  [cartDlg, $("#viewer"), dlg].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  $$('input[name="mode"]').forEach((r) => r.addEventListener("change", () => {
    const delivery = $('input[name="mode"]:checked').value === "Delivery";
    $("#addrField").hidden = !delivery;
    $('#addrField input').required = delivery;
  }));
  $("#checkout").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(orderMessage(e.target))}`;
    window.open(url, "_blank", "noopener");
  });

  $("#chatClose").addEventListener("click", () => { chat.hidden = true; $(".chat-fab").hidden = false; });
  $("#chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#chatInput");
    if (input.value.trim()) ask(input.value.trim());
    input.value = "";
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) $("#chatClose").click(); });

  renderStatic(); renderTabs(); renderMenu(); renderCart();
})();
