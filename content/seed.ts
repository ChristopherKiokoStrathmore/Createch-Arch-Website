// content/seed.ts — Build prompt §4. Single source of truth for content.
// Imported by scripts/import-content.mjs (Phase 4) into Sanity, and used
// directly by pages until CMS wiring lands.
//
// Gallery `file` values are paths under assets-web/ (see scripts/prepare-images.mjs).
// Attribution integrity (§0): only Networks Padel Village is underCreatech.

export type Sector =
  | "hospitality"
  | "retail-mixed-use"
  | "healthcare"
  | "residential"
  | "workplace"
  | "fnb-interiors";

export type GalleryImage = {
  file: string; // path under assets-web/, shaped {slug}/{name}.jpg
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  featured: boolean;
  order: number;
  sector: Sector;
  location: string;
  country: string;
  areaSqm?: number;
  teamSize?: number;
  year?: number;
  role: string;
  underCreatech: boolean;
  brief: string;
  constraint?: string;
  move?: string;
  outcome?: string;
  accolade?: string;
  seoDescription: string;
  heroImage?: string; // path under assets-web/ — set for legacy after curation
  gallery: GalleryImage[];
};

export const SECTOR_LABELS: Record<Sector, string> = {
  hospitality: "Hospitality",
  "retail-mixed-use": "Retail & Mixed-Use",
  healthcare: "Healthcare",
  residential: "Residential",
  workplace: "Workplace",
  "fnb-interiors": "F&B Interiors",
};

export const siteSettings = {
  email: "anvi@createch.co.ke",
  phone: "+254 733 622 848",
  whatsapp: "254733622848",
  location: "Nairobi, Kenya",
  tagline: "Hospitality | Architecture | Interior Design",
  showTeam: false,
  socials: { instagram: "", linkedin: "" },
};

export const studioPhilosophy =
  "Createch Architects is a Nairobi-based design practice specializing in architecture and interior design for hospitality, food and beverage, lifestyle spaces and high-end residential projects. We believe successful hospitality design goes beyond aesthetics: it shapes guest experience, operational efficiency, brand identity and commercial performance. Our approach is rooted in contextual sensitivity, functionality and storytelling. From concept development through technical detailing and project coordination, we work closely with clients and consultants to deliver design aligned with operational and business objectives, with careful attention to detail, scale, lighting, circulation and user experience.";

export const anviBio =
  "Createch was founded by Anvi Shah, an architect and interior designer with over sixteen years of experience across hospitality, retail, commercial, residential and mixed-use projects in Kenya, India, East and West Africa. Her background includes leading hospitality and lifestyle projects for clients such as Grumeti Reserves, Tanzania and Village Market, Kenya, with earlier roles at Les Harbottle Designs, Symbion Kenya, Somaya & Kalappa Consultants and Phoenix Marketcity. She brings expertise in concept development, spatial planning, technical detailing, consultant coordination and end-user experience, ensuring each project is thoughtfully designed, operationally efficient and brand-aligned.";

export const anviCredentials = [
  "B.Arch, Sir J.J. College of Architecture, Mumbai",
  "MSc Environmental Design of Buildings, Cardiff University",
  "BORAQS-certified Architect, Kenya",
  "Registered Architect, Council of Architecture, India",
  "EDGE Expert, IFC World Bank Group",
];

export const services = [
  { title: "Architecture", description: "Concept to construction across hospitality, retail and residential." },
  { title: "Interior Design", description: "Guest-experience-led interiors resolved to the minute detail." },
  { title: "Landscape Integration", description: "Landscape as connective tissue between arrival, building and place." },
  { title: "Concept-to-Handover Delivery", description: "Consultant coordination and site delivery from first line to handover." },
];

export const projects: Project[] = [
  {
    slug: "networks-padel-village",
    title: "Networks Padel Village & Vamos Restaurant",
    featured: true,
    order: 1,
    sector: "hospitality",
    location: "Nairobi",
    country: "Kenya",
    areaSqm: 3400,
    teamSize: 3,
    role: "Lead Architect & Interior Designer",
    underCreatech: true,
    brief:
      "A greenfield sports and social destination: padel courts with change facilities, a restaurant and bar (Vamos), and a social lounge, bound together by landscape.",
    constraint:
      "The site had to serve two speeds at once, competitive sport and slow social life, without either diluting the other.",
    move:
      "Landscape was treated as the connective tissue, sequencing arrival, courts, lounge and dining as one continuous social terrain; the restaurant opens outward to the courts so spectating becomes the atmosphere.",
    outcome:
      "Delivered from inception to handover as the practice's flagship: a complete sport, food and beverage destination now operating in Nairobi.",
    seoDescription:
      "Networks Padel Village and Vamos Restaurant, Nairobi — a greenfield sport and social destination by Createch Architects, delivered from inception to handover.",
    heroImage: "networks-padel-village/CED_3747.jpg",
    gallery: [
      { file: "networks-padel-village/CED_3790.jpg", alt: "The social lounge under a patterned hexagonal canopy, opening to the pool." },
      { file: "networks-padel-village/CED_3743.jpg", alt: "Detail of a padel court net against the blue playing surface." },
      { file: "networks-padel-village/CED_3729_1.jpg", alt: "A padel court beneath the steel-framed roof, spectator seating alongside." },
      { file: "networks-padel-village/CED_3769.jpg", alt: "Tiered spectator seating in bright blue and red beside the courts." },
      { file: "networks-padel-village/CED_3749.jpg", alt: "Vamos restaurant terrace with umbrellas and the pool beyond." },
      { file: "networks-padel-village/CED_3764.jpg", alt: "Shaded dining terrace threaded with planting and paving." },
      { file: "networks-padel-village/CED_3752.jpg", alt: "Landscaped social terrain linking dining, play and the courts." },
      { file: "networks-padel-village/CED_3786.jpg", alt: "Lounge seating with timber screens and hanging greenery." },
      { file: "networks-padel-village/CED_3784.jpg", alt: "A floral mural running along the covered walkway." },
      { file: "networks-padel-village/CED_3775.jpg", alt: "A topiary padel player set into the entrance wall." },
      { file: "networks-padel-village/CED_3760.jpg", alt: "Outdoor training equipment on turf beside the courts." },
      { file: "networks-padel-village/CED_3735.jpg", alt: "Two padel courts seen end-on under the continuous roof." },
      { file: "networks-padel-village/CED_3800.jpg", alt: "Change-room lockers finished for daily match use." },
    ],
  },
  {
    slug: "le-meridien-zanzibar",
    title: "Le Méridien, Bwejuu",
    featured: false,
    order: 2,
    sector: "hospitality",
    location: "Bwejuu, Zanzibar",
    country: "Tanzania",
    areaSqm: 10000,
    teamSize: 2,
    role: "Project Lead",
    underCreatech: false,
    brief:
      "A new-build 75-key beach resort with extensive pool, gym, spa, specialty restaurants and landscaped grounds on Bwejuu's coast.",
    constraint:
      "Coordinating consultants across Nairobi and Tanzania while designing room types that feel distinct rather than repeated.",
    move:
      "A family of unique room experiences, each detailed individually, with the guest journey and hotel operations resolved in parallel with the client's operations team.",
    outcome:
      "Led from concept through construction documentation with ongoing site supervision and coordination.",
    seoDescription:
      "Le Méridien Bwejuu, Zanzibar — a 75-key beach resort led from concept to construction documentation.",
    heroImage: "le-meridien-zanzibar/Le_Meridien_Concept_Restaurant_01.jpg",
    gallery: [
      { file: "le-meridien-zanzibar/Le_Meridien_Concept_Restaurant_01.jpg", alt: "Concept render of the Le Méridien specialty restaurant opening to the coast." },
      { file: "le-meridien-zanzibar/Le_Meridien_Concept_Restaurant_03.jpg", alt: "Restaurant concept with layered timber ceiling and sea views." },
      { file: "le-meridien-zanzibar/Le_Meridien_Concept_Restaurant_02.jpg", alt: "Dining terrace concept for the beach resort." },
      { file: "le-meridien-zanzibar/Le_Meridien_Concept_Villa_01.jpg", alt: "Guest villa concept, one of a family of distinct room types." },
      { file: "le-meridien-zanzibar/Le_Meridien_Concept_Villa_02.jpg", alt: "Villa interior concept with private outdoor space." },
      { file: "le-meridien-zanzibar/Le_Meridien_Concept_Villa_04.jpg", alt: "Villa concept detailing the guest bathroom and threshold to the garden." },
    ],
  },
  {
    slug: "radisson-collection-abuja",
    title: "Radisson Collection Hotel",
    featured: false,
    order: 3,
    sector: "hospitality",
    location: "Abuja",
    country: "Nigeria",
    areaSqm: 55000,
    teamSize: 2,
    role: "Project Lead",
    underCreatech: false,
    brief:
      "A 259-key flagship hotel: pools, gym, spa, night club, conference facilities, specialty restaurants and landscaped areas.",
    constraint:
      "A brand-standard tower at 55,000 m² that still reads as a place, not a product, with consultants split between Nigeria and South Africa.",
    move:
      "The elevations were developed as the project's identity, unique elevational features and details carried through the whole building, with design coordination led from Nairobi.",
    outcome:
      "Concept to construction documentation as project lead; design coordination meetings, operations liaison and site coordination ongoing.",
    seoDescription:
      "Radisson Collection Hotel, Abuja — a 259-key flagship whose elevations carry its identity, led from concept to construction documentation.",
    heroImage: "radisson-collection-abuja/Radisson_Abuja_Concept_03.jpg",
    gallery: [
      { file: "radisson-collection-abuja/Radisson_Abuja_Concept_03.jpg", alt: "Concept elevation of the Radisson Collection flagship tower, Abuja." },
      { file: "radisson-collection-abuja/Radisson_Abuja_Concept_02.jpg", alt: "Concept render of the hotel podium and entrance." },
      { file: "radisson-collection-abuja/Radisson_Abuja_Concept_01.jpg", alt: "Early concept study of the tower massing." },
      { file: "radisson-collection-abuja/Radisson_Abuja_01.jpg", alt: "Exterior view of the Radisson Collection, Abuja." },
      { file: "radisson-collection-abuja/Radisson_Abuja_02.jpg", alt: "Elevational detail carried through the building." },
      { file: "radisson-collection-abuja/Radisson_Abuja_03.jpg", alt: "Landscaped approach to the flagship hotel." },
    ],
  },
  {
    slug: "tribe-hotel-nairobi",
    title: "Tribe Boutique Hotel, Refurbishment",
    featured: false,
    order: 4,
    sector: "hospitality",
    location: "Nairobi",
    country: "Kenya",
    areaSqm: 8800,
    teamSize: 2,
    role: "Project Lead & Interior Architect",
    underCreatech: false,
    brief:
      "Full refurbishment of an operating boutique hotel: 137 rooms, gym and spa, restaurant and pool areas.",
    constraint:
      "An existing, aging structure and a live hotel, every detail resolved against what was already built, with procurement and client changes in motion.",
    move:
      "Interior architecture led at the level of the minute detail: construction details resolved on site, specialists coordinated, hotel operations kept running through delivery.",
    outcome:
      "Full project cycle from design to handover of a renewed Tribe.",
    seoDescription:
      "Tribe Boutique Hotel, Nairobi — a full refurbishment of a live 137-room hotel, delivered from design to handover.",
    heroImage: "tribe-hotel-nairobi/Tribe_Public_Areas_02.jpg",
    gallery: [
      { file: "tribe-hotel-nairobi/Tribe_Public_Areas_02.jpg", alt: "Refurbished public area at Tribe Boutique Hotel." },
      { file: "tribe-hotel-nairobi/Tribe_Hotel_Rooms_01.jpg", alt: "Guest room after refurbishment." },
      { file: "tribe-hotel-nairobi/Tribe_Hotel_Rooms_03.jpg", alt: "Refurbished guest room with bespoke joinery." },
      { file: "tribe-hotel-nairobi/Tribe_Hotel_Rooms_04.jpg", alt: "Suite interior at the renewed Tribe." },
      { file: "tribe-hotel-nairobi/Tribe_Jiko_Pool_04.jpg", alt: "Jiko restaurant and pool area." },
      { file: "tribe-hotel-nairobi/Tribe_Jiko_Pool_02.jpg", alt: "Poolside dining at Tribe." },
      { file: "tribe-hotel-nairobi/Tribe_Public_Areas_01.jpg", alt: "Double-height public space at Tribe Boutique Hotel." },
    ],
  },
  {
    slug: "kwetu-hilton-curio",
    title: "Kwetu, Hilton Curio Collection",
    featured: false,
    order: 5,
    sector: "hospitality",
    location: "Peponi Road, Nairobi",
    country: "Kenya",
    teamSize: 2,
    role: "Senior Architect",
    underCreatech: false,
    brief:
      "A new 125-key hotel with pool, gym, spa, conference facilities and restaurants.",
    constraint:
      "Effectively a retrofit of a new building: main structures were already built under a previous architect, the use case changed mid-stream from serviced residences to a 5-star-plus boutique hotel, on a heavily contoured site.",
    move:
      "Redesign within the built frame: new requirements absorbed without disturbing completed structure, with consultants coordinated across UAE, India and South Africa and details resolved through live site surveys.",
    outcome:
      "Design, production and execution through construction, changes incorporated while building continued.",
    seoDescription:
      "Kwetu, Hilton Curio Collection, Nairobi — a 125-key hotel redesigned within an existing built frame.",
    heroImage: "kwetu-hilton-curio/Kwetu_Concept_Pool_03.jpg",
    gallery: [
      { file: "kwetu-hilton-curio/Kwetu_Concept_Pool_03.jpg", alt: "Concept render of the Kwetu pool terrace on its contoured site." },
      { file: "kwetu-hilton-curio/Kwetu_Concept_Pool_01.jpg", alt: "Pool and deck concept for the Hilton Curio hotel." },
      { file: "kwetu-hilton-curio/Kwetu_Concept_Pool_02.jpg", alt: "Landscaped pool concept stepping with the terrain." },
      { file: "kwetu-hilton-curio/Kwetu_Concept_Pool_04.jpg", alt: "Evening view of the pool concept." },
      { file: "kwetu-hilton-curio/Kwetu_Concept_Rooms_03.jpg", alt: "Guest room concept for the boutique hotel." },
      { file: "kwetu-hilton-curio/Kwetu_Concept_Rooms_04.jpg", alt: "Room interior concept with balcony." },
    ],
  },
  {
    slug: "village-market-trademark",
    title: "Village Market Extension & Trademark Hotel",
    featured: false,
    order: 6,
    sector: "retail-mixed-use",
    location: "Nairobi",
    country: "Kenya",
    areaSqm: 86000,
    teamSize: 3,
    role: "Project Lead & Senior Architect",
    underCreatech: false,
    brief:
      "Extension of one of Nairobi's landmark shopping destinations: new mall, conference and meeting facilities, restaurants, and the 215-key Trademark Hotel, linked to the existing centre.",
    constraint:
      "Blending old and new architecture into one continuous destination while the existing mall traded on.",
    move:
      "The new build was threaded into the old through courtyards and internal streets; consultants, suppliers and tenants coordinated across the full 86,000 m².",
    outcome:
      "Full cycle from design to handover. Recognized with a token of appreciation from the client at the opening ceremony.",
    accolade: "Token of appreciation from the client at the opening ceremony.",
    seoDescription:
      "Village Market Extension & Trademark Hotel, Nairobi — an 86,000 m² retail and hospitality destination threaded into a landmark trading centre.",
    heroImage: "village-market-trademark/Village_Market_Ext_Courtyard_03.jpg",
    gallery: [
      { file: "village-market-trademark/Village_Market_Ext_Courtyard_03.jpg", alt: "External courtyard linking the Village Market extension to the existing centre." },
      { file: "village-market-trademark/Village_Market_Ext_Courtyard_04.jpg", alt: "Courtyard and internal street of the extended destination." },
      { file: "village-market-trademark/Village_Market_Ext_Courtyard_01.jpg", alt: "Landscaped courtyard at Village Market." },
      { file: "village-market-trademark/Village_Market_Ext_Courtyard_05.jpg", alt: "Arrival courtyard blending old and new architecture." },
      { file: "village-market-trademark/Village_Market_Internal_02.jpg", alt: "Internal mall street of the extension." },
      { file: "village-market-trademark/Village_Market_Internal_04.jpg", alt: "Retail concourse within the Village Market extension." },
      { file: "village-market-trademark/Village_Market_Internal2_02.jpg", alt: "Interior atrium of the extended shopping destination." },
      { file: "village-market-trademark/Village_Market_Internal_03.jpg", alt: "Vertical circulation and daylight within the mall." },
    ],
  },
  {
    slug: "kilima-lodge-serengeti",
    title: "Kilima Lodge, Private House",
    featured: false,
    order: 7,
    sector: "residential",
    location: "Grumeti Reserves, Serengeti",
    country: "Tanzania",
    areaSqm: 1700,
    teamSize: 3,
    role: "Project Architect",
    underCreatech: false,
    brief:
      "A high-end private lodge on the Serengeti: five en-suite bedroom wings, main house, VIP suite, guest lodges, sala, infinity pool and spa deck overlooking the plains.",
    constraint:
      "A concept authored by US architects, delivered across ten time zones: project management in the UK and Australia, engineers in Italy and Nairobi, interiors in Cape Town, specialist fabricators in the UK, site in Tanzania.",
    move:
      "Carried the project from design development to completion as the coordinating architect, aligning global consultants and craft specialists (copper roofing, fireplaces, bespoke glazing) drawing by drawing.",
    outcome:
      "Completed private lodge; letter of appreciation from the developer.",
    accolade: "Letter of appreciation from the developer for effort and dedication to the project.",
    seoDescription:
      "Kilima Lodge, Grumeti Reserves, Serengeti — a private lodge coordinated across ten time zones from design development to completion.",
    heroImage: "kilima-lodge-serengeti/Kilima_Green_Roofs_01.jpg",
    gallery: [
      { file: "kilima-lodge-serengeti/Kilima_Green_Roofs_01.jpg", alt: "Green roofs of Kilima Lodge settling into the Serengeti plains." },
      { file: "kilima-lodge-serengeti/Kilima_Vip_Suite_01.jpg", alt: "VIP suite overlooking the plains." },
      { file: "kilima-lodge-serengeti/Kilima_Vip_Suite_02.jpg", alt: "Interior of the VIP suite with bespoke joinery." },
      { file: "kilima-lodge-serengeti/Kilima_Vip_Suite_03.jpg", alt: "Bedroom wing with views over the reserve." },
      { file: "kilima-lodge-serengeti/Kilima_Photos_Elevation_04.jpg", alt: "Elevation of a bedroom wing under a copper roof." },
      { file: "kilima-lodge-serengeti/Kilima_Green_Roofs_03.jpg", alt: "Roofscape blending the lodge into the landscape." },
    ],
  },
  {
    slug: "aga-khan-childrens-hospital",
    title: "Aga Khan Children's Specialty Hospital",
    featured: false,
    order: 8,
    sector: "healthcare",
    location: "Nairobi",
    country: "Kenya",
    areaSqm: 7500,
    teamSize: 3,
    role: "Senior Architect",
    underCreatech: false,
    brief:
      "Vertical extension of an operational children's hospital from ground storey to G+4: clinics, consultation rooms, wards and staff facilities, to international standards using American fire and hospital-design codes.",
    constraint:
      "Building upward over a live children's hospital, on a limited budget, with users across Nairobi, Karachi and Uganda.",
    move:
      "Interiors built on the African Tinga Tinga tales, animal characters carried through wards and a mixed-media exterior mural in the Tinga Tinga palette, turning code-driven healthcare space into a children's world.",
    outcome:
      "Scheme design to detail design under international health facility guidelines.",
    seoDescription:
      "Aga Khan Children's Specialty Hospital, Nairobi — a G+4 vertical extension turning code-driven healthcare space into a children's world through Tinga Tinga interiors.",
    heroImage: "aga-khan-childrens-hospital/Aga_Khan_Concept_01.jpg",
    gallery: [
      { file: "aga-khan-childrens-hospital/Aga_Khan_Concept_01.jpg", alt: "Concept render of the children's hospital with a Tinga Tinga exterior mural." },
      { file: "aga-khan-childrens-hospital/Aga_Khan_Concept_02.jpg", alt: "Ward concept carrying animal characters from the Tinga Tinga tales." },
      { file: "aga-khan-childrens-hospital/Aga_Khan_Concept_03.jpg", alt: "Consultation area concept in the Tinga Tinga palette." },
      { file: "aga-khan-childrens-hospital/Aga_Khan_Concept_04.jpg", alt: "Interior concept for the paediatric wards." },
      { file: "aga-khan-childrens-hospital/Aga_Khan_Floor_Plan_01.jpg", alt: "Floor plan of the vertical hospital extension.", caption: "Plan of the G+4 extension." },
    ],
  },
  {
    slug: "orion-park-mumbai",
    title: "Orion Park Office Building, Phoenix Marketcity",
    featured: false,
    order: 9,
    sector: "workplace",
    location: "Mumbai",
    country: "India",
    role: "Architect",
    underCreatech: false,
    brief:
      "Office development within the Phoenix Marketcity estate.",
    seoDescription:
      "Orion Park Office Building, Phoenix Marketcity, Mumbai — an office development by the practice.",
    heroImage: "orion-park-mumbai/Orion_Park_Mumbai_02.jpg",
    gallery: [
      { file: "orion-park-mumbai/Orion_Park_Mumbai_02.jpg", alt: "Elevation of the Orion Park office building at Phoenix Marketcity." },
      { file: "orion-park-mumbai/Orion_Park_Mumbai_04.jpg", alt: "View of the office development within the estate." },
      { file: "orion-park-mumbai/Orion_Park_Mumbai_03.jpg", alt: "Facade study for Orion Park." },
    ],
  },
  {
    slug: "club-mahindra-theog",
    title: "Club Mahindra Holiday Resort",
    featured: false,
    order: 10,
    sector: "hospitality",
    location: "Theog, Himachal Pradesh",
    country: "India",
    role: "Architect",
    underCreatech: false,
    brief:
      "Himalayan holiday resort for Club Mahindra at Theog.",
    seoDescription:
      "Club Mahindra Holiday Resort, Theog, Himachal Pradesh — a Himalayan holiday resort.",
    heroImage: "club-mahindra-theog/Club_Mahindra_Himachal_07.jpg",
    gallery: [
      { file: "club-mahindra-theog/Club_Mahindra_Himachal_07.jpg", alt: "The Club Mahindra resort stepping down the Himalayan hillside at Theog." },
      { file: "club-mahindra-theog/Club_Mahindra_Himachal_03.jpg", alt: "Resort blocks set into the mountain slope." },
      { file: "club-mahindra-theog/Club_Mahindra_Himachal_04.jpg", alt: "Elevation of the holiday resort against the hills." },
      { file: "club-mahindra-theog/Club_Mahindra_Himachal_05.jpg", alt: "View across the resort terraces." },
    ],
  },
  {
    slug: "indian-restaurant-mumbai",
    title: "Indian Restaurant, Interiors",
    featured: false,
    order: 11,
    sector: "fnb-interiors",
    location: "Mumbai",
    country: "India",
    role: "Interior Designer",
    underCreatech: false,
    brief:
      "A fine-dining interior built around India's national flower, the lotus.",
    constraint:
      "Privacy for diners without sealing the room away from the street.",
    move:
      "Laser-cut lotus-petal screen walls give privacy while offering passers-by a glimpse; Jaisalmer stone with brass inlay, backlit gold-painted laser-cut panels continuing across the ceiling, and Sanskrit verses cut into red panels running wall to ceiling.",
    outcome:
      "A rooted, rustic-material fine-dining room where craft carries the brand.",
    seoDescription:
      "Indian Restaurant interiors, Mumbai — a fine-dining room built around the lotus, in Jaisalmer stone, brass and laser-cut screens.",
    heroImage: "indian-restaurant-mumbai/Indian_Restaurant_Mumbai_01.jpg",
    gallery: [
      { file: "indian-restaurant-mumbai/Indian_Restaurant_Mumbai_01.jpg", alt: "Laser-cut lotus-petal screen and Jaisalmer stone in the fine-dining room." },
      { file: "indian-restaurant-mumbai/Indian_Restaurant_Mumbai_02.jpg", alt: "Backlit gold laser-cut ceiling panels and Sanskrit verses on red." },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
