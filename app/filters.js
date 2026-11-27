// Search, filter and sort state for the deal list. Every control on the page
// reads and writes this one state object, and applyFilters turns the full
// deal list into the visible list in one place.

import { discountPct, dealScore } from "./score.js";

export const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  sort: "score",
};

export function listCategories(deals) {
  const seen = new Set();
  for (const d of deals) seen.add(d.category);
  return ["All", ...[...seen].sort()];
}

export function listStores(deals) {
  const seen = new Set();
  for (const d of deals) seen.add(d.store);
  return ["All", ...[...seen].sort()];
}

export function applyFilters(deals) {
  const q = state.query.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountPct(d) < state.minDiscount) return false;
    return true;
  });
  const by = {
    score: (a, b) => dealScore(b) - dealScore(a) || discountPct(b) - discountPct(a),
    discount: (a, b) => discountPct(b) - discountPct(a) || dealScore(b) - dealScore(a),
    price: (a, b) => a.price - b.price,
    savings: (a, b) => (b.was - b.price) - (a.was - a.price),
  };
  out = [...out].sort(by[state.sort] ?? by.score);
  return out;
}
