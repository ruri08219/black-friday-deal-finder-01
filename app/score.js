// Deal scoring. A deal's score is its discount, plus a bonus for how real the
// deal is: a record low earns the biggest bonus, a deep verified discount a
// smaller one, a routine discount none. The score tops out at 99 so no deal
// ever claims to be perfect.

export function discountPct(deal) {
  if (!deal.was || deal.was <= deal.price) return 0;
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savings(deal) {
  return Math.max(0, deal.was - deal.price);
}

export function dealScore(deal) {
  const pct = discountPct(deal);
  const bonus = deal.verdict === "NEW LOW" ? 20 : deal.verdict === "STRONG" ? 5 : 0;
  return Math.min(99, pct + bonus);
}

export function verdictClass(verdict) {
  return verdict === "NEW LOW" ? "newlow" : verdict === "STRONG" ? "strong" : "routine";
}

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

export function checkedLabel(deal) {
  // "2026-11-27T06:45:00Z" -> "27 Nov 2026, 06:45 UTC"
  const d = new Date(deal.checked);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
}
