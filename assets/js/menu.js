/*
 * Red Rooster — site settings and menu data.
 * This is the ONE file to edit when prices, hours or items change.
 * Source: Red_Rooster_Menu_October.pdf (October 2026 menu).
 */

window.RR_CONFIG = {
  name: "Red Rooster",
  tagline: "Taste Booster.",
  // WhatsApp number orders are sent to (international format, digits only).
  whatsapp: "233500477777",
  phones: ["+233 50 047 7777", "+233 59 711 1555"],
  instagram: "red.roostergh",
  address: "La-Bawaleshi Road, East Legon, Accra (opposite MTN)",
  mapQuery: "La-Bawaleshi Road East Legon Accra opposite MTN",
  currency: "GH₵",
  timezone: "Africa/Accra",
  // Opening hours, 24h clock. The WhatsApp reply said 12:30; the flyer says "From 1 PM".
  // TODO: confirm with the owner, and add the closing time ("close": "22:00").
  hours: { open: "12:30", close: null },
  notes: ["Dine-in & takeaway", "Offers are not available on Bolt Food"],
};

// Limited-time promos. They hide themselves automatically outside their dates.
window.RR_PROMOS = [
  {
    id: "deal-5-shawarmas",
    name: "5 Chicken Shawarmas",
    desc: "Classic, Ghanaian style or mix and match.",
    price: 200,
    img: "deal-5-shawarmas",
    start: "2026-10-01",
    end: "2026-10-07",
    options: [{ label: "Style", choices: ["Classic", "Ghanaian style", "Mix"] }],
  },
];

window.RR_CATEGORIES = [
  { id: "deals", label: "Deals" },
  { id: "shawarma", label: "Shawarma" },
  { id: "burgers", label: "Burgers" },
  { id: "sandwiches", label: "Sandwiches" },
  { id: "chicken", label: "Roasted Chicken" },
  { id: "wings", label: "Wings & Rice Bowls" },
  { id: "crispy", label: "Crispy" },
  { id: "sides", label: "Sides & Sauces" },
];

const RICE = { label: "Rice", choices: ["Jollof rice", "Fried rice"] };
const FRIES_OR_RICE = { label: "Side", choices: ["Fries", "Jollof rice", "Fried rice"] };

// tags: drink = a drink is included, spicy, grilled, crispy, weekend = Fri/Sat/Sun only
window.RR_MENU = [
  // Everyday + weekend deals
  { id: "family-platter", cat: "deals", name: "Family Share Platter", price: 235, img: "family-platter",
    desc: "½ rotisserie chicken, 2 rice portions, 1 chicken shawarma (4 cuts), 4 wings, 3 crispy strips, fries, garlic & cheddar sauces, 2 drinks.",
    tags: ["weekend", "drink", "share"], serves: 3 },
  { id: "sub-burger-combo", cat: "deals", name: "Any Sub + Any Burger", price: 160, img: "sub-burger-combo",
    desc: "Any sub and any burger with fries and 2 iced drinks.", tags: ["weekend", "drink", "share"], serves: 2 },

  // Shawarma
  { id: "ghanaian-shawarma", cat: "shawarma", name: "Ghanaian Style Shawarma", price: 50, img: "ghanaian-shawarma",
    desc: "Chicken shawarma, mixed vegetables, chips & special spicy sauce.", tags: ["spicy", "popular"] },
  { id: "classic-shawarma", cat: "shawarma", name: "Classic Shawarma", price: 50, img: "classic-shawarma",
    desc: "Chicken shawarma, chips, pickles & garlic sauce in Lebanese bread.", tags: ["popular"] },

  // Burgers (a drink is included with every burger)
  { id: "honey-mustard-roost", cat: "burgers", name: "Honey Mustard Roost", price: 90, img: "honey-mustard-roost",
    desc: "Fried chicken breast, lettuce, tomatoes & honey mustard sauce.", tags: ["drink", "crispy"] },
  { id: "smoke-beak", cat: "burgers", name: "Smoke Beak", price: 90, img: "smoke-beak",
    desc: "Fried chicken breast, lettuce, tomatoes & BBQ sauce.", tags: ["drink", "crispy"] },
  { id: "spicy-cluck", cat: "burgers", name: "Spicy Cluck", price: 90, img: "spicy-cluck",
    desc: "Fried chicken breast, lettuce, tomatoes, cheddar cheese & mayo sauce.", tags: ["drink", "crispy", "spicy"] },
  { id: "chicken-breast-burger", cat: "burgers", name: "Chicken Breast", price: 90, img: "chicken-breast-burger",
    desc: "Grilled chicken breast, lettuce, tomatoes, cheddar cheese & mayo mustard sauce.", tags: ["drink", "grilled"] },
  { id: "ranch-rush", cat: "burgers", name: "Ranch Rush", price: 90, img: "ranch-rush",
    desc: "Fried chicken breast, lettuce, tomatoes & ranch sauce.", tags: ["drink", "crispy"] },

  // Sandwiches (a drink is included with every sandwich)
  { id: "tawouk-sandwich", cat: "sandwiches", name: "Tawouk Sandwich", price: 80, img: "tawouk-sandwich",
    desc: "Grilled chicken, chips, pickles & garlic sauce in Lebanese bread.", tags: ["drink", "grilled"] },
  { id: "crunchy-rooster", cat: "sandwiches", name: "Crunchy Rooster (Crispy)", price: 90, img: "crunchy-rooster",
    desc: "Crispy chicken, chips, coleslaw & ketchup. Garlic sauce optional.", tags: ["drink", "crispy"],
    options: [{ label: "Garlic sauce", choices: ["No garlic sauce", "Add garlic sauce"] }] },
  { id: "rooster-fiesta", cat: "sandwiches", name: "Rooster Fiesta", price: 90, img: "rooster-fiesta",
    desc: "Grilled chicken breast, onion, green pepper, sweet corn, mozzarella & mayo.", tags: ["drink", "grilled"] },
  { id: "chili-beak", cat: "sandwiches", name: "Chili Beak", price: 90, img: "chili-beak",
    desc: "Grilled chicken breast, onion, red pepper, chili pepper, mozzarella & cocktail sauce.", tags: ["drink", "grilled", "spicy"] },
  { id: "rooster-sub", cat: "sandwiches", name: "Rooster Sub", price: 90, img: "rooster-sub",
    desc: "Grilled chicken breast, pickles, sweet corn, lettuce, mozzarella & mayo. Garlic sauce optional.", tags: ["drink", "grilled"],
    options: [{ label: "Garlic sauce", choices: ["No garlic sauce", "Add garlic sauce"] }] },
  { id: "rooster-twist", cat: "sandwiches", name: "Rooster Twist", price: 90, img: "rooster-twist",
    desc: "Crispy chicken, tomato, lettuce, cheddar & mayo in tortilla bread.", tags: ["drink", "crispy"] },
  { id: "roosted-tawouk", cat: "sandwiches", name: "Roosted Tawouk", price: 90, img: "roosted-tawouk",
    desc: "Grilled chicken, chips, pickles, coleslaw, garlic sauce & ketchup in baguette bread.", tags: ["drink", "grilled"] },

  // Roasted chicken
  { id: "whole-chicken", cat: "chicken", name: "Whole Roasted Chicken", price: 100, img: "whole-chicken",
    desc: "Whole rotisserie chicken.", tags: ["share", "popular"], serves: 3 },
  { id: "half-chicken", cat: "chicken", name: "Half Chicken + Rice + Drink", price: 85, img: "half-chicken",
    desc: "Half rotisserie chicken with your choice of jollof or fried rice, plus one drink.", tags: ["drink", "popular"],
    options: [RICE] },

  // Wings & rice bowls (one drink included with every meal)
  { id: "chicken-wings", cat: "wings", name: "Chicken Wings (6 pcs)", price: 80, img: "chicken-wings",
    desc: "Six wings in your choice of BBQ, ranch, honey mustard or buffalo sauce.", tags: ["drink"],
    options: [{ label: "Sauce", choices: ["BBQ", "Ranch", "Honey mustard", "Buffalo"] }] },
  { id: "regular-wings", cat: "wings", name: "Regular Wings (6 pcs)", price: 70, img: "regular-wings",
    desc: "Six regular chicken wings.", tags: ["drink"] },
  { id: "rice-bowl-wings", cat: "wings", name: "Rice Bowl with Wings", price: 65, img: "rice-bowl-wings",
    desc: "Rice with 2 chicken wings.", tags: ["drink", "value"], options: [RICE] },
  { id: "rice-bowl-thigh", cat: "wings", name: "Rice Bowl with Fried Chicken Thigh", price: 65, img: "rice-bowl-thigh",
    desc: "Rice with 2 fried chicken thigh pieces.", tags: ["drink", "value"], options: [RICE] },
  { id: "rice-bowl-strips", cat: "wings", name: "Rice Bowl with Chicken Strips", price: 65, img: "rice-bowl-strips",
    desc: "Rice with 2 crispy chicken strips.", tags: ["drink", "value", "crispy"], options: [RICE] },
  { id: "rice-bowl-shawarma", cat: "wings", name: "Rice Bowl with Chicken Shawarma", price: 65, img: "rice-bowl-shawarma",
    desc: "Rice topped with chicken shawarma.", tags: ["drink", "value"], options: [RICE] },

  // Crispy deals
  { id: "crispy-8", cat: "crispy", name: "8 Crispy Strips", price: 110, img: "crispy-8",
    desc: "8 crispy chicken strips + fries OR rice + 1 drink.", tags: ["drink", "crispy"], options: [FRIES_OR_RICE] },
  { id: "crispy-16", cat: "crispy", name: "16 Crispy Strips", price: 200, img: "crispy-16",
    desc: "16 crispy chicken strips + fries OR rice + 2 drinks.", tags: ["drink", "crispy", "share"], serves: 2,
    options: [FRIES_OR_RICE] },

  // Sides
  { id: "fried-rice", cat: "sides", name: "Fried Rice", price: 40, img: "fried-rice", desc: "Side portion.", tags: ["side"] },
  { id: "jollof-rice", cat: "sides", name: "Jollof Rice", price: 40, img: "jollof-rice", desc: "Side portion.", tags: ["side"] },
  { id: "chips", cat: "sides", name: "Chips", price: 30, img: "chips", desc: "Golden fries.", tags: ["side"] },
  { id: "pickles", cat: "sides", name: "Pickles", price: 15, img: "pickles", desc: "Side of pickles.", tags: ["side"] },
  // Sauces
  { id: "garlic-sauce", cat: "sides", name: "Garlic Sauce", price: 20, img: "garlic-sauce", desc: "Extra sauce.", tags: ["sauce"] },
  { id: "cocktail-sauce", cat: "sides", name: "Cocktail Sauce", price: 10, img: "cocktail-sauce", desc: "Extra sauce.", tags: ["sauce"] },
  { id: "bbq-sauce", cat: "sides", name: "BBQ Sauce", price: 20, img: "bbq-sauce", desc: "Extra sauce.", tags: ["sauce"] },
  { id: "honey-mustard-sauce", cat: "sides", name: "Honey Mustard Sauce", price: 20, img: "honey-mustard-sauce", desc: "Extra sauce.", tags: ["sauce"] },
  { id: "ranch-sauce", cat: "sides", name: "Ranch Sauce", price: 20, img: "ranch-sauce", desc: "Extra sauce.", tags: ["sauce"] },
  { id: "cheddar-sauce", cat: "sides", name: "Cheddar Cheese Sauce", price: 20, img: "cheddar-sauce", desc: "Extra sauce.", tags: ["sauce"] },
];
