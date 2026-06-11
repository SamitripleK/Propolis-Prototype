// admin-modals.jsx — All modal components for the Properties management flow.
// Loaded after admin-ui.jsx. Exposes BuildingModal, UnitModal, RoomModal, ConfirmModal,
// useToast, ToastContainer on window.

const { useState: useStateM, useEffect: useEffectM } = React;

/* ─── Amenity catalogs for modal pickers ───────────────────────────────────── */
const MODAL_AMENITIES = {
  building: [
    "AdditionalStorage","AirConditioner","Alarm","Balcony","Cable","Carpet",
    "CeilingFan","ControlledAccess","Courtyard","Dishwasher","Disposal","Dryer",
    "FramedMirrors","Furnished","Handrails","HardSurfaceCounterTops","HardwoodFlooring",
    "Heat","IndividualClimateControl","LargeClosets","LinenCloset","Microwave",
    "MiniFridge","Other","Pantry","Patio","PlugInCooktop","PrivateBalcony","PrivatePatio",
    "Range","Refrigerator","TileFlooring","View","VinylFlooring","Washer","WindowCoverings",
  ],
  unit: [
    "AdditionalStorage","AirConditioner","Alarm","Balcony","Cable","Carpet",
    "CeilingFan","ControlledAccess","Courtyard","Dishwasher","Disposal","Dryer",
    "FramedMirrors","Furnished","Handrails","HardSurfaceCounterTops","HardwoodFlooring",
    "Heat","IndividualClimateControl","LargeClosets","LinenCloset","Microwave",
    "MiniFridge","Other","Pantry","Patio","PlugInCooktop","PrivateBalcony","PrivatePatio",
    "Range","Refrigerator","Test Amenity","TileFlooring","View","VinylFlooring","Washer","WindowCoverings",
  ],
  room: [
    "Bed","Wardrobe","Desk","Chair","AttachedBathroom","Window","Fan",
    "AirConditioner","Heater","Internet","PrivateBalcony","Closet","StudyTable",
    "MiniFridge","Washer","Other",
  ],
};

/* ─── Modal Portal Overlay ──────────────────────────────────────────────────── */
function ModalPortal({ sm, onClose, children }) {
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
      <div className={"modal" + (sm ? " modal-sm" : "")} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ─── Amenity chip picker ───────────────────────────────────────────────────── */
function AmenChips({ catalog, selected, onChange }) {
  const items = MODAL_AMENITIES[catalog] || [];
  const toggle = (a) => onChange(selected.includes(a) ? selected.filter(x => x !== a) : [...selected, a]);
  return (
    <div className="amen-chips">
      {items.map(a => (
        <button key={a} type="button"
          className={"chip" + (selected.includes(a) ? " on" : "")}
          onClick={() => toggle(a)}>
          {selected.includes(a) && <AIcon name="check" size={12} />}{a}
        </button>
      ))}
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

/* ─── Building Modal (Add + Edit) ──────────────────────────────────────────── */
function BuildingModal({ mode, building: init, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useStateM({
    name: init?.name || "",
    fullName: init?.fullName || "",
    address: init?.address || "",
    ownerLLC: init?.ownerLLC || "",
    floors: init?.floors != null ? String(init.floors) : "",
    hasElevator: init?.hasElevator || false,
    description: init?.description || "",
    photoUrls: init?.image || "",
    amenities: init?.amenities?.present ? [...init.amenities.present] : [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    onSave(form);
    onClose();
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-head">
        <h2>{isEdit ? "Edit building" : "Add building"}</h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>

      <div className="modal-body">
        {/* Basic info */}
        <div className="modal-section">
          <div className="modal-section-title">Basic information</div>
          <div className="modal-2col">
            <div className="field">
              <label>Name *</label>
              <input className="inp" placeholder="e.g. Plum House" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="field">
              <label>Full name</label>
              <input className="inp" placeholder="e.g. Plum House Residences" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Address</label>
            <input className="inp" placeholder="e.g. 240 NW 25th St, Miami, FL 33127" value={form.address} onChange={e => set("address", e.target.value)} />
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Owner LLC</label>
              <input className="inp" placeholder="e.g. Wynwood Living Holdings LLC" value={form.ownerLLC} onChange={e => set("ownerLLC", e.target.value)} />
            </div>
            <div className="field">
              <label>Floors</label>
              <input className="inp" type="number" min="1" placeholder="e.g. 4" value={form.floors} onChange={e => set("floors", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <div className="inp-check">
              <input type="checkbox" id="bld-elev" checked={form.hasElevator} onChange={e => set("hasElevator", e.target.checked)} />
              <label htmlFor="bld-elev">Has elevator</label>
            </div>
          </div>
        </div>

        {/* Description & photos */}
        <div className="modal-section">
          <div className="modal-section-title">Description &amp; media</div>
          <div className="field">
            <label>Description</label>
            <textarea className="inp" rows="3" placeholder="Optional notes about the building…" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div className="field">
            <label>Photo URLs</label>
            <textarea className="inp" rows="2" placeholder="https://… (one per line or comma-separated)" value={form.photoUrls} onChange={e => set("photoUrls", e.target.value)} />
          </div>
        </div>

        {/* Amenities */}
        <div className="modal-section">
          <div className="modal-section-title">Building amenities <span style={{ fontWeight: 400, opacity: .7 }}>— {form.amenities.length} selected</span></div>
          <AmenChips catalog="building" selected={form.amenities} onChange={v => set("amenities", v)} />
        </div>

        <div style={{ height: 6 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!valid}
          style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />{isEdit ? "Save changes" : "Add building"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── Unit Modal (Add + Edit) ───────────────────────────────────────────────── */
const UNIT_TYPES = ["Residential","Commercial","Studio","Penthouse","Duplex","Loft","Other"];
const UNIT_CONFIGS = ["Studio","1×1","1×2","2×1","2×2","3×1","3×2","4×2","Custom"];

function UnitModal({ mode, buildingName, unit: init, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useStateM({
    name: init?.name || "",
    config: init?.config || "",
    type: init?.type || "Residential",
    notes: init?.notes || "",
    amenities: init?.amenities?.present ? [...init.amenities.present] : [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    onSave(form);
    onClose();
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-head">
        <h2>{isEdit ? "Edit unit" : "Add unit"}</h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>
      {buildingName && (
        <div className="modal-ctx">
          <span className="cx-ic"><AIcon name="building" size={14} /></span>
          {isEdit ? "Unit in" : "Adding unit to"}: <strong>{buildingName}</strong>
        </div>
      )}

      <div className="modal-body">
        <div className="modal-section">
          <div className="modal-section-title">Unit details</div>
          <div className="field">
            <label>Unit name *</label>
            <input className="inp" placeholder="e.g. Apartment 2A, Unit 301" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Unit config</label>
              <select className="inp" value={form.config} onChange={e => set("config", e.target.value)}>
                <option value="">Select config</option>
                {UNIT_CONFIGS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Unit type</label>
              <select className="inp" value={form.type} onChange={e => set("type", e.target.value)}>
                {UNIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="inp" rows="3" placeholder="Optional notes about this unit…" value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">Unit amenities <span style={{ fontWeight: 400, opacity: .7 }}>— {form.amenities.length} selected</span></div>
          <AmenChips catalog="unit" selected={form.amenities} onChange={v => set("amenities", v)} />
        </div>

        <div style={{ height: 6 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!valid}
          style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />{isEdit ? "Save changes" : "Add unit"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── Room Modal (Add + Edit) ───────────────────────────────────────────────── */
const ROOM_TYPES = ["Master","Master · ensuite","Standard double","Compact single","Studio","Shared","Custom"];
const ROOM_STATUSES_OPT = ["Occupied","Vacant","Maintenance","Disabled"];

function RoomModal({ mode, buildingName, unitName, room: init, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useStateM({
    name: init?.name || "",
    type: init?.type || "Standard double",
    status: init?.status || "Vacant",
    rent: init?.rent != null ? String(init.rent) : "",
    tenant: init?.tenant || "",
    notes: init?.notes || "",
    amenities: init?.amenities?.present ? [...init.amenities.present] : [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    onSave(form);
    onClose();
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-head">
        <h2>{isEdit ? "Edit room" : "Add room"}</h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>
      {(buildingName || unitName) && (
        <div className="modal-ctx">
          <span className="cx-ic"><AIcon name="building" size={14} /></span>
          {isEdit ? "Room in" : "Adding room to"}:
          {buildingName && <React.Fragment> <strong>{buildingName}</strong></React.Fragment>}
          {unitName && <React.Fragment> / <strong>{unitName}</strong></React.Fragment>}
        </div>
      )}

      <div className="modal-body">
        <div className="modal-section">
          <div className="modal-section-title">Room details</div>

          {/* read-only parent context in edit mode */}
          {isEdit && buildingName && (
            <div className="modal-2col">
              <div className="field field-ro">
                <label>Building</label>
                <div className="ro-val"><AIcon name="building" size={14} />{buildingName}</div>
              </div>
              {unitName && (
                <div className="field field-ro">
                  <label>Unit</label>
                  <div className="ro-val"><AIcon name="layers" size={14} />{unitName}</div>
                </div>
              )}
            </div>
          )}

          <div className="modal-2col">
            <div className="field">
              <label>Room name / number *</label>
              <input className="inp" placeholder="e.g. Room 1, Room 2A" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="field">
              <label>Room type</label>
              <select className="inp" value={form.type} onChange={e => set("type", e.target.value)}>
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Occupancy status</label>
              <select className="inp" value={form.status} onChange={e => set("status", e.target.value)}>
                {ROOM_STATUSES_OPT.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Monthly rent ($)</label>
              <input className="inp" type="number" min="0" placeholder="e.g. 1200" value={form.rent} onChange={e => set("rent", e.target.value)} />
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
          <div className="modal-section-title">Room amenities <span style={{ fontWeight: 400, opacity: .7 }}>— {form.amenities.length} selected</span></div>
          <AmenChips catalog="room" selected={form.amenities} onChange={v => set("amenities", v)} />
        </div>

        <div style={{ height: 6 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!valid}
          style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />{isEdit ? "Save changes" : "Add room"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── Confirm Modal ─────────────────────────────────────────────────────────── */
const CONFIRM_CFG = {
  "disable-building": {
    icon: "ban", cls: "warn",
    title: "Disable building?",
    msg: "This building will be disabled and hidden from active operations. Existing units and rooms will remain saved.",
    label: "Disable building", btn: "btn-warn",
  },
  "delete-building": {
    icon: "trash", cls: "danger",
    title: "Delete building?",
    msg: "This action cannot be undone. Deleting this building may also affect its connected units, rooms, amenities, financials, and activity records.",
    label: "Delete building", btn: "btn-danger",
  },
  "disable-unit": {
    icon: "ban", cls: "warn",
    title: "Disable unit?",
    msg: "This unit will be disabled and hidden from active operations. Existing room records will remain saved.",
    label: "Disable unit", btn: "btn-warn",
  },
  "delete-unit": {
    icon: "trash", cls: "danger",
    title: "Delete unit?",
    msg: "This action cannot be undone. Deleting this unit may also affect its connected rooms, amenities, financials, and activity records.",
    label: "Delete unit", btn: "btn-danger",
  },
  "disable-room": {
    icon: "ban", cls: "warn",
    title: "Disable room?",
    msg: "This room will be disabled and hidden from active operations. Existing records will remain saved.",
    label: "Disable room", btn: "btn-warn",
  },
  "delete-room": {
    icon: "trash", cls: "danger",
    title: "Delete room?",
    msg: "This action cannot be undone. Deleting this room may also affect its amenities, financials, tenant records, and activity history.",
    label: "Delete room", btn: "btn-danger",
  },
  "remove-building-amenity": {
    icon: "trash", cls: "danger",
    title: "Remove building amenity?",
    msg: "This amenity will be removed from this building only. This action will not affect unit or room amenities.",
    label: "Remove amenity", btn: "btn-danger",
  },
  "remove-unit-amenity": {
    icon: "trash", cls: "danger",
    title: "Remove unit amenity?",
    msg: "This amenity will be removed from this unit only. This action will not affect building or room amenities.",
    label: "Remove amenity", btn: "btn-danger",
  },
  "remove-room-amenity": {
    icon: "trash", cls: "danger",
    title: "Remove room amenity?",
    msg: "This amenity will be removed from this room only. This action will not affect building or unit amenities.",
    label: "Remove amenity", btn: "btn-danger",
  },
};

function ConfirmModal({ kind, name, onConfirm, onClose }) {
  const c = CONFIRM_CFG[kind] || {};
  return (
    <ModalPortal sm onClose={onClose}>
      <div className="confirm-dialog">
        <div className={"cd-icon " + (c.cls || "warn")}>
          <AIcon name={c.icon || "ban"} size={22} />
        </div>
        <h2>{c.title}</h2>
        {name && <div className="cd-name">{name}</div>}
        <p>{c.msg}</p>
        <div className="cd-actions">
          <button className="btn btn-soft" onClick={onClose}>Cancel</button>
          <button className={"btn " + (c.btn || "btn-warn")} onClick={() => { onConfirm(); onClose(); }}>{c.label}</button>
        </div>
      </div>
    </ModalPortal>
  );
}

Object.assign(window, {
  BuildingModal, UnitModal, RoomModal, ConfirmModal, useToast, ToastContainer,
});
