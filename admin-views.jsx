// admin-views.jsx — Properties tab views. Loaded after admin-amenities.jsx.
const { useState: useStateV, useMemo } = React;
const M = window.money;

/* ───────────────────────── Properties List ───────────────────────── */
const VIEW_KEY = "propolis-prop-view";

function PropertiesList({ onOpenBuilding }) {
  const [q, setQ] = useStateV("");
  const [status, setStatus] = useStateV("all");
  const [loc, setLoc] = useStateV("all");
  const [sort, setSort] = useStateV("revenue");
  const [view, setView] = useStateV(() => localStorage.getItem(VIEW_KEY) || "grid");
  const [modal, setModal] = useStateV(null);
  const { toasts, showToast } = useToast();

  React.useEffect(() => { localStorage.setItem(VIEW_KEY, view); }, [view]);

  const locations = ["all", ...Array.from(new Set(BUILDINGS.map(b => b.location.split(" · ")[0])))];
  const statuses  = ["all", "Active", "Onboarding", "Maintenance"];

  const list = useMemo(() => {
    let r = BUILDINGS.filter(b => {
      const hitQ = !q || (b.name + " " + b.fullName + " " + b.address + " " + b.ownerLLC + " " + b.type).toLowerCase().includes(q.toLowerCase());
      const hitS = status === "all" || b.status === status;
      const hitL = loc === "all" || b.location.startsWith(loc);
      return hitQ && hitS && hitL;
    });
    const by = {
      revenue:   (a, b) => b.monthlyRevenue - a.monthlyRevenue,
      occupancy: (a, b) => b.occupancy - a.occupancy,
      name:      (a, b) => a.name.localeCompare(b.name),
      updated:   () => 0,
    }[sort];
    return [...r].sort(by);
  }, [q, status, loc, sort]);

  const clear = () => { setQ(""); setStatus("all"); setLoc("all"); setSort("revenue"); };
  const anyFilter = q || status !== "all" || loc !== "all";
  const cols = "52px 220px 60px 60px 60px 128px 86px 108px 90px 52px";
  const close = () => setModal(null);

  const buildingMenu = (b) => ([
    { label: "Add unit",         icon: "plus",  onClick: () => setModal({ type: "add-unit",          building: b }) },
    { label: "Edit building",    icon: "edit",  onClick: () => setModal({ type: "edit-building",     building: b }) },
    { sep: true },
    { label: "Disable building", icon: "ban",   onClick: () => setModal({ type: "disable-building", building: b }) },
    { label: "Delete building",  icon: "trash", danger: true, onClick: () => setModal({ type: "delete-building",  building: b }) },
  ]);

  return (
    <div className="fade">
      <div className="toolbar">
        <div className="search">
          <span className="ic"><AIcon name="search" size={16} /></span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search buildings by name, address, owner, or type…" />
        </div>
        <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="revenue">Sort: Revenue</option>
          <option value="occupancy">Sort: Occupancy</option>
          <option value="name">Sort: Name</option>
          <option value="updated">Sort: Last updated</option>
        </select>
        <div className="view-switch" role="group" aria-label="View">
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")} title="Grid view"><AIcon name="grid" size={16} /></button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")} title="List view"><AIcon name="list" size={16} /></button>
        </div>
      </div>

      <div className="filter-row">
        <span className="fr-label">Filter</span>
        <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
        </select>
        <select className="select" value={loc} onChange={e => setLoc(e.target.value)}>
          {locations.map(l => <option key={l} value={l}>{l === "all" ? "All locations" : l}</option>)}
        </select>
        <select className="select" defaultValue="any"><option value="any">Any occupancy</option><option>80%+ occupied</option><option>50–79%</option><option>Below 50%</option></select>
        <select className="select" defaultValue="any"><option value="any">Any revenue</option><option>$40K+ / mo</option><option>$20–40K / mo</option><option>Under $20K</option></select>
        {anyFilter && <button className="clear-btn" onClick={clear}>Clear filters</button>}
      </div>

      {list.length === 0 ? (
        anyFilter ? (
          <EmptyState icon="building" heading="No properties match your filters"
            body="Try adjusting your search or clearing the active filters to see all buildings."
            action={<button className="btn btn-soft btn-sm" onClick={clear}>Clear filters</button>} />
        ) : (
          <EmptyState icon="building" heading="No buildings added yet"
            body="Add your first building to start managing units, rooms, amenities, and activity."
            action={<button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-building" })}><AIcon name="plus" size={14} /> Add building</button>} />
        )
      ) : view === "grid" ? (
        <div className="bgrid">
          {list.map(b => (
            <div className="bcard" key={b.id} role="button" tabIndex={0}
              onClick={() => onOpenBuilding(b.id)}
              onKeyDown={e => { if (e.key === "Enter") onOpenBuilding(b.id); }}>
              <div className="bcard-media">
                <BuildingMedia src={b.image} alt={b.name} />
                <span className="bcard-badge"><StatusTag status={b.status} tone={b.statusTone} /></span>
                <span className="bcard-kebab" onClick={e => e.stopPropagation()}>
                  <ActionMenu items={buildingMenu(b)} glass />
                </span>
              </div>
              <div className="bcard-body">
                <div>
                  <div className="bcard-title">{b.name}</div>
                  <div className="bcard-full">{b.fullName}</div>
                </div>
                <div className="bcard-line"><span className="li"><AIcon name="pin" size={13} /></span><span>{b.address}</span></div>
                <div className="bcard-line"><span className="li"><AIcon name="briefcase" size={13} /></span><span>{b.ownerLLC}</span></div>
                <div className="bcard-stats">
                  <div className="bstat"><span className="l">Floors</span><span className="v">{b.floors}</span></div>
                  <div className="bstat"><span className="l">Units</span><span className="v">{b.totalApartments}</span></div>
                  <div className="bstat"><span className="l">Rooms</span><span className="v">{b.totalRooms}</span></div>
                </div>
                <OccupancyBar pct={b.occupancy} />
                <div className="bcard-foot">
                  <span className="amen-count"><span className="ac-ic"><AIcon name="sparkle" size={13} /></span>{b.amenitiesCount} amenities</span>
                  <span className="small mono">{b.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-scroll">
          <div className="dtable rich">
            <div className="dt-head" style={{ gridTemplateColumns: cols }}>
              <span></span><span>Building</span><span>Floors</span><span>Units</span><span>Rooms</span>
              <span>Occupancy</span><span>Amenities</span><span>Status</span><span>Updated</span>
              <span className="hd-kebab"></span>
            </div>
            {list.map(b => (
              <div className="dt-row" key={b.id} role="button" tabIndex={0} style={{ gridTemplateColumns: cols }}
                onClick={() => onOpenBuilding(b.id)}
                onKeyDown={e => { if (e.key === "Enter") onOpenBuilding(b.id); }}>
                <div className="row-thumb"><BuildingMedia src={b.image} alt={b.name} compact /></div>
                <div className="primary">
                  <span className="nm">{b.name}</span>
                  <span className="sub2"><span className="si"><AIcon name="pin" size={11} /></span><span>{b.address}</span></span>
                  <span className="sub2"><span className="si"><AIcon name="briefcase" size={11} /></span><span>{b.ownerLLC}</span></span>
                </div>
                <div className="cell-v">{b.floors}</div>
                <div className="cell-v">{b.totalApartments}</div>
                <div className="cell-v">{b.totalRooms}</div>
                <OccupancyBar pct={b.occupancy} />
                <div className="amen-count"><span className="ac-ic"><AIcon name="sparkle" size={13} /></span>{b.amenitiesCount}</div>
                <div><StatusTag status={b.status} tone={b.statusTone} /></div>
                <div className="cell-sub" style={{ fontSize: 12 }}>{b.lastUpdated}</div>
                <span className="row-kebab" onClick={e => e.stopPropagation()}><ActionMenu items={buildingMenu(b)} /></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal?.type === "add-building" && (
        <BuildingModal mode="add" onSave={() => showToast("Building added successfully.")} onClose={close} />
      )}
      {modal?.type === "edit-building" && (
        <BuildingModal mode="edit" building={modal.building} onSave={() => showToast("Building updated successfully.")} onClose={close} />
      )}
      {modal?.type === "add-unit" && (
        <UnitModal mode="add" buildingName={modal.building?.name} onSave={() => showToast("Unit added successfully.")} onClose={close} />
      )}
      {(modal?.type === "disable-building" || modal?.type === "delete-building") && (
        <ConfirmModal kind={modal.type} name={modal.building?.name}
          onConfirm={() => showToast(
            modal.type === "disable-building"
              ? modal.building.name + " has been disabled."
              : modal.building.name + " has been deleted."
          )} onClose={close} />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ───────────────────────── Building Detail ───────────────────────── */
function BuildingDetail({ building: b, onBack, onHome, onOpenApartment }) {
  const [sec, setSec]               = useStateV("overview");
  const [modal, setModal]           = useStateV(null);
  const [amenities, setAmenities]   = useStateV(() => initAmenities(b.amenities.present));
  const [amenityAdd, setAmenityAdd] = useStateV(false);   // trigger from action menu
  const { toasts, showToast }       = useToast();
  const close = () => setModal(null);

  const tabs = [
    { id: "overview",   label: "Overview",   icon: "doc"      },
    { id: "financials", label: "Financials", icon: "wallet"   },
    { id: "amenities",  label: "Amenities",  icon: "sparkle", count: amenities.length },
    { id: "activity",   label: "Activity",   icon: "bell"     },
    { id: "units",      label: "Units",      icon: "building", count: b.totalApartments },
  ];

  const unitMenu = (a) => ([
    { label: "Add room",      icon: "plus",  onClick: () => setModal({ type: "add-room",    unit: a }) },
    { label: "Edit unit",     icon: "edit",  onClick: () => setModal({ type: "edit-unit",   unit: a }) },
    { sep: true },
    { label: "Disable unit",  icon: "ban",   onClick: () => setModal({ type: "disable-unit", unit: a }) },
    { label: "Delete unit",   icon: "trash", danger: true, onClick: () => setModal({ type: "delete-unit", unit: a }) },
  ]);

  const childCols = "minmax(0,1.5fr) 0.7fr 1.1fr 0.95fr 0.7fr 1fr auto auto";

  return (
    <div className="fade">
      <Breadcrumb trail={[{ label: "Properties", onClick: onHome }, { label: b.name }]} />
      <button className="back-link" onClick={onBack}><AIcon name="arrow-left" size={15} /> Back to properties</button>

      <div className="detail-head">
        <div className="dh-left">
          <div className="dh-titlerow">
            <span className="dh-icon" style={{ background: "rgba(199,122,60,.12)", color: "var(--amber)" }}><AIcon name="building" size={26} /></span>
            <div>
              <h1>{b.name}</h1>
              <div className="dh-meta">
                <span className="m"><span className="mi"><AIcon name="layers" size={14} /></span>{b.type}</span>
                <span className="m"><span className="mi"><AIcon name="pin" size={14} /></span>{b.location}</span>
                <span className="m"><span className="mi"><AIcon name="clock" size={14} /></span>Updated {b.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dh-actions">
          <StatusTag status={b.status} tone={b.statusTone} />
          <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "edit-building" })}><AIcon name="edit" size={15} /> Edit</button>
          <button className="btn btn-soft btn-sm"><AIcon name="download" size={15} /> Export</button>
          <ActionMenu items={[
            { label: "Add unit",              icon: "plus",    onClick: () => setModal({ type: "add-unit" }) },
            { label: "Add building amenity",  icon: "sparkle", onClick: () => { setSec("amenities"); setAmenityAdd(true); } },
            { label: "Edit building",         icon: "edit",    onClick: () => setModal({ type: "edit-building" }) },
            { sep: true },
            { label: "Disable building",      icon: "ban",     onClick: () => setModal({ type: "disable-building" }) },
            { label: "Delete building",       icon: "trash",   danger: true, onClick: () => setModal({ type: "delete-building" }) },
          ]} />
        </div>
      </div>

      <KpiRow items={[
        { label: "Units",          icon: "building", value: b.totalApartments },
        { label: "Rooms",          icon: "bed",      value: b.totalRooms },
        { label: "Occupancy",      icon: "users",    value: b.occupancy, unit: "%" },
        { label: "Monthly revenue",icon: "wallet",   value: M(b.monthlyRevenue), delta: "Net " + M(b.financials.netIncome), deltaDir: "up" },
      ]} />

      <LevelTabs tabs={tabs} active={sec} onChange={setSec} />

      {sec === "overview" && (
        <OverviewPanel title="Building overview" status={b.status} statusTone={b.statusTone}
          specs={[
            { label: "Property type",  value: b.type },
            { label: "Location",       value: b.location },
            { label: "Total units",    value: b.totalApartments, serif: true },
            { label: "Total rooms",    value: b.totalRooms,      serif: true },
            { label: "Occupancy rate", value: b.occupancy + "%", serif: true },
            { label: "Current status", value: b.statusNote },
          ]} />
      )}
      {sec === "financials" && (
        <FinancialsPanel title="Building financials"
          cards={[
            { label: "Total revenue",    value: M(b.financials.revenue),     note: "per month" },
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
        <AmenityManager
          level="building"
          contextPath={b.name}
          amenities={amenities}
          onAdd={a    => { setAmenities(p => [...p, a]); showToast("Amenity added."); }}
          onEdit={(id, f) => { setAmenities(p => p.map(x => x.id === id ? { ...x, ...f } : x)); showToast("Amenity updated."); }}
          onRemove={id => { setAmenities(p => p.filter(x => x.id !== id)); showToast("Amenity removed."); }}
          autoOpenAdd={amenityAdd}
          onAutoOpenConsumed={() => setAmenityAdd(false)}
        />
      )}
      {sec === "activity" && <ActivityPanel title="Building activity" activity={b.activity} />}
      {sec === "units" && (
        <Panel icon="building" title={"Units in " + b.name}
          action={
            <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "add-unit" })}>
              <AIcon name="plus" size={15} /> Add unit
            </button>
          }>
          {b.apartments.length === 0 ? (
            <EmptyState icon="building" heading="No units added yet"
              body="Add a unit inside this building to start managing rooms and occupancy."
              action={<button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-unit" })}><AIcon name="plus" size={14} /> Add unit</button>} />
          ) : (
            <div className="child-table">
              {b.apartments.map(a => {
                const pct = Math.round((a.occupiedRooms / a.totalRooms) * 100);
                return (
                  <div className="child-row" key={a.id} role="button" tabIndex={0}
                    style={{ gridTemplateColumns: childCols }}
                    onClick={() => onOpenApartment(a.id)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenApartment(a.id); } }}>
                    <div className="cr-primary"><b>{a.name}</b><span>{a.floor}</span></div>
                    <div className="cr-cell"><span className="l">Rooms</span><span className="v">{a.totalRooms}</span></div>
                    <div className="cr-cell"><span className="l">Occupancy</span><span className="v">{a.occupiedRooms}/{a.totalRooms} · {pct}%</span></div>
                    <div className="cr-cell"><span className="l">Rent</span><span className="v">{M(a.rent)}/mo</span></div>
                    <div className="cr-cell"><span className="l">Amenities</span><span className="v">{a.amenitiesCount}</span></div>
                    <div><StatusTag status={a.status} tone={a.statusTone} /></div>
                    <span onClick={e => e.stopPropagation()}><ActionMenu items={unitMenu(a)} /></span>
                    <span className="cr-go">View<AIcon name="chevron" size={13} /></span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      )}

      {modal?.type === "edit-building" && (
        <BuildingModal mode="edit" building={b} onSave={() => showToast("Building updated successfully.")} onClose={close} />
      )}
      {modal?.type === "add-unit" && (
        <UnitModal mode="add" buildingName={b.name} onSave={() => showToast("Unit added successfully.")} onClose={close} />
      )}
      {modal?.type === "edit-unit" && (
        <UnitModal mode="edit" buildingName={b.name} unit={modal.unit} onSave={() => showToast("Unit updated successfully.")} onClose={close} />
      )}
      {modal?.type === "add-room" && (
        <RoomModal mode="add" buildingName={b.name} unitName={modal.unit?.name} onSave={() => showToast("Room added successfully.")} onClose={close} />
      )}
      {(modal?.type === "disable-unit" || modal?.type === "delete-unit") && (
        <ConfirmModal kind={modal.type} name={modal.unit?.name}
          onConfirm={() => showToast((modal.unit?.name || "Unit") + (modal.type === "disable-unit" ? " disabled." : " deleted."))}
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

/* ───────────────────────── Apartment (Unit) Detail ───────────────────────── */
function ApartmentDetail({ building: b, apt: a, onHome, onOpenBuilding, onBack, onOpenRoom }) {
  const [sec, setSec]               = useStateV("overview");
  const [modal, setModal]           = useStateV(null);
  const [amenities, setAmenities]   = useStateV(() => initAmenities(a.amenities.present));
  const [amenityAdd, setAmenityAdd] = useStateV(false);
  const { toasts, showToast }       = useToast();
  const close = () => setModal(null);

  const pct = Math.round((a.occupiedRooms / a.totalRooms) * 100);
  const net = a.financials.rent - a.financials.utility - a.financials.maintenance;

  const tabs = [
    { id: "overview",   label: "Overview",   icon: "doc"     },
    { id: "financials", label: "Financials", icon: "wallet"  },
    { id: "amenities",  label: "Amenities",  icon: "sparkle", count: amenities.length },
    { id: "activity",   label: "Activity",   icon: "bell"    },
    { id: "rooms",      label: "Rooms",      icon: "bed",     count: a.totalRooms },
  ];

  const roomMenu = (r) => ([
    { label: "Edit room",     icon: "edit",  onClick: () => setModal({ type: "edit-room",    room: r }) },
    { sep: true },
    { label: "Disable room",  icon: "ban",   onClick: () => setModal({ type: "disable-room", room: r }) },
    { label: "Delete room",   icon: "trash", danger: true, onClick: () => setModal({ type: "delete-room",  room: r }) },
  ]);

  const childCols = "minmax(0,1.4fr) 1fr 0.85fr 0.7fr 1.2fr auto auto";
  const ctxPath   = b.name + " / " + a.name;

  return (
    <div className="fade">
      <Breadcrumb trail={[
        { label: "Properties", onClick: onHome },
        { label: b.name,       onClick: () => onOpenBuilding(b.id) },
        { label: a.name },
      ]} />
      <button className="back-link" onClick={onBack}><AIcon name="arrow-left" size={15} /> Back to {b.name}</button>

      <div className="detail-head">
        <div className="dh-left">
          <div className="dh-titlerow">
            <span className="dh-icon" style={{ background: "rgba(45,95,90,.12)", color: "var(--teal)" }}><AIcon name="building" size={26} /></span>
            <div>
              <h1>{a.name}</h1>
              <div className="dh-meta">
                <span className="m"><span className="mi"><AIcon name="building" size={14} /></span>{b.name}</span>
                <span className="m"><span className="mi"><AIcon name="layers"   size={14} /></span>{a.floor}</span>
                <span className="m"><span className="mi"><AIcon name="window"   size={14} /></span>{a.size}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dh-actions">
          <StatusTag status={a.status} tone={a.statusTone} />
          <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "edit-unit" })}><AIcon name="edit" size={15} /> Edit</button>
          <ActionMenu items={[
            { label: "Add room",         icon: "plus",    onClick: () => setModal({ type: "add-room" }) },
            { label: "Add unit amenity", icon: "sparkle", onClick: () => { setSec("amenities"); setAmenityAdd(true); } },
            { label: "Edit unit",        icon: "edit",    onClick: () => setModal({ type: "edit-unit" }) },
            { sep: true },
            { label: "Disable unit",     icon: "ban",     onClick: () => setModal({ type: "disable-unit" }) },
            { label: "Delete unit",      icon: "trash",   danger: true, onClick: () => setModal({ type: "delete-unit" }) },
          ]} />
        </div>
      </div>

      <KpiRow items={[
        { label: "Floor",        icon: "layers", value: a.floor.replace(" floor", "") },
        { label: "Rooms",        icon: "bed",    value: a.totalRooms },
        { label: "Occupancy",    icon: "users",  value: a.occupiedRooms + "/" + a.totalRooms, unit: " rooms" },
        { label: "Monthly rent", icon: "wallet", value: M(a.rent) },
      ]} />

      <LevelTabs tabs={tabs} active={sec} onChange={setSec} />

      {sec === "overview" && (
        <OverviewPanel title="Unit overview" status={a.status} statusTone={a.statusTone}
          specs={[
            { label: "Parent building", value: b.name },
            { label: "Floor",           value: a.floor },
            { label: "Size",            value: a.size },
            { label: "Total rooms",     value: a.totalRooms, serif: true },
            { label: "Occupancy",       value: pct + "%",    serif: true },
            { label: "Status",          value: a.status },
          ]} />
      )}
      {sec === "financials" && (
        <FinancialsPanel title="Unit financials"
          cards={[
            { label: "Monthly rent", value: M(a.financials.rent) },
            { label: "Paid",         value: M(a.financials.paid),    note: "received", dir: "up" },
            { label: "Pending",      value: M(a.financials.pending), note: a.financials.pending ? "due" : "none", dir: a.financials.pending ? "down" : "" },
            { label: "Net income",   value: M(net),                  note: "after costs", dir: "up", accent: true },
          ]}
          ledger={[
            { label: "Rent collected",        value: M(a.financials.paid) },
            { label: "Utility cost",          value: "– " + M(a.financials.utility) },
            { label: "Maintenance charges",   value: "– " + M(a.financials.maintenance) },
            { label: "Net income",            value: M(net), total: true },
          ]} />
      )}
      {sec === "amenities" && (
        <AmenityManager
          level="unit"
          contextPath={ctxPath}
          amenities={amenities}
          onAdd={am   => { setAmenities(p => [...p, am]); showToast("Amenity added."); }}
          onEdit={(id, f) => { setAmenities(p => p.map(x => x.id === id ? { ...x, ...f } : x)); showToast("Amenity updated."); }}
          onRemove={id => { setAmenities(p => p.filter(x => x.id !== id)); showToast("Amenity removed."); }}
          autoOpenAdd={amenityAdd}
          onAutoOpenConsumed={() => setAmenityAdd(false)}
        />
      )}
      {sec === "activity" && <ActivityPanel title="Unit activity" activity={a.activity} />}
      {sec === "rooms" && (
        <Panel icon="bed" title={"Rooms in " + a.name}
          action={
            <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "add-room" })}>
              <AIcon name="plus" size={15} /> Add room
            </button>
          }>
          {a.rooms.length === 0 ? (
            <EmptyState icon="bed" heading="No rooms added yet"
              body="Add rooms inside this unit to manage rent, amenities, and tenant activity."
              action={<button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "add-room" })}><AIcon name="plus" size={14} /> Add room</button>} />
          ) : (
            <div className="child-table">
              {a.rooms.map(r => (
                <div className="child-row" key={r.id} role="button" tabIndex={0}
                  style={{ gridTemplateColumns: childCols }}
                  onClick={() => onOpenRoom(r.id)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenRoom(r.id); } }}>
                  <div className="cr-primary"><b>{r.name}</b><span>{r.type}</span></div>
                  <div className="cr-cell"><span className="l">Tenant</span><span className="v"><Tenant name={r.tenant} /></span></div>
                  <div className="cr-cell"><span className="l">Rent</span><span className="v">{M(r.rent)}/mo</span></div>
                  <div className="cr-cell"><span className="l">Amenities</span><span className="v">{r.amenitiesCount}</span></div>
                  <div><StatusTag status={r.status} tone={r.statusTone} /></div>
                  <span onClick={e => e.stopPropagation()}><ActionMenu items={roomMenu(r)} /></span>
                  <span className="cr-go">View<AIcon name="chevron" size={13} /></span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {modal?.type === "edit-unit" && (
        <UnitModal mode="edit" buildingName={b.name} unit={a} onSave={() => showToast("Unit updated successfully.")} onClose={close} />
      )}
      {modal?.type === "add-room" && (
        <RoomModal mode="add" buildingName={b.name} unitName={a.name} onSave={() => showToast("Room added successfully.")} onClose={close} />
      )}
      {modal?.type === "edit-room" && (
        <RoomModal mode="edit" buildingName={b.name} unitName={a.name} room={modal.room} onSave={() => showToast("Room updated successfully.")} onClose={close} />
      )}
      {(modal?.type === "disable-room" || modal?.type === "delete-room") && (
        <ConfirmModal kind={modal.type} name={modal.room?.name}
          onConfirm={() => showToast((modal.room?.name || "Room") + (modal.type === "disable-room" ? " disabled." : " deleted."))}
          onClose={close} />
      )}
      {modal?.type === "disable-unit" && (
        <ConfirmModal kind="disable-unit" name={a.name} onConfirm={() => showToast(a.name + " disabled.")} onClose={close} />
      )}
      {modal?.type === "delete-unit" && (
        <ConfirmModal kind="delete-unit" name={a.name} onConfirm={() => showToast(a.name + " deleted.")} onClose={close} />
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

  const ctxPath = b.name + " / " + a.name + " / " + r.name;

  return (
    <div className="fade">
      <Breadcrumb trail={[
        { label: "Properties", onClick: onHome },
        { label: b.name,       onClick: () => onOpenBuilding(b.id) },
        { label: a.name,       onClick: () => onOpenApartment(a.id) },
        { label: r.name },
      ]} />
      <button className="back-link" onClick={onBack}><AIcon name="arrow-left" size={15} /> Back to {a.name}</button>

      <div className="detail-head">
        <div className="dh-left">
          <div className="dh-titlerow">
            <span className="dh-icon" style={{ background: "rgba(138,95,119,.14)", color: "var(--plum)" }}><AIcon name="bed" size={26} /></span>
            <div>
              <h1>{r.name}</h1>
              <div className="dh-meta">
                <span className="m"><span className="mi"><AIcon name="building" size={14} /></span>{b.name}</span>
                <span className="m"><span className="mi"><AIcon name="layers"   size={14} /></span>{a.name}</span>
                <span className="m"><span className="mi"><AIcon name="bed"      size={14} /></span>{r.type}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dh-actions">
          <StatusTag status={r.status} tone={r.statusTone} />
          <button className="btn btn-soft btn-sm" onClick={() => setModal({ type: "edit-room" })}><AIcon name="edit" size={15} /> Edit</button>
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
        { label: "Room rent",      icon: "wallet",  value: M(r.rent),              unit: "/mo" },
        { label: "Payment status", icon: "doc",     value: r.financials.status },
        { label: "Occupancy",      icon: "users",   value: r.status },
        { label: "Amenities",      icon: "sparkle", value: amenities.length },
      ]} />

      <LevelTabs tabs={tabs} active={sec} onChange={setSec} />

      {sec === "overview" && (
        <div className="det-cols wide-left">
          <OverviewPanel title="Room overview" status={r.status} statusTone={r.statusTone}
            specs={[
              { label: "Room type",      value: r.type },
              { label: "Parent unit",    value: a.name },
              { label: "Parent building",value: b.name },
              { label: "Occupancy",      value: r.status },
              { label: "Monthly rent",   value: M(r.rent), serif: true },
              { label: "Payment",        value: r.financials.status },
            ]} />
          <Panel icon="user" title="Assigned tenant">
            {r.tenant ? (
              <div>
                <div style={{ marginBottom: 16 }}><Tenant name={r.tenant} /></div>
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
            { label: "Room rent",     value: M(r.financials.rent) },
            { label: "Paid amount",   value: M(r.financials.paid),    note: "received", dir: "up" },
            { label: "Pending amount",value: M(r.financials.pending), note: r.financials.pending ? "due" : "none", dir: r.financials.pending ? "down" : "" },
            { label: "Extra charges", value: M(r.financials.extra),   note: "add-ons" },
          ]}
          ledger={[
            { label: "Base rent",     value: M(r.financials.rent) },
            { label: "Extra charges", value: "+ " + M(r.financials.extra) },
            { label: "Paid to date",  value: M(r.financials.paid) },
            { label: "Balance due",   value: M(r.financials.pending), total: true },
          ]} />
      )}
      {sec === "amenities" && (
        <AmenityManager
          level="room"
          contextPath={ctxPath}
          amenities={amenities}
          onAdd={am   => { setAmenities(p => [...p, am]); showToast("Amenity added."); }}
          onEdit={(id, f) => { setAmenities(p => p.map(x => x.id === id ? { ...x, ...f } : x)); showToast("Amenity updated."); }}
          onRemove={id => { setAmenities(p => p.filter(x => x.id !== id)); showToast("Amenity removed."); }}
          autoOpenAdd={amenityAdd}
          onAutoOpenConsumed={() => setAmenityAdd(false)}
        />
      )}
      {sec === "activity" && <ActivityPanel title="Room activity" activity={r.activity} />}

      {modal?.type === "edit-room" && (
        <RoomModal mode="edit" buildingName={b.name} unitName={a.name} room={r}
          onSave={() => showToast("Room updated successfully.")} onClose={close} />
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
