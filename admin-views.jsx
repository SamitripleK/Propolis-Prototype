// admin-views.jsx — Properties tab views. Loaded after admin-amenities.jsx.
const { useState: useStateV, useMemo, useEffect: useEffectV } = React;
const M = window.money;

/* ─── Rental type badge ─────────────────────────────────────────────────────── */
function RentalBadge({ type }) {
  const teal = type === "STR";
  return (
    <span className={"tag " + (teal ? "teal" : "green")} style={{ fontSize: 11, padding: "3px 9px" }}>
      {type}
    </span>
  );
}

/* ─── Disabled building notice ──────────────────────────────────────────────── */
function DisabledNotice({ message }) {
  return (
    <div style={{ background:"rgba(180,73,47,.07)", border:"1px solid rgba(180,73,47,.18)", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
      <AIcon name="ban" size={14} style={{ color:"var(--red)", flexShrink:0 }} />
      <span style={{ fontSize:13, color:"var(--red)", fontWeight:500 }}>{message}</span>
    </div>
  );
}

/* ─── Filter constants ──────────────────────────────────────────────────────── */
const STAY_OPTS     = ["LTR", "STR", "Not set"];
const SPACE_OPTS    = ["Coliving", "Entire Apartment", "Unset"];
const BEDS_OPTS     = ["1 bd", "2 bd", "5 bd"];
const BATHS_OPTS    = ["1 ba", "2 ba", "5 ba"];
const BED_SIZE_OPTS = ["Full", "Queen", "Twin"];
const QUALITY_OPTS  = ["Deluxe", "Standard"];
const LAYOUT_OPTS   = ["Studio", "1×1", "2×2", "3×1", "3×3", "4×3"];
const FEATURE_OPTS  = ["Has elevator", "ADA accessible"];
const POPULAR_AM    = ["Air Conditioner","Balcony","Cable","Controlled Access","Furnished","Microwave","Refrigerator","Washer"];
const ALL_AM        = [
  "Additional Storage","Air Conditioner","Alarm","Balcony","Cable","Carpet",
  "Ceiling Fan","Controlled Access","Courtyard","Dishwasher","Dryer","Furnished",
  "Microwave","Patio","Pantry","Refrigerator","Washer","Other",
];
const FILTER_DEFAULTS = {
  stayType:[], spaceType:[], buildings:[], beds:[], baths:[], bedSize:[],
  qualityTier:[], aptLayout:[], rentMin:"", rentMax:"", features:[], ownership:[], amenities:[],
};

/* ─── ChipMulti — multi-select chip group ──────────────────────────────────── */
function ChipMulti({ options, selected, onToggle }) {
  return (
    <div className="fchip-group">
      {options.map(opt => (
        <button key={opt} type="button"
          className={"fchip" + (selected.includes(opt) ? " on" : "")}
          onClick={() => onToggle(opt)}>
          {selected.includes(opt) && <AIcon name="check" size={11} />}
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── FSection — collapsible drawer section ─────────────────────────────────── */
function FSection({ title, open, onToggle, count, children }) {
  return (
    <div className="fsec">
      <button type="button" className="fsec-head" onClick={onToggle}>
        <span className="fsec-title">{title}</span>
        {count > 0 && <span className="fsec-count">{count}</span>}
        <span className={"fsec-chev" + (open ? " open" : "")}><AIcon name="chevron" size={13} /></span>
      </button>
      {open && <div className="fsec-body">{children}</div>}
    </div>
  );
}

/* ─── FilterDrawer ──────────────────────────────────────────────────────────── */
function FilterDrawer({ open, onClose, draft, onChange, onApply, onClear }) {
  const [secs, setSecs] = useStateV({
    stayType:true, spaceType:true, buildings:true,
    roomDetails:false, aptLayout:false, financial:false,
    features:false, ownership:false, amenities:false,
  });
  const [amSearch, setAmSearch] = useStateV("");
  const [showAllAm, setShowAllAm] = useStateV(false);

  /* Lock page scroll behind the drawer; reset search state on each open */
  useEffectV(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setAmSearch("");
      setShowAllAm(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const toggleSec = (k) => setSecs(p => ({ ...p, [k]: !p[k] }));
  const tog = (field, val) => {
    const arr = draft[field] || [];
    onChange({ ...draft, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
  };

  const ownerOpts = [...new Set(BUILDINGS.map(b => b.ownerLLC).filter(Boolean))];
  const filteredAm = ALL_AM.filter(a => !amSearch || a.toLowerCase().includes(amSearch.toLowerCase()));
  const visibleAm  = amSearch ? filteredAm : (showAllAm ? ALL_AM : POPULAR_AM);
  const c = (field) => (draft[field] || []).length;

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="filter-drawer">
        <div className="drawer-head">
          <h3>Advanced Filters</h3>
          <div className="drawer-head-right">
            <button type="button" className="drawer-clear-btn" onClick={onClear}>Clear all</button>
            <button type="button" className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
          </div>
        </div>

        <div className="drawer-body">
          <FSection title="Stay Type" open={secs.stayType} onToggle={() => toggleSec("stayType")} count={c("stayType")}>
            <ChipMulti options={STAY_OPTS} selected={draft.stayType} onToggle={v => tog("stayType", v)} />
          </FSection>

          <FSection title="Space Type" open={secs.spaceType} onToggle={() => toggleSec("spaceType")} count={c("spaceType")}>
            <ChipMulti options={SPACE_OPTS} selected={draft.spaceType} onToggle={v => tog("spaceType", v)} />
          </FSection>

          <FSection title="Buildings" open={secs.buildings} onToggle={() => toggleSec("buildings")} count={c("buildings")}>
            <ChipMulti options={BUILDINGS.map(b => b.name)} selected={draft.buildings} onToggle={v => tog("buildings", v)} />
          </FSection>

          <FSection title="Room Details" open={secs.roomDetails} onToggle={() => toggleSec("roomDetails")}
            count={c("beds") + c("baths") + c("bedSize") + c("qualityTier")}>
            <div><div className="fsec-sub">Beds</div><ChipMulti options={BEDS_OPTS} selected={draft.beds} onToggle={v => tog("beds", v)} /></div>
            <div><div className="fsec-sub">Baths</div><ChipMulti options={BATHS_OPTS} selected={draft.baths} onToggle={v => tog("baths", v)} /></div>
            <div><div className="fsec-sub">Bed size</div><ChipMulti options={BED_SIZE_OPTS} selected={draft.bedSize} onToggle={v => tog("bedSize", v)} /></div>
            <div><div className="fsec-sub">Quality tier</div><ChipMulti options={QUALITY_OPTS} selected={draft.qualityTier} onToggle={v => tog("qualityTier", v)} /></div>
          </FSection>

          <FSection title="Apartment Layout" open={secs.aptLayout} onToggle={() => toggleSec("aptLayout")} count={c("aptLayout")}>
            <ChipMulti options={LAYOUT_OPTS} selected={draft.aptLayout} onToggle={v => tog("aptLayout", v)} />
          </FSection>

          <FSection title="Financial" open={secs.financial} onToggle={() => toggleSec("financial")}
            count={(draft.rentMin || draft.rentMax) ? 1 : 0}>
            <div>
              <div className="fsec-sub">Monthly rent ($/mo)</div>
              <div className="rent-row">
                <input type="number" placeholder="Min" value={draft.rentMin}
                  onChange={e => onChange({ ...draft, rentMin: e.target.value })} />
                <input type="number" placeholder="Max" value={draft.rentMax}
                  onChange={e => onChange({ ...draft, rentMax: e.target.value })} />
              </div>
            </div>
          </FSection>

          <FSection title="Building Features" open={secs.features} onToggle={() => toggleSec("features")} count={c("features")}>
            <ChipMulti options={FEATURE_OPTS} selected={draft.features} onToggle={v => tog("features", v)} />
          </FSection>

          <FSection title="Ownership Entity" open={secs.ownership} onToggle={() => toggleSec("ownership")} count={c("ownership")}>
            <ChipMulti options={ownerOpts} selected={draft.ownership} onToggle={v => tog("ownership", v)} />
          </FSection>

          <FSection title="Amenities" open={secs.amenities} onToggle={() => toggleSec("amenities")} count={c("amenities")}>
            {draft.amenities.length > 0 && (
              <div>
                <div className="fsec-sub">Selected</div>
                <div className="fchip-group">
                  {draft.amenities.map(am => (
                    <button key={am} type="button" className="fchip on" onClick={() => tog("amenities", am)}>
                      {am} <AIcon name="x" size={10} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="am-search">
              <span className="am-ic"><AIcon name="search" size={13} /></span>
              <input placeholder="Search amenities…" value={amSearch} onChange={e => setAmSearch(e.target.value)} />
            </div>
            <div>
              {!amSearch && <div className="fsec-sub">{showAllAm ? "All amenities" : "Popular"}</div>}
              <div className="fchip-group">
                {visibleAm.map(am => (
                  <button key={am} type="button"
                    className={"fchip" + (draft.amenities.includes(am) ? " on" : "")}
                    onClick={() => tog("amenities", am)}>
                    {draft.amenities.includes(am) && <AIcon name="check" size={11} />}{am}
                  </button>
                ))}
              </div>
            </div>
            {!amSearch && (
              <button type="button" onClick={() => setShowAllAm(p => !p)}
                style={{ background:"transparent", border:0, color:"var(--teal)", fontSize:13, fontWeight:500, cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:5 }}>
                {showAllAm ? "Show fewer" : "Show all amenities"}
                <span style={{ display:"flex", transition:"transform .2s ease", transform: showAllAm ? "rotate(180deg)" : "none" }}>
                  <AIcon name="chevron" size={12} />
                </span>
              </button>
            )}
          </FSection>
        </div>

        <div className="drawer-foot">
          <button type="button" className="btn btn-soft" style={{ flex:"0 0 auto" }} onClick={onClear}>Clear all</button>
          <button type="button" className="btn btn-primary" style={{ flex:1 }} onClick={onApply}>Apply Filters</button>
        </div>
      </div>
    </React.Fragment>,
    document.body
  );
}

/* ───────────────────────── Properties List ───────────────────────── */
const VIEW_KEY = "propolis-prop-view";

function PropertiesList({ onOpenBuilding }) {
  const [q, setQ]                           = useStateV("");
  const [mainBuilding, setMainBuilding]     = useStateV("");
  const [mainStayType, setMainStayType]     = useStateV("");
  const [mainSpaceType, setMainSpaceType]   = useStateV("");
  const [sort, setSort]                     = useStateV("revenue");
  const [view, setView]                     = useStateV(() => localStorage.getItem(VIEW_KEY) || "grid");
  const [modal, setModal]                   = useStateV(null);
  const [drawerOpen, setDrawerOpen]         = useStateV(false);
  const [draftFilters, setDraftFilters]     = useStateV({ ...FILTER_DEFAULTS });
  const [appliedFilters, setAppliedFilters] = useStateV({ ...FILTER_DEFAULTS });
  const { toasts, showToast }               = useToast();

  useEffectV(() => { localStorage.setItem(VIEW_KEY, view); }, [view]);

  /* Count active advanced filter dimensions */
  const advCount = useMemo(() => {
    const af = appliedFilters;
    return [af.stayType, af.spaceType, af.buildings, af.beds, af.baths,
            af.bedSize, af.qualityTier, af.aptLayout, af.features, af.ownership, af.amenities]
      .reduce((n, arr) => n + (arr.length > 0 ? 1 : 0), 0)
      + ((af.rentMin || af.rentMax) ? 1 : 0);
  }, [appliedFilters]);

  /* Filtered building list */
  const list = useMemo(() => {
    const af = appliedFilters;
    let r = BUILDINGS.filter(b => {
      const text = (b.name + " " + b.address + " " + (b.ownerLLC || "")).toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;

      if (mainBuilding && b.name !== mainBuilding) return false;
      if (mainStayType === "LTR" && b.ltrCount === 0) return false;
      if (mainStayType === "STR" && b.strCount === 0) return false;
      if (mainSpaceType === "Coliving" && !b.apartments.some(a => a.rooms.some(r => r.housingType === "Coliving"))) return false;
      if (mainSpaceType === "Entire Apartment" && !b.apartments.some(a => a.rooms.some(r => r.housingType !== "Coliving"))) return false;

      if (af.buildings.length && !af.buildings.includes(b.name)) return false;
      if (af.stayType.includes("LTR") && b.ltrCount === 0) return false;
      if (af.stayType.includes("STR") && b.strCount === 0) return false;
      if (af.spaceType.includes("Coliving") && !b.apartments.some(a => a.rooms.some(r => r.housingType === "Coliving"))) return false;
      if (af.spaceType.includes("Entire Apartment") && !b.apartments.some(a => a.rooms.some(r => r.housingType !== "Coliving"))) return false;
      if (af.ownership.length && !af.ownership.includes(b.ownerLLC)) return false;
      if (af.features.includes("Has elevator") && !(b.amenities.present || []).includes("Elevator")) return false;
      if (af.amenities.length) {
        const bAm = new Set(b.amenities.present || []);
        if (!af.amenities.every(a => bAm.has(a))) return false;
      }
      const avgRent = b.totalRooms > 0 ? (b.yearlyRevenue / 12 / b.totalRooms) : 0;
      if (af.rentMin && avgRent > 0 && avgRent < Number(af.rentMin)) return false;
      if (af.rentMax && avgRent > 0 && avgRent > Number(af.rentMax)) return false;
      return true;
    });
    const by = {
      revenue:   (a, b) => b.monthlyRevenue - a.monthlyRevenue,
      occupancy: (a, b) => b.occupancy - a.occupancy,
      name:      (a, b) => a.name.localeCompare(b.name),
    }[sort] || (() => 0);
    return [...r].sort(by);
  }, [q, mainBuilding, mainStayType, mainSpaceType, appliedFilters, sort]);

  /* Applied filter chips */
  const chips = useMemo(() => {
    const af = appliedFilters;
    const out = [];
    if (q)             out.push({ key:"q",    label:'"' + q + '"',  type:"q" });
    if (mainBuilding)  out.push({ key:"mb",   label:mainBuilding,   type:"mainBuilding" });
    if (mainStayType)  out.push({ key:"mst",  label:mainStayType,   type:"mainStayType" });
    if (mainSpaceType) out.push({ key:"msp",  label:mainSpaceType,  type:"mainSpaceType" });
    af.stayType.forEach(v  => out.push({ key:"st-"+v,  label:v,              type:"drawer", field:"stayType",   val:v }));
    af.spaceType.forEach(v => out.push({ key:"sp-"+v,  label:v,              type:"drawer", field:"spaceType",  val:v }));
    af.buildings.forEach(v => out.push({ key:"bl-"+v,  label:v,              type:"drawer", field:"buildings",  val:v }));
    af.beds.forEach(v      => out.push({ key:"bd-"+v,  label:v,              type:"drawer", field:"beds",       val:v }));
    af.baths.forEach(v     => out.push({ key:"ba-"+v,  label:v,              type:"drawer", field:"baths",      val:v }));
    af.bedSize.forEach(v   => out.push({ key:"bs-"+v,  label:v+" bed",       type:"drawer", field:"bedSize",    val:v }));
    af.aptLayout.forEach(v => out.push({ key:"al-"+v,  label:"Layout "+v,    type:"drawer", field:"aptLayout",  val:v }));
    af.features.forEach(v  => out.push({ key:"ft-"+v,  label:v,              type:"drawer", field:"features",   val:v }));
    af.ownership.forEach(v => out.push({ key:"ow-"+v,  label:v,              type:"drawer", field:"ownership",  val:v }));
    af.amenities.forEach(v => out.push({ key:"am-"+v,  label:v,              type:"drawer", field:"amenities",  val:v }));
    if (af.rentMin || af.rentMax) {
      const lbl = "Rent " + (af.rentMin ? "$"+af.rentMin : "") + (af.rentMin && af.rentMax ? "–" : "") + (af.rentMax ? "$"+af.rentMax : "+");
      out.push({ key:"rent", label:lbl, type:"drawer-rent" });
    }
    return out;
  }, [q, mainBuilding, mainStayType, mainSpaceType, appliedFilters]);

  const removeChip = (chip) => {
    if (chip.type === "q")            { setQ(""); return; }
    if (chip.type === "mainBuilding") { setMainBuilding(""); return; }
    if (chip.type === "mainStayType") { setMainStayType(""); return; }
    if (chip.type === "mainSpaceType"){ setMainSpaceType(""); return; }
    if (chip.type === "drawer-rent")  {
      const nxt = { ...appliedFilters, rentMin:"", rentMax:"" };
      setAppliedFilters(nxt); setDraftFilters(nxt); return;
    }
    if (chip.type === "drawer") {
      const nxt = { ...appliedFilters, [chip.field]: appliedFilters[chip.field].filter(x => x !== chip.val) };
      setAppliedFilters(nxt); setDraftFilters(nxt);
    }
  };

  const openDrawer  = () => { setDraftFilters({ ...appliedFilters }); setDrawerOpen(true); };
  const applyDrawer = () => { setAppliedFilters({ ...draftFilters }); setDrawerOpen(false); };
  const clearDrawer = () => { const nxt = { ...FILTER_DEFAULTS }; setDraftFilters(nxt); setAppliedFilters(nxt); setDrawerOpen(false); };
  const clearAll    = () => { setQ(""); setMainBuilding(""); setMainStayType(""); setMainSpaceType(""); setAppliedFilters({ ...FILTER_DEFAULTS }); setDraftFilters({ ...FILTER_DEFAULTS }); };

  const anyActive = chips.length > 0;
  const cols = "52px minmax(180px,1.4fr) 56px 72px 60px 90px 100px 90px 52px";
  const close = () => setModal(null);

  const buildingMenu = (b) => ([
    { label: "Add apartment",    icon: "plus",  onClick: () => setModal({ type: "add-apartment",    building: b }) },
    { label: "Edit building",    icon: "edit",  onClick: () => setModal({ type: "edit-building",    building: b }) },
    { sep: true },
    { label: "Disable building", icon: "ban",   onClick: () => setModal({ type: "disable-building", building: b }) },
    { label: "Delete building",  icon: "trash", danger: true, onClick: () => setModal({ type: "delete-building", building: b }) },
  ]);

  return (
    <div className="fade">

      {/* ── Filter bar ── */}
      <div className="prop-filters">
        <div className="pf-row1">
          <div className="pf-search">
            <span className="pf-ic"><AIcon name="search" size={16} /></span>
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search buildings by name, address, or LLC…" />
          </div>
        </div>

        <div className="pf-row2">
          <select className={"pf-select" + (mainBuilding ? " active" : "")}
            value={mainBuilding} onChange={e => setMainBuilding(e.target.value)}>
            <option value="">Building</option>
            {BUILDINGS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>

          <select className={"pf-select" + (mainStayType ? " active" : "")}
            value={mainStayType} onChange={e => setMainStayType(e.target.value)}>
            <option value="">Stay Type</option>
            <option value="LTR">LTR</option>
            <option value="STR">STR</option>
          </select>

          <select className={"pf-select" + (mainSpaceType ? " active" : "")}
            value={mainSpaceType} onChange={e => setMainSpaceType(e.target.value)}>
            <option value="">Space Type</option>
            <option value="Coliving">Coliving</option>
            <option value="Entire Apartment">Entire Apartment</option>
          </select>

          <button type="button"
            className={"btn-more-filters" + (advCount > 0 ? " has-filters" : "")}
            onClick={openDrawer}>
            <AIcon name="sparkle" size={14} />
            More Filters
            {advCount > 0 && <span className="btn-mf-count">{advCount}</span>}
          </button>

          <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
            <select className="pf-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="revenue">Revenue ↓</option>
              <option value="occupancy">Occupancy ↓</option>
              <option value="name">Name A–Z</option>
            </select>
            <div className="view-switch" role="group" aria-label="View">
              <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")} title="Grid view"><AIcon name="grid" size={16} /></button>
              <button className={view === "list" ? "on" : ""} onClick={() => setView("list")} title="List view"><AIcon name="list" size={16} /></button>
            </div>
          </div>
        </div>

        {/* Applied filter chips */}
        {anyActive && (
          <div className="applied-bar">
            <span className="applied-label">Active:</span>
            {chips.map(chip => (
              <span key={chip.key} className="applied-chip">
                {chip.label}
                <span className="ax" onClick={() => removeChip(chip)}><AIcon name="x" size={11} /></span>
              </span>
            ))}
            <button type="button" className="applied-clear" onClick={clearAll}>Clear all</button>
          </div>
        )}
      </div>

      {/* ── Building grid / list ── */}
      {list.length === 0 ? (
        anyActive ? (
          <EmptyState icon="building" heading="No properties match your filters"
            body="Try adjusting your filters or clearing them to see all buildings."
            action={<button className="btn btn-soft btn-sm" onClick={clearAll}>Clear filters</button>} />
        ) : (
          <EmptyState icon="building" heading="No buildings added yet"
            body="Add your first building to start managing apartments, rooms, amenities, and activity."
            action={<button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-building" })}><AIcon name="plus" size={14} /> Add building</button>} />
        )
      ) : view === "grid" ? (
        <div className="bgrid">
          {list.map(b => {
            const disabled = b.status === "Under Construction";
            return (
              <div className="bcard" key={b.id} role="button" tabIndex={0}
                style={disabled ? { opacity:.72 } : {}}
                onClick={() => !disabled && onOpenBuilding(b.id)}
                onKeyDown={e => { if (e.key === "Enter" && !disabled) onOpenBuilding(b.id); }}>
                <div className="bcard-media">
                  <BuildingMedia src={b.image} alt={b.name} />
                  <span className="bcard-badge"><StatusTag status={b.status} tone={b.statusTone} /></span>
                  <span className="bcard-kebab" onClick={e => e.stopPropagation()}>
                    <ActionMenu items={buildingMenu(b)} glass />
                  </span>
                </div>
                <div className="bcard-body">
                  <div className="bcard-title" style={{ fontWeight:600, fontFamily:"var(--sans)", fontSize:19 }}>{b.name}</div>
                  {disabled && <DisabledNotice message="Under Construction — operations paused" />}
                  <div className="bcard-line"><span className="li"><AIcon name="pin" size={13} /></span><span>{b.address}</span></div>
                  {b.ownerLLC && <div className="bcard-line"><span className="li"><AIcon name="briefcase" size={13} /></span><span>{b.ownerLLC}</span></div>}
                  <div className="bcard-line"><span className="li"><AIcon name="layers" size={13} /></span><span>{b.floors} floors</span></div>
                  <div className="bcard-stats" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
                    <div className="bstat"><span className="l">Apts</span><span className="v" style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:18 }}>{b.totalApartments}</span></div>
                    <div className="bstat"><span className="l">Rooms</span><span className="v" style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:18 }}>{b.totalRooms}</span></div>
                    <div className="bstat"><span className="l">LTR</span><span className="v" style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:18, color:"var(--green)" }}>{b.ltrCount}</span></div>
                    <div className="bstat"><span className="l">STR</span><span className="v" style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:18, color:"var(--teal)" }}>{b.strCount}</span></div>
                  </div>
                  {b.yearlyRevenue > 0 && (
                    <div className="bcard-line">
                      <span className="li"><AIcon name="wallet" size={13} /></span>
                      <span style={{ fontWeight:500 }}>${Math.round(b.yearlyRevenue / 1000)}k last year</span>
                    </div>
                  )}
                  {b.financials.revenue > 0 && (
                    <div className="bcard-line">
                      <span className="li"><AIcon name="trend" size={13} /></span>
                      <span>{M(b.financials.revenue)}/mo current</span>
                    </div>
                  )}
                  <div className="bcard-foot">
                    {disabled && <button className="btn btn-soft btn-sm" onClick={e => e.stopPropagation()}>Re-enable</button>}
                    <span className="small mono" style={{ marginLeft:"auto" }}>{b.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="list-scroll">
          <div className="dtable rich">
            <div className="dt-head" style={{ gridTemplateColumns: cols }}>
              <span></span><span>Building</span><span>Floors</span><span>Apartments</span><span>Rooms</span>
              <span>LTR / STR</span><span>Revenue / yr</span><span>Status</span>
              <span className="hd-kebab"></span>
            </div>
            {list.map(b => {
              const disabled = b.status === "Under Construction";
              return (
                <div className="dt-row" key={b.id} role="button" tabIndex={0} style={{ gridTemplateColumns: cols }}
                  onClick={() => !disabled && onOpenBuilding(b.id)}
                  onKeyDown={e => { if (e.key === "Enter" && !disabled) onOpenBuilding(b.id); }}>
                  <div className="row-thumb"><BuildingMedia src={b.image} alt={b.name} compact /></div>
                  <div className="primary">
                    <span className="nm" style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:16 }}>{b.name}</span>
                    <span className="sub2"><span className="si"><AIcon name="pin" size={11} /></span><span>{b.address}</span></span>
                    {b.ownerLLC && <span className="sub2"><span className="si"><AIcon name="briefcase" size={11} /></span><span>{b.ownerLLC}</span></span>}
                  </div>
                  <div className="cell-v">{b.floors}</div>
                  <div className="cell-v">{b.totalApartments}</div>
                  <div className="cell-v">{b.totalRooms}</div>
                  <div className="cell-v" style={{ fontSize:13 }}>
                    <span style={{ color:"var(--green)", fontWeight:600 }}>{b.ltrCount}</span>
                    <span style={{ color:"var(--muted)", margin:"0 4px" }}>/</span>
                    <span style={{ color:"var(--teal)", fontWeight:600 }}>{b.strCount}</span>
                  </div>
                  <div className="cell-v" style={{ fontSize:13 }}>
                    {b.yearlyRevenue > 0 ? <span style={{ fontWeight:500 }}>${Math.round(b.yearlyRevenue/1000)}k</span> : <span className="muted">—</span>}
                  </div>
                  <div><StatusTag status={b.status} tone={b.statusTone} /></div>
                  <span className="row-kebab" onClick={e => e.stopPropagation()}><ActionMenu items={buildingMenu(b)} /></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        draft={draftFilters}
        onChange={setDraftFilters}
        onApply={applyDrawer}
        onClear={clearDrawer}
      />

      {modal?.type === "add-building" && (
        <BuildingModal mode="add" onSave={() => showToast("Building added successfully.")} onClose={close} />
      )}
      {modal?.type === "edit-building" && (
        <BuildingModal mode="edit" building={modal.building} onSave={() => showToast("Building updated.")} onClose={close} />
      )}
      {modal?.type === "add-apartment" && (
        <ApartmentModal mode="add" buildingName={modal.building?.name} onSave={() => showToast("Apartment added.")} onClose={close} />
      )}
      {(modal?.type === "disable-building" || modal?.type === "delete-building") && (
        <ConfirmModal kind={modal.type} name={modal.building?.name}
          onConfirm={() => showToast(modal.building.name + (modal.type === "disable-building" ? " disabled." : " deleted."))}
          onClose={close} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ───────────────────────── Building Detail ───────────────────────── */
function BuildingDetail({ building: b, onBack, onHome, onOpenApartment, onOpenRoom }) {
  const [sec, setSec]               = useStateV("apartments");
  const [modal, setModal]           = useStateV(null);
  const [amenities, setAmenities]   = useStateV(() => initAmenities(b.amenities.present));
  const [amenityAdd, setAmenityAdd] = useStateV(false);
  const [openApts, setOpenApts]     = useStateV({});
  const toggleApt = (id) => setOpenApts(p => ({ ...p, [id]: !p[id] }));
  const { toasts, showToast }       = useToast();
  const close = () => setModal(null);

  const tabs = [
    { id: "apartments", label: "Apartments", icon: "building", count: b.totalApartments },
    { id: "overview",   label: "Overview",   icon: "doc"      },
    { id: "financials", label: "Financials", icon: "wallet"   },
    { id: "amenities",  label: "Amenities",  icon: "sparkle", count: amenities.length },
    { id: "activity",   label: "Activity",   icon: "bell"     },
  ];

  const aptMenu = (a) => ([
    { label: "View apartment details", icon: "building", onClick: () => onOpenApartment(a.id) },
    { label: "Add room",          icon: "plus",  onClick: () => setModal({ type: "add-room",          apt: a }) },
    { label: "Edit apartment",    icon: "edit",  onClick: () => setModal({ type: "edit-apartment",    apt: a }) },
    { sep: true },
    { label: "Disable apartment", icon: "ban",   onClick: () => setModal({ type: "disable-apartment", apt: a }) },
    { label: "Delete apartment",  icon: "trash", danger: true, onClick: () => setModal({ type: "delete-apartment", apt: a }) },
  ]);

  const childCols = "minmax(0,1.5fr) 0.7fr 0.8fr 0.8fr 1.1fr 1fr auto auto";

  const disabled = b.status === "Under Construction";

  return (
    <div className="fade">
      <Breadcrumb trail={[{ label: "Properties", onClick: onHome }, { label: b.name }]} />

      <div className="detail-head">
        <div className="dh-left">
          <div className="dh-titlerow">
            <span className="dh-icon" style={{ background:"rgba(199,122,60,.12)", color:"var(--amber)" }}><AIcon name="building" size={20} /></span>
            <div>
              <h1 style={{ fontFamily:"var(--sans)", fontWeight:700 }}>{b.name}</h1>
              <div className="dh-meta">
                <span className="m"><span className="mi"><AIcon name="pin" size={14} /></span>{b.address}</span>
                {b.ownerLLC && <span className="m"><span className="mi"><AIcon name="briefcase" size={14} /></span>{b.ownerLLC}</span>}
                <span className="m"><span className="mi"><AIcon name="layers" size={14} /></span>{b.floors} floors</span>
                <span className="m"><span className="mi"><AIcon name="clock" size={14} /></span>Updated {b.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dh-actions">
          <StatusTag status={b.status} tone={b.statusTone} />
          {!disabled && (
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-apartment" })}><AIcon name="plus" size={15} /> Add apartment</button>
          )}
          <ActionMenu items={[
            { label: "Add building amenity", icon: "sparkle", onClick: () => { setSec("amenities"); setAmenityAdd(true); } },
            { label: "Edit building",        icon: "edit",    onClick: () => setModal({ type: "edit-building" }) },
            { sep: true },
            { label: "Disable building",     icon: "ban",     onClick: () => setModal({ type: "disable-building" }) },
            { label: "Delete building",      icon: "trash",   danger: true, onClick: () => setModal({ type: "delete-building" }) },
          ]} />
        </div>
      </div>

      <KpiRow items={[
        { label: "Apartments",      icon: "building", value: b.totalApartments },
        { label: "Rooms",           icon: "bed",      value: b.totalRooms },
        { label: "LTR / STR",       icon: "users",    value: b.ltrCount + " / " + b.strCount },
        { label: "Monthly revenue", icon: "wallet",   value: b.financials.revenue > 0 ? M(b.financials.revenue) : "—",
          delta: b.yearlyRevenue > 0 ? "$" + Math.round(b.yearlyRevenue/1000) + "k last year" : null, deltaDir: "up" },
      ]} />

      {disabled && (
        <div style={{ marginBottom:20 }}>
          <DisabledNotice message="This building is under construction. Re-enable it to manage apartments and rooms." />
        </div>
      )}

      <LevelTabs tabs={tabs} active={sec} onChange={setSec} />

      {sec === "apartments" && (
        <Panel icon="building" title={"Apartments in " + b.name}>
          {disabled ? (
            <EmptyState icon="building" heading="Building under construction"
              body="Apartments cannot be managed while the building is under construction." />
          ) : b.apartments.length === 0 ? (
            <EmptyState icon="building" heading="No apartments added yet"
              body="Add an apartment inside this building to start managing rooms and occupancy."
              action={<button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-apartment" })}><AIcon name="plus" size={14} /> Add apartment</button>} />
          ) : (
            <div className="child-table">
              {b.apartments.map(a => {
                const pct = Math.round((a.occupiedRooms / Math.max(a.totalRooms,1)) * 100);
                const open = !!openApts[a.id];
                return (
                  <React.Fragment key={a.id}>
                    <div className="child-row" role="button" tabIndex={0}
                      style={{ gridTemplateColumns: childCols }}
                      onClick={() => toggleApt(a.id)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleApt(a.id); } }}>
                      <div className="cr-primary">
                        <b style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:15 }}>{a.name}</b>
                        <span>{a.floor} · {a.layout || (a.totalRooms + " rooms")}</span>
                      </div>
                      <div className="cr-cell"><span className="l">Rooms</span><span className="v">{a.totalRooms}</span></div>
                      <div className="cr-cell">
                        <span className="l">LTR</span>
                        <span className="v" style={{ color:"var(--green)" }}>{a.ltrCount}</span>
                      </div>
                      <div className="cr-cell">
                        <span className="l">STR</span>
                        <span className="v" style={{ color:"var(--teal)" }}>{a.strCount}</span>
                      </div>
                      <div className="cr-cell">
                        <span className="l">Occupancy</span>
                        <span className="v">{a.occupiedRooms}/{a.totalRooms} · {pct}%</span>
                      </div>
                      <div><StatusTag status={a.status} tone={a.statusTone} /></div>
                      <span className="cr-go">
                        {open ? "Hide Rooms" : "Show Rooms"}
                        <span style={{ display:"flex", transition:"transform .2s ease", transform: open ? "rotate(180deg)" : "none" }}>
                          <AIcon name="chevron" size={13} />
                        </span>
                      </span>
                      <span onClick={e => e.stopPropagation()}><ActionMenu items={aptMenu(a)} /></span>
                    </div>
                    {open && (
                      <div style={{ padding:"2px 0 10px 26px", display:"flex", flexDirection:"column", gap:6 }}>
                        {a.rooms.length === 0 ? (
                          <div style={{ fontSize:13, color:"var(--muted)", padding:"6px 0" }}>
                            No rooms in this apartment yet.
                          </div>
                        ) : a.rooms.map(r => (
                          <div className="child-row" key={r.id} role="button" tabIndex={0}
                            style={{ gridTemplateColumns:"minmax(0,1.4fr) 0.9fr 0.8fr 1fr 1fr auto", padding:"10px 14px" }}
                            onClick={e => { e.stopPropagation(); onOpenRoom && onOpenRoom(a.id, r.id); }}
                            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onOpenRoom && onOpenRoom(a.id, r.id); } }}>
                            <div className="cr-primary">
                              <b style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:14 }}>{r.name}</b>
                              <span>{r.housingType} · {r.bd}bd / {r.ba}ba</span>
                            </div>
                            <div className="cr-cell"><span className="l">Type</span><span className="v"><RentalBadge type={r.rentalType} /></span></div>
                            <div className="cr-cell"><span className="l">Bed</span><span className="v">{r.bedSize || "—"}</span></div>
                            <div className="cr-cell"><span className="l">Rent / mo</span><span className="v">{M(r.rent)}</span></div>
                            <div><StatusTag status={r.status} tone={r.statusTone} /></div>
                            <span className="cr-go">View<AIcon name="chevron" size={13} /></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </Panel>
      )}

      {sec === "overview" && (
        <OverviewPanel title="Building overview" status={b.status} statusTone={b.statusTone}
          specs={[
            { label: "Address",       value: b.address },
            { label: "Owner LLC",     value: b.ownerLLC || "—" },
            { label: "Floors",        value: b.floors, serif: false },
            { label: "Total apartments", value: b.totalApartments, serif: true },
            { label: "Total rooms",   value: b.totalRooms, serif: true },
            { label: "Occupancy",     value: b.occupancy + "%", serif: true },
            { label: "LTR rooms",     value: b.ltrCount, serif: true },
            { label: "STR rooms",     value: b.strCount, serif: true },
            { label: "Status note",   value: b.statusNote },
          ]} />
      )}
      {sec === "financials" && (
        <FinancialsPanel title="Building financials"
          cards={[
            { label: "Monthly revenue",  value: M(b.financials.revenue),     note: "current month" },
            { label: "Pending payments", value: M(b.financials.pending),     note: "outstanding", dir: b.financials.pending > 4000 ? "down" : "" },
            { label: "Maintenance cost", value: M(b.financials.maintenance), note: "this month" },
            { label: "Net income",       value: M(b.financials.netIncome),   note: "after costs", dir: "up", accent: true },
          ]}
          trend={b.financials.trend} trendLabels={b.financials.trendLabels}
          ledger={[
            { label: "Gross revenue",         value: M(b.financials.revenue) },
            { label: "Pending / outstanding",  value: "– " + M(b.financials.pending) },
            { label: "Maintenance & upkeep",   value: "– " + M(b.financials.maintenance) },
            { label: "Net income",             value: M(b.financials.netIncome), total: true },
          ]} />
      )}
      {sec === "amenities" && (
        <AmenityManager level="building" contextPath={b.name} amenities={amenities}
          onAdd={a    => { setAmenities(p => [...p, a]); showToast("Amenity added."); }}
          onEdit={(id, f) => { setAmenities(p => p.map(x => x.id === id ? { ...x, ...f } : x)); showToast("Amenity updated."); }}
          onRemove={id => { setAmenities(p => p.filter(x => x.id !== id)); showToast("Amenity removed."); }}
          autoOpenAdd={amenityAdd} onAutoOpenConsumed={() => setAmenityAdd(false)} />
      )}
      {sec === "activity" && <ActivityPanel title="Building activity" activity={b.activity} />}

      {modal?.type === "edit-building" && (
        <BuildingModal mode="edit" building={b} onSave={() => showToast("Building updated.")} onClose={close} />
      )}
      {modal?.type === "add-apartment" && (
        <ApartmentModal mode="add" buildingName={b.name} onSave={() => showToast("Apartment added.")} onClose={close} />
      )}
      {modal?.type === "edit-apartment" && (
        <ApartmentModal mode="edit" buildingName={b.name} apt={modal.apt} onSave={() => showToast("Apartment updated.")} onClose={close} />
      )}
      {modal?.type === "add-room" && (
        <RoomModal mode="add" buildingName={b.name} aptName={modal.apt?.name} onSave={() => showToast("Room added.")} onClose={close} />
      )}
      {(modal?.type === "disable-apartment" || modal?.type === "delete-apartment") && (
        <ConfirmModal kind={modal.type} name={modal.apt?.name}
          onConfirm={() => showToast((modal.apt?.name || "Apartment") + (modal.type === "disable-apartment" ? " disabled." : " deleted."))}
          onClose={close} />
      )}
      {modal?.type === "disable-building" && (
        <ConfirmModal kind="disable-building" name={b.name} onConfirm={() => showToast(b.name + " disabled.")} onClose={close} />
      )}
      {modal?.type === "delete-building" && (
        <ConfirmModal kind="delete-building" name={b.name} onConfirm={() => showToast(b.name + " deleted.")} onClose={close} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ───────────────────────── Apartment Detail ───────────────────────── */
function ApartmentDetail({ building: b, apt: a, onHome, onOpenBuilding, onBack, onOpenRoom }) {
  const [sec, setSec]               = useStateV("rooms");
  const [modal, setModal]           = useStateV(null);
  const [amenities, setAmenities]   = useStateV(() => initAmenities(a.amenities.present));
  const [amenityAdd, setAmenityAdd] = useStateV(false);
  const { toasts, showToast }       = useToast();
  const close = () => setModal(null);

  const pct = Math.round((a.occupiedRooms / Math.max(a.totalRooms,1)) * 100);

  const tabs = [
    { id: "rooms",        label: "Rooms",        icon: "bed",     count: a.totalRooms },
    { id: "overview",     label: "Overview",     icon: "doc"      },
    { id: "amenities",    label: "Amenities",    icon: "sparkle", count: amenities.length },
    { id: "pricing",      label: "Pricing",      icon: "wallet"   },
    { id: "reservations", label: "Reservations", icon: "doc"      },
    { id: "activity",     label: "Activity",     icon: "bell"     },
  ];

  const roomMenu = (r) => ([
    { label: "Edit room",    icon: "edit",  onClick: () => setModal({ type: "edit-room",    room: r }) },
    { sep: true },
    { label: "Disable room", icon: "ban",   onClick: () => setModal({ type: "disable-room", room: r }) },
    { label: "Delete room",  icon: "trash", danger: true, onClick: () => setModal({ type: "delete-room", room: r }) },
  ]);

  const childCols = "minmax(0,1.2fr) 72px 80px 72px 80px 100px 1fr auto auto";

  return (
    <div className="fade">
      <Breadcrumb trail={[
        { label: "Properties", onClick: onHome },
        { label: b.name,       onClick: () => onOpenBuilding(b.id) },
        { label: a.name },
      ]} />
      <div className="detail-head">
        <div className="dh-left">
          <div className="dh-titlerow">
            <span className="dh-icon" style={{ background:"rgba(45,95,90,.12)", color:"var(--teal)" }}><AIcon name="building" size={20} /></span>
            <div>
              <h1 style={{ fontFamily:"var(--sans)", fontWeight:700 }}>{a.name}</h1>
              <div className="dh-meta">
                <span className="m"><span className="mi"><AIcon name="building" size={14} /></span>{b.name}</span>
                <span className="m"><span className="mi"><AIcon name="layers"   size={14} /></span>{a.floor}</span>
                {a.size && <span className="m"><span className="mi"><AIcon name="window" size={14} /></span>{a.size}</span>}
                {a.layout && <span className="m"><span className="mi"><AIcon name="grid" size={14} /></span>Layout {a.layout}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="dh-actions">
          <StatusTag status={a.status} tone={a.statusTone} />
          <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-room" })}><AIcon name="plus" size={15} /> Add room</button>
          <ActionMenu items={[
            { label: "Add apartment amenity", icon: "sparkle", onClick: () => { setSec("amenities"); setAmenityAdd(true); } },
            { label: "Edit apartment",        icon: "edit",    onClick: () => setModal({ type: "edit-apartment" }) },
            { sep: true },
            { label: "Disable apartment",     icon: "ban",     onClick: () => setModal({ type: "disable-apartment" }) },
            { label: "Delete apartment",      icon: "trash",   danger: true, onClick: () => setModal({ type: "delete-apartment" }) },
          ]} />
        </div>
      </div>

      <KpiRow items={[
        { label: "Rooms",        icon: "bed",    value: a.totalRooms },
        { label: "LTR / STR",   icon: "users",  value: a.ltrCount + " / " + a.strCount },
        { label: "Occupancy",   icon: "users",  value: a.occupiedRooms + "/" + a.totalRooms, unit: " rooms" },
        { label: "Rent / mo",   icon: "wallet", value: M(a.rent) },
      ]} />

      <LevelTabs tabs={tabs} active={sec} onChange={setSec} />

      {sec === "rooms" && (
        <Panel icon="bed" title={"Rooms in " + a.name}>
          {a.rooms.length === 0 ? (
            <EmptyState icon="bed" heading="No rooms added yet"
              body="Add rooms inside this apartment to manage rent, amenities, and tenant activity."
              action={<button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-room" })}><AIcon name="plus" size={14} /> Add room</button>} />
          ) : (
            <div className="child-table">
              {a.rooms.map(r => (
                <div className="child-row" key={r.id} role="button" tabIndex={0}
                  style={{ gridTemplateColumns: childCols }}
                  onClick={() => onOpenRoom(r.id)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenRoom(r.id); } }}>
                  <div className="cr-primary">
                    <b style={{ fontFamily:"var(--sans)", fontWeight:600, fontSize:15 }}>{r.name}</b>
                    <span>{r.housingType} · {r.bd}bd / {r.ba}ba</span>
                  </div>
                  <div className="cr-cell">
                    <span className="l">Type</span>
                    <span className="v"><RentalBadge type={r.rentalType} /></span>
                  </div>
                  <div className="cr-cell">
                    <span className="l">Bed</span>
                    <span className="v">{r.bedSize || "—"}</span>
                  </div>
                  <div className="cr-cell">
                    <span className="l">Listed</span>
                    <span className="v" style={{ fontSize:12 }}>{r.listedDate || "—"}</span>
                  </div>
                  <div className="cr-cell">
                    <span className="l">Rev / mo</span>
                    <span className="v">{M(r.rent)}</span>
                  </div>
                  <div className="cr-cell">
                    <span className="l">Rev / yr</span>
                    <span className="v" style={{ fontWeight:600 }}>{M(r.yearlyRevenue)}</span>
                  </div>
                  <div><StatusTag status={r.status} tone={r.statusTone} /></div>
                  <span className="cr-go">View<AIcon name="chevron" size={13} /></span>
                  <span onClick={e => e.stopPropagation()}><ActionMenu items={roomMenu(r)} /></span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {sec === "overview" && (
        <OverviewPanel title="Apartment overview" status={a.status} statusTone={a.statusTone}
          specs={[
            { label: "Parent building", value: b.name },
            { label: "Floor",           value: a.floor },
            { label: "Size",            value: a.size || "—" },
            { label: "Layout",          value: a.layout || "—" },
            { label: "Total rooms",     value: a.totalRooms, serif: true },
            { label: "Occupancy",       value: pct + "%",    serif: true },
            { label: "LTR rooms",       value: a.ltrCount,   serif: true },
            { label: "STR rooms",       value: a.strCount,   serif: true },
            { label: "Status",          value: a.status },
          ]} />
      )}
      {sec === "amenities" && (
        <AmenityManager level="apartment" contextPath={b.name + " / " + a.name} amenities={amenities}
          onAdd={am   => { setAmenities(p => [...p, am]); showToast("Amenity added."); }}
          onEdit={(id, f) => { setAmenities(p => p.map(x => x.id === id ? { ...x, ...f } : x)); showToast("Amenity updated."); }}
          onRemove={id => { setAmenities(p => p.filter(x => x.id !== id)); showToast("Amenity removed."); }}
          autoOpenAdd={amenityAdd} onAutoOpenConsumed={() => setAmenityAdd(false)} />
      )}
      {sec === "pricing" && (
        <FinancialsPanel title="Apartment pricing"
          cards={[
            { label: "Monthly rent", value: M(a.financials.rent) },
            { label: "Paid",         value: M(a.financials.paid),    note: "received", dir: "up" },
            { label: "Pending",      value: M(a.financials.pending), note: a.financials.pending ? "due" : "none", dir: a.financials.pending ? "down" : "" },
            { label: "Net income",   value: M(a.financials.rent - a.financials.utility - a.financials.maintenance), note: "after costs", dir: "up", accent: true },
          ]}
          ledger={[
            { label: "Rent collected",       value: M(a.financials.paid) },
            { label: "Utility cost",         value: "– " + M(a.financials.utility) },
            { label: "Maintenance charges",  value: "– " + M(a.financials.maintenance) },
            { label: "Net income",           value: M(a.financials.rent - a.financials.utility - a.financials.maintenance), total: true },
          ]} />
      )}
      {sec === "reservations" && (
        <Panel icon="doc" title="Reservations">
          <EmptyState icon="doc" heading="No reservations yet"
            body="Lease and reservation history for this apartment will appear here." />
        </Panel>
      )}
      {sec === "activity" && <ActivityPanel title="Apartment activity" activity={a.activity} />}

      {modal?.type === "edit-apartment" && (
        <ApartmentModal mode="edit" buildingName={b.name} apt={a} onSave={() => showToast("Apartment updated.")} onClose={close} />
      )}
      {modal?.type === "add-room" && (
        <RoomModal mode="add" buildingName={b.name} aptName={a.name} onSave={() => showToast("Room added.")} onClose={close} />
      )}
      {modal?.type === "edit-room" && (
        <RoomModal mode="edit" buildingName={b.name} aptName={a.name} room={modal.room} onSave={() => showToast("Room updated.")} onClose={close} />
      )}
      {(modal?.type === "disable-room" || modal?.type === "delete-room") && (
        <ConfirmModal kind={modal.type} name={modal.room?.name}
          onConfirm={() => showToast((modal.room?.name || "Room") + (modal.type === "disable-room" ? " disabled." : " deleted."))}
          onClose={close} />
      )}
      {modal?.type === "disable-apartment" && (
        <ConfirmModal kind="disable-apartment" name={a.name} onConfirm={() => showToast(a.name + " disabled.")} onClose={close} />
      )}
      {modal?.type === "delete-apartment" && (
        <ConfirmModal kind="delete-apartment" name={a.name} onConfirm={() => showToast(a.name + " deleted.")} onClose={close} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ───────────────────────── Room Detail ───────────────────────── */
function RoomDetail({ building: b, apt: a, room: r, onHome, onOpenBuilding, onOpenApartment, onBack }) {
  const [sec, setSec]               = useStateV("overview");
  const [modal, setModal]           = useStateV(null);
  const [amenities, setAmenities]   = useStateV(() => initAmenities(r.amenities.present));
  const [amenityAdd, setAmenityAdd] = useStateV(false);
  const { toasts, showToast }       = useToast();
  const close = () => setModal(null);

  const payTone = r.financials.status === "Paid" ? "green"
    : r.financials.status === "Partial" ? "amber" : "terra";

  const tabs = [
    { id: "overview",   label: "Overview",   icon: "doc"     },
    { id: "financials", label: "Financials", icon: "wallet"  },
    { id: "amenities",  label: "Amenities",  icon: "sparkle", count: amenities.length },
    { id: "activity",   label: "Activity",   icon: "bell"    },
  ];

  return (
    <div className="fade">
      <Breadcrumb trail={[
        { label: "Properties", onClick: onHome },
        { label: b.name,       onClick: () => onOpenBuilding(b.id) },
        { label: a.name,       onClick: () => onOpenApartment(a.id) },
        { label: r.name },
      ]} />
      <div className="detail-head">
        <div className="dh-left">
          <div className="dh-titlerow">
            <span className="dh-icon" style={{ background:"rgba(138,95,119,.14)", color:"var(--plum)" }}><AIcon name="bed" size={20} /></span>
            <div>
              <h1 style={{ fontFamily:"var(--sans)", fontWeight:700 }}>{r.name}</h1>
              <div className="dh-meta">
                <span className="m"><span className="mi"><AIcon name="building" size={14} /></span>{b.name}</span>
                <span className="m"><span className="mi"><AIcon name="layers"   size={14} /></span>{a.name}</span>
                <span className="m"><span className="mi"><AIcon name="bed"      size={14} /></span>{r.housingType || r.type}</span>
                {r.rentalType && <span className="m"><RentalBadge type={r.rentalType} /></span>}
              </div>
            </div>
          </div>
        </div>
        <div className="dh-actions">
          <StatusTag status={r.status} tone={r.statusTone} />
          <ActionMenu items={[
            { label: "Add room amenity", icon: "sparkle", onClick: () => { setSec("amenities"); setAmenityAdd(true); } },
            { label: "Edit room",        icon: "edit",    onClick: () => setModal({ type: "edit-room" }) },
            { sep: true },
            { label: "Disable room",     icon: "ban",     onClick: () => setModal({ type: "disable-room" }) },
            { label: "Delete room",      icon: "trash",   danger: true, onClick: () => setModal({ type: "delete-room" }) },
          ]} />
        </div>
      </div>

      <KpiRow items={[
        { label: "Rent / mo",      icon: "wallet",  value: M(r.rent),              unit: "/mo" },
        { label: "Revenue / yr",   icon: "trend",   value: M(r.yearlyRevenue) },
        { label: "Payment",        icon: "doc",     value: r.financials.status },
        { label: "Status",         icon: "users",   value: r.status },
      ]} />

      <LevelTabs tabs={tabs} active={sec} onChange={setSec} />

      {sec === "overview" && (
        <div className="det-cols wide-left">
          <OverviewPanel title="Room overview" status={r.status} statusTone={r.statusTone}
            specs={[
              { label: "Rental type",     value: r.rentalType || "—" },
              { label: "Housing type",    value: r.housingType || "—" },
              { label: "Bed size",        value: r.bedSize || "—" },
              { label: "Bedrooms / Bath", value: r.bd != null ? r.bd + "bd / " + r.ba + "ba" : "—" },
              { label: "Listed",          value: r.listedDate || "—" },
              { label: "Parent apartment",value: a.name },
              { label: "Parent building", value: b.name },
              { label: "Monthly revenue", value: M(r.rent), serif: true },
              { label: "Yearly revenue",  value: M(r.yearlyRevenue), serif: true },
            ]} />
          <Panel icon="user" title="Assigned tenant">
            {r.tenant ? (
              <div>
                <div style={{ marginBottom:16 }}><Tenant name={r.tenant} /></div>
                <div className="ledger">
                  <div className="lr"><span>Lease status</span><b>Active</b></div>
                  <div className="lr"><span>Monthly rent</span><b>{M(r.rent)}</b></div>
                  <div className="lr"><span>Payment</span><b><StatusTag status={r.financials.status} tone={payTone} /></b></div>
                </div>
              </div>
            ) : (
              <EmptyState icon="user" heading="No tenant assigned" body="This room is currently vacant and available to lease."
                action={<button className="btn btn-soft btn-sm"><AIcon name="plus" size={15} /> Assign tenant</button>} />
            )}
          </Panel>
        </div>
      )}
      {sec === "financials" && (
        <FinancialsPanel title="Room financials"
          cards={[
            { label: "Monthly rent",    value: M(r.financials.rent) },
            { label: "Paid amount",     value: M(r.financials.paid),    note: "received", dir: "up" },
            { label: "Pending amount",  value: M(r.financials.pending), note: r.financials.pending ? "due" : "none", dir: r.financials.pending ? "down" : "" },
            { label: "Extra charges",   value: M(r.financials.extra),   note: "add-ons" },
          ]}
          ledger={[
            { label: "Base rent",     value: M(r.financials.rent) },
            { label: "Extra charges", value: "+ " + M(r.financials.extra) },
            { label: "Paid to date",  value: M(r.financials.paid) },
            { label: "Balance due",   value: M(r.financials.pending), total: true },
          ]} />
      )}
      {sec === "amenities" && (
        <AmenityManager level="room" contextPath={b.name + " / " + a.name + " / " + r.name} amenities={amenities}
          onAdd={am   => { setAmenities(p => [...p, am]); showToast("Amenity added."); }}
          onEdit={(id, f) => { setAmenities(p => p.map(x => x.id === id ? { ...x, ...f } : x)); showToast("Amenity updated."); }}
          onRemove={id => { setAmenities(p => p.filter(x => x.id !== id)); showToast("Amenity removed."); }}
          autoOpenAdd={amenityAdd} onAutoOpenConsumed={() => setAmenityAdd(false)} />
      )}
      {sec === "activity" && <ActivityPanel title="Room activity" activity={r.activity} />}

      {modal?.type === "edit-room" && (
        <RoomModal mode="edit" buildingName={b.name} aptName={a.name} room={r}
          onSave={() => showToast("Room updated.")} onClose={close} />
      )}
      {modal?.type === "disable-room" && (
        <ConfirmModal kind="disable-room" name={r.name} onConfirm={() => showToast(r.name + " disabled.")} onClose={close} />
      )}
      {modal?.type === "delete-room" && (
        <ConfirmModal kind="delete-room" name={r.name} onConfirm={() => showToast(r.name + " deleted.")} onClose={close} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

window.Views = { PropertiesList, BuildingDetail, ApartmentDetail, RoomDetail };
