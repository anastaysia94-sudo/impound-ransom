/* Impound Ransom — city lots, official lookups, fee rules.
   Informational only. Verify against current city/state sources. */

window.IR_DATA = {
  junkFees: [
    { id: "admin", name: "Administrative / paperwork fee", why: "Often bundled into the posted tow rate. Separate 'admin' add-ons are frequently unauthorized.", typical: "$25–$95" },
    { id: "gate", name: "Gate / after-hours fee (during posted hours)", why: "A gate fee is only sometimes allowed outside posted hours. Charging it at 2pm on a weekday is a common gouge.", typical: "$40–$150" },
    { id: "env", name: "Environmental / hazmat fee (no spill)", why: "Texas and several other states expressly ban environmental fees unless there was an actual cleanup.", typical: "$25–$75" },
    { id: "credit", name: "Credit-card surcharge", why: "Many jurisdictions require the lot to accept a card. A 'card convenience' fee on top of a non-consensual tow is often illegal.", typical: "3–5%" },
    { id: "notify", name: "Notification fee above statute", why: "Certified-mail notice fees are capped. Charging $75 to 'notify you' of a tow they already performed is padding.", typical: "$25–$80" },
    { id: "personal", name: "Fee to retrieve personal property", why: "Several states (including Texas) ban charging you to get your ID, keys, or meds out of the car.", typical: "$20–$50" },
    { id: "double_storage", name: "Two storage days inside 24 hours", why: "California and others: if you pick up within 24 hours of arrival, that is one storage day — not two calendar dates.", typical: "$30–$80" },
    { id: "fuel", name: "Fuel surcharge (non-consensual)", why: "If it is not on the posted, agency-approved rate card, it is usually junk.", typical: "$15–$40" },
    { id: "drop", name: "Full tow after a drop request", why: "If you arrived before the car left the lot, many states cap the charge at half the tow (CA CVC 22658(h)).", typical: "half the tow" },
    { id: "lien", name: "Lien / processing fee before the statutory clock", why: "Lien-sale paperwork fees cannot start the day they hook the car.", typical: "$50–$200" }
  ],

  states: {
    CA: {
      name: "California",
      capType: "Operator / CHP-approved rate (no single statewide dollar cap)",
      towNote: "Private-property tows cannot exceed the local law-enforcement or CHP-approved rate for that area (CVC 22658(i)). CHP Class A ceiling for FY 2025–26 is about $327/hr hook + ~$78–$81/day storage.",
      storageNote: "Release within 24 hours of arrival = one storage day only (CVC 22658(i)(2)). After-hours release fee capped at half the regular tow in many private-property cases.",
      lawfulMaxHint: { tow: 327, storageDay: 81, notes: "Use the posted CHP/LE rate card at the lot. Anything not posted is presumptively junk." },
      cannotSell: ["Driver license", "Passports / IDs", "Prescriptions", "Tax and court papers", "Photos of obvious personal value"],
      statutes: ["CVC 22658", "CVC 22650.5 (must accept non-cash)", "CVC 22852 (notice)", "CVC 22524.5"],
      junkLikely: ["admin", "gate", "double_storage", "credit", "drop", "fuel"]
    },
    TX: {
      name: "Texas",
      capType: "Statewide Vehicle Storage Facility caps (TDLR)",
      towNote: "Non-consent tow of a passenger vehicle ≤10,000 lbs: max $272 (plus local government fee if any). Heavier classes $380 / $489.",
      storageNote: "Daily storage max $22.85 (vehicle ≤25 ft). Impound fee max $22.85. Notification fee is separately capped.",
      lawfulMaxHint: { tow: 272, storageDay: 22.85, impound: 22.85, notes: "TDLR bans environmental, notary, and personal-property access fees." },
      cannotSell: ["IDs", "Medications", "Child seats in some cases", "Papers needed to prove ownership"],
      statutes: ["Tex. Occ. Code ch. 2308", "16 TAC §85.722"],
      junkLikely: ["env", "personal", "admin", "credit", "lien"]
    },
    NY: {
      name: "New York",
      capType: "City / local (NYC has published pound rates)",
      towNote: "NYPD regular tow $185; heavy duty $370. Overnight storage at city pounds $20. Marshal/sheriff tows for judgment debt use a different fee schedule.",
      storageNote: "NYC city-pound overnight storage $20. Private lots in the state are locally regulated.",
      lawfulMaxHint: { tow: 185, storageDay: 20, notes: "NYC NYPD pound rates. Private-property tows in the five boroughs are a different, often higher, fight." },
      cannotSell: ["IDs", "Prescriptions", "Legal papers"],
      statutes: ["NYC Admin. Code / NYPD Tow Pound schedule", "NYS DOL towing rules outside NYC"],
      junkLikely: ["admin", "gate", "credit", "notify"]
    },
    IL: {
      name: "Illinois",
      capType: "ICC-filed operator rates; first 24 hours storage often free on ICC tows",
      towNote: "No single statewide dollar cap. Chicago city pounds publish their own tow/storage schedule. ICC-regulated tows: no storage charge for the first 24 hours in many cases.",
      storageNote: "Ask whether the first 24 hours are free. Private lots file rates; demand the posted card.",
      lawfulMaxHint: { tow: 250, storageDay: 50, notes: "Chicago city pound vs private lot are different worlds. Always get the inventory number." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["625 ILCS 5/4-203", "ICC towing rules", "Chicago MCC 9-92"],
      junkLikely: ["admin", "gate", "double_storage", "credit"]
    },
    FL: {
      name: "Florida",
      capType: "Mostly county / local",
      towNote: "No uniform statewide dollar cap for every county. Miami-Dade and others publish maximum wrecker rates. Demand the county rate card.",
      storageNote: "Daily storage is locally capped in several metro counties. First-day rules vary.",
      lawfulMaxHint: { tow: 175, storageDay: 35, notes: "Use the county wrecker tariff. If they will not show it, that is your first dispute line." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["Fla. Stat. §713.78", "county wrecker ordinances"],
      junkLikely: ["admin", "gate", "env", "credit"]
    },
    WA: {
      name: "Washington",
      capType: "Statewide registered-tow caps (adjusted)",
      towNote: "Washington publishes maximums for registered tow truck operators (approx. $401 hook class-dependent; confirm current WAC/WTSC schedule).",
      storageNote: "Daily storage has a published statewide ceiling (recently ~$101/day — confirm current table).",
      lawfulMaxHint: { tow: 401, storageDay: 101, notes: "Seattle street tows go to the city contractor (Lincoln). Private-property tows use the same state cap framework." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["RCW 46.55", "WAC 308-61"],
      junkLikely: ["admin", "gate", "credit", "fuel"]
    },
    PA: {
      name: "Pennsylvania",
      capType: "Local / city (Philadelphia Parking Authority publishes rates)",
      towNote: "Philadelphia PPA tows are a city process: tickets + tow + storage. Private predatory tows have a separate complaint path.",
      storageNote: "PPA storage accrues at the official lot. Pay tickets or enroll in a plan before release on scofflaw tows.",
      lawfulMaxHint: { tow: 175, storageDay: 25, notes: "PPA lot rates vs a random private lot in the suburbs are not the same fight." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["Phila. Code / PPA regulations", "75 Pa.C.S. towing provisions"],
      junkLikely: ["admin", "gate", "credit"]
    },
    GA: {
      name: "Georgia",
      capType: "Statewide caps by weight class",
      towNote: "Georgia publishes maximum non-consensual rates (~$228 class-dependent — confirm current DPS table).",
      storageNote: "Daily storage statewide ceiling ~$33/day (confirm current).",
      lawfulMaxHint: { tow: 228, storageDay: 33, notes: "Statewide numeric cap is your friend. Ask them to point to the posted maximum." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["O.C.G.A. §44-1-13", "Ga. DPS wrecker rules"],
      junkLikely: ["admin", "gate", "env", "credit"]
    },
    MA: {
      name: "Massachusetts",
      capType: "Statewide caps",
      towNote: "Non-consent tow ceiling around $132 plus mileage in many schedules (confirm current DPU/city).",
      storageNote: "Daily storage often capped near $35.",
      lawfulMaxHint: { tow: 132, storageDay: 35, notes: "Boston and state caps differ slightly. Get the invoice itemized." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["M.G.L. c. 159B", "city wrecker rules"],
      junkLikely: ["admin", "gate", "credit"]
    },
    CO: {
      name: "Colorado",
      capType: "Statewide cap on law-enforcement tows; private varies",
      towNote: "LE tows have published ceilings (recently ~$251). Private-property tows are more local.",
      storageNote: "LE storage recently ~$48/day statewide ceiling.",
      lawfulMaxHint: { tow: 251, storageDay: 48, notes: "Ask whether this was an LE-ordered tow. That changes the cap." },
      cannotSell: ["IDs", "Medications", "Personal papers"],
      statutes: ["C.R.S. 42-4-1801 et seq."],
      junkLikely: ["admin", "gate", "credit"]
    },
    DEFAULT: {
      name: "Your state",
      capType: "Local or 'reasonable' — demand the posted card",
      towNote: "Only about half of states publish a hard statewide dollar cap. Everywhere else, the lawful amount is the posted, filed, or locally approved rate.",
      storageNote: "Storage is the meter. Get the car out first, fight the junk line items second.",
      lawfulMaxHint: { tow: 200, storageDay: 40, notes: "Treat anything not on a posted, dated rate card as disputed." },
      cannotSell: ["IDs", "Medications", "Tax and court papers", "Photos of obvious personal value"],
      statutes: ["Your state's non-consensual towing statute", "Local wrecker ordinance"],
      junkLikely: ["admin", "gate", "env", "credit", "double_storage"]
    }
  },

  cities: [
    {
      id: "nyc",
      name: "New York City",
      state: "NY",
      aliases: ["new york", "nyc", "manhattan", "brooklyn", "queens", "bronx", "staten island"],
      officialLookups: [
        { label: "NYC Find Towed Vehicle", url: "https://www.nyc.gov/site/finance/vehicles/services-towed-vehicles.page" },
        { label: "NYPD towed vehicles", url: "https://www.nyc.gov/site/nypd/services/vehicles-property/towed-vehicles.page" }
      ],
      phones: [
        { label: "NYC 311", tel: "311" },
        { label: "Marshal / Sheriff judgment tows", tel: "6465171000" }
      ],
      lots: [
        { name: "NYPD Pound — Bronx", address: "745 E 141st St area / check 311 for current pound", phone: "311", hours: "Confirm on 311", notes: "Street-parking tows usually stay in-borough." },
        { name: "NYPD Pound — Brooklyn", address: "Confirm current Brooklyn pound via 311", phone: "311", hours: "Confirm on 311", notes: "" },
        { name: "NYPD Pound — Queens", address: "Confirm current Queens pound via 311", phone: "311", hours: "Confirm on 311", notes: "" }
      ],
      bring: ["Driver license", "Registration", "Insurance card", "If financed: title + notarized authorization"],
      live: null
    },
    {
      id: "la",
      name: "Los Angeles",
      state: "CA",
      aliases: ["los angeles", "la", "l.a.", "hollywood", "van nuys", "south la"],
      officialLookups: [
        { label: "OPG VIIC plate search", url: "https://www.opglaviic.com" },
        { label: "LADOT boots & tows", url: "https://ladotparking.org/adjudication-division/booted-towed-vehicles/" }
      ],
      phones: [
        { label: "LA 311", tel: "311" },
        { label: "ASK-LAPD", tel: "8772755273" },
        { label: "Boot release", tel: "8552882642" }
      ],
      lots: [
        { name: "Official Police Garages (18 lots)", address: "VIIC tells you which OPG has the car", phone: "311", hours: "Varies by garage", notes: "LAPD/LADOT tows go to an OPG. LASD uses different contractors per station." }
      ],
      bring: ["Driver license", "Registration", "Insurance", "Cash or card — OPG fees due at the garage"],
      live: null
    },
    {
      id: "chicago",
      name: "Chicago",
      state: "IL",
      aliases: ["chicago", "chi"],
      officialLookups: [
        { label: "CPD Find My Car", url: "https://publicsearch2.chicagopolice.org/FindMyCar" },
        { label: "City vehicle search", url: "https://webapps1.chicago.gov/vehiclesearch/" },
        { label: "Open data (last 90 days)", url: "https://data.cityofchicago.org/Transportation/Towed-Vehicles/ygr5-vcbg" }
      ],
      phones: [
        { label: "Find the car (24/7)", tel: "3127444444" },
        { label: "Ticket-debt tows", tel: "3127447275" },
        { label: "Chicago 311", tel: "311" }
      ],
      lots: [
        { name: "Central Auto Pound", address: "500 E Wacker Dr (Lower Level), Chicago", phone: "3127444444", hours: "24/7", notes: "City street tows." },
        { name: "Auto Pound #6", address: "701 N Sacramento Ave, Chicago", phone: "7732657605", hours: "24/7", notes: "" },
        { name: "Auto Pound #2", address: "103rd & Doty Ave, Chicago", phone: "3127444444", hours: "24/7", notes: "" },
        { name: "O'Hare Auto Pound", address: "1000 Bessie Coleman Dr, Chicago", phone: "3127444444", hours: "24/7", notes: "Airport." }
      ],
      bring: ["Driver license", "Registration", "Insurance", "Payment for pound fees; ticket-debt tows may require all determined tickets"],
      live: "chicago"
    },
    {
      id: "sf",
      name: "San Francisco",
      state: "CA",
      aliases: ["san francisco", "sf", "s.f."],
      officialLookups: [
        { label: "SFMTA towed vehicles", url: "https://www.sfmta.com/getting-around/drive-park/towed-vehicles" },
        { label: "TEGSCO lot search", url: "https://www.tegsco.com" }
      ],
      phones: [
        { label: "City Impound", tel: "4158658200" },
        { label: "SFPD STOP unit", tel: "4156783625" }
      ],
      lots: [
        { name: "SF Impound (TEGSCO)", address: "450 7th St, San Francisco, CA 94103", phone: "4158658200", hours: "24/7", notes: "Oversized vehicles may go to Daly City." }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "houston",
      name: "Houston",
      state: "TX",
      aliases: ["houston", "harris county"],
      officialLookups: [
        { label: "City of Houston — findmytowedcar.com", url: "https://findmytowedcar.com" },
        { label: "Harris County — findmytowedcar.org", url: "https://findmytowedcar.org" }
      ],
      phones: [
        { label: "HPD tow line", tel: "7133088580" },
        { label: "Harris County Sheriff tow", tel: "3462862151" }
      ],
      lots: [
        { name: "Assigned VSF (lookup names the lot)", address: "Shown on findmytowedcar.com / .org", phone: "7133088580", hours: "Varies", notes: "City vs unincorporated county are different sites. Search both if unsure." }
      ],
      bring: ["Driver license", "Proof of ownership", "Card — Texas VSFs must itemize lawful fees only"],
      live: null
    },
    {
      id: "seattle",
      name: "Seattle",
      state: "WA",
      aliases: ["seattle"],
      officialLookups: [
        { label: "Seattle — find a towed car", url: "https://www.seattle.gov/your-rights-as-a-customer/find-a-towed-car" }
      ],
      phones: [
        { label: "Lincoln Towing (city contractor)", tel: "2063642000" },
        { label: "SPD non-emergency", tel: "2066255011" }
      ],
      lots: [
        { name: "Lincoln Towing (street tows)", address: "Confirm on Lincoln search / 206-364-2000", phone: "2063642000", hours: "Confirm by phone", notes: "Private-lot tows: read the sign on the lot you parked in." }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "philly",
      name: "Philadelphia",
      state: "PA",
      aliases: ["philadelphia", "philly"],
      officialLookups: [
        { label: "PPA boots & tows", url: "https://philapark.org/tow/" },
        { label: "City how-to", url: "https://www.phila.gov/services/streets-sidewalks-alleys/get-your-car-back-when-it-has-been-towed/" }
      ],
      phones: [
        { label: "PPA Lot 10", tel: "2156839601" },
        { label: "PPA Lot 6", tel: "2156839510" }
      ],
      lots: [
        { name: "PPA Lot 10", address: "6 E Oregon Ave, Philadelphia, PA 19148", phone: "2156839601", hours: "Long evening hours; confirm", notes: "Scofflaw tows need tickets paid or a payment plan." },
        { name: "PPA Lot 6", address: "4701 Bath St, Philadelphia, PA 19137", phone: "2156839510", hours: "Confirm", notes: "" }
      ],
      bring: ["Driver license", "Registration", "Insurance", "PVB release if you paid tickets downtown"],
      live: null
    },
    {
      id: "miami",
      name: "Miami",
      state: "FL",
      aliases: ["miami", "miami-dade", "miami dade"],
      officialLookups: [
        { label: "Miami-Dade towed vehicles", url: "https://www.miamidade.gov/global/police/towed-vehicles.page" }
      ],
      phones: [
        { label: "Miami-Dade 311", tel: "311" }
      ],
      lots: [
        { name: "County / contractor lot (311 names it)", address: "Ask 311 with plate + block", phone: "311", hours: "Confirm", notes: "County wrecker tariff is the cap argument." }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "boston",
      name: "Boston",
      state: "MA",
      aliases: ["boston"],
      officialLookups: [
        { label: "Boston towed vehicles", url: "https://www.boston.gov/departments/transportation/towed-cars" }
      ],
      phones: [
        { label: "Boston towed cars", tel: "6176353900" }
      ],
      lots: [
        { name: "City contractor lot", address: "Confirm at boston.gov/towed-cars", phone: "6176353900", hours: "Confirm", notes: "" }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "dc",
      name: "Washington, DC",
      state: "DC",
      aliases: ["washington", "washington dc", "dc", "d.c.", "district of columbia"],
      officialLookups: [
        { label: "DMV / towed vehicles", url: "https://dmv.dc.gov/service/towed-vehicles" }
      ],
      phones: [
        { label: "DC towed vehicles", tel: "2027275000" }
      ],
      lots: [
        { name: "DC impound (DMV lookup)", address: "Named by the official search", phone: "2027275000", hours: "Confirm", notes: "" }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "dallas",
      name: "Dallas",
      state: "TX",
      aliases: ["dallas"],
      officialLookups: [
        { label: "Dallas towed / impounded", url: "https://dallascityhall.com" }
      ],
      phones: [
        { label: "Dallas 311", tel: "311" }
      ],
      lots: [
        { name: "City or licensed VSF", address: "311 or wrecker sign", phone: "311", hours: "Confirm", notes: "Texas statewide VSF caps still apply." }
      ],
      bring: ["Driver license", "Proof of ownership"],
      live: null
    },
    {
      id: "atlanta",
      name: "Atlanta",
      state: "GA",
      aliases: ["atlanta"],
      officialLookups: [
        { label: "Atlanta Police towed vehicles", url: "https://www.atlantapd.org" }
      ],
      phones: [
        { label: "Atlanta 311", tel: "311" }
      ],
      lots: [
        { name: "Contract wrecker lot", address: "APD / 311 will name it", phone: "311", hours: "Confirm", notes: "Use the Georgia statewide cap." }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "denver",
      name: "Denver",
      state: "CO",
      aliases: ["denver"],
      officialLookups: [
        { label: "Denver towed vehicles", url: "https://www.denvergov.org" }
      ],
      phones: [
        { label: "Denver 311", tel: "311" }
      ],
      lots: [
        { name: "City contractor", address: "311 names the yard", phone: "311", hours: "Confirm", notes: "" }
      ],
      bring: ["Driver license", "Registration"],
      live: null
    },
    {
      id: "phoenix",
      name: "Phoenix",
      state: "AZ",
      aliases: ["phoenix"],
      officialLookups: [
        { label: "Phoenix towed vehicles", url: "https://www.phoenix.gov/streets/towed-vehicles" }
      ],
      phones: [
        { label: "Phoenix 602-262-6151", tel: "6022626151" }
      ],
      lots: [
        { name: "City contractor yard", address: "Named by the official search", phone: "6022626151", hours: "Confirm", notes: "" }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    },
    {
      id: "austin",
      name: "Austin",
      state: "TX",
      aliases: ["austin"],
      officialLookups: [
        { label: "Austin towed vehicles", url: "https://www.austintexas.gov" }
      ],
      phones: [
        { label: "Austin 311", tel: "311" }
      ],
      lots: [
        { name: "Licensed VSF", address: "311 / wrecker sign", phone: "311", hours: "Confirm", notes: "Texas VSF caps apply." }
      ],
      bring: ["Driver license", "Proof of ownership"],
      live: null
    },
    {
      id: "sandiego",
      name: "San Diego",
      state: "CA",
      aliases: ["san diego"],
      officialLookups: [
        { label: "San Diego towed vehicles", url: "https://www.sandiego.gov" }
      ],
      phones: [
        { label: "SDPD non-emergency", tel: "6195312000" }
      ],
      lots: [
        { name: "Contract yard", address: "Police / 211-style lookup names it", phone: "6195312000", hours: "Confirm", notes: "California posted-rate rules apply." }
      ],
      bring: ["Driver license", "Registration", "Insurance"],
      live: null
    }
  ]
};

window.IR_resolveCity = function (q) {
  const s = (q || "").trim().toLowerCase();
  if (!s) return null;
  return window.IR_DATA.cities.find((c) =>
    c.aliases.some((a) => s === a || s.includes(a) || a.includes(s))
  ) || null;
};

window.IR_stateOf = function (code) {
  return window.IR_DATA.states[code] || window.IR_DATA.states.DEFAULT;
};
