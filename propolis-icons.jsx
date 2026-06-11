// Inline SVG icon set — single weight, 1.6 stroke, rounded caps.
const Icon = ({ name, size = 20, color = "currentColor", stroke = 1.6 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "arrow":
      return (<svg {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>);
    case "arrow-ne":
      return (<svg {...p}><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>);
    case "home":
      return (<svg {...p}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></svg>);
    case "building":
      return (<svg {...p}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2"/></svg>);
    case "briefcase":
      return (<svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>);
    case "calendar":
      return (<svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>);
    case "user":
      return (<svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>);
    case "key":
      return (<svg {...p}><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9"/><path d="m16 7 3 3"/></svg>);
    case "check":
      return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>);
    case "shield":
      return (<svg {...p}><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/></svg>);
    case "doc":
      return (<svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>);
    case "lock":
      return (<svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
    case "headset":
      return (<svg {...p}><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/><path d="M20 20a3 3 0 0 1-3 3h-2"/></svg>);
    case "pin":
      return (<svg {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>);
    case "bed":
      return (<svg {...p}><path d="M3 18V9M21 18v-5a3 3 0 0 0-3-3H3"/><circle cx="7" cy="13" r="2"/><path d="M3 18h18"/></svg>);
    case "sofa":
      return (<svg {...p}><path d="M4 11V8a2 2 0 0 1 4 0v3"/><path d="M20 11V8a2 2 0 0 0-4 0v3"/><path d="M2 16v-3a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v3"/><path d="M5 16v3M19 16v3"/></svg>);
    case "wifi":
      return (<svg {...p}><path d="M3 9a15 15 0 0 1 18 0"/><path d="M6 13a10 10 0 0 1 12 0"/><path d="M9 17a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r=".5"/></svg>);
    case "heart":
      return (<svg {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>);
    case "star":
      return (<svg {...p}><path d="m12 3 2.6 5.4 6 .9-4.4 4.2 1 5.9L12 17l-5.2 2.4 1-5.9L3.4 9.3l6-.9z"/></svg>);
    case "search":
      return (<svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>);
    case "sliders":
      return (<svg {...p}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h14M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="16" cy="18" r="2"/></svg>);
    case "users":
      return (<svg {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M18 20c0-2.4-1.2-4.2-3-4.8"/></svg>);
    case "clock":
      return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    case "sparkle":
      return (<svg {...p}><path d="M12 3c.5 4 2.5 6 6 6.5-3.5.5-5.5 2.5-6 6.5-.5-4-2.5-6-6-6.5 3.5-.5 5.5-2.5 6-6.5z"/><path d="M19 14c.2 1.4.9 2.1 2.2 2.3-1.3.2-2 .9-2.2 2.2-.2-1.3-.9-2-2.2-2.2 1.3-.2 2-.9 2.2-2.3z"/></svg>);
    case "coffee":
      return (<svg {...p}><path d="M4 9h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M7 3v2M11 3v2"/></svg>);
    case "wash":
      return (<svg {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M7 6h.5M10 6h.5"/></svg>);
    case "map":
      return (<svg {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>);
    default: return null;
  }
};

window.Icon = Icon;
