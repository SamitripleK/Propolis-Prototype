// admin-modals.jsx — All modal components for the Properties management flow.
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

/* ─── Amenity catalogs for modal pickers ───────────────────────────────────── */
const MODAL_BUILDING_AMENITIES = [
  "Additional Storage","Air Conditioner","Alarm","Balcony","Cable","Carpet",
  "Ceiling Fan","Controlled Access","Courtyard","Dishwasher","Dryer","Furnished",
  "Microwave","Patio","Pantry","Other",
];

const MODAL_AMENITIES = {
  building: MODAL_BUILDING_AMENITIES,
  apartment: [
    "Additional Storage","Air Conditioner","Alarm","Balcony","Cable","Carpet",
    "Ceiling Fan","Controlled Access","Courtyard","Dishwasher","Dryer","Furnished",
    "Microwave","Patio","Pantry","Other",
  ],
  room: [
    "Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Fan",
    "Air Conditioner","Heater","Internet","Balcony","Closet","Mini Fridge","Other",
  ],
};

/* ─── Modal Portal ──────────────────────────────────────────────────────────── */
function ModalPortal({ sm, lg, onClose, children }) {
  useEffectM(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className={"modal" + (sm ? " modal-sm" : "") + (lg ? " modal-lg" : "")} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ─── Amenity chip picker ───────────────────────────────────────────────────── */
function AmenChips({ catalog, selected, onChange }) {
  const items = MODAL_AMENITIES[catalog] || [];
  const [adding, setAdding] = useStateM(false);
  const [newName, setNewName] = useStateM("");
  const toggle = (a) => onChange(selected.includes(a) ? selected.filter(x => x !== a) : [...selected, a]);

  const commitNew = () => {
    const nm = newName.trim();
    if (!nm) { setAdding(false); setNewName(""); return; }
    const match = items.find(x => x.toLowerCase() === nm.toLowerCase());
    if (match) {
      if (!selected.includes(match)) onChange([...selected, match]);
    } else {
      items.push(nm);
      /* keep the assign-amenities catalog in sync */
      const cat = window.AMENITY_CATALOG && AMENITY_CATALOG[catalog];
      if (cat && !cat.some(x => x.toLowerCase() === nm.toLowerCase())) cat.push(nm);
      onChange([...selected, nm]);
    }
    setNewName("");
    setAdding(false);
  };

  return (
    <div className="amen-chips">
      {items.map(a => (
        <button key={a} type="button"
          className={"chip" + (selected.includes(a) ? " on" : "")}
          onClick={() => toggle(a)}>
          {selected.includes(a) && <AIcon name="check" size={12} />}{a}
        </button>
      ))}
      {adding ? (
        <span className="chip" style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
          <input autoFocus value={newName} placeholder="New amenity…"
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); commitNew(); }
              if (e.key === "Escape") { e.stopPropagation(); setAdding(false); setNewName(""); }
            }}
            style={{ border:0, outline:0, background:"transparent", font:"inherit", color:"var(--ink)", width:120 }} />
          <button type="button" onClick={commitNew} title="Add"
            style={{ border:0, background:"transparent", cursor:"pointer", color:"var(--green)", display:"flex" }}>
            <AIcon name="check" size={13} />
          </button>
          <button type="button" onClick={() => { setAdding(false); setNewName(""); }} title="Cancel"
            style={{ border:0, background:"transparent", cursor:"pointer", color:"var(--muted)", display:"flex" }}>
            <AIcon name="x" size={13} />
          </button>
        </span>
      ) : (
        <button type="button" className="chip" style={{ borderStyle:"dashed" }} onClick={() => setAdding(true)}>
          <AIcon name="plus" size={12} /> Add new
        </button>
      )}
    </div>
  );
}

/* ─── Collapsible section for BuildingModal ─────────────────────────────────── */
function AccSection({ open, onToggle, title, badge, children }) {
  return (
    <div className="modal-acc">
      <button type="button" className="modal-acc-head" onClick={onToggle}>
        <span className="modal-acc-title">{title}</span>
        {badge != null && <span className="modal-acc-badge">{badge}</span>}
        <span className={"modal-acc-chev" + (open ? " open" : "")}>
          <AIcon name="chevron" size={14} />
        </span>
      </button>
      {open && <div className="modal-acc-body">{children}</div>}
    </div>
  );
}

/* ─── Toast system ──────────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useStateM([]);
  const showToast = (msg) => {
    const id = Date.now() + String(Math.floor(Math.random() * 100000));
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  };
  return { toasts, showToast };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return ReactDOM.createPortal(
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span className="t-ic"><AIcon name="check" size={15} /></span>{t.msg}
        </div>
      ))}
    </div>,
    document.body
  );
}

/* ─── Building Modal — with collapsible sections incl. Apartments + Rooms ───── */
const BED_SIZES   = ["Full","Twin","Queen","King"];
const RENTAL_TYPES = ["LTR","STR"];
const HOUSING_TYPES = ["Coliving","Private","Shared"];

function BuildingModal({ mode, building: init, onSave, onClose }) {
  const isEdit = mode === "edit";

  // Collapsible section state
  const [open, setOpen] = useStateM({ details: true, amenities: false, apartments: false, review: false });
  const toggle = (k) => setOpen(p => ({ ...p, [k]: !p[k] }));

  // Building fields
  const [form, setForm] = useStateM({
    name:        init?.name        || "",
    fullName:    init?.fullName    || "",
    address:     init?.address     || "",
    ownerLLC:    init?.ownerLLC    || "",
    floors:      init?.floors != null ? String(init.floors) : "",
    hasElevator: init?.hasElevator || false,
    description: init?.description || "",
    photoUrls:   init?.image       || "",
    amenities:   init?.amenities?.present ? [...init.amenities.present] : [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Apartments within the modal
  const [apartments, setApartments] = useStateM([]);
  const [openApts, setOpenApts] = useStateM({});
  const toggleApt = (id) => setOpenApts(p => ({ ...p, [id]: !p[id] }));

  const addApartment = () => {
    const id = "napt-" + Date.now();
    setApartments(p => [...p, { id, name:"", layout:"", status:"Active", rooms:[] }]);
    setOpenApts(p => ({ ...p, [id]: true }));
    setOpen(p => ({ ...p, apartments: true }));
  };

  const updateApt = (aptId, field, val) =>
    setApartments(p => p.map(a => a.id === aptId ? { ...a, [field]: val } : a));

  const removeApt = (aptId) => {
    setApartments(p => p.filter(a => a.id !== aptId));
    setOpenApts(p => { const n = { ...p }; delete n[aptId]; return n; });
  };

  const addRoom = (aptId) => {
    const roomId = "nrm-" + Date.now();
    setApartments(p => p.map(a =>
      a.id === aptId
        ? { ...a, rooms: [...a.rooms, { id: roomId, name:"", rentalType:"LTR", housingType:"Coliving", bedSize:"Full", monthlyRev:"" }] }
        : a
    ));
  };

  const updateRoom = (aptId, roomId, field, val) =>
    setApartments(p => p.map(a =>
      a.id === aptId
        ? { ...a, rooms: a.rooms.map(r => r.id === roomId ? { ...r, [field]: val } : r) }
        : a
    ));

  const removeRoom = (aptId, roomId) =>
    setApartments(p => p.map(a =>
      a.id === aptId ? { ...a, rooms: a.rooms.filter(r => r.id !== roomId) } : a
    ));

  const totalRooms = apartments.reduce((s, a) => s + a.rooms.length, 0);
  const valid = form.name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    onSave({ ...form, apartments });
    onClose();
  };

  const missingFields = [];
  if (!form.name.trim()) missingFields.push("Building name");

  return (
    <ModalPortal lg onClose={onClose}>
      <div className="modal-head">
        <h2 style={{ fontFamily:"var(--sans)", fontWeight:700, fontSize:22 }}>
          {isEdit ? "Edit building" : "Add building"}
        </h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>

      <div className="modal-body" style={{ gap:10, paddingBottom:18 }}>

        {/* ── Section 1: Building Details ── */}
        <AccSection open={open.details} onToggle={() => toggle("details")} title="Building Details">
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div className="modal-2col">
              <div className="field">
                <label>Name *</label>
                <input className="inp" placeholder="e.g. Aerie" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div className="field">
                <label>Owner LLC</label>
                <input className="inp" placeholder="e.g. NW 121 LLC" value={form.ownerLLC} onChange={e => set("ownerLLC", e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Full address</label>
              <input className="inp" placeholder="e.g. 121 NW 7th Ave Miami FL 33218" value={form.address} onChange={e => set("address", e.target.value)} />
            </div>
            <div className="modal-2col">
              <div className="field">
                <label>Floors</label>
                <input className="inp" type="number" min="1" placeholder="e.g. 3" value={form.floors} onChange={e => set("floors", e.target.value)} />
              </div>
              <div className="field" style={{ justifyContent:"flex-end" }}>
                <label>&nbsp;</label>
                <div className="inp-check">
                  <input type="checkbox" id="bld-elev" checked={form.hasElevator} onChange={e => set("hasElevator", e.target.checked)} />
                  <label htmlFor="bld-elev">Has elevator</label>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea className="inp" rows="2" placeholder="Optional notes about the building…" value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            <div className="field">
              <label>Photo URLs</label>
              <textarea className="inp" rows="2" placeholder="https://… (one per line)" value={form.photoUrls} onChange={e => set("photoUrls", e.target.value)} />
            </div>
          </div>
        </AccSection>

        {/* ── Section 2: Building Amenities ── */}
        <AccSection open={open.amenities} onToggle={() => toggle("amenities")}
          title="Building Amenities" badge={form.amenities.length > 0 ? form.amenities.length + " selected" : null}>
          <AmenChips catalog="building" selected={form.amenities} onChange={v => set("amenities", v)} />
        </AccSection>

        {/* ── Section 3: Apartments ── */}
        <AccSection open={open.apartments} onToggle={() => toggle("apartments")}
          title="Apartments" badge={apartments.length > 0 ? apartments.length + " · " + totalRooms + " rooms" : null}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {apartments.length === 0 && (
              <p style={{ margin:0, fontSize:13, color:"var(--muted)" }}>
                Optional — add apartments and rooms inside this building, or skip and add them later.
              </p>
            )}
            {apartments.map(apt => (
              <div key={apt.id} className="apt-acc">
                <div className="apt-acc-head" onClick={() => toggleApt(apt.id)}>
                  <span style={{ flex:1, fontWeight:600, fontSize:13, color:"var(--ink)" }}>
                    {apt.name || "New apartment"} {apt.rooms.length > 0 && <span style={{ color:"var(--muted)", fontWeight:400 }}>· {apt.rooms.length} room{apt.rooms.length !== 1 ? "s" : ""}</span>}
                  </span>
                  <button type="button" className="btn btn-soft btn-sm" style={{ marginRight:6 }}
                    onClick={e => { e.stopPropagation(); addRoom(apt.id); setOpenApts(p => ({ ...p, [apt.id]: true })); }}>
                    <AIcon name="plus" size={13} /> Add room
                  </button>
                  <button type="button" className="btn btn-sm" style={{ color:"var(--red)", background:"transparent", border:"none", padding:"0 4px" }}
                    onClick={e => { e.stopPropagation(); removeApt(apt.id); }}>
                    <AIcon name="trash" size={14} />
                  </button>
                  <span style={{ marginLeft:6, color:"var(--muted)", display:"flex", alignItems:"center", transform: openApts[apt.id] ? "rotate(180deg)":"none", transition:"transform .2s" }}>
                    <AIcon name="chevron" size={13} />
                  </span>
                </div>
                {openApts[apt.id] && (
                  <div className="apt-acc-body">
                    <div className="modal-2col" style={{ marginBottom:12 }}>
                      <div className="field">
                        <label>Apartment name / number *</label>
                        <input className="inp" placeholder="e.g. Apartment 11" value={apt.name}
                          onChange={e => updateApt(apt.id, "name", e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Layout</label>
                        <input className="inp" placeholder="e.g. 3×1 or 2×2" value={apt.layout}
                          onChange={e => updateApt(apt.id, "layout", e.target.value)} />
                      </div>
                    </div>
                    {apt.rooms.length === 0 ? (
                      <p style={{ margin:0, fontSize:12, color:"var(--muted)" }}>No rooms yet — click "Add room" above.</p>
                    ) : (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {apt.rooms.map(rm => (
                          <div key={rm.id} className="room-mini-row">
                            <div className="field" style={{ flex:1.2, gap:4 }}>
                              <label style={{ fontSize:10 }}>Room name</label>
                              <input className="inp" style={{ height:36, fontSize:13 }} placeholder="e.g. Room 11A"
                                value={rm.name} onChange={e => updateRoom(apt.id, rm.id, "name", e.target.value)} />
                            </div>
                            <div className="field" style={{ flex:.8, gap:4 }}>
                              <label style={{ fontSize:10 }}>Type</label>
                              <select className="inp" style={{ height:36, fontSize:13 }} value={rm.rentalType}
                                onChange={e => updateRoom(apt.id, rm.id, "rentalType", e.target.value)}>
                                {RENTAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="field" style={{ flex:.9, gap:4 }}>
                              <label style={{ fontSize:10 }}>Housing</label>
                              <select className="inp" style={{ height:36, fontSize:13 }} value={rm.housingType}
                                onChange={e => updateRoom(apt.id, rm.id, "housingType", e.target.value)}>
                                {HOUSING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="field" style={{ flex:.7, gap:4 }}>
                              <label style={{ fontSize:10 }}>Bed</label>
                              <select className="inp" style={{ height:36, fontSize:13 }} value={rm.bedSize}
                                onChange={e => updateRoom(apt.id, rm.id, "bedSize", e.target.value)}>
                                {BED_SIZES.map(b => <option key={b} value={b}>{b}</option>)}
                              </select>
                            </div>
                            <div className="field" style={{ flex:.7, gap:4 }}>
                              <label style={{ fontSize:10 }}>$/mo</label>
                              <input className="inp" style={{ height:36, fontSize:13 }} type="number" placeholder="0"
                                value={rm.monthlyRev} onChange={e => updateRoom(apt.id, rm.id, "monthlyRev", e.target.value)} />
                            </div>
                            <button type="button" style={{ background:"transparent", border:"none", color:"var(--muted)", cursor:"pointer", padding:"0 4px", alignSelf:"flex-end", marginBottom:2 }}
                              onClick={() => removeRoom(apt.id, rm.id)}>
                              <AIcon name="x" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-soft btn-sm" style={{ alignSelf:"flex-start" }} onClick={addApartment}>
              <AIcon name="plus" size={14} /> Add apartment
            </button>
          </div>
        </AccSection>

        {/* ── Section 4: Review & Save ── */}
        <AccSection open={open.review} onToggle={() => toggle("review")} title="Review &amp; Save">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { l:"Building name", v: form.name || <span style={{ color:"var(--red)" }}>Required</span> },
                { l:"Owner LLC",     v: form.ownerLLC || "—" },
                { l:"Floors",        v: form.floors || "—" },
                { l:"Amenities",     v: form.amenities.length + " selected" },
                { l:"Apartments",    v: apartments.length },
                { l:"Total rooms",   v: totalRooms },
              ].map((r, i) => (
                <div key={i} style={{ background:"var(--paper)", border:"1px solid var(--line-2)", borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontFamily:"var(--mono)", letterSpacing:".1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:4 }}>{r.l}</div>
                  <div style={{ fontSize:14, fontWeight:500 }}>{r.v}</div>
                </div>
              ))}
            </div>
            {missingFields.length > 0 && (
              <div style={{ background:"rgba(180,73,47,.07)", border:"1px solid rgba(180,73,47,.18)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"var(--red)" }}>
                Missing required: {missingFields.join(", ")}
              </div>
            )}
          </div>
        </AccSection>

        <div style={{ height:4 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!valid}
          style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />{isEdit ? "Save changes" : "Save building"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── Apartment Modal (Add + Edit) ─────────────────────────────────────────── */
const APT_CONFIGS = ["Studio","1×1","1×2","2×1","2×2","3×1","3×2","4×2","Custom"];

function ApartmentModal({ mode, buildingName, apt: init, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useStateM({
    name:     init?.name     || "",
    layout:   init?.layout   || "",
    floor:    init?.floor    || "",
    size:     init?.size     || "",
    status:   init?.status   || "Active",
    notes:    init?.notes    || "",
    amenities: init?.amenities?.present ? [...init.amenities.present] : [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 0;

  const handleSave = () => { if (!valid) return; onSave(form); onClose(); };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-head">
        <h2 style={{ fontFamily:"var(--sans)", fontWeight:700, fontSize:22 }}>
          {isEdit ? "Edit apartment" : "Add apartment"}
        </h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>
      {buildingName && (
        <div className="modal-ctx">
          <span className="cx-ic"><AIcon name="building" size={14} /></span>
          {isEdit ? "Apartment in" : "Adding apartment to"}: <strong>{buildingName}</strong>
        </div>
      )}

      <div className="modal-body">
        <div className="modal-section">
          <div className="modal-section-title">Apartment details</div>
          <div className="field">
            <label>Apartment name / number *</label>
            <input className="inp" placeholder="e.g. Apartment 11" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Layout</label>
              <select className="inp" value={form.layout} onChange={e => set("layout", e.target.value)}>
                <option value="">Select layout</option>
                {APT_CONFIGS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Floor</label>
              <input className="inp" placeholder="e.g. 1st floor" value={form.floor} onChange={e => set("floor", e.target.value)} />
            </div>
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Size</label>
              <input className="inp" placeholder="e.g. 680 sq ft" value={form.size} onChange={e => set("size", e.target.value)} />
            </div>
            <div className="field">
              <label>Status</label>
              <select className="inp" value={form.status} onChange={e => set("status", e.target.value)}>
                {["Active","Vacant","Under Renovation","Disabled"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="inp" rows="2" placeholder="Optional notes about this apartment…" value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">
            Apartment amenities <span style={{ fontWeight:400, opacity:.7 }}>— {form.amenities.length} selected</span>
          </div>
          <AmenChips catalog="apartment" selected={form.amenities} onChange={v => set("amenities", v)} />
        </div>
        <div style={{ height:6 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!valid} style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />{isEdit ? "Save changes" : "Add apartment"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── Room Modal (Add + Edit) ───────────────────────────────────────────────── */
const ROOM_STATUSES_OPT = ["Occupied","Vacant","Maintenance","Disabled"];

function RoomModal({ mode, buildingName, aptName, room: init, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useStateM({
    name:        init?.name        || "",
    rentalType:  init?.rentalType  || "LTR",
    housingType: init?.housingType || "Coliving",
    bedSize:     init?.bedSize     || "Full",
    bd:          init?.bd != null  ? String(init.bd) : "1",
    ba:          init?.ba != null  ? String(init.ba) : "1",
    status:      init?.status      || "Vacant",
    monthlyRev:  init?.rent != null ? String(init.rent) : "",
    listedDate:  init?.listedDate  || "",
    tenant:      init?.tenant      || "",
    notes:       init?.notes       || "",
    amenities:   init?.amenities?.present ? [...init.amenities.present] : [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 0;

  const handleSave = () => { if (!valid) return; onSave(form); onClose(); };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-head">
        <h2 style={{ fontFamily:"var(--sans)", fontWeight:700, fontSize:22 }}>
          {isEdit ? "Edit room" : "Add room"}
        </h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>
      {(buildingName || aptName) && (
        <div className="modal-ctx">
          <span className="cx-ic"><AIcon name="building" size={14} /></span>
          {isEdit ? "Room in" : "Adding room to"}:
          {buildingName && <React.Fragment> <strong>{buildingName}</strong></React.Fragment>}
          {aptName && <React.Fragment> / <strong>{aptName}</strong></React.Fragment>}
        </div>
      )}

      <div className="modal-body">
        <div className="modal-section">
          <div className="modal-section-title">Room details</div>

          {isEdit && buildingName && (
            <div className="modal-2col">
              <div className="field field-ro">
                <label>Building</label>
                <div className="ro-val"><AIcon name="building" size={14} />{buildingName}</div>
              </div>
              {aptName && (
                <div className="field field-ro">
                  <label>Apartment</label>
                  <div className="ro-val"><AIcon name="layers" size={14} />{aptName}</div>
                </div>
              )}
            </div>
          )}

          <div className="modal-2col">
            <div className="field">
              <label>Room name / number *</label>
              <input className="inp" placeholder="e.g. Room 11A" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="field">
              <label>Rental type</label>
              <select className="inp" value={form.rentalType} onChange={e => set("rentalType", e.target.value)}>
                {RENTAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Housing type</label>
              <select className="inp" value={form.housingType} onChange={e => set("housingType", e.target.value)}>
                {HOUSING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Bed size</label>
              <select className="inp" value={form.bedSize} onChange={e => set("bedSize", e.target.value)}>
                {BED_SIZES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Bedrooms / Bathrooms</label>
              <div style={{ display:"flex", gap:8 }}>
                <select className="inp" value={form.bd} onChange={e => set("bd", e.target.value)} style={{ flex:1 }}>
                  {["1","2","3","4"].map(n => <option key={n} value={n}>{n} bd</option>)}
                </select>
                <select className="inp" value={form.ba} onChange={e => set("ba", e.target.value)} style={{ flex:1 }}>
                  {["1","2","3"].map(n => <option key={n} value={n}>{n} ba</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Occupancy status</label>
              <select className="inp" value={form.status} onChange={e => set("status", e.target.value)}>
                {ROOM_STATUSES_OPT.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Monthly revenue ($)</label>
              <input className="inp" type="number" min="0" placeholder="e.g. 442" value={form.monthlyRev} onChange={e => set("monthlyRev", e.target.value)} />
            </div>
            <div className="field">
              <label>Listed date</label>
              <input className="inp" type="date" value={form.listedDate} onChange={e => set("listedDate", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Assigned tenant</label>
            <input className="inp" placeholder="Full name — leave blank if vacant" value={form.tenant} onChange={e => set("tenant", e.target.value)} />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="inp" rows="2" placeholder="Optional notes…" value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">Room amenities <span style={{ fontWeight:400, opacity:.7 }}>— {form.amenities.length} selected</span></div>
          <AmenChips catalog="room" selected={form.amenities} onChange={v => set("amenities", v)} />
        </div>
        <div style={{ height:6 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!valid} style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />{isEdit ? "Save changes" : "Add room"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── Confirm Modal ─────────────────────────────────────────────────────────── */
const CONFIRM_CFG = {
  "disable-building": {
    icon:"ban", cls:"warn",
    title:"Disable building?",
    msg:"This building will be disabled and hidden from active operations. Existing apartments and rooms will remain saved.",
    label:"Disable building", btn:"btn-warn",
    reason:true, reasonPlaceholder:"e.g. Under renovation, structural inspection, seasonal closure…",
  },
  "delete-building": {
    icon:"trash", cls:"danger",
    title:"Delete building?",
    msg:"This action cannot be undone. Deleting this building will also remove its apartments, rooms, amenities, financials, and activity records.",
    label:"Delete building", btn:"btn-danger",
  },
  "disable-apartment": {
    icon:"ban", cls:"warn",
    title:"Disable apartment?",
    msg:"This apartment will be disabled and hidden from active operations. Existing room records will remain saved.",
    label:"Disable apartment", btn:"btn-warn",
    reason:true, reasonPlaceholder:"e.g. Renovation, maintenance, pending re-listing…",
  },
  "delete-apartment": {
    icon:"trash", cls:"danger",
    title:"Delete apartment?",
    msg:"This action cannot be undone. Deleting this apartment will also remove its rooms, amenities, financials, and activity records.",
    label:"Delete apartment", btn:"btn-danger",
  },
  "disable-room": {
    icon:"ban", cls:"warn",
    title:"Disable room?",
    msg:"This room will be disabled and hidden from active operations. Existing records will remain saved.",
    label:"Disable room", btn:"btn-warn",
    reason:true, reasonPlaceholder:"e.g. Repairs needed, deep cleaning, furniture replacement…",
  },
  "delete-room": {
    icon:"trash", cls:"danger",
    title:"Delete room?",
    msg:"This action cannot be undone. Deleting this room will also remove its amenities, financials, tenant records, and activity history.",
    label:"Delete room", btn:"btn-danger",
  },
  "remove-building-amenity": {
    icon:"trash", cls:"danger",
    title:"Remove building amenity?",
    msg:"This amenity will be removed from this building only.",
    label:"Remove amenity", btn:"btn-danger",
  },
  "remove-apartment-amenity": {
    icon:"trash", cls:"danger",
    title:"Remove apartment amenity?",
    msg:"This amenity will be removed from this apartment only.",
    label:"Remove amenity", btn:"btn-danger",
  },
  "remove-room-amenity": {
    icon:"trash", cls:"danger",
    title:"Remove room amenity?",
    msg:"This amenity will be removed from this room only.",
    label:"Remove amenity", btn:"btn-danger",
  },
};

function ConfirmModal({ kind, name, onConfirm, onClose }) {
  const c = CONFIRM_CFG[kind] || {};
  const [reason, setReason] = useStateM("");
  const reasonOk = !c.reason || reason.trim().length > 0;
  return (
    <ModalPortal sm onClose={onClose}>
      <div className="confirm-dialog">
        <div className={"cd-icon " + (c.cls || "warn")}><AIcon name={c.icon || "ban"} size={22} /></div>
        <h2 style={{ fontFamily:"var(--sans)", fontWeight:700 }}>{c.title}</h2>
        {name && <div className="cd-name">{name}</div>}
        <p>{c.msg}</p>
        {c.reason && (
          <div className="field" style={{ margin:"4px 0 16px" }}>
            <label>Reason *</label>
            <textarea className="inp" rows="2" placeholder={c.reasonPlaceholder || "Add a reason…"}
              value={reason} onChange={e => setReason(e.target.value)} autoFocus />
          </div>
        )}
        <div className="cd-actions">
          <button className="btn btn-soft" onClick={onClose}>Cancel</button>
          <button className={"btn " + (c.btn || "btn-warn")} disabled={!reasonOk} style={{ opacity: reasonOk ? 1 : .45 }}
            onClick={() => { if (!reasonOk) return; onConfirm(reason.trim()); onClose(); }}>{c.label}</button>
        </div>
      </div>
    </ModalPortal>
  );
}

Object.assign(window, {
  BuildingModal, ApartmentModal, RoomModal, ConfirmModal, useToast, ToastContainer,
});
