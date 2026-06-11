// admin-ui.jsx — reusable Properties components (badges, KPIs, financials, amenities, activity, tables).
// Loaded after admin-icons.jsx + admin-data.jsx. Exposes components on window.
const { useState, useRef, useEffect } = React;

// status pill
function StatusTag({ status, tone = "muted" }) {
  return <span className={"tag " + tone}><span className="pip" />{status}</span>;
}

// occupancy bar
function OccupancyBar({ pct }) {
  const cls = pct >= 80 ? "" : pct >= 55 ? "warn" : "low";
  return (
    <div className="occ">
      <div className="ot"><span>{pct}%</span><small>occupied</small></div>
      <div className="ob"><i className={cls} style={{ width: pct + "%" }} /></div>
    </div>
  );
}

// KPI summary cards
function KpiRow({ items }) {
  return (
    <div className="kpi-row">
      {items.map((k, i) => (
        <div className="kpi" key={i}>
          <div className="kl">{k.icon && <span className="ki"><AIcon name={k.icon} size={14} /></span>}{k.label}</div>
          <div className="kv">{k.value}{k.unit && <small>{k.unit}</small>}</div>
          {k.delta && <div className={"kd " + (k.deltaDir || "")}>{k.deltaDir === "up" && <AIcon name="trend" size={13} />}{k.delta}</div>}
        </div>
      ))}
    </div>
  );
}

// breadcrumb
function Breadcrumb({ trail }) {
  return (
    <div className="crumb">
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep"><AIcon name="chevron" size={12} /></span>}
          {t.onClick
            ? <button onClick={t.onClick}>{t.label}</button>
            : <span className="cur">{t.label}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// trend bar chart
function TrendBars({ data, labels }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="trend">
        {data.map((v, i) => (
          <div key={i} className={"tb" + (i === data.length - 1 ? " last" : "")}
            style={{ height: Math.max(6, (v / max) * 84) + "px" }}
            title={"$" + v + "k"} />
        ))}
      </div>
      <div className="trend-axis">{labels.map((l, i) => <span key={i}>{l}</span>)}</div>
    </div>
  );
}

// level / section tabs (segmented)
function LevelTabs({ tabs, active, onChange }) {
  return (
    <div className="level-tabs">
      <div className="seg">
        {tabs.map(t => (
          <button key={t.id} className={active === t.id ? "on" : ""} onClick={() => onChange(t.id)}>
            <AIcon name={t.icon} size={15} />{t.label}
            {t.count != null && <span className="cnt">{t.count}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// panel wrapper
function Panel({ icon, title, action, children }) {
  return (
    <section className="panel fade">
      <div className="panel-head">
        <div className="ph-t">{icon && <span className="pi"><AIcon name={icon} size={17} /></span>}<h3 className="h3">{title}</h3></div>
        {action}
      </div>
      {children}
    </section>
  );
}

// overview spec grid
function OverviewPanel({ title, specs, status, statusTone, statusNote, extra }) {
  return (
    <Panel icon="doc" title={title || "Overview"}
      action={status && <StatusTag status={status} tone={statusTone} />}>
      <div className="spec-grid">
        {specs.map((s, i) => (
          <div className="spec" key={i}>
            <div className="sl">{s.label}</div>
            <div className={"sv" + (s.serif ? " serif" : "")}>{s.value}</div>
          </div>
        ))}
      </div>
      {extra}
    </Panel>
  );
}

// financials panel — flexible cards + optional trend + ledger
function FinancialsPanel({ title, cards, trend, trendLabels, ledger }) {
  return (
    <Panel icon="wallet" title={title || "Financials"}>
      <div className="fin-grid">
        {cards.map((c, i) => (
          <div className={"fin-card" + (c.accent ? " accent" : "")} key={i}>
            <div className="fl">{c.label}</div>
            <div className="fv">{c.value}</div>
            {c.note && <div className={"fd " + (c.dir || "")}>{c.dir === "up" && <AIcon name="trend" size={12} />}{c.note}</div>}
          </div>
        ))}
      </div>
      {trend && (
        <div style={{ marginTop: 22 }}>
          <div className="eye" style={{ marginBottom: 4 }}>Revenue trend · last 6 months ($K)</div>
          <TrendBars data={trend} labels={trendLabels} />
        </div>
      )}
      {ledger && (
        <div className="ledger" style={{ marginTop: 18 }}>
          {ledger.map((l, i) => (
            <div className={"lr" + (l.total ? " total" : "")} key={i}>
              <span>{l.label}</span>
              <span className="lv"><b>{l.value}</b></span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// amenities board — present highlighted, rest shown dashed/off
function AmenitiesPanel({ title, catalog, present }) {
  const items = window.AMENITY_CATALOG[catalog] || present;
  const set = new Set(present);
  return (
    <Panel icon="sparkle" title={title || "Amenities"}
      action={<span className="small mono">{present.length} of {items.length} available</span>}>
      <div className="amen-grid">
        {items.map((a, i) => {
          const on = set.has(a);
          return (
            <div className={"amen-cell" + (on ? "" : " off")} key={i}>
              <span className="ai"><AIcon name={window.AMENITY_ICONS[a] || "check"} size={17} /></span>
              {a}
              {on && <span className="ack"><AIcon name="check" size={16} /></span>}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// activity timeline
function ActivityPanel({ title, activity, action }) {
  if (!activity || !activity.length) {
    return (
      <Panel icon="bell" title={title || "Activity"}>
        <EmptyState icon="bell" heading="No recent activity" body="Updates, payments, and maintenance actions will appear here." />
      </Panel>
    );
  }
  return (
    <Panel icon="bell" title={title || "Activity"} action={action}>
      <div className="timeline">
        {activity.map((a, i) => (
          <div className="tl" key={i}>
            <span className={"ti " + (a.tone || "muted")}><AIcon name={a.icon} size={16} /></span>
            <div className="tc"><h5>{a.title}</h5><p>{a.detail}</p></div>
            <span className="tt">{a.time}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// empty state
function EmptyState({ icon = "search", heading, body, action }) {
  return (
    <div className="empty-state">
      <div className="es-ic"><AIcon name={icon} size={24} /></div>
      <h4>{heading}</h4>
      <p>{body}</p>
      {action}
    </div>
  );
}

// tenant pill
function Tenant({ name }) {
  if (!name) return <span className="small muted" style={{ fontStyle: "italic" }}>Unassigned</span>;
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <span className="tenant">
      <span className="av">{initials}</span>
      <span className="nm">{name}</span>
    </span>
  );
}

// building photo with graceful placeholder fallback
function BuildingMedia({ src, alt, compact }) {
  if (src) return <img src={src} alt={alt} loading="lazy" />;
  return (
    <div className="media-ph">
      <span className="mph-ic"><AIcon name="image" size={compact ? 16 : 22} /></span>
      {!compact && <span className="mph-l">No photo</span>}
    </div>
  );
}

// kebab action menu (portal-rendered so it never clips inside cards/rows)
function ActionMenu({ items, align = "right", glass }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const W = 200;
  const place = () => {
    const r = btnRef.current.getBoundingClientRect();
    const left = align === "right" ? Math.max(8, r.right - W) : r.left;
    setPos({ top: r.bottom + 6, left });
  };
  const toggle = (e) => { e.stopPropagation(); e.preventDefault(); if (open) { setOpen(false); return; } place(); setOpen(true); };
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <React.Fragment>
      <button ref={btnRef} className={"kebab" + (glass ? " kebab-glass" : "") + (open ? " on" : "")} onClick={toggle} aria-label="Building actions">
        <AIcon name="more" size={16} />
      </button>
      {open && ReactDOM.createPortal(
        <div className="menu" style={{ top: pos.top, left: pos.left }} onClick={e => e.stopPropagation()}>
          {items.map((it, i) => it.sep
            ? <div className="menu-sep" key={i} />
            : <button key={i} className={"menu-item" + (it.danger ? " danger" : "")}
                onClick={(e) => { e.stopPropagation(); setOpen(false); it.onClick && it.onClick(); }}>
                <span className="mi"><AIcon name={it.icon} size={16} /></span>{it.label}
              </button>)}
        </div>, document.body)}
    </React.Fragment>
  );
}

Object.assign(window, {
  StatusTag, OccupancyBar, KpiRow, Breadcrumb, TrendBars, LevelTabs,
  Panel, OverviewPanel, FinancialsPanel, AmenitiesPanel, ActivityPanel, EmptyState, Tenant,
  BuildingMedia, ActionMenu,
});
