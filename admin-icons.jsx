// admin-icons.jsx — extends the Propolis icon set with property-management amenity icons.
// AIcon renders amenity/UI glyphs; anything it doesn't know falls back to window.Icon.
const AIcon = ({ name, size = 20, color = "currentColor", stroke = 1.6, style, className }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style, className };
  switch (name) {
    case "arrow-left":  return (<svg {...p}><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>);
    case "x":           return (<svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>);
    case "grid":        return (<svg {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>);
    case "list":        return (<svg {...p}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.1"/><circle cx="3.5" cy="12" r="1.1"/><circle cx="3.5" cy="18" r="1.1"/></svg>);
    case "trash":       return (<svg {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"/><path d="M10 11v6M14 11v6"/></svg>);
    case "ban":         return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/></svg>);
    case "image":       return (<svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>);
    case "car":        return (<svg {...p}><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M3 16v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-2 0v-1H7v1a1 1 0 0 1-2 0v-1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="14" r="1"/><circle cx="16.5" cy="14" r="1"/></svg>);
    case "dumbbell":   return (<svg {...p}><path d="M6.5 6.5v11M3 9v6M17.5 6.5v11M21 9v6M6.5 12h11"/></svg>);
    case "elevator":   return (<svg {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18"/><path d="M7.5 9 6 7.5 4.5 9M16.5 7.5 15 9l1.5 1.5"/></svg>);
    case "pool":       return (<svg {...p}><path d="M3 18c1.2 0 1.2 1 2.4 1s1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1"/><path d="M7 15V6a2 2 0 0 1 4 0M13 15V6a2 2 0 0 1 4 0"/><path d="M7 10h6"/></svg>);
    case "rooftop":    return (<svg {...p}><path d="M3 21h18"/><path d="m4 21 .8-9.5a1 1 0 0 1 1-.9h12.4a1 1 0 0 1 1 .9L20 21"/><path d="m2 11 10-6 10 6"/><path d="M10 21v-4h4v4"/></svg>);
    case "reception":  return (<svg {...p}><path d="M3 20h18"/><path d="M4 20v-6a6 6 0 0 1 12 0v6"/><path d="M10 8V5h6v3"/><path d="M16 12h4a1 1 0 0 1 1 1v7"/></svg>);
    case "balcony":    return (<svg {...p}><rect x="4" y="3" width="16" height="9" rx="1"/><path d="M3 12h18M12 12v9M4 16h16M7 16v5M17 16v5"/></svg>);
    case "fridge":     return (<svg {...p}><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M10 6v1M10 13v2"/></svg>);
    case "ac":         return (<svg {...p}><rect x="3" y="5" width="18" height="7" rx="2"/><path d="M6 9h2M11 9h2"/><path d="M7 16c0 1.5-1 1.5-1 3M12 16c0 1.5-1 1.5-1 3M17 16c0 1.5-1 1.5-1 3"/></svg>);
    case "heat":       return (<svg {...p}><path d="M9 4c0 2-2 3-2 5s2 2 2 4-2 3-2 3M15 4c0 2-2 3-2 5s2 2 2 4-2 3-2 3"/></svg>);
    case "fan":        return (<svg {...p}><circle cx="12" cy="12" r="1.6"/><path d="M12 10.4C12 7 11 4 13.5 4S16 8 12 10.4M13.6 12c3.4 0 6.4-1 6.4 1.5S16 16 13.6 12M10.4 12c-3.4 0-6.4 1-6.4-1.5S8 8 10.4 12M12 13.6c0 3.4 1 6.4-1.5 6.4S8 16 12 13.6"/></svg>);
    case "desk":       return (<svg {...p}><path d="M3 7h18M4 7v12M20 7v12M4 13h6M7 13v6"/><path d="M14 11h4v3h-4z"/></svg>);
    case "wardrobe":   return (<svg {...p}><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 3v18M9 11v2M15 11v2"/></svg>);
    case "window":     return (<svg {...p}><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/></svg>);
    case "chair":      return (<svg {...p}><path d="M6 11V5a2 2 0 0 1 4 0v6M14 11V5a2 2 0 0 1 4 0v6"/><path d="M5 11h14v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M7 16v4M17 16v4"/></svg>);
    case "tv":         return (<svg {...p}><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/></svg>);
    case "plug":       return (<svg {...p}><path d="M9 3v5M15 3v5"/><path d="M6 8h12v2a6 6 0 0 1-12 0z"/><path d="M12 16v5"/></svg>);
    case "edit":       return (<svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>);
    case "download":   return (<svg {...p}><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>);
    case "plus":       return (<svg {...p}><path d="M12 5v14M5 12h14"/></svg>);
    case "more":       return (<svg {...p}><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>);
    case "chevron":    return (<svg {...p}><path d="m9 6 6 6-6 6"/></svg>);
    case "bell":       return (<svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>);
    case "layers":     return (<svg {...p}><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/></svg>);
    case "trend":      return (<svg {...p}><path d="M3 17 9 11l4 4 8-8"/><path d="M15 7h6v6"/></svg>);
    case "wallet":     return (<svg {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/></svg>);
    case "tool":       return (<svg {...p}><path d="M14.5 5.5a3.5 3.5 0 0 0-4.8 4.3l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6a3.5 3.5 0 0 0 4.3-4.8l-2.3 2.3-1.9-.5-.5-1.9z"/></svg>);
    default:           return (window.Icon ? <window.Icon name={name} size={size} color={color} stroke={stroke} style={style} className={className}/> : null);
  }
};
window.AIcon = AIcon;
