/**
 * Visitor-facing copy and practice identity.
 *
 * This is the single place to edit words. Pages and components should import
 * from `@/content` rather than inventing strings. Do not add lorem, SaaS
 * slogans, or contact details that have not been confirmed.
 *
 * Contact: city/country and the published mailbox/phone live here. A street
 * address is left blank on purpose — fill `site.address.line1` (or point it
 * at an env var) when the practice confirms one. Do not invent a Nairobi
 * street, a second phone, or a new email.
 */

export const site = {
  name: "Createch Architects",
  legalName: "Createch Architects Ltd",
  email: "anvi@createch.co.ke",
  phone: "+254 733 622 848",
  whatsapp: "254733622848",
  // TODO: set a confirmed street / building here (or via env) before printing
  // a postal address. City and country are enough until then.
  address: {
    line1: "",
    city: "Nairobi",
    country: "Kenya",
  },
  location: "Nairobi, Kenya",
  tagline: "Hospitality | Architecture | Interior Design",
  kicker: "Hospitality · Architecture · Interior Design",
  showTeam: false,
  socials: { instagram: "", linkedin: "" },
};

/** @deprecated Prefer `site`. Kept so older imports keep compiling. */
export const siteSettings = site;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
] as const;

export const metadataCopy = {
  title: site.name,
  description:
    "Createch Architects is a Nairobi practice designing hotels, restaurants and lifestyle destinations across Africa and India.",
  ogAlt:
    "Createch Architects — architecture for hospitality, from first line to final detail.",
};

export const heroCopy = {
  kicker: site.kicker,
  title: "The art of layouts, plans and spaces",
  strap: "Experts at putting your plan in motion.",
  lede: "Createch Architects is a Nairobi practice designing hotels, restaurants and lifestyle destinations across Africa and India.",
  cta: "View work",
  ctaHref: "#featured-work",
};
export type HeroCopy = typeof heroCopy;

/**
 * Lines already on createch.co.ke — kept, typeset as a studio statement
 * rather than a SaaS feature grid. Do not inflate them into marketing claims.
 */
export const principles = [
  { title: "Efficiency", body: "in space management" },
  { title: "Cognizant", body: "of mother nature" },
  { title: "Utilization", body: "of renewable energy" },
  { title: "Management", body: "of time, cost and resources" },
] as const;

export const presence = [
  { title: "Based in Kenya", body: "Serving Africa" },
  { title: "Procuring", body: "From the world" },
] as const;

export const homeCopy = {
  featured: { number: "02", label: "Selected Work" },
  studio: {
    number: "03",
    label: "Studio",
    headline:
      "We design for guest experience, operational efficiency and commercial performance.",
    lede: "Sixteen years across hotels, lodges, retail destinations and residences, from concept to handover.",
    disciplines: ["Hospitality", "Architecture", "Interior Design"] as const,
    aboutCta: "About the studio",
  },
  contact: {
    number: "04",
    label: "Contact",
    headline: "Tell us about your project.",
  },
};

export const founderCopy = {
  kicker: "Know the founder",
  name: "Anvi Shah",
  role: "Founder · Principal Architect",
  short:
    "Createch was founded by Anvi Shah, an architect and interior designer with over sixteen years across hospitality, retail, commercial and residential projects in Kenya, India, and East and West Africa — from concept development through technical detailing and consultant coordination to end-user experience.",
  caption: [
    { label: "Base", value: "Nairobi, Kenya" },
    { label: "Since", value: "16+ years" },
    { label: "Clients", value: "Grumeti · Village Market" },
  ],
  cta: "Read the full profile",
  portraitAlt: "Anvi Shah, founder and principal architect of Createch Architects.",
  portraitSrc: "/images/founder/Anvi_Shah_Profile.jpg",
};

export const studioCopy = {
  eyebrow: "The practice",
  title: "Design that has to work on opening night.",
  lede: "Createch Architects is a Nairobi-based practice for hospitality, food and beverage, lifestyle spaces and high-end residential design.",
  metaDescription:
    "Createch Architects is a Nairobi practice for hospitality, F&B, lifestyle and high-end residential design, founded by Anvi Shah after sixteen years across Kenya, India, East and West Africa.",
  approach: {
    number: "01",
    label: "Approach",
    headline: "Successful hospitality design goes beyond aesthetics.",
  },
  services: { number: "02", label: "Services", where: "Where the work has been" },
  founder: {
    number: "03",
    label: "Founder",
    name: "Anvi Shah",
    role: "Founder · Principal Architect",
    qualifications: "Qualifications & registrations",
    caption: [
      { label: "Base", value: "Nairobi, Kenya" },
      { label: "Practising", value: "16+ years" },
    ],
  },
  cta: {
    headline: "Tell us about your project.",
    link: "Start a conversation",
  },
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
  {
    title: "Architecture",
    description: "Concept to construction across hospitality, retail and residential.",
  },
  {
    title: "Interior Design",
    description: "Guest-experience-led interiors resolved to the minute detail.",
  },
  {
    title: "Landscape Integration",
    description: "Landscape as connective tissue between arrival, building and place.",
  },
  {
    title: "Concept-to-Handover Delivery",
    description: "Consultant coordination and site delivery from first line to handover.",
  },
];

export const workCopy = {
  eyebrow: "Selected Work",
  title: "Projects, across countries.",
  lede: "Hotels, lodges, restaurants, retail destinations, a children's hospital and private houses — from first concept to handover.",
  metaDescription:
    "Selected hospitality, retail, healthcare and residential projects by Createch Architects and by Anvi Shah with previous practices, across Kenya, Tanzania, Nigeria and India.",
  own: { number: "01", label: "Createch Architects" },
  earlier: {
    number: "02",
    label: "Earlier Work",
    lede: "Projects led or coordinated by Anvi Shah with previous practices, before founding Createch. Her role is named on every project.",
  },
  empty: {
    title: "Work will live here.",
    lede: "Case studies appear here as photography is cleared for the site. Nothing on this page is invented.",
  },
  placeholderLabel: "Example — not a Createch project",
  priorPractice:
    "Delivered by Anvi Shah as {role} with a previous practice, before founding Createch Architects.",
  next: "Next project",
};

export const contactCopy = {
  eyebrow: "Contact",
  title: "Tell us about your project.",
  lede: "Createch works from concept through technical detailing to handover, in Nairobi and across the region. New enquiries go straight to Anvi.",
  metaDescription:
    "Talk to Createch Architects about a hotel, restaurant, lodge, retail or residential project. Based in Nairobi, working across East and West Africa and India.",
  direct: { number: "01", label: "Direct" },
  brief: {
    number: "02",
    label: "Your brief",
    headline: "Four things that get you a useful first reply.",
    lede: "None of it has to be resolved. A sentence on each is enough to come back to you with something worth reading.",
  },
  prompts: [
    {
      label: "The project",
      body: "Type and scale — a hotel, a restaurant, a lodge, a retail floor, a house. Rooms, covers or square metres if you know them.",
    },
    {
      label: "The site",
      body: "Where it is, and whether it is greenfield, a conversion or a refurbishment of something operating.",
    },
    {
      label: "The stage",
      body: "Feasibility, concept, an existing scheme that needs resolving, or drawings ready for site.",
    },
    {
      label: "The dates",
      body: "When you need to be on site, and when the doors are meant to open.",
    },
  ],
  preferEmail: "Prefer email? Write to",
  preferEmailTail: "— it reaches the same inbox.",
  studioLabel: "Studio",
};

export const enquiryCopy = {
  projectTypes: [
    "Hotel or lodge",
    "Restaurant, bar or café",
    "Retail or mixed-use",
    "Private residence",
    "Workplace",
    "Something else",
  ],
  stages: [
    "Just an idea",
    "Feasibility",
    "Concept design",
    "An existing scheme that needs resolving",
    "Ready for site",
  ],
  sentTitle: "Thank you — that has reached Anvi.",
  sentBody:
    "You can expect a reply within two working days. If it is urgent, WhatsApp is faster:",
  unconfigured:
    "The form isn't connected to email yet, so this didn't send. Please write to us directly.",
  failed: "That didn't go through.",
  submit: "Send enquiry",
  pending: "Sending…",
  placeholders: {
    location: "Where it is",
    timeline: "On site by, open by",
    message: "A sentence or two is enough.",
    phone: "Optional",
  },
};

export const footerCopy = {
  start: "Start a project",
  work: "Work",
  studio: "Studio",
};

export const notFoundCopy = {
  eyebrow: "404",
  title: "That page isn't here.",
  lede: "The link may be old, or the address slightly off. The work is all still where it should be.",
  recent: "Recent projects",
};

export const errorCopy = {
  kicker: "Something went wrong",
  title: "This page didn't load properly.",
  lede: "Reloading usually fixes it. If it doesn't, we'd rather hear from you directly than have you leave.",
  retry: "Try again",
  home: "Back to the homepage",
};

export function streetAddress(s = site): string | undefined {
  const line = s.address.line1.trim();
  return line || undefined;
}

export function locationLabel(s = site): string {
  return [s.address.city, s.address.country].filter(Boolean).join(", ");
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function waHref(id: string): string {
  return `https://wa.me/${id}`;
}

export function mailtoHref(email: string, subject?: string): string {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
}
