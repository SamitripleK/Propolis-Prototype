// admin-app.jsx — Properties dashboard shell + navigation. Loaded last.
const { useState: useStateA, useEffect: useEffectA } = React;

const NAV_KEY = "propolis-properties-nav";

const loadNav = () => {
  try { return JSON.parse(localStorage.getItem(NAV_KEY)) || {}; } catch (e) { return {}; }
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: "trend" },
  { label: "Properties", icon: "building", on: true, cnt: BUILDINGS.length },
  { label: "Tenants", icon: "users" },
  { label: "Payments", icon: "wallet" },
  { label: "Maintenance", icon: "tool" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <a href="index.html"><img className="logo-img" src="assets/Property 1=White.svg" alt="Propolis" /></a>
      </div>
      <div className="sb-section">Menu</div>
      <nav className="sb-nav">
        {NAV_ITEMS.map(n => (
          <a href="#" key={n.label} className={n.on ? "on" : ""}>
            <span className="si"><AIcon name={n.icon} size={18} /></span>
            {n.label}
            {n.cnt != null && <span className="cnt">{n.cnt}</span>}
          </a>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <span className="av">D</span>
          <div style={{ minWidth: 0 }}>
            <div className="nm">Dana Reyes</div>
            <div className="rl">Operations</div>
          </div>
        </div>
        <button className="sb-bell" title="Notifications"><AIcon name="bell" size={16} /><span className="nub" /></button>
      </div>
    </aside>
  );
}

function App() {
  const init = loadNav();
  const [tab, setTab]               = useStateA(init.tab || "properties");
  const [buildingId, setBuildingId] = useStateA(init.buildingId || null);
  const [aptId, setAptId]           = useStateA(init.aptId || null);
  const [roomId, setRoomId]         = useStateA(init.roomId || null);
  const [showAddBuilding, setShowAddBuilding] = useStateA(false);
  const { toasts, showToast } = useToast();

  useEffectA(() => {
    localStorage.setItem(NAV_KEY, JSON.stringify({ tab, buildingId, aptId, roomId }));
  }, [tab, buildingId, aptId, roomId]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "instant" });

  const building = buildingId ? BUILDINGS.find(b => b.id === buildingId) : null;
  const apt      = building && aptId ? building.apartments.find(a => a.id === aptId) : null;
  const room     = apt && roomId ? apt.rooms.find(r => r.id === roomId) : null;

  const openBuilding  = (id) => { setBuildingId(id); setAptId(null); setRoomId(null); scrollTop(); };
  const openApartment = (id) => { setAptId(id); setRoomId(null); scrollTop(); };
  const openRoom      = (id) => { setRoomId(id); scrollTop(); };
  const home          = () => { setBuildingId(null); setAptId(null); setRoomId(null); scrollTop(); };
  const backToBuilding = () => { setAptId(null); setRoomId(null); scrollTop(); };
  const backToApt      = () => { setRoomId(null); scrollTop(); };

  let view;
  if (tab === "compare") {
    view = <CompareProperties />;
  } else if (room) {
    view = <Views.RoomDetail key={room.id} building={building} apt={apt} room={room}
      onHome={home} onOpenBuilding={openBuilding} onOpenApartment={openApartment} onBack={backToApt} />;
  } else if (apt) {
    view = <Views.ApartmentDetail key={apt.id} building={building} apt={apt}
      onHome={home} onOpenBuilding={openBuilding} onBack={backToBuilding} onOpenRoom={openRoom} />;
  } else if (building) {
    view = <Views.BuildingDetail key={building.id} building={building}
      onHome={home} onBack={home} onOpenApartment={openApartment}
      onOpenRoom={(aptId, roomId) => { setAptId(aptId); setRoomId(roomId); scrollTop(); }} />;
  } else {
    view = <Views.PropertiesList onOpenBuilding={openBuilding} />;
  }

  const switchTab = (t) => { setTab(t); scrollTop(); };

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <div className="wrap">
          <div className="page-head">
            <div className="ph-left">
              <h1 className="h1">Properties</h1>
              <p>Manage buildings, apartments, rooms, amenities, financials, and activity.</p>
            </div>
            {tab === "properties" && !building && (
              <div className="ph-actions">
                <button className="btn btn-primary" onClick={() => setShowAddBuilding(true)}>
                  <AIcon name="plus" size={16} /> Add building
                </button>
              </div>
            )}
          </div>

          <div className="tabs">
            <button className={tab === "properties" ? "on" : ""} onClick={() => switchTab("properties")}>
              <AIcon name="building" size={16} /> Properties <span className="cnt">{BUILDINGS.length}</span>
            </button>
            <button className={tab === "compare" ? "on" : ""} onClick={() => switchTab("compare")}>
              <AIcon name="layers" size={16} /> Compare Properties
            </button>
          </div>

          {view}
        </div>
      </main>

      {showAddBuilding && (
        <BuildingModal mode="add"
          onSave={() => { showToast("Building added successfully."); }}
          onClose={() => setShowAddBuilding(false)} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
