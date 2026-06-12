// admin-data.jsx — Propolis property data: Building → Apartment → Room.

const AMENITY_ICONS = {
  "Parking":"car","Gym":"dumbbell","24/7 Security":"shield","Elevator":"elevator",
  "Rooftop":"rooftop","Swimming Pool":"pool","Laundry":"wash","Reception":"reception",
  "Bike Storage":"layers","Co-work Lounge":"briefcase",
  "Balcony":"balcony","Kitchen":"coffee","Air Conditioning":"ac","Heating":"heat",
  "Furnished":"sofa","Private Bathroom":"wash","Internet":"wifi","Washing Machine":"wash",
  "Smart TV":"tv","Dishwasher":"fridge",
  "Bed":"bed","Wardrobe":"wardrobe","Desk":"desk","Chair":"chair",
  "Attached Bathroom":"wash","Window":"window","Fan":"fan","Power Backup":"plug",
};

const AMENITY_CATALOG = {
  building:  ["Parking","Gym","24/7 Security","Elevator","Rooftop","Swimming Pool","Laundry","Reception","Bike Storage","Co-work Lounge"],
  apartment: ["Furnished","Kitchen","Air Conditioning","Heating","Balcony","Private Bathroom","Internet","Washing Machine","Smart TV","Dishwasher"],
  room:      ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Fan","Internet","Power Backup"],
};

/* Demo brand/manufacturer per amenity — shown on amenity cards */
const AMENITY_BRANDS = {
  "Dishwasher":"Bosch","Washing Machine":"LG","Smart TV":"Samsung","Air Conditioning":"Daikin",
  "Heating":"Honeywell","Internet":"Xfinity","Elevator":"Otis","Laundry":"Speed Queen",
  "Gym":"Technogym","24/7 Security":"ADT","Swimming Pool":"Pentair","Kitchen":"Whirlpool",
  "Fan":"Hunter","Power Backup":"Generac","Bed":"IKEA","Wardrobe":"IKEA","Desk":"IKEA","Chair":"Herman Miller",
};

const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const A = (icon, tone, title, detail, time) => ({ icon, tone, title, detail, time });

const LTR_AM = ["Bed","Wardrobe","Desk","Chair","Window","Internet"];
const STR_AM = ["Bed","Wardrobe","Desk","Chair","Window","Internet","Air Conditioning","Power Backup"];

// Room builder — Building → Apartment → Room
const rm = (id, name, rentalType, housingType, bedSize, bd, ba, status, statusTone, monthlyRev, tenant, listedDate, present, activity) => {
  const paid = status === "Occupied" ? monthlyRev : 0;
  return {
    id, name, rentalType, housingType, bedSize, bd, ba,
    type: housingType + " · " + bedSize,
    status, statusTone,
    rent: monthlyRev,
    yearlyRevenue: monthlyRev * 12,
    tenant, listedDate,
    financials: { rent: monthlyRev, paid, pending: 0, extra: 0, status: status === "Occupied" ? "Paid" : "Vacant" },
    amenities: { catalog: "room", present },
    activity,
  };
};

const BUILDINGS = [

  // ─────────────────────────── AERIE ───────────────────────────
  {
    id:"aerie", name:"Aerie", fullName:"Aerie",
    address:"121 NW 7th Ave Miami FL 33218",
    location:"Allapattah · Miami", ownerLLC:"NW 121 LLC", floors:3,
    image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    _totalApartments:12, _totalRooms:32, ltrCount:23, strCount:9,
    yearlyRevenue:194000, occupancy:88, lastUpdated:"Jun 10, 2026",
    financials:{ revenue:16200, pending:2100, maintenance:1800, netIncome:12300,
      trend:[13,14,14,15,16,16], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","24/7 Security","Elevator","Laundry","Co-work Lounge"] },
    activity:[
      A("wallet","green","Rent received","Room 11A · $442 cleared for June","2h ago"),
      A("user","teal","Tenant moved in","Room 12B · lease started Jun 1","1 day ago"),
      A("tool","amber","Maintenance scheduled","Elevator service Jun 15","Jun 9"),
      A("doc","muted","Lease renewed","Apartment 21 · 12-month extension","Jun 5"),
    ],
    apartments:[
      {
        id:"aerie-apt11", name:"Apartment 11", floor:"1st floor", size:"680 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:1274,
        financials:{ rent:1274, paid:1274, pending:0, utility:120, maintenance:60 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine"] },
        activity:[ A("wallet","green","All rooms paid","June rent cleared","2h ago") ],
        rooms:[
          rm("aerie-11a","Room 11A","LTR","Coliving","Full",1,1,"Occupied","green",442,"Carlos Rivera","2023-03-03",LTR_AM,[A("wallet","green","Rent paid","June $442 received","2h ago")]),
          rm("aerie-11b","Room 11B","LTR","Coliving","Full",1,1,"Occupied","green",442,"Daria Moston","2023-03-03",LTR_AM,[A("wallet","green","Rent paid","June $442 received","2h ago")]),
          rm("aerie-11c","Room 11C","LTR","Coliving","Twin",1,1,"Occupied","green",390,"Marcus Lee","2023-03-10",LTR_AM,[A("wallet","green","Rent paid","June $390 received","2h ago")]),
        ],
      },
      {
        id:"aerie-apt12", name:"Apartment 12", floor:"1st floor", size:"700 sq ft",
        layout:"3×2", status:"Partially occupied", statusTone:"amber", rent:2750,
        financials:{ rent:2750, paid:1650, pending:1100, utility:130, maintenance:80 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Balcony","Internet"] },
        activity:[ A("user","teal","Tenant moved in","Room 12B · Jun 1","1 day ago"), A("doc","muted","Room 12C listed","Available now","Jun 8") ],
        rooms:[
          rm("aerie-12a","Room 12A","LTR","Coliving","Full",1,1,"Occupied","green",450,"Sofia Marin","2023-05-01",LTR_AM,[A("wallet","green","Rent paid","June $450","1 day ago")]),
          rm("aerie-12b","Room 12B","STR","Coliving","Queen",1,1,"Occupied","green",1200,null,"2026-06-01",STR_AM,[A("user","teal","Guest checked in","3-night stay","1 day ago")]),
          rm("aerie-12c","Room 12C","STR","Coliving","Full",1,1,"Vacant","terra",1100,null,"2026-06-08",STR_AM,[A("doc","muted","Listed","Available for STR","Jun 8")]),
        ],
      },
      {
        id:"aerie-apt21", name:"Apartment 21", floor:"2nd floor", size:"720 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:1370,
        financials:{ rent:1370, paid:1370, pending:0, utility:115, maintenance:40 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Dishwasher"] },
        activity:[ A("doc","muted","Lease renewed","12-month extension signed","Jun 5") ],
        rooms:[
          rm("aerie-21a","Room 21A","LTR","Coliving","Full",1,1,"Occupied","green",465,"James Osei","2022-11-15",LTR_AM,[A("doc","muted","Lease renewed","12 months","Jun 5")]),
          rm("aerie-21b","Room 21B","LTR","Coliving","Full",1,1,"Occupied","green",458,"Lena Park","2023-01-10",LTR_AM,[A("wallet","green","Rent paid","June $458","2 days ago")]),
          rm("aerie-21c","Room 21C","LTR","Coliving","Twin",1,1,"Occupied","green",447,"Yusuf Ahmed","2023-06-20",LTR_AM,[A("wallet","green","Rent paid","June $447","2 days ago")]),
        ],
      },
    ],
  },

  // ─────────────────────────── LIMON ───────────────────────────
  {
    id:"limon", name:"Limon", fullName:"Limon",
    address:"3505 NW 5th Ave, Miami, FL 33127",
    location:"Wynwood · Miami", ownerLLC:null, floors:5,
    image:null,
    status:"Under Construction", statusTone:"terra", statusNote:"Under construction — all operations paused",
    _totalApartments:29, _totalRooms:51, ltrCount:2, strCount:0,
    yearlyRevenue:0, occupancy:4, lastUpdated:"Jun 10, 2026",
    financials:{ revenue:0, pending:0, maintenance:0, netIncome:0,
      trend:[0,0,0,0,0,0], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:[] },
    activity:[
      A("tool","terra","Construction started","Building under active renovation","Jun 1, 2026"),
      A("doc","muted","Building disabled","All operations paused","Jun 1, 2026"),
    ],
    apartments:[],
  },

  // ─────────────────────────── OLIVE ───────────────────────────
  {
    id:"olive", name:"Olive", fullName:"Olive",
    address:"637 NW 2nd St Miami FL 33218",
    location:"Allapattah · Miami", ownerLLC:"NW 637 LLC", floors:4,
    image:"https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    _totalApartments:13, _totalRooms:29, ltrCount:0, strCount:29,
    yearlyRevenue:546000, occupancy:90, lastUpdated:"Jun 11, 2026",
    financials:{ revenue:48000, pending:3200, maintenance:4100, netIncome:40700,
      trend:[42,44,45,46,48,48], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["24/7 Security","Laundry","Co-work Lounge","Bike Storage","Reception","Elevator"] },
    activity:[
      A("wallet","green","Revenue milestone","$48k for May — record month","Jun 10"),
      A("user","teal","New guest checked in","Room 11A · 5-night stay","Jun 10"),
      A("tool","amber","AC maintenance","Apartment 21 · scheduled Jun 14","Jun 9"),
    ],
    apartments:[
      {
        id:"olive-apt11", name:"Apartment 11", floor:"1st floor", size:"860 sq ft",
        layout:"3×2", status:"Fully occupied", statusTone:"green", rent:4830,
        financials:{ rent:4830, paid:4830, pending:0, utility:200, maintenance:150 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Smart TV","Dishwasher"] },
        activity:[ A("wallet","green","Revenue received","$4,830 cleared","Jun 10") ],
        rooms:[
          rm("olive-11a","Room 11A","STR","Coliving","Queen",1,1,"Occupied","green",1650,null,"2024-01-10",STR_AM,[A("user","teal","Guest checked in","5-night stay","Jun 10")]),
          rm("olive-11b","Room 11B","STR","Coliving","Full",1,1,"Occupied","green",1580,null,"2024-01-10",STR_AM,[A("user","teal","Guest checked in","4-night stay","Jun 9")]),
          rm("olive-11c","Room 11C","STR","Coliving","Twin",1,1,"Vacant","terra",1600,null,"2024-01-10",STR_AM,[A("doc","muted","Available","No upcoming bookings","Jun 11")]),
        ],
      },
      {
        id:"olive-apt12", name:"Apartment 12", floor:"1st floor", size:"820 sq ft",
        layout:"2×2", status:"Fully occupied", statusTone:"green", rent:3500,
        financials:{ rent:3500, paid:3500, pending:0, utility:190, maintenance:100 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Smart TV"] },
        activity:[ A("wallet","green","Revenue received","$3,500 cleared","Jun 9") ],
        rooms:[
          rm("olive-12a","Room 12A","STR","Coliving","Queen",1,1,"Occupied","green",1780,null,"2024-02-15",STR_AM,[A("user","teal","Guest extended stay","Extra 2 nights","Jun 9")]),
          rm("olive-12b","Room 12B","STR","Coliving","Queen",1,1,"Occupied","green",1720,null,"2024-02-15",STR_AM,[A("user","teal","Guest checked in","3-night stay","Jun 8")]),
        ],
      },
      {
        id:"olive-apt21", name:"Apartment 21", floor:"2nd floor", size:"890 sq ft",
        layout:"3×2", status:"Partially occupied", statusTone:"amber", rent:4820,
        financials:{ rent:4820, paid:3220, pending:1600, utility:210, maintenance:120 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Smart TV","Dishwasher","Balcony"] },
        activity:[ A("tool","amber","AC maintenance","Scheduled Jun 14","Jun 9") ],
        rooms:[
          rm("olive-21a","Room 21A","STR","Coliving","Queen",1,1,"Occupied","green",1620,null,"2024-03-01",STR_AM,[A("user","teal","Guest checked in","2-night stay","Jun 10")]),
          rm("olive-21b","Room 21B","STR","Coliving","Full",1,1,"Occupied","green",1580,null,"2024-03-01",STR_AM,[A("wallet","green","Revenue received","$1,580","Jun 9")]),
          rm("olive-21c","Room 21C","STR","Coliving","Twin",1,1,"Vacant","terra",1620,null,"2024-03-01",STR_AM,[A("tool","amber","Under maintenance","AC repair pending","Jun 9")]),
        ],
      },
    ],
  },

  // ─────────────────────────── OTTO ───────────────────────────
  {
    id:"otto", name:"Otto", fullName:"Otto",
    address:"228 NW 7th Ave Miami FL 33218",
    location:"Allapattah · Miami", ownerLLC:"NW 228 LLC", floors:3,
    image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    _totalApartments:12, _totalRooms:36, ltrCount:36, strCount:0,
    yearlyRevenue:504000, occupancy:94, lastUpdated:"Jun 10, 2026",
    financials:{ revenue:42000, pending:1800, maintenance:3200, netIncome:37000,
      trend:[39,40,41,41,42,42], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","24/7 Security","Elevator","Laundry","Bike Storage","Co-work Lounge"] },
    activity:[
      A("wallet","green","Rent received","Apartment 11 · $3,600 cleared","5h ago"),
      A("doc","muted","Inspection passed","Annual safety inspection","Jun 3"),
    ],
    apartments:[
      {
        id:"otto-apt11", name:"Apartment 11", floor:"1st floor", size:"780 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:3600,
        financials:{ rent:3600, paid:3600, pending:0, utility:160, maintenance:80 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine"] },
        activity:[ A("wallet","green","Rent received","$3,600 cleared","5h ago") ],
        rooms:[
          rm("otto-11a","Room 11A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Felix Duro","2024-08-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","5h ago")]),
          rm("otto-11b","Room 11B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Nadia Solis","2024-08-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","5h ago")]),
          rm("otto-11c","Room 11C","LTR","Coliving","Twin",1,1,"Occupied","green",1200,"Artem Vlasov","2024-09-15",LTR_AM,[A("wallet","green","Rent paid","June $1,200","5h ago")]),
        ],
      },
      {
        id:"otto-apt12", name:"Apartment 12", floor:"1st floor", size:"760 sq ft",
        layout:"3×1", status:"Partially occupied", statusTone:"amber", rent:2400,
        financials:{ rent:2400, paid:2400, pending:0, utility:150, maintenance:60 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Heating"] },
        activity:[ A("user","amber","Room 12C vacant","Available from Jun 20","Jun 9") ],
        rooms:[
          rm("otto-12a","Room 12A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Ivan Petrov","2024-10-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","1 day ago")]),
          rm("otto-12b","Room 12B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Mia Torres","2025-01-15",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","1 day ago")]),
          rm("otto-12c","Room 12C","LTR","Coliving","Twin",1,1,"Vacant","terra",1200,null,"2026-06-01",LTR_AM,[A("doc","muted","Listed","Available Jun 20","Jun 9")]),
        ],
      },
      {
        id:"otto-apt21", name:"Apartment 21", floor:"2nd floor", size:"800 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:3600,
        financials:{ rent:3600, paid:3600, pending:0, utility:155, maintenance:70 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Heating"] },
        activity:[ A("wallet","green","Rent received","$3,600 cleared","5h ago") ],
        rooms:[
          rm("otto-21a","Room 21A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Celine Dubois","2024-06-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","5h ago")]),
          rm("otto-21b","Room 21B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Omar Hassan","2024-07-15",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","5h ago")]),
          rm("otto-21c","Room 21C","LTR","Coliving","Twin",1,1,"Occupied","green",1200,"Ana Lima","2025-03-01",LTR_AM,[A("wallet","green","Rent paid","June $1,200","5h ago")]),
        ],
      },
    ],
  },

  // ─────────────────────────── PASTEL ───────────────────────────
  {
    id:"pastel", name:"Pastel", fullName:"Pastel",
    address:"1160 NW 5th St Miami FL 33218",
    location:"Allapattah · Miami", ownerLLC:"NW 1160 LLC", floors:5,
    image:null,
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    _totalApartments:16, _totalRooms:32, ltrCount:10, strCount:22,
    yearlyRevenue:313000, occupancy:82, lastUpdated:"Jun 9, 2026",
    financials:{ revenue:48000, pending:2400, maintenance:3600, netIncome:42000,
      trend:[41,43,44,46,47,48], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","Elevator","Laundry","Co-work Lounge","24/7 Security"] },
    activity:[
      A("user","teal","Guest checked in","Room 11B · 7-night STR stay","Jun 10"),
      A("wallet","green","LTR rent received","Apartment 21 rooms · $2,400","Jun 9"),
      A("tool","amber","HVAC maintenance","Floor 3 · scheduled Jun 16","Jun 8"),
    ],
    apartments:[
      {
        id:"pastel-apt11", name:"Apartment 11", floor:"1st floor", size:"760 sq ft",
        layout:"2×2", status:"Fully occupied", statusTone:"green", rent:2600,
        financials:{ rent:2600, paid:2600, pending:0, utility:140, maintenance:70 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine"] },
        activity:[ A("user","teal","Guest checked in","Room 11B · 7-night stay","Jun 10") ],
        rooms:[
          rm("pastel-11a","Room 11A","LTR","Coliving","Full",1,1,"Occupied","green",900,"Tomas Bauer","2025-02-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $900","1 day ago")]),
          rm("pastel-11b","Room 11B","STR","Coliving","Queen",1,1,"Occupied","green",1700,null,"2025-03-15",STR_AM,[A("user","teal","Guest checked in","7-night stay","Jun 10")]),
        ],
      },
      {
        id:"pastel-apt12", name:"Apartment 12", floor:"1st floor", size:"720 sq ft",
        layout:"2×2", status:"Partially occupied", statusTone:"amber", rent:2800,
        financials:{ rent:2800, paid:1400, pending:1400, utility:130, maintenance:50 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Smart TV"] },
        activity:[ A("doc","muted","Room 12B listed","Available Jun 15","Jun 8") ],
        rooms:[
          rm("pastel-12a","Room 12A","STR","Coliving","Queen",1,1,"Occupied","green",1400,null,"2025-04-01",STR_AM,[A("user","teal","Guest checked in","2-night stay","Jun 9")]),
          rm("pastel-12b","Room 12B","STR","Coliving","Full",1,1,"Vacant","terra",1400,null,"2025-04-01",STR_AM,[A("doc","muted","Available Jun 15","Listed","Jun 8")]),
        ],
      },
      {
        id:"pastel-apt21", name:"Apartment 21", floor:"2nd floor", size:"800 sq ft",
        layout:"2×2", status:"Fully occupied", statusTone:"green", rent:2400,
        financials:{ rent:2400, paid:2400, pending:0, utility:145, maintenance:60 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Heating"] },
        activity:[ A("wallet","green","LTR rent received","$2,400 cleared","Jun 9") ],
        rooms:[
          rm("pastel-21a","Room 21A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Rania Aziz","2025-05-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","Jun 9")]),
          rm("pastel-21b","Room 21B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Victor Silva","2025-05-15",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","Jun 9")]),
        ],
      },
    ],
  },

  // ─────────────────────────── PLUM ───────────────────────────
  {
    id:"plum", name:"Plum", fullName:"Plum",
    address:"626 NW 11th Ave Miami FL 33136",
    location:"Allapattah · Miami", ownerLLC:"NW 626 LLC", floors:3,
    image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    _totalApartments:12, _totalRooms:36, ltrCount:36, strCount:0,
    yearlyRevenue:588000, occupancy:96, lastUpdated:"Jun 11, 2026",
    financials:{ revenue:49000, pending:1200, maintenance:2800, netIncome:45000,
      trend:[45,46,47,48,49,49], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","Gym","24/7 Security","Elevator","Rooftop","Laundry","Co-work Lounge"] },
    activity:[
      A("wallet","green","Rent received","Apartment 11 · $3,600 cleared","4h ago"),
      A("user","teal","Tenant renewed","Apartment 21 · 12-month extension","Jun 8"),
      A("doc","muted","Inspection logged","Annual safety — passed","Jun 5"),
    ],
    apartments:[
      {
        id:"plum-apt11", name:"Apartment 11", floor:"1st floor", size:"720 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:3600,
        financials:{ rent:3600, paid:3600, pending:0, utility:150, maintenance:60 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Heating"] },
        activity:[ A("wallet","green","Rent received","$3,600 cleared","4h ago") ],
        rooms:[
          rm("plum-11a","Room 11A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Maya Okafor","2024-04-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","4h ago")]),
          rm("plum-11b","Room 11B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Theo Lindqvist","2024-05-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","4h ago")]),
          rm("plum-11c","Room 11C","LTR","Coliving","Twin",1,1,"Occupied","green",1200,"Sofia Marchetti","2024-06-15",LTR_AM,[A("wallet","green","Rent paid","June $1,200","4h ago")]),
        ],
      },
      {
        id:"plum-apt12", name:"Apartment 12", floor:"1st floor", size:"700 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:3600,
        financials:{ rent:3600, paid:3600, pending:0, utility:145, maintenance:55 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine"] },
        activity:[ A("wallet","green","Rent received","$3,600 cleared","4h ago") ],
        rooms:[
          rm("plum-12a","Room 12A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Priya Nair","2024-09-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","4h ago")]),
          rm("plum-12b","Room 12B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Daniel Roth","2024-10-15",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","4h ago")]),
          rm("plum-12c","Room 12C","LTR","Coliving","Twin",1,1,"Occupied","green",1200,"Liam Chen","2025-01-10",LTR_AM,[A("wallet","green","Rent paid","June $1,200","4h ago")]),
        ],
      },
      {
        id:"plum-apt21", name:"Apartment 21", floor:"2nd floor", size:"740 sq ft",
        layout:"3×1", status:"Fully occupied", statusTone:"green", rent:3600,
        financials:{ rent:3600, paid:3600, pending:0, utility:148, maintenance:58 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Heating","Smart TV"] },
        activity:[ A("user","teal","Tenant renewed","12-month extension","Jun 8") ],
        rooms:[
          rm("plum-21a","Room 21A","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Grace Adeyemi","2023-12-01",[...LTR_AM,"Air Conditioning"],[A("doc","muted","Lease renewed","12 months","Jun 8")]),
          rm("plum-21b","Room 21B","LTR","Coliving","Full",1,1,"Occupied","green",1200,"Omar Vasquez","2024-02-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,200","4h ago")]),
          rm("plum-21c","Room 21C","LTR","Coliving","Twin",1,1,"Occupied","green",1200,"Hana Sato","2024-03-15",LTR_AM,[A("wallet","green","Rent paid","June $1,200","4h ago")]),
        ],
      },
    ],
  },

  // ─────────────────────────── SAFFRON ───────────────────────────
  {
    id:"saffron", name:"Saffron", fullName:"Saffron",
    address:"1110 NW 7th St Miami FL 33136",
    location:"Allapattah · Miami", ownerLLC:"NW 1110 LLC", floors:4,
    image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    _totalApartments:14, _totalRooms:28, ltrCount:13, strCount:15,
    yearlyRevenue:0, occupancy:86, lastUpdated:"Jun 10, 2026",
    financials:{ revenue:38000, pending:2600, maintenance:3100, netIncome:32300,
      trend:[34,35,36,36,37,38], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","Gym","24/7 Security","Elevator","Laundry","Reception","Co-work Lounge"] },
    activity:[
      A("user","teal","STR guest checked in","Room 11B · 4-night stay","Jun 10"),
      A("wallet","green","LTR rent collected","Apartment 12 rooms · $2,800","Jun 9"),
      A("doc","muted","New listing","Room 21C · STR listing live","Jun 8"),
    ],
    apartments:[
      {
        id:"saffron-apt11", name:"Apartment 11", floor:"1st floor", size:"800 sq ft",
        layout:"2×2", status:"Fully occupied", statusTone:"green", rent:3800,
        financials:{ rent:3800, paid:3800, pending:0, utility:170, maintenance:90 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Washing Machine","Smart TV"] },
        activity:[ A("user","teal","STR guest checked in","Room 11B · 4-night stay","Jun 10") ],
        rooms:[
          rm("saffron-11a","Room 11A","LTR","Coliving","Full",1,1,"Occupied","green",1400,"Nadia Hassan","2025-01-10",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,400","1 day ago")]),
          rm("saffron-11b","Room 11B","STR","Coliving","Queen",1,1,"Occupied","green",2400,null,"2025-06-01",STR_AM,[A("user","teal","Guest checked in","4-night stay","Jun 10")]),
        ],
      },
      {
        id:"saffron-apt12", name:"Apartment 12", floor:"1st floor", size:"780 sq ft",
        layout:"2×2", status:"Fully occupied", statusTone:"green", rent:2800,
        financials:{ rent:2800, paid:2800, pending:0, utility:160, maintenance:80 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Heating","Washing Machine"] },
        activity:[ A("wallet","green","LTR rent collected","$2,800 cleared","Jun 9") ],
        rooms:[
          rm("saffron-12a","Room 12A","LTR","Coliving","Full",1,1,"Occupied","green",1400,"Elena Popov","2024-11-15",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,400","Jun 9")]),
          rm("saffron-12b","Room 12B","LTR","Coliving","Full",1,1,"Occupied","green",1400,"Rashid Karim","2025-02-01",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,400","Jun 9")]),
        ],
      },
      {
        id:"saffron-apt21", name:"Apartment 21", floor:"2nd floor", size:"820 sq ft",
        layout:"3×2", status:"Partially occupied", statusTone:"amber", rent:4600,
        financials:{ rent:4600, paid:3200, pending:1400, utility:175, maintenance:95 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Internet","Smart TV","Washing Machine","Dishwasher"] },
        activity:[ A("doc","muted","New listing","Room 21C · STR live","Jun 8") ],
        rooms:[
          rm("saffron-21a","Room 21A","STR","Coliving","Queen",1,1,"Occupied","green",1800,null,"2025-06-01",STR_AM,[A("user","teal","Guest extended","2 extra nights","Jun 10")]),
          rm("saffron-21b","Room 21B","LTR","Coliving","Full",1,1,"Occupied","green",1400,"Yara Nasser","2025-03-10",[...LTR_AM,"Air Conditioning"],[A("wallet","green","Rent paid","June $1,400","Jun 9")]),
          rm("saffron-21c","Room 21C","STR","Coliving","Twin",1,1,"Vacant","terra",1400,null,"2026-06-08",STR_AM,[A("doc","muted","New STR listing","Live as of Jun 8","Jun 8")]),
        ],
      },
    ],
  },
];

// ── Derived counts (real totals override sample array lengths) ──
BUILDINGS.forEach(b => {
  b.totalApartments = b._totalApartments || b.apartments.length;
  b.totalRooms      = b._totalRooms      || b.apartments.reduce((s,a) => s + a.rooms.length, 0);
  b.amenitiesCount  = b.amenities.present.length;
  b.monthlyRevenue  = b.financials.revenue;
  b.apartments.forEach(a => {
    a.totalRooms    = a.rooms.length;
    a.occupiedRooms = a.rooms.filter(r => r.status === "Occupied").length;
    a.ltrCount      = a.rooms.filter(r => r.rentalType === "LTR").length;
    a.strCount      = a.rooms.filter(r => r.rentalType === "STR").length;
    a.amenitiesCount = a.amenities.present.length;
    a.parentBuilding = b.name;
    a.parentBuildingId = b.id;
    a.rooms.forEach(r => {
      r.amenitiesCount  = r.amenities.present.length;
      r.parentApartment = a.name;
      r.parentBuilding  = b.name;
    });
  });
});

Object.assign(window, { BUILDINGS, AMENITY_ICONS, AMENITY_CATALOG, AMENITY_BRANDS, money });
