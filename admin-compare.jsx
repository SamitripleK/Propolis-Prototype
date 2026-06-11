// admin-compare.jsx — Compare Properties tab. Loaded after admin-views.jsx.
const { useState: useStateC, useMemo: useMemoC } = React;

function CompareProperties() {
  const Mc = window.money;
  const [picked, setPicked] = useStateC(BUILDINGS.slice(0, 3).map(b => b.id));

  const toggle = (id) => setPicked(p =>
    p.includes(id) ? p.filter(x => x !== id) : (p.length >= 4 ? p : [...p, id]));

  const sel = useMemoC(() => BUILDINGS.filter(b => picked.includes(b.id)), [picked]);

  // best-value helpers
  const max = (fn) => Math.max(...sel.map(fn));
  const bestRev = max(b => b.monthlyRevenue);
  const bestOcc = max(b => b.occupancy);
  const bestNet = max(b => b.financials.netIncome);

  // amenities union for matrix
  const amenUnion = Array.from(new Set(sel.flatMap(b => b.amenities.present)));

  return (
    <div className="fade">
      {/* property selector */}
      <div className="cmp-select">
        <div className="ph-t" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span className="pi" style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(45,95,90,.1)", color: "var(--teal)", display: "grid", placeItems: "center" }}><AIcon name="layers" size={17} /></span>
          <div>
            <h3 className="h3">Select properties to compare</h3>
            <div className="small" style={{ marginTop: 2 }}>Choose up to 4 buildings · {picked.length} selected</div>
          </div>
        </div>
        <div className="cmp-pick">
          {BUILDINGS.map(b => {
            const on = picked.includes(b.id);
            return (
              <button className={"chip" + (on ? " on" : "")} key={b.id} onClick={() => toggle(b.id)}>
                <AIcon name={on ? "check" : "plus"} size={14} />{b.name}
                <span style={{ opacity: .6, fontFamily: "var(--mono)", fontSize: 11 }}>{b.location.split(" · ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {sel.length < 2 ? (
        <EmptyState icon="layers" heading="Select at least two properties"
          body="Pick two or more buildings above to see a side-by-side comparison of financials, occupancy, amenities, and activity." />
      ) : (
        <React.Fragment>
          {/* side-by-side comparison table */}
          <div className="cmp-scroll">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {sel.map(b => (
                    <th key={b.id}><div className="nm">{b.name}</div><div className="loc">{b.location}</div></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="group"><td colSpan={sel.length + 1}>Overview</td></tr>
                <tr><td className="rowlabel">Property type</td>{sel.map(b => <td key={b.id}>{b.type}</td>)}</tr>
                <tr><td className="rowlabel">Apartments</td>{sel.map(b => <td key={b.id}><span className="big">{b.totalApartments}</span></td>)}</tr>
                <tr><td className="rowlabel">Rooms</td>{sel.map(b => <td key={b.id}><span className="big">{b.totalRooms}</span></td>)}</tr>
                <tr><td className="rowlabel">Occupancy</td>{sel.map(b => <td key={b.id} className={b.occupancy === bestOcc ? "best" : ""}><span className="big">{b.occupancy}%</span></td>)}</tr>
                <tr><td className="rowlabel">Status</td>{sel.map(b => <td key={b.id}><StatusTag status={b.status} tone={b.statusTone} /></td>)}</tr>

                <tr className="group"><td colSpan={sel.length + 1}>Financials · monthly</td></tr>
                <tr><td className="rowlabel">Revenue</td>{sel.map(b => <td key={b.id} className={b.monthlyRevenue === bestRev ? "best" : ""}><span className="big">{Mc(b.monthlyRevenue)}</span></td>)}</tr>
                <tr><td className="rowlabel">Pending</td>{sel.map(b => <td key={b.id}><span className="big">{Mc(b.financials.pending)}</span></td>)}</tr>
                <tr><td className="rowlabel">Maintenance</td>{sel.map(b => <td key={b.id}><span className="big">{Mc(b.financials.maintenance)}</span></td>)}</tr>
                <tr><td className="rowlabel">Net income</td>{sel.map(b => <td key={b.id} className={b.financials.netIncome === bestNet ? "best" : ""}><span className="big">{Mc(b.financials.netIncome)}</span></td>)}</tr>

                <tr className="group"><td colSpan={sel.length + 1}>Activity</td></tr>
                <tr><td className="rowlabel">Last updated</td>{sel.map(b => <td key={b.id}>{b.lastUpdated}</td>)}</tr>
                <tr><td className="rowlabel">Recent updates</td>{sel.map(b => <td key={b.id}><span className="big">{b.activity.length}</span><div className="sub">logged actions</div></td>)}</tr>
                <tr><td className="rowlabel">Amenities</td>{sel.map(b => <td key={b.id}><span className="big">{b.amenitiesCount}</span></td>)}</tr>
              </tbody>
            </table>
          </div>

          {/* financial comparison cards */}
          <div className="section-title"><span className="st-ic"><AIcon name="wallet" size={16} /></span><h3 className="h3">Financial performance</h3></div>
          <div className="cmp-cards">
            {sel.map(b => (
              <div className="card" key={b.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <h4 className="h4">{b.name}</h4>
                  <span className="small mono">{b.location.split(" · ")[0]}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 30, letterSpacing: "-.01em" }}>{Mc(b.monthlyRevenue)}</span>
                  <span className="small">/mo revenue</span>
                </div>
                <div className="occ" style={{ margin: "12px 0 14px" }}>
                  <div className="ob" style={{ height: 8 }}><i style={{ width: Math.round(b.monthlyRevenue / bestRev * 100) + "%" }} /></div>
                </div>
                <div className="ledger">
                  <div className="lr"><span>Net income</span><b>{Mc(b.financials.netIncome)}</b></div>
                  <div className="lr"><span>Pending</span><b>{Mc(b.financials.pending)}</b></div>
                  <div className="lr"><span>Occupancy</span><b>{b.occupancy}%</b></div>
                </div>
              </div>
            ))}
          </div>

          {/* occupancy comparison */}
          <div className="section-title"><span className="st-ic"><AIcon name="users" size={16} /></span><h3 className="h3">Occupancy comparison</h3></div>
          <div className="card">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {sel.map(b => {
                const cls = b.occupancy >= 80 ? "" : b.occupancy >= 55 ? "warn" : "low";
                return (
                  <div key={b.id} style={{ display: "grid", gridTemplateColumns: "160px 1fr 56px", alignItems: "center", gap: 16 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{b.name}</span>
                    <div className="ob" style={{ height: 10, background: "var(--cream-2)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                      <i className={cls} style={{ width: b.occupancy + "%", position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 99, display: "block", background: cls === "warn" ? "var(--amber)" : cls === "low" ? "var(--red)" : "var(--green)" }} />
                    </div>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 18, textAlign: "right" }}>{b.occupancy}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* amenities comparison matrix */}
          <div className="section-title"><span className="st-ic"><AIcon name="sparkle" size={16} /></span><h3 className="h3">Amenities comparison</h3></div>
          <div className="cmp-scroll">
            <table className="cmp-table">
              <thead>
                <tr><th>Amenity</th>{sel.map(b => <th key={b.id}><div className="nm" style={{ fontSize: 16 }}>{b.name}</div></th>)}</tr>
              </thead>
              <tbody>
                {amenUnion.map(am => (
                  <tr key={am}>
                    <td className="rowlabel" style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <AIcon name={window.AMENITY_ICONS[am] || "check"} size={15} />{am}
                    </td>
                    {sel.map(b => (
                      <td key={b.id}>
                        {b.amenities.present.includes(am)
                          ? <span className="check"><AIcon name="check" size={18} /></span>
                          : <span className="cross"><AIcon name="x" size={16} /></span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

window.CompareProperties = CompareProperties;
