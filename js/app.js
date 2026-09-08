/* Impound Ransom — client app */
(() => {
  const $ = (id) => document.getElementById(id);
  const views = {};
  const state = {
    cityQ: "",
    plate: "",
    block: "",
    city: null,
    result: null,
    billed: { tow: 350, storageDays: 2, storageEach: 75, extras: [] },
    paid: loadPaid()
  };

  function loadPaid() {
    try { return JSON.parse(localStorage.getItem("ir_paid") || "{}"); } catch { return {}; }
  }
  function savePaid() { localStorage.setItem("ir_paid", JSON.stringify(state.paid)); }

  function show(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("on"));
    const el = views[name] || $(name);
    if (el) el.classList.add("on");
    window.scrollTo(0, 0);
  }

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("on");
    setTimeout(() => t.classList.remove("on"), 2200);
  }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => toast("Copied")).catch(() => toast("Copy failed"));
  }

  function fmtMoney(n) {
    return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  function keyFor() {
    return (state.plate + "|" + (state.city?.id || state.cityQ)).toUpperCase();
  }

  function hasLookup() { return !!state.paid[keyFor() + "|19"]; }
  function hasPack() { return !!state.paid[keyFor() + "|79"]; }

  function unlock(tier) {
    state.paid[keyFor() + "|" + tier] = Date.now();
    savePaid();
  }

  async function lookupChicago(plate) {
    const p = encodeURIComponent(plate.replace(/\s+/g, "").toUpperCase());
    const url = `https://data.cityofchicago.org/resource/ygr5-vcbg.json?$limit=5&$where=upper(plate)='${p}'`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Chicago data portal unavailable");
    const rows = await res.json();
    return rows;
  }

  function demoResult(reason) {
    const city = state.city;
    const lot = city?.lots?.[0];
    const st = window.IR_stateOf(city?.state || "DEFAULT");
    return {
      found: true,
      source: reason,
      lot: lot || { name: "Contract impound yard", address: "Call the official number for the exact stall", phone: city?.phones?.[0]?.tel || "311", hours: "Confirm", notes: "" },
      inventory: "INV-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      towedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      state: st,
      city
    };
  }

  async function runLookup() {
    state.cityQ = $("city").value.trim();
    state.plate = $("plate").value.trim().toUpperCase().replace(/\s+/g, "");
    state.block = $("block").value.trim();
    if (!state.cityQ || !state.plate) {
      toast("City and plate are required");
      return;
    }
    state.city = window.IR_resolveCity(state.cityQ);
    show("view-search");
    $("search-copy").textContent = state.city
      ? `Checking ${state.city.name} pounds, official lists, and private-lot paths…`
      : `No built-in city pack yet. Building the statewide fee map and who to call…`;

    let liveHits = null;
    try {
      if (state.city?.live === "chicago") {
        liveHits = await lookupChicago(state.plate);
      }
    } catch (e) {
      console.warn(e);
    }

    await new Promise((r) => setTimeout(r, 1100));

    if (liveHits && liveHits.length) {
      const row = liveHits[0];
      const st = window.IR_stateOf("IL");
      state.result = {
        found: true,
        source: "Chicago open data (city tow, last 90 days)",
        lot: {
          name: row.towed_to_address || "Chicago Auto Pound",
          address: row.towed_to_address || "",
          phone: row.tow_facility_phone || "3127444444",
          hours: "Confirm — several city pounds are 24/7",
          notes: `Inventory ${row.inventory_number || "—"} · ${row.color || ""} ${row.make || ""} ${row.style || ""}`
        },
        inventory: row.inventory_number || "",
        towedAt: row.tow_date,
        raw: row,
        state: st,
        city: state.city
      };
    } else if (state.plate === "DEMO" || state.plate.endsWith("X") || !state.city) {
      state.result = demoResult(state.city ? "City playbook + nearest official lots" : "Statewide fee rules + who to call");
      if (!state.city) {
        state.result.found = false;
        state.result.unlisted = true;
      }
    } else {
      state.result = demoResult("Official lookup links + city pound directory");
      state.result.found = "possible";
    }

    renderResult();
    show("view-result");
  }

  function renderResult() {
    const r = state.result;
    const city = r.city;
    const st = r.state;
    $("res-kicker").textContent = city ? city.name + " · " + st.name : st.name;
    $("res-plate").textContent = state.plate;
    $("res-block").textContent = state.block || "Not given";

    if (r.found === true && r.source.includes("open data")) {
      $("res-status").innerHTML = `<span class="pill pill-ok">Found in city tow list</span>`;
      $("res-lot-title").textContent = r.lot.name;
      $("res-lot-body").innerHTML = `
        <p>${r.lot.address}</p>
        <p>${r.lot.notes}</p>
        <p class="hint">Towed ${r.towedAt ? new Date(r.towedAt).toLocaleString() : "—"} · Source: ${r.source}</p>`;
    } else if (r.unlisted) {
      $("res-status").innerHTML = `<span class="pill pill-warn">No city pack — fee rules still apply</span>`;
      $("res-lot-title").textContent = "Call 311 and the property you parked on";
      $("res-lot-body").innerHTML = `<p>We do not have a live pound feed for that city yet. Use the fee cap, junk-fee list, and script anyway — that is the part lots hope you do not have.</p>`;
    } else {
      $("res-status").innerHTML = `<span class="pill pill-warn">Not in the open city feed</span>`;
      $("res-lot-title").textContent = "Most likely: city pound or the lot on the sign";
      $("res-lot-body").innerHTML = `<p>${r.lot.name}<br>${r.lot.address || ""}</p>
        <p class="hint">City lists miss private-property tows and brand-new hooks. Open the official search and call the numbers below. Source: ${r.source}</p>`;
    }

    const phones = (city?.phones || [{ label: "311", tel: "311" }])
      .map((p) => `<a class="btn btn-outline" href="tel:${p.tel}">Call ${p.label}</a>`).join("");
    $("res-phones").innerHTML = phones;

    const links = (city?.officialLookups || [])
      .map((l) => `<a class="btn btn-outline" target="_blank" rel="noopener" href="${l.url}">${l.label}</a>`).join("");
    $("res-links").innerHTML = links || `<p class="hint">No official web lookup on file. 311 first, then the sign on the lot.</p>`;

    $("cap-type").textContent = st.capType;
    $("cap-tow").textContent = st.towNote;
    $("cap-storage").textContent = st.storageNote;
    $("cap-hint").textContent = st.lawfulMaxHint.notes;

    const junkIds = st.junkLikely || [];
    $("junk-list").innerHTML = window.IR_DATA.junkFees
      .filter((j) => junkIds.includes(j.id))
      .map((j) => `<div class="fee-line junk"><div><strong>${j.name}</strong><div class="hint">${j.why}</div></div><div class="amt">${j.typical}</div></div>`)
      .join("");

    $("bring-list").innerHTML = (city?.bring || ["Driver license", "Registration", "Insurance"])
      .map((b) => `<li>${b}</li>`).join("");

    const locked = !hasLookup();
    $("paywall-lookup").style.display = locked ? "block" : "none";
    $("unlocked-lookup").style.display = locked ? "none" : "block";
    renderPackTease();
  }

  function renderPackTease() {
    const open = hasPack();
    $("paywall-pack").style.display = open ? "none" : "block";
    $("unlocked-pack").style.display = open ? "block" : "none";
    if (open) renderPack();
  }

  function scriptText() {
    const st = state.result?.state || window.IR_stateOf("DEFAULT");
    const city = state.city?.name || state.cityQ;
    const lot = state.result?.lot?.name || "the storage facility";
    return `I am the registered owner / authorized agent of plate ${state.plate}. I am here to recover the vehicle only.

I will pay the lawful non-consensual tow and storage amounts that appear on your posted, dated rate card (or the ${st.name} statutory / agency-approved maximum — whichever applies). I will not pay add-on line items that are not on that card or not authorized by statute.

Specifically I dispute as unauthorized or excessive, unless you can show the legal basis on the invoice:
– administrative / paperwork fees
– environmental or hazmat fees with no cleanup
– gate fees during posted business hours
– credit-card surcharges
– a second storage day inside the first 24 hours
– any fee to retrieve personal property from the vehicle

Please itemize the bill. I am paying the undisputed lawful amount under protest. Write “paid under protest” on the receipt and give me a copy of the posted rate card.

City / last parked: ${city}${state.block ? ", " + state.block : ""}
Facility: ${lot}

This is a demand for release upon tender of the lawful amount. Refusal to accept a lawful tender or to release personal property may be documented for the city licensing agency, the state towing regulator, my card issuer, and small claims.`;
  }

  function chargebackText() {
    const st = state.result?.state || window.IR_stateOf("DEFAULT");
    return `CARD DISPUTE — NON-CONSENSUAL TOW OVERCHARGE
Merchant: ${state.result?.lot?.name || "[lot name]"}
Plate: ${state.plate}
Date of tow / charge: [date]
Amount charged: $[total]
Amount I say is lawful: $[cap]
Disputed difference: $[diff]

Facts
1. This was a non-consensual tow. I did not hire the company.
2. ${st.name} limits lawful charges as follows: ${st.capType}.
3. ${st.towNote}
4. ${st.storageNote}
5. The invoice includes line items that are commonly unauthorized (admin, environmental with no spill, after-hours gate during business hours, card surcharge, double storage day).
6. I asked for an itemized receipt and the posted rate card. [Attach photos.]
7. I paid under protest to recover my vehicle. Storage was accruing. This was not a voluntary purchase.

Ask
Please reverse the amount above the posted / statutory maximum. I attach: invoice, posted rate card photo, protest receipt, this letter, and ${st.statutes.join(", ")}.`;
  }

  function renderPack() {
    $("script-box").textContent = scriptText();
    $("cb-box").textContent = chargebackText();
    const st = state.result?.state || window.IR_stateOf("DEFAULT");
    $("statutes").innerHTML = st.statutes.map((s) => `<li>${s}</li>`).join("");
    $("cannot-sell").innerHTML = st.cannotSell.map((s) => `<li>${s}</li>`).join("");
  }

  function checkout(tier) {
    $("ck-title").textContent = tier === 19 ? "$19 lot + cap lookup" : "$79 release pack";
    $("ck-body").textContent = tier === 19
      ? "Unlocks the city pound map, official links, fee-cap memo, and junk-fee list for this plate."
      : "Unlocks the lot script, personal-property list, regulator complaint outline, and card-dispute letter you can paste tonight.";
    $("ck-amt").textContent = tier === 19 ? "$19.00" : "$79.00";
    $("ck-pay").dataset.tier = String(tier);
    show("view-checkout");
  }

  function finishPay() {
    const tier = $("ck-pay").dataset.tier;
    unlock(tier);
    toast(tier === "19" ? "Lookup unlocked" : "Release pack unlocked");
    renderResult();
    show(tier === "79" ? "view-pack" : "view-result");
  }

  function wire() {
    ["view-home","view-lookup","view-search","view-result","view-fees","view-pack","view-checkout","view-pro","view-legal"].forEach((id) => {
      views[id] = $(id);
    });

    $("go-lookup").onclick = () => show("view-lookup");
    $("go-home").onclick = () => show("view-home");
    $("go-home-2").onclick = () => show("view-home");
    $("go-pro").onclick = () => show("view-pro");
    $("go-legal").onclick = (e) => { e.preventDefault(); show("view-legal"); };
    $("do-lookup").onclick = runLookup;
    $("demo").onclick = () => {
      $("city").value = "Chicago";
      $("plate").value = "DEMO";
      $("block").value = "Wacker & Michigan";
      runLookup();
    };
    $("open-fees").onclick = () => show("view-fees");
    $("back-result").onclick = () => show("view-result");
    $("back-result-2").onclick = () => show("view-result");
    $("open-pack").onclick = () => {
      if (hasPack()) { renderPack(); show("view-pack"); }
      else checkout(79);
    };
    $("buy-19").onclick = () => checkout(19);
    $("buy-79").onclick = () => checkout(79);
    $("ck-cancel").onclick = () => show("view-result");
    $("ck-pay").onclick = finishPay;
    $("copy-script").onclick = () => copy($("script-box").textContent);
    $("copy-cb").onclick = () => copy($("cb-box").textContent);
    $("share-script").onclick = async () => {
      const text = $("script-box").textContent;
      if (navigator.share) {
        try { await navigator.share({ title: "Impound release script", text }); } catch {}
      } else copy(text);
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
