// admin-amenities.jsx — Amenity management components for Building, Unit, Room levels.
// Loaded after admin-modals.jsx. Exposes initAmenities, AmenityModal, AmenityManager on window.

const { useState: useStateAm, useEffect: useEffectAm } = React;

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const AMENITY_CATS = [
  "Comfort","Security","Recreation","Utilities","Accessibility","Storage","Other",
];
const AMENITY_STATUS_OPTS = ["Available","Unavailable","Coming Soon"];

const AMENITY_ICON_LIST = [
  { k:"sparkle",  l:"General"     },
  { k:"car",      l:"Parking"     },
  { k:"dumbbell", l:"Gym"         },
  { k:"shield",   l:"Security"    },
  { k:"elevator", l:"Elevator"    },
  { k:"pool",     l:"Pool"        },
  { k:"rooftop",  l:"Rooftop"     },
  { k:"wash",     l:"Laundry"     },
  { k:"reception",l:"Reception"   },
  { k:"balcony",  l:"Balcony"     },
  { k:"coffee",   l:"Kitchen"     },
  { k:"ac",       l:"A/C"         },
  { k:"heat",     l:"Heat"        },
  { k:"sofa",     l:"Furnished"   },
  { k:"fan",      l:"Fan"         },
  { k:"wifi",     l:"Internet"    },
  { k:"tv",       l:"Smart TV"    },
  { k:"plug",     l:"Power"       },
  { k:"bed",      l:"Bed"         },
  { k:"desk",     l:"Desk"        },
  { k:"wardrobe", l:"Wardrobe"    },
  { k:"window",   l:"Window"      },
  { k:"chair",    l:"Chair"       },
  { k:"fridge",   l:"Fridge"      },
  { k:"layers",   l:"Storage"     },
  { k:"briefcase",l:"Co-work"     },
  { k:"users",    l:"Common area" },
  { k:"tool",     l:"Maintenance" },
  { k:"clock",    l:"24/7"        },
];

const STATUS_TONE = {
  "Available": "green",
  "Unavailable": "muted",
  "Coming Soon": "amber",
};

/* ─── initAmenities helper ──────────────────────────────────────────────────── */
function initAmenities(names) {
  return (names || []).map(name => ({
    id: name,
    name,
    category: "",
    icon: (window.AMENITY_ICONS && window.AMENITY_ICONS[name]) || "sparkle",
    description: "",
    status: "Available",
    notes: "",
  }));
}

/* ─── makeId helper ─────────────────────────────────────────────────────────── */
function makeId(prefix) {
  return prefix + "-" + Math.floor(Math.random() * 1e9).toString(36);
}

/* ─── IconPicker ─────────────────────────────────────────────────────────────── */
function IconPicker({ value, onChange }) {
  return (
    <div className="icon-picker">
      {AMENITY_ICON_LIST.map(ic => (
        <button key={ic.k} type="button"
          className={"icon-opt" + (value === ic.k ? " on" : "")}
          onClick={() => onChange(ic.k)} title={ic.l}>
          <AIcon name={ic.k} size={17} />
        </button>
      ))}
    </div>
  );
}

/* ─── AmenityModal (add + edit) ─────────────────────────────────────────────── */
function AmenityModal({ mode, level, contextPath, amenity: init, existingNames, onSave, onClose }) {
  const isEdit = mode === "edit";
  const levelLabel = level === "building" ? "building"
    : level === "apartment" ? "apartment" : "room";

  const [form, setForm] = useStateAm({
    name: init?.name || "",
    category: init?.category || "",
    icon: init?.icon || "sparkle",
    description: init?.description || "",
    status: init?.status || "Available",
    notes: init?.notes || "",
  });
  const [nameErr, setNameErr] = useStateAm("");

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === "name") setNameErr("");
  };

  const valid = form.name.trim().length > 0;

  const handleSave = () => {
    if (!valid) { setNameErr("Amenity name is required."); return; }
    const lc = form.name.trim().toLowerCase();
    if ((existingNames || []).includes(lc)) {
      setNameErr("This amenity already exists.");
      return;
    }
    onSave({ ...form, name: form.name.trim() });
    onClose();
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-head">
        <h2>{isEdit ? "Edit " + levelLabel + " amenity" : "Add " + levelLabel + " amenity"}</h2>
        <button className="mh-close" onClick={onClose} aria-label="Close"><AIcon name="x" size={18} /></button>
      </div>
      {contextPath && (
        <div className="modal-ctx">
          <span className="cx-ic"><AIcon name="sparkle" size={14} /></span>
          {isEdit ? "Editing amenity for" : "Adding amenity to"}:
          {contextPath.split(" / ").map((seg, i, arr) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ opacity: .4 }}>/</span>}
              <strong>{seg}</strong>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="modal-body">
        {/* Name + Category */}
        <div className="modal-section">
          <div className="modal-section-title">Amenity details</div>
          <div className="modal-2col">
            <div className="field">
              <label>Amenity name *</label>
              <input className={"inp" + (nameErr ? " inp-err" : "")}
                placeholder="e.g. Rooftop access, Gym"
                value={form.name} onChange={e => set("name", e.target.value)} />
              {nameErr && <div className="field-error">{nameErr}</div>}
            </div>
            <div className="field">
              <label>Category</label>
              <select className="inp" value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="">No category</option>
                {AMENITY_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-2col">
            <div className="field">
              <label>Availability</label>
              <select className="inp" value={form.status} onChange={e => set("status", e.target.value)}>
                {AMENITY_STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Description</label>
              <input className="inp" placeholder="Short description (optional)" value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="inp" rows="2" placeholder="Any additional notes…" value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
        </div>

        {/* Icon picker */}
        <div className="modal-section">
          <div className="modal-section-title">
            Icon
            <span style={{ fontWeight: 400, opacity: .6, marginLeft: 8 }}>
              — {AMENITY_ICON_LIST.find(x => x.k === form.icon)?.l || form.icon}
            </span>
          </div>
          <IconPicker value={form.icon} onChange={v => set("icon", v)} />
        </div>

        <div style={{ height: 6 }} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-soft" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}
          disabled={!valid} style={{ opacity: valid ? 1 : .45 }}>
          <AIcon name={isEdit ? "check" : "plus"} size={15} />
          {isEdit ? "Save changes" : "Save amenity"}
        </button>
      </div>
    </ModalPortal>
  );
}

/* ─── AmenityCard ────────────────────────────────────────────────────────────── */
function AmenityCard({ amenity, onEdit, onRemove }) {
  const tone = STATUS_TONE[amenity.status] || "muted";
  return (
    <div className="amen-cell amen-mgd">
      <span className="ai"><AIcon name={amenity.icon || "sparkle"} size={17} /></span>
      <div className="amen-info">
        <div className="amen-nm">{amenity.name}</div>
        <div className="amen-meta">
          {amenity.category && <span className="amen-cat">{amenity.category}</span>}
          <StatusTag status={amenity.status} tone={tone} />
        </div>
      </div>
      <div className="amen-acts">
        <ActionMenu items={[
          { label: "Edit",   icon: "edit",  onClick: onEdit },
          { label: "Delete", icon: "trash", danger: true, onClick: onRemove },
        ]} />
      </div>
    </div>
  );
}

/* ─── AmenityManager panel ───────────────────────────────────────────────────── */
const EMPTY_CFG = {
  building: {
    heading: "No building amenities added yet",
    body: "Add building-level amenities such as parking, elevator, security, gym, or rooftop.",
  },
  apartment: {
    heading: "No apartment amenities added yet",
    body: "Add apartment-level amenities such as balcony, kitchen, AC, washer, or furnished setup.",
  },
  room: {
    heading: "No room amenities added yet",
    body: "Add room-level amenities such as bed, desk, wardrobe, window, or attached bathroom.",
  },
};

function AmenityManager({
  level, contextPath, amenities,
  onAdd, onEdit, onRemove,
  autoOpenAdd, onAutoOpenConsumed,
}) {
  const [modal, setModal] = useStateAm(null);
  const closeModal = () => setModal(null);

  const levelLabel = level === "building" ? "building"
    : level === "apartment" ? "apartment" : "room";
  const empty = EMPTY_CFG[level] || {};

  // trigger add modal from parent (e.g. action menu)
  useEffectAm(() => {
    if (autoOpenAdd) {
      setModal({ type: "add" });
      if (onAutoOpenConsumed) onAutoOpenConsumed();
    }
  }, [autoOpenAdd]);

  const existingNames = amenities.map(a => a.name.toLowerCase());
  const existingNamesForEdit = (editAmenity) =>
    amenities.filter(a => a.id !== editAmenity.id).map(a => a.name.toLowerCase());

  const handleAdd = (form) => {
    onAdd({ id: makeId(level), ...form });
    closeModal();
  };

  const handleEdit = (form) => {
    onEdit(modal.amenity.id, form);
    closeModal();
  };

  const handleRemove = () => {
    onRemove(modal.amenity.id);
    closeModal();
  };

  const confirmKind = "remove-" + levelLabel + "-amenity";

  return (
    <Panel icon="sparkle"
      title={levelLabel[0].toUpperCase() + levelLabel.slice(1) + " amenities"}
      action={
        <React.Fragment>
          <span className="small mono" style={{ opacity: .6 }}>{amenities.length} added</span>
          <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "add" })}>
            <AIcon name="plus" size={15} /> Add amenity
          </button>
        </React.Fragment>
      }>

      {amenities.length === 0 ? (
        <EmptyState icon="sparkle" heading={empty.heading} body={empty.body}
          action={
            <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "add" })}>
              <AIcon name="plus" size={14} /> Add {levelLabel} amenity
            </button>
          } />
      ) : (
        <div className="amen-grid">
          {amenities.map(a => (
            <AmenityCard key={a.id} amenity={a}
              onEdit={() => setModal({ type: "edit", amenity: a })}
              onRemove={() => setModal({ type: "remove", amenity: a })} />
          ))}
        </div>
      )}

      {modal?.type === "add" && (
        <AmenityModal mode="add" level={level} contextPath={contextPath}
          existingNames={existingNames}
          onSave={handleAdd} onClose={closeModal} />
      )}
      {modal?.type === "edit" && (
        <AmenityModal mode="edit" level={level} contextPath={contextPath}
          amenity={modal.amenity}
          existingNames={existingNamesForEdit(modal.amenity)}
          onSave={handleEdit} onClose={closeModal} />
      )}
      {modal?.type === "remove" && (
        <ConfirmModal kind={confirmKind} name={modal.amenity.name}
          onConfirm={handleRemove} onClose={closeModal} />
      )}
    </Panel>
  );
}

Object.assign(window, { initAmenities, AmenityModal, AmenityCard, AmenityManager });
