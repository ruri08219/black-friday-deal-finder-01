// Renders the deal list and the single-deal view. Everything shown comes
// from data.js through score.js; nothing here invents a price, a store or a
// link. Text is escaped before it reaches the page.

import { discountPct, savings, dealScore, verdictClass, money, checkedLabel } from "./score.js";
import { deals } from "./data.js";

export function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function dealCard(d) {
  const pct = discountPct(d);
  return `<article class="card" id="deal-${esc(d.id)}">
    <div class="card-top">
      <span class="cat">${esc(d.category)}</span>
      <span class="verdict ${verdictClass(d.verdict)}">${esc(d.verdict)}</span>
    </div>
    <h3><a href="#/deal/${esc(d.id)}">${esc(d.title)}</a></h3>
    <p class="store">${esc(d.store)}</p>
    <p class="prices"><span class="now">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="pct">-${pct}%</span></p>
    <p class="save">You save ${money(savings(d))} &middot; Deal score ${dealScore(d)}/100</p>
    <p class="checked">Checked ${checkedLabel(d)}</p>
    <p class="actions"><a class="buy" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a>
    <a class="detail" href="#/deal/${esc(d.id)}">Why this deal?</a></p>
  </article>`;
}

export function renderList(list, host) {
  if (!list.length) {
    host.innerHTML = `<p class="empty">No deals match those filters. Clear the search or lower the discount to see the whole board again.</p>`;
    return;
  }
  host.innerHTML = list.map(dealCard).join("\n");
}

export function compareBox(d) {
  if (!d.group) return "";
  const others = deals.filter((x) => x.group === d.group && x.id !== d.id);
  if (!others.length) return "";
  const rows = [d, ...others]
    .slice()
    .sort((a, b) => a.price - b.price)
    .map(
      (x) =>
        `<tr${x.id === d.id ? ' class="here"' : ""}><td>${esc(x.store)}</td><td>${money(x.price)}</td><td>-${discountPct(x)}%</td><td>${esc(x.verdict)}</td></tr>`,
    )
    .join("\n");
  const best = [d, ...others].reduce((a, b) => (a.price <= b.price ? a : b));
  const gap = others.length ? money(Math.max(0, others[0].price - best.price)) : "$0";
  return `<section class="compare">
    <h2>Same product, compared across stores</h2>
    <table><thead><tr><th>Store</th><th>Price</th><th>Off</th><th>Verdict</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="compare-note">Best price: <strong>${esc(best.store)} at ${money(best.price)}</strong>${others.length ? ` — ${gap} cheaper than ${esc(others[0].store)}` : ""}. Prices checked ${checkedLabel(d)}.</p>
  </section>`;
}

export function renderDetail(d, host) {
  const pct = discountPct(d);
  host.innerHTML = `<p class="back"><a href="#/">&larr; All deals</a></p>
  <article class="detail-card">
    <div class="card-top">
      <span class="cat">${esc(d.category)}</span>
      <span class="verdict ${verdictClass(d.verdict)}">${esc(d.verdict)}</span>
    </div>
    <h2>${esc(d.title)}</h2>
    <p class="store">${esc(d.store)}</p>
    <p class="prices big"><span class="now">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="pct">-${pct}%</span></p>
    <p class="save">You save ${money(savings(d))} &middot; Deal score ${dealScore(d)}/100</p>
    <p class="why"><strong>Why this is a deal:</strong> ${esc(d.note)}</p>
    <p class="checked">Price checked ${checkedLabel(d)}.<br>Source: ${esc(d.source)}.</p>
    <p class="actions"><a class="buy" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a></p>
  </article>
  ${compareBox(d)}`;
}

export function renderStats(host, total, shown) {
  host.textContent = `${total} deals · ${shown} shown · checked 27 Nov 2026`;
}
