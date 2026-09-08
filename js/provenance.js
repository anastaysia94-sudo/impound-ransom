/* Impound Ransom — source provenance overlay.
   This file does not convert research into legal advice. It tells the UI which
   jurisdiction cards were checked against primary sources in the current pass. */
(()=>{
  'use strict';
  const D=window.IR_DATA;if(!D)return;
  const checkedAt='2026-09-08';
  const source={
    TX:{status:'primary_source_checked',checkedAt,label:'Texas TDLR — VSF Fees and Other Charges',url:'https://www.tdlr.texas.gov/towing/compliance/vsf/fees.htm',note:'Primary source confirms statewide private-property tow maxima and current adjusted VSF storage/impound charges; a lower local maximum may apply.'},
    NY:{status:'primary_source_checked',checkedAt,label:'NYPD — Towed Vehicles',url:'https://www.nyc.gov/site/nypd/services/vehicles-property/towed-vehicles.page',note:'Primary source confirms NYPD regular/heavy tow and overnight storage amounts. Marshal/sheriff judgment tows use a different schedule.'},
    CA:{status:'framework_checked_amount_review_needed',checkedAt,label:'California Highway Patrol — Rotation Tow Program / 2026–2027 TSA',url:'https://www.chp.ca.gov/programs-services/for-law-enforcement/rotation-tow-program',note:'Current CHP program/framework source checked. A single statewide private-property dollar cap should not be inferred; local/approved operator rates and the applicable tow authority matter. Any approximate dollar figure shown in the research card must be checked against the actual current local/approved rate card.'},
    IL:{status:'official_lookup_checked_fee_review_needed',checkedAt,label:'City of Chicago — Towed Vehicle Search',url:'https://webapps1.chicago.gov/vehiclesearch/',note:'Official city lookup path checked. The numeric fee research card is not certified as a current statewide Illinois cap and must be verified for the actual tow authority/operator.'}
  };
  for(const [code,state] of Object.entries(D.states)){
    state.provenance=source[code]||{status:'current_primary_source_review_required',checkedAt:null,label:'Current jurisdiction source required before relying on a numeric amount',url:null,note:'This research card has not been reverified against a primary current fee source in the 2026-09-08 hardening pass. Use it to locate the rule, not as a guaranteed legal maximum.'};
  }
  D.provenancePolicy={checkedAt,rule:'Numeric fee claims are research leads unless the current card identifies a primary source checked for the applicable tow type. City, tow authority, vehicle class, timing, and local rules can change the amount.'};

  function annotate(){
    const type=document.getElementById('cap-type');
    const hint=document.getElementById('cap-hint');
    if(!type||!hint)return;
    const state=Object.values(D.states).find(s=>s.capType===type.textContent);
    if(!state?.provenance)return;
    const p=state.provenance;
    const badge=p.status==='primary_source_checked'?'SOURCE CHECKED':'VERIFY CURRENT AMOUNT';
    const sourceLink=p.url?` · ${p.label}: ${p.url}`:` · ${p.label}`;
    hint.textContent=`${state.lawfulMaxHint.notes} · ${badge}${p.checkedAt?` ${p.checkedAt}`:''}. ${p.note}${sourceLink}`;
  }
  addEventListener('DOMContentLoaded',()=>{
    const target=document.getElementById('cap-type');
    if(target)new MutationObserver(annotate).observe(target,{childList:true,subtree:true,characterData:true});
    annotate();
  });
})();
