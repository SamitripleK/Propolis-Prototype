// admin-data.jsx — Propolis property data: Building → Apartment → Room.
// Each level carries overview, financials, amenities, and activity.

// Amenity → icon map (used by the amenities board at every level)
const AMENITY_ICONS = {
  // building
  "Parking":"car","Gym":"dumbbell","24/7 Security":"shield","Elevator":"elevator",
  "Rooftop":"rooftop","Swimming Pool":"pool","Laundry":"wash","Reception":"reception",
  "Bike Storage":"layers","Co-work Lounge":"briefcase",
  // apartment
  "Balcony":"balcony","Kitchen":"coffee","Air Conditioning":"ac","Heating":"heat",
  "Furnished":"sofa","Private Bathroom":"wash","Internet":"wifi","Washing Machine":"wash",
  "Smart TV":"tv","Dishwasher":"fridge",
  // room
  "Bed":"bed","Wardrobe":"wardrobe","Desk":"desk","Chair":"chair",
  "Attached Bathroom":"wash","Window":"window","Fan":"fan","Power Backup":"plug",
};

// Full catalogs so the board can show present + not-included amenities
const AMENITY_CATALOG = {
  building:  ["Parking","Gym","24/7 Security","Elevator","Rooftop","Swimming Pool","Laundry","Reception","Bike Storage","Co-work Lounge"],
  apartment: ["Furnished","Kitchen","Air Conditioning","Heating","Balcony","Private Bathroom","Internet","Washing Machine","Smart TV","Dishwasher"],
  room:      ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Fan","Internet","Power Backup"],
};

const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

// ---- activity helpers ----
const A = (icon, tone, title, detail, time) => ({ icon, tone, title, detail, time });

// ---- Rooms ----
const room = (id, name, type, status, statusTone, rent, tenant, fin, present, activity) => ({
  id, name, type, status, statusTone, rent, tenant,
  financials: fin,
  amenities: { catalog:"room", present },
  activity,
});

// reusable room financial builder
const rfin = (rent, paid, pending, extra, status) => ({ rent, paid, pending, extra, status });

const BUILDINGS = [
  // ───────────────────────── PLUM ─────────────────────────
  {
    id:"plum", name:"Plum House", location:"Wynwood · Miami", type:"Mixed-use residential",
    fullName:"Plum House Residences", address:"240 NW 25th St, Wynwood, FL 33127", ownerLLC:"Wynwood Living Holdings LLC", floors:4,
    image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    occupancy:92, lastUpdated:"Jun 8, 2026",
    financials:{ revenue:48200, pending:3150, maintenance:5400, netIncome:39650,
      trend:[38,41,40,44,46,48], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","Gym","24/7 Security","Elevator","Rooftop","Laundry","Co-work Lounge"] },
    activity:[
      A("wallet","green","Rent payment received","Apartment 3B · $2,400 cleared for June","2h ago"),
      A("tool","amber","Maintenance scheduled","Elevator service · vendor confirmed for Jun 12","Yesterday"),
      A("user","teal","New tenant moved in","Room 2 · Apartment 2A — lease started","2 days ago"),
      A("doc","muted","Lease renewed","Apartment 1A extended for 12 months","Jun 1"),
    ],
    apartments:[
      { id:"plum-1a", name:"Apartment 1A", floor:"1st floor", size:"720 sq ft", status:"Fully occupied", statusTone:"green", rent:2400,
        financials:{ rent:2400, paid:2400, pending:0, utility:180, maintenance:120 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Heating","Private Bathroom","Internet","Washing Machine"] },
        activity:[ A("wallet","green","Rent fully paid","June rent cleared","3h ago"), A("doc","muted","Lease renewed","12-month extension signed","Jun 1") ],
        rooms:[
          room("plum-1a-r1","Room 1","Master · ensuite","Occupied","green",1300,"Maya Okafor", rfin(1300,1300,0,40,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("wallet","green","Payment received","June rent paid in full","3h ago"), A("tool","muted","AC serviced","Routine filter clean","May 20")]),
          room("plum-1a-r2","Room 2","Standard double","Occupied","green",1100,"Theo Lindqvist", rfin(1100,1100,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Window","Fan","Internet"],
            [A("user","teal","Tenant check-in","Move-in completed","Apr 4"), A("wallet","green","Payment received","June rent paid","3h ago")]),
        ] },
      { id:"plum-2a", name:"Apartment 2A", floor:"2nd floor", size:"840 sq ft", status:"Partially occupied", statusTone:"amber", rent:2900,
        financials:{ rent:2900, paid:1900, pending:1000, utility:210, maintenance:90 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Balcony","Private Bathroom","Internet","Washing Machine","Smart TV"] },
        activity:[ A("user","teal","New tenant moved in","Room 2 — lease started","2 days ago"), A("wallet","amber","Payment pending","Room 3 · $1,000 due Jun 10","2 days ago") ],
        rooms:[
          room("plum-2a-r1","Room 1","Master · balcony","Occupied","green",1200,"Priya Nair", rfin(1200,1200,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("wallet","green","Payment received","June rent paid","1 day ago")]),
          room("plum-2a-r2","Room 2","Standard double","Occupied","green",1000,"Daniel Roth", rfin(1000,700,300,0,"Partial"),
            ["Bed","Wardrobe","Desk","Window","Fan","Internet"],
            [A("user","teal","Tenant check-in","Move-in completed","2 days ago"), A("wallet","amber","Partial payment","$300 balance remaining","2 days ago")]),
          room("plum-2a-r3","Room 3","Compact single","Vacant","terra",700,null, rfin(700,0,0,0,"Vacant"),
            ["Bed","Wardrobe","Desk","Window","Fan"],
            [A("tool","amber","Turnover cleaning","Prepared for next tenant","3 days ago"), A("doc","muted","Listing opened","Available from Jun 15","4 days ago")]),
        ] },
      { id:"plum-3b", name:"Apartment 3B", floor:"3rd floor", size:"680 sq ft", status:"Fully occupied", statusTone:"green", rent:2400,
        financials:{ rent:2400, paid:2400, pending:0, utility:165, maintenance:60 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Heating","Private Bathroom","Internet"] },
        activity:[ A("wallet","green","Rent payment received","$2,400 cleared for June","2h ago") ],
        rooms:[
          room("plum-3b-r1","Room 1","Master · ensuite","Occupied","green",1300,"Sofia Marchetti", rfin(1300,1300,0,25,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("wallet","green","Payment received","June rent paid","2h ago")]),
          room("plum-3b-r2","Room 2","Standard double","Occupied","green",1100,"Liam Chen", rfin(1100,1100,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Window","Internet"],
            [A("wallet","green","Payment received","June rent paid","2h ago")]),
        ] },
    ],
  },

  // ───────────────────────── SAFFRON ─────────────────────────
  {
    id:"saffron", name:"Saffron House", location:"Brickell · Miami", type:"High-rise apartments",
    fullName:"Saffron House Tower", address:"1100 Brickell Bay Dr, Brickell, FL 33131", ownerLLC:"Brickell Bay Properties LLC", floors:14,
    image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    occupancy:84, lastUpdated:"Jun 9, 2026",
    financials:{ revenue:61400, pending:5800, maintenance:7200, netIncome:48400,
      trend:[52,55,53,57,60,61], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","Gym","24/7 Security","Elevator","Swimming Pool","Laundry","Reception","Co-work Lounge"] },
    activity:[
      A("user","teal","Tour completed","Apartment 12C · prospective tenant","4h ago"),
      A("wallet","amber","Payment overdue","Apartment 9A · $1,800 past due","Yesterday"),
      A("tool","terra","Maintenance request","Apartment 12C · AC not cooling","Yesterday"),
      A("trend","green","Occupancy up","Building occupancy reached 84%","Jun 5"),
    ],
    apartments:[
      { id:"saf-9a", name:"Apartment 9A", floor:"9th floor", size:"950 sq ft", status:"Partially occupied", statusTone:"amber", rent:3400,
        financials:{ rent:3400, paid:1600, pending:1800, utility:240, maintenance:110 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Heating","Balcony","Private Bathroom","Internet","Washing Machine","Smart TV","Dishwasher"] },
        activity:[ A("wallet","amber","Payment overdue","$1,800 past due","Yesterday") ],
        rooms:[
          room("saf-9a-r1","Room 1","Master · city view","Occupied","green",1800,"Nadia Hassan", rfin(1800,1600,200,0,"Partial"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet","Power Backup"],
            [A("wallet","amber","Partial payment","$200 balance remaining","Yesterday")]),
          room("saf-9a-r2","Room 2","Standard · city view","Vacant","terra",1600,null, rfin(1600,0,0,0,"Vacant"),
            ["Bed","Wardrobe","Desk","Window","Air Conditioning","Internet"],
            [A("doc","muted","Listing opened","Available now","Jun 2")]),
        ] },
      { id:"saf-12c", name:"Apartment 12C", floor:"12th floor", size:"1,120 sq ft", status:"Fully occupied", statusTone:"green", rent:4100,
        financials:{ rent:4100, paid:4100, pending:0, utility:300, maintenance:260 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Heating","Balcony","Private Bathroom","Internet","Washing Machine","Smart TV","Dishwasher"] },
        activity:[ A("user","teal","Tour completed","Prospective tenant viewed","4h ago"), A("tool","terra","Maintenance request","AC not cooling — assigned","Yesterday") ],
        rooms:[
          room("saf-12c-r1","Room 1","Master suite","Occupied","green",1700,"Grace Adeyemi", rfin(1700,1700,0,60,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet","Power Backup"],
            [A("wallet","green","Payment received","June rent paid","2 days ago")]),
          room("saf-12c-r2","Room 2","Double · ensuite","Occupied","green",1400,"Omar Vasquez", rfin(1400,1400,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("tool","terra","Maintenance request","AC not cooling","Yesterday")]),
          room("saf-12c-r3","Room 3","Standard single","Occupied","green",1000,"Hana Sato", rfin(1000,1000,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Window","Fan","Internet"],
            [A("wallet","green","Payment received","June rent paid","3 days ago")]),
        ] },
    ],
  },

  // ───────────────────────── OTTO ─────────────────────────
  {
    id:"otto", name:"Otto House", location:"Edgewater · Miami", type:"Boutique low-rise",
    fullName:"Otto House Lofts", address:"55 NE 30th St, Edgewater, FL 33137", ownerLLC:"Edgewater Bay Group LLC", floors:5,
    image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop",
    status:"Active", statusTone:"green", statusNote:"Fully operational",
    occupancy:76, lastUpdated:"Jun 7, 2026",
    financials:{ revenue:33800, pending:2100, maintenance:3900, netIncome:27800,
      trend:[30,31,29,32,33,34], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","24/7 Security","Elevator","Laundry","Bike Storage"] },
    activity:[
      A("wallet","green","Rent payment received","Apartment 4 · $2,100 cleared","5h ago"),
      A("doc","muted","Inspection logged","Annual safety inspection passed","Jun 3"),
      A("user","teal","Tenant notice","Apartment 2 · 30-day move-out notice","Jun 2"),
    ],
    apartments:[
      { id:"otto-2", name:"Apartment 2", floor:"Ground floor", size:"610 sq ft", status:"Notice given", statusTone:"amber", rent:1950,
        financials:{ rent:1950, paid:1950, pending:0, utility:140, maintenance:70 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Private Bathroom","Internet"] },
        activity:[ A("user","amber","Move-out notice","30-day notice received","Jun 2") ],
        rooms:[
          room("otto-2-r1","Room 1","Studio-style","Occupied","amber",1950,"Felix Brenner", rfin(1950,1950,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("user","amber","Move-out notice","Vacating Jul 2","Jun 2")]),
        ] },
      { id:"otto-4", name:"Apartment 4", floor:"2nd floor", size:"780 sq ft", status:"Fully occupied", statusTone:"green", rent:2100,
        financials:{ rent:2100, paid:2100, pending:0, utility:160, maintenance:55 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Heating","Balcony","Private Bathroom","Internet","Washing Machine"] },
        activity:[ A("wallet","green","Rent payment received","$2,100 cleared","5h ago") ],
        rooms:[
          room("otto-4-r1","Room 1","Master · balcony","Occupied","green",1200,"Iris Kowalski", rfin(1200,1200,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("wallet","green","Payment received","June rent paid","5h ago")]),
          room("otto-4-r2","Room 2","Standard double","Occupied","green",900,"Marcus Bell", rfin(900,900,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Window","Fan","Internet"],
            [A("wallet","green","Payment received","June rent paid","5h ago")]),
        ] },
    ],
  },

  // ───────────────────────── PASTEL ─────────────────────────
  {
    id:"pastel", name:"Pastel House", location:"Coconut Grove · Miami", type:"Garden apartments",
    fullName:"Pastel House Garden Flats", address:"3400 Main Hwy, Coconut Grove, FL 33133", ownerLLC:"Grove Garden Estates LLC", floors:2,
    image:null,
    status:"Onboarding", statusTone:"teal", statusNote:"New to platform",
    occupancy:48, lastUpdated:"Jun 9, 2026",
    financials:{ revenue:21600, pending:1200, maintenance:2600, netIncome:17800,
      trend:[0,0,8,14,19,22], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["Parking","Laundry","Bike Storage","Co-work Lounge"] },
    activity:[
      A("layers","teal","Building onboarded","Pastel House added to platform","Jun 9"),
      A("doc","muted","Units listed","6 apartments published","Jun 9"),
      A("user","green","First tenant","Apartment B1 · lease signed","Jun 8"),
    ],
    apartments:[
      { id:"pastel-b1", name:"Apartment B1", floor:"Garden level", size:"700 sq ft", status:"Fully occupied", statusTone:"green", rent:2200,
        financials:{ rent:2200, paid:2200, pending:0, utility:150, maintenance:40 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Balcony","Private Bathroom","Internet","Washing Machine"] },
        activity:[ A("user","green","Lease signed","First tenant moved in","Jun 8") ],
        rooms:[
          room("pastel-b1-r1","Room 1","Master · garden","Occupied","green",1200,"Ana Beltran", rfin(1200,1200,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("user","green","Tenant check-in","Move-in completed","Jun 8")]),
          room("pastel-b1-r2","Room 2","Standard double","Occupied","green",1000,"Jonas Vik", rfin(1000,1000,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Window","Fan","Internet"],
            [A("user","green","Tenant check-in","Move-in completed","Jun 8")]),
        ] },
      { id:"pastel-b2", name:"Apartment B2", floor:"Garden level", size:"640 sq ft", status:"Vacant", statusTone:"terra", rent:2000,
        financials:{ rent:2000, paid:0, pending:0, utility:0, maintenance:30 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Private Bathroom","Internet"] },
        activity:[ A("doc","muted","Listing opened","Available from Jun 20","Jun 9") ],
        rooms:[
          room("pastel-b2-r1","Room 1","Master","Vacant","terra",1100,null, rfin(1100,0,0,0,"Vacant"),
            ["Bed","Wardrobe","Desk","Window","Air Conditioning","Internet"],
            [A("doc","muted","Listing opened","Available now","Jun 9")]),
          room("pastel-b2-r2","Room 2","Standard","Vacant","terra",900,null, rfin(900,0,0,0,"Vacant"),
            ["Bed","Wardrobe","Desk","Window","Fan"],
            [A("doc","muted","Listing opened","Available now","Jun 9")]),
        ] },
    ],
  },

  // ───────────────────────── OLIVE ─────────────────────────
  {
    id:"olive", name:"Olive House", location:"Little Havana · Miami", type:"Shared-living residence",
    fullName:"Olive House Commons", address:"1450 SW 8th St, Little Havana, FL 33135", ownerLLC:"Calle Ocho Residences LLC", floors:3,
    image:"https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=900&q=80&auto=format&fit=crop",
    status:"Maintenance", statusTone:"terra", statusNote:"Active repair work",
    occupancy:68, lastUpdated:"Jun 6, 2026",
    financials:{ revenue:28400, pending:4300, maintenance:9100, netIncome:15000,
      trend:[27,28,26,25,27,28], trendLabels:["Jan","Feb","Mar","Apr","May","Jun"] },
    amenities:{ catalog:"building", present:["24/7 Security","Laundry","Co-work Lounge","Bike Storage","Reception"] },
    activity:[
      A("tool","terra","Major maintenance","Roof waterproofing in progress","6h ago"),
      A("wallet","amber","Payments pending","2 rooms · $4,300 outstanding","Yesterday"),
      A("user","teal","Tenant relocated","Room moved during repairs","Jun 5"),
    ],
    apartments:[
      { id:"olive-1", name:"Apartment 1", floor:"1st floor", size:"900 sq ft", status:"Partially occupied", statusTone:"amber", rent:2600,
        financials:{ rent:2600, paid:1700, pending:900, utility:190, maintenance:420 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Private Bathroom","Internet","Washing Machine"] },
        activity:[ A("tool","terra","Repair in progress","Bathroom plumbing","6h ago") ],
        rooms:[
          room("olive-1-r1","Room 1","Master","Occupied","green",1000,"Rashid Karim", rfin(1000,1000,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Internet"],
            [A("wallet","green","Payment received","June rent paid","2 days ago")]),
          room("olive-1-r2","Room 2","Standard","Occupied","amber",800,"Elena Popov", rfin(800,700,100,0,"Partial"),
            ["Bed","Wardrobe","Desk","Window","Fan","Internet"],
            [A("wallet","amber","Partial payment","$100 remaining","Yesterday")]),
          room("olive-1-r3","Room 3","Standard","Vacant","terra",800,null, rfin(800,0,0,0,"Vacant"),
            ["Bed","Wardrobe","Desk","Window","Fan"],
            [A("tool","terra","Under repair","Plumbing work","6h ago")]),
        ] },
      { id:"olive-2", name:"Apartment 2", floor:"2nd floor", size:"850 sq ft", status:"Fully occupied", statusTone:"green", rent:2400,
        financials:{ rent:2400, paid:2400, pending:0, utility:175, maintenance:80 },
        amenities:{ catalog:"apartment", present:["Furnished","Kitchen","Air Conditioning","Private Bathroom","Internet"] },
        activity:[ A("wallet","green","Rent payment received","$2,400 cleared","Jun 4") ],
        rooms:[
          room("olive-2-r1","Room 1","Master","Occupied","green",1300,"Yara Nasser", rfin(1300,1300,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Chair","Attached Bathroom","Window","Air Conditioning","Internet"],
            [A("wallet","green","Payment received","June rent paid","Jun 4")]),
          room("olive-2-r2","Room 2","Standard double","Occupied","green",1100,"Pavel Novak", rfin(1100,1100,0,0,"Paid"),
            ["Bed","Wardrobe","Desk","Window","Fan","Internet"],
            [A("wallet","green","Payment received","June rent paid","Jun 4")]),
        ] },
    ],
  },
];

// ---- derived counts ----
BUILDINGS.forEach(b => {
  b.totalApartments = b.apartments.length;
  b.totalRooms = b.apartments.reduce((s,a)=>s + a.rooms.length, 0);
  b.amenitiesCount = b.amenities.present.length;
  b.monthlyRevenue = b.financials.revenue;
  b.apartments.forEach(a => {
    a.totalRooms = a.rooms.length;
    a.occupiedRooms = a.rooms.filter(r => r.status === "Occupied").length;
    a.amenitiesCount = a.amenities.present.length;
    a.parentBuilding = b.name;
    a.rooms.forEach(r => { r.amenitiesCount = r.amenities.present.length; r.parentApartment = a.name; r.parentBuilding = b.name; });
  });
});

Object.assign(window, { BUILDINGS, AMENITY_ICONS, AMENITY_CATALOG, money });
