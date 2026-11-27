// Bootstrap: wires the controls to the filter state, renders the list, and
// routes between the list (#/) and one deal (#/deal/<id>). No network calls:
// the whole board is data.js, loaded once at the first load.

import { deals, CHECKED_DAY } from "./data.js";
import { state, listCategories, listStores, applyFilters } from "./filters.js";
import { renderList, renderDetail, renderStats } from "./render.js";

const app = document.getElementById("app");
const grid = document.getElementById("grid");
const count = document.getElementById("count");
const search = document.getElementById("search");
const category = document.getElementById("category");
const store = document.getElementById("store");
const discount = document.getElementById("discount");
const sort = document.getElementById("sort");
const checkedNote = document.getElementById("checked-note");

function fillSelect(select, values) {
  for (const v of values) {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v === "All" ? `All ${select === category ? "categories" : "stores"}` : v;
    select.appendChild(o);
  }
}

fillSelect(category, listCategories(deals));
fillSelect(store, listStores(deals));
checkedNote.textContent = `Every price on this board was checked on ${CHECKED_DAY}.`;

function showList() {
  const list = applyFilters(deals);
  renderStats(count, deals.length, list.length);
  renderList(list, grid);
  app.hidden = false;
}

function route() {
  const hash = location.hash || "#/";
  const m = hash.match(/^#\/deal\/([a-z0-9-]+)$/);
  if (m) {
    const d = deals.find((x) => x.id === m[1]);
    if (d) {
      renderDetail(d, grid);
      count.textContent = `${d.title} · ${d.store}`;
      app.hidden = false;
      window.scrollTo(0, 0);
      return;
    }
  }
  showList();
}

search.addEventListener("input", () => {
  state.query = search.value;
  showList();
});
category.addEventListener("change", () => {
  state.category = category.value;
  showList();
});
store.addEventListener("change", () => {
  state.store = store.value;
  showList();
});
discount.addEventListener("change", () => {
  state.minDiscount = Number(discount.value);
  showList();
});
sort.addEventListener("change", () => {
  state.sort = sort.value;
  showList();
});
window.addEventListener("hashchange", route);

route();
