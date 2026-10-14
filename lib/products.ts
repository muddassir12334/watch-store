// Seed catalogue. Placeholder data until the admin panel and database exist;
// every page reads products through the helpers at the bottom of this file,
// so swapping the source later does not touch the UI.

export type Movement = "Quartz" | "Automatic" | "Mechanical" | "Smart";
export type Gender = "Men" | "Women" | "Unisex";
export type DialColor = "Blue" | "Black" | "Brown" | "Green" | "Copper" | "Silver" | "White";

export type ProductPhoto = { src: string; width: number; height: number };

export type WatchLook = {
  face: "classic" | "chrono" | "skeleton" | "smart";
  caseColor: string;
  dial: string;
  dialGlow: string;
  strap: string;
  hands: string;
};

export type Variant = {
  sku: string;
  label: string;
  stock: number;
  look: WatchLook;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  salePrice?: number;
  isNew?: boolean;
  bestSeller?: boolean;
  movement: Movement;
  caseSize: number;
  caseMaterial: string;
  strapMaterial: string;
  dialColor: DialColor;
  waterResistance: string;
  gender: Gender;
  accent: string;
  image?: ProductPhoto;
  variants: Variant[];
};

export type Category = { slug: string; name: string; blurb: string };

export const categories: Category[] = [
  { slug: "luxury", name: "Luxury", blurb: "Open-worked dials and hand-finished cases" },
  { slug: "men", name: "Men", blurb: "Everyday chronographs and field watches" },
  { slug: "women", name: "Women", blurb: "Slim cases, quiet detail" },
  { slug: "smart", name: "Smart Watches", blurb: "Health, calls and a week of battery" },
  { slug: "sports", name: "Sports", blurb: "Built for water, trail and track" },
  { slug: "couple", name: "Couple Sets", blurb: "Two watches, one design" },
  { slug: "kids", name: "Kids", blurb: "Tough, bright and easy to read" },
  { slug: "accessories", name: "Accessories", blurb: "Straps, boxes and tools" },
];

export const dialSwatches: Record<DialColor, string> = {
  Blue: "#3f7fd0",
  Black: "#16181c",
  Brown: "#5a3b2a",
  Green: "#1f8f6c",
  Copper: "#c98a5e",
  Silver: "#aeb6bf",
  White: "#efece6",
};

const steel = "#c9ced6";
const roseGold = "#d9966c";
const gold = "#d8b46a";
const blackCase = "#2a2c31";

export const products: Product[] = [
  // Photographed stock. Names and specs are read from the photos; prices and
  // stock counts are placeholders until the owner confirms them.
  {
    slug: "patek-philippe-nautilus-chronograph",
    name: "Nautilus Chronograph",
    brand: "Patek Philippe",
    category: "luxury",
    description:
      "The porthole-shaped Nautilus case with a horizontally embossed blue dial, a single chronograph counter at six o'clock and a date at three.",
    price: 950000,
    isNew: true,
    movement: "Automatic",
    caseSize: 40,
    caseMaterial: "Polished and brushed metal",
    strapMaterial: "Fabric",
    dialColor: "Blue",
    waterResistance: "120 m",
    gender: "Men",
    accent: "#3b6fb5",
    image: { src: "/watches/nautilus-chronograph.jpg", width: 764, height: 261 },
    variants: [
      {
        sku: "PP-NAUT-CH-BL",
        label: "Blue dial",
        stock: 1,
        look: { face: "chrono", caseColor: steel, dial: "#1f3f73", dialGlow: "#4d7fc4", strap: "#3a567a", hands: "#f2f6ff" },
      },
    ],
  },
  {
    slug: "a-lange-sohne-perpetual-calendar-lumen",
    name: "Perpetual Calendar Lumen",
    brand: "A. Lange & Söhne",
    category: "luxury",
    description:
      "A smoked, semi-transparent dial that glows green in the dark, with an outsize date, a month ring around the dial edge and a moon-phase display, on a black alligator-grain strap.",
    price: 1250000,
    movement: "Automatic",
    caseSize: 42,
    caseMaterial: "Polished metal",
    strapMaterial: "Leather",
    dialColor: "Black",
    waterResistance: "30 m",
    gender: "Men",
    accent: "#3f9a5a",
    image: { src: "/watches/lange-perpetual-lumen.jpg", width: 556, height: 551 },
    variants: [
      {
        sku: "ALS-PC-LUM",
        label: "Smoked dial / Black leather",
        stock: 1,
        look: { face: "classic", caseColor: steel, dial: "#0f1512", dialGlow: "#3f9a5a", strap: "#121315", hands: "#b9f5c8" },
      },
    ],
  },
  {
    slug: "patek-philippe-aquanaut-travel-time",
    name: "Aquanaut Travel Time",
    brand: "Patek Philippe",
    category: "luxury",
    description:
      "A rose-gold Aquanaut with the embossed chequered dial, a second time zone with local and home day/night indicators, a date sub-dial at six and a matching brown rubber strap.",
    price: 890000,
    bestSeller: true,
    movement: "Automatic",
    caseSize: 41,
    caseMaterial: "Rose gold tone",
    strapMaterial: "Rubber",
    dialColor: "Brown",
    waterResistance: "120 m",
    gender: "Men",
    accent: "#b98566",
    image: { src: "/watches/aquanaut-travel-time.jpg", width: 340, height: 438 },
    variants: [
      {
        sku: "PP-AQUA-TT-RG",
        label: "Rose gold / Brown rubber",
        stock: 1,
        look: { face: "classic", caseColor: roseGold, dial: "#2a1c15", dialGlow: "#6b4a38", strap: "#2e211b", hands: "#f5ece4" },
      },
    ],
  },
  {
    slug: "audemars-piguet-royal-oak-chronograph",
    name: "Royal Oak Chronograph",
    brand: "Audemars Piguet",
    category: "luxury",
    description:
      "The octagonal bezel with eight exposed screws, a blue tapisserie dial with three chronograph counters and an integrated bracelet in a dark brushed finish.",
    price: 980000,
    movement: "Automatic",
    caseSize: 41,
    caseMaterial: "Dark brushed metal",
    strapMaterial: "Metal bracelet",
    dialColor: "Blue",
    waterResistance: "50 m",
    gender: "Men",
    accent: "#5d7fb8",
    image: { src: "/watches/royal-oak-chronograph.jpg", width: 351, height: 438 },
    variants: [
      {
        sku: "AP-RO-CH-BL",
        label: "Blue dial / Bracelet",
        stock: 1,
        look: { face: "chrono", caseColor: "#4a4f58", dial: "#6f8fc0", dialGlow: "#a9c1e6", strap: "#3c4047", hands: "#f2f6ff" },
      },
    ],
  },
  {
    slug: "steel-dive-watch-black",
    name: "Steel Dive Watch",
    brand: "Arzoo",
    category: "sports",
    description:
      "A classic steel diver: black dial with large luminous numerals, an orange minute hand, a date at three, a rotating timing bezel and a beads-of-rice bracelet.",
    price: 85000,
    isNew: true,
    movement: "Automatic",
    caseSize: 40,
    caseMaterial: "Stainless steel",
    strapMaterial: "Stainless steel",
    dialColor: "Black",
    waterResistance: "200 m",
    gender: "Men",
    accent: "#8e9aa6",
    image: { src: "/watches/steel-diver.jpg", width: 547, height: 365 },
    variants: [
      {
        sku: "AZ-DIVE-BKST",
        label: "Black dial / Steel bracelet",
        stock: 2,
        look: { face: "classic", caseColor: steel, dial: "#0e0f11", dialGlow: "#2c2f35", strap: "#aab1ba", hands: "#f1ead2" },
      },
    ],
  },
  {
    slug: "meridian-open-heart-azure",
    name: "Open Heart Azure",
    brand: "Meridian",
    category: "luxury",
    description:
      "A hand-guilloché dial in two tones of blue opens at six o'clock to show the balance at work. The onion crown and coin-edge bezel are cut from a single block of steel, and the alligator-grain strap is stitched in matching navy.",
    price: 189000,
    isNew: true,
    movement: "Automatic",
    caseSize: 42,
    caseMaterial: "Stainless steel",
    strapMaterial: "Leather",
    dialColor: "Blue",
    waterResistance: "50 m",
    gender: "Men",
    accent: "#1f7fd6",
    variants: [
      {
        sku: "MR-3123-AZBL",
        label: "Azure / Navy leather",
        stock: 3,
        look: { face: "skeleton", caseColor: steel, dial: "#143f8f", dialGlow: "#19b7a4", strap: "#14213f", hands: "#eef4ff" },
      },
      {
        sku: "MR-3123-AZOR",
        label: "Azure / Tan leather",
        stock: 2,
        look: { face: "skeleton", caseColor: steel, dial: "#143f8f", dialGlow: "#e0763a", strap: "#b5562a", hands: "#eef4ff" },
      },
    ],
  },
  {
    slug: "meridian-skeleton-copper",
    name: "Skeleton Copper",
    brand: "Meridian",
    category: "luxury",
    description:
      "The movement is the dial. Bridges are cut away until only the structure remains, framed by a fluted rose-gold bezel on a blackened case. A textile-inlay rubber strap keeps it light on the wrist.",
    price: 164500,
    bestSeller: true,
    movement: "Mechanical",
    caseSize: 43,
    caseMaterial: "DLC steel, rose-gold bezel",
    strapMaterial: "Rubber",
    dialColor: "Black",
    waterResistance: "50 m",
    gender: "Men",
    accent: "#c98a5e",
    variants: [
      {
        sku: "MR-3715-RGBK",
        label: "Rose gold / Black",
        stock: 5,
        look: { face: "skeleton", caseColor: roseGold, dial: "#101114", dialGlow: "#5a4636", strap: "#17181b", hands: "#f0b891" },
      },
      {
        sku: "MR-3715-BKBK",
        label: "All black",
        stock: 4,
        look: { face: "skeleton", caseColor: blackCase, dial: "#0d0e10", dialGlow: "#3a3d44", strap: "#141518", hands: "#d7dbe0" },
      },
      {
        sku: "MR-3715-BLBK",
        label: "Electric blue / Black",
        stock: 0,
        look: { face: "skeleton", caseColor: "#1f5fd0", dial: "#0d0e10", dialGlow: "#1d4fae", strap: "#141518", hands: "#9cc2ff" },
      },
    ],
  },
  {
    slug: "meridian-regulator-jupiter",
    name: "Regulator Jupiter",
    brand: "Meridian",
    category: "luxury",
    description:
      "Hours, minutes and seconds each get their own register on a dial textured like weathered copper. Limited production, numbered on the case back.",
    price: 142000,
    movement: "Automatic",
    caseSize: 44,
    caseMaterial: "Rose-gold PVD steel",
    strapMaterial: "Leather",
    dialColor: "Copper",
    waterResistance: "100 m",
    gender: "Men",
    accent: "#b9783f",
    variants: [
      {
        sku: "MR-9341-CUBK",
        label: "Rose gold / Black leather",
        stock: 6,
        look: { face: "chrono", caseColor: roseGold, dial: "#b8733a", dialGlow: "#e9a45f", strap: "#15161a", hands: "#fff3e4" },
      },
      {
        sku: "MR-9343-CUBK",
        label: "Steel / Black leather",
        stock: 6,
        look: { face: "chrono", caseColor: steel, dial: "#b8733a", dialGlow: "#e9a45f", strap: "#15161a", hands: "#fff3e4" },
      },
    ],
  },
  {
    slug: "arzoo-regent-chrono-steel",
    name: "Regent Chrono Steel",
    brand: "Arzoo",
    category: "men",
    description:
      "A three-register chronograph with a sunray silver dial and a solid-link bracelet look. Sized to slip under a cuff and sturdy enough for every day.",
    price: 24500,
    salePrice: 19900,
    bestSeller: true,
    movement: "Quartz",
    caseSize: 41,
    caseMaterial: "Stainless steel",
    strapMaterial: "Stainless steel",
    dialColor: "Silver",
    waterResistance: "50 m",
    gender: "Men",
    accent: "#8fa0b3",
    variants: [
      {
        sku: "AZ-4101-SLST",
        label: "Silver dial / Steel",
        stock: 18,
        look: { face: "chrono", caseColor: steel, dial: "#b9c0c9", dialGlow: "#eef1f5", strap: "#9aa2ad", hands: "#1b2433" },
      },
      {
        sku: "AZ-4101-BLST",
        label: "Blue dial / Steel",
        stock: 9,
        look: { face: "chrono", caseColor: steel, dial: "#173b78", dialGlow: "#3f7fd0", strap: "#9aa2ad", hands: "#f2f6ff" },
      },
    ],
  },
  {
    slug: "arzoo-regent-chrono-midnight",
    name: "Regent Chrono Midnight",
    brand: "Arzoo",
    category: "men",
    description:
      "The Regent in full black: matte case, black dial, and red chronograph seconds for a single point of colour.",
    price: 26000,
    isNew: true,
    movement: "Quartz",
    caseSize: 41,
    caseMaterial: "Black PVD steel",
    strapMaterial: "Leather",
    dialColor: "Black",
    waterResistance: "50 m",
    gender: "Men",
    accent: "#6b7280",
    variants: [
      {
        sku: "AZ-4102-BKBK",
        label: "Black / Black leather",
        stock: 12,
        look: { face: "chrono", caseColor: blackCase, dial: "#111215", dialGlow: "#33363d", strap: "#131417", hands: "#e7e9ec" },
      },
    ],
  },
  {
    slug: "kestrel-field-40",
    name: "Field 40",
    brand: "Kestrel",
    category: "men",
    description:
      "A clean field watch with oversized numerals, a date at three and a canvas strap that only gets better with wear.",
    price: 14900,
    movement: "Quartz",
    caseSize: 40,
    caseMaterial: "Brushed steel",
    strapMaterial: "Canvas",
    dialColor: "Green",
    waterResistance: "100 m",
    gender: "Unisex",
    accent: "#4f8a5b",
    variants: [
      {
        sku: "KS-4001-GRKH",
        label: "Olive dial / Khaki canvas",
        stock: 22,
        look: { face: "classic", caseColor: steel, dial: "#27452f", dialGlow: "#4f8a5b", strap: "#6c6447", hands: "#f3efe2" },
      },
      {
        sku: "KS-4001-BKBK",
        label: "Black dial / Black canvas",
        stock: 15,
        look: { face: "classic", caseColor: steel, dial: "#121316", dialGlow: "#34373d", strap: "#1b1c1f", hands: "#f3efe2" },
      },
    ],
  },
  {
    slug: "arzoo-luna-rose",
    name: "Luna Rose",
    brand: "Arzoo",
    category: "women",
    description:
      "A 34 mm case in warm rose gold with a mother-of-pearl-toned dial and slim baton markers. Light, quiet and easy to dress up.",
    price: 17500,
    bestSeller: true,
    movement: "Quartz",
    caseSize: 34,
    caseMaterial: "Rose-gold PVD steel",
    strapMaterial: "Leather",
    dialColor: "White",
    waterResistance: "30 m",
    gender: "Women",
    accent: "#d99a8b",
    variants: [
      {
        sku: "AZ-3401-WHRS",
        label: "Pearl dial / Blush leather",
        stock: 14,
        look: { face: "classic", caseColor: roseGold, dial: "#ece6dc", dialGlow: "#ffffff", strap: "#c79a8e", hands: "#8a5a45" },
      },
      {
        sku: "AZ-3401-WHBK",
        label: "Pearl dial / Black leather",
        stock: 7,
        look: { face: "classic", caseColor: roseGold, dial: "#ece6dc", dialGlow: "#ffffff", strap: "#17181b", hands: "#8a5a45" },
      },
    ],
  },
  {
    slug: "arzoo-luna-noir",
    name: "Luna Noir",
    brand: "Arzoo",
    category: "women",
    description:
      "The Luna with a deep black dial and gold case. Minimal markers, a domed crystal, and a strap that tapers to the buckle.",
    price: 16900,
    salePrice: 13900,
    movement: "Quartz",
    caseSize: 34,
    caseMaterial: "Gold PVD steel",
    strapMaterial: "Leather",
    dialColor: "Black",
    waterResistance: "30 m",
    gender: "Women",
    accent: "#c9a45a",
    variants: [
      {
        sku: "AZ-3402-BKGD",
        label: "Black dial / Black leather",
        stock: 10,
        look: { face: "classic", caseColor: gold, dial: "#101114", dialGlow: "#3b3323", strap: "#15161a", hands: "#e9c986" },
      },
    ],
  },
  {
    slug: "volt-pulse-2",
    name: "Pulse 2",
    brand: "Volt",
    category: "smart",
    description:
      "A bright AMOLED display, Bluetooth calling, heart-rate and sleep tracking, and up to seven days between charges. Works with Android and iPhone.",
    price: 21999,
    isNew: true,
    movement: "Smart",
    caseSize: 44,
    caseMaterial: "Aluminium",
    strapMaterial: "Silicone",
    dialColor: "Black",
    waterResistance: "IP68",
    gender: "Unisex",
    accent: "#5b8cff",
    variants: [
      {
        sku: "VT-P2-44-BK",
        label: "Graphite / Black band",
        stock: 30,
        look: { face: "smart", caseColor: blackCase, dial: "#07080b", dialGlow: "#5b8cff", strap: "#17181c", hands: "#ffffff" },
      },
      {
        sku: "VT-P2-44-SL",
        label: "Silver / Blue band",
        stock: 16,
        look: { face: "smart", caseColor: steel, dial: "#07080b", dialGlow: "#38bdf8", strap: "#27447a", hands: "#ffffff" },
      },
    ],
  },
  {
    slug: "volt-pulse-mini",
    name: "Pulse Mini",
    brand: "Volt",
    category: "smart",
    description:
      "Everything in the Pulse 2 in a smaller 40 mm case, with cycle tracking and a softer woven-feel band.",
    price: 18499,
    movement: "Smart",
    caseSize: 40,
    caseMaterial: "Aluminium",
    strapMaterial: "Silicone",
    dialColor: "Black",
    waterResistance: "IP68",
    gender: "Women",
    accent: "#e08aa0",
    variants: [
      {
        sku: "VT-PM-40-RS",
        label: "Rose / Blush band",
        stock: 20,
        look: { face: "smart", caseColor: roseGold, dial: "#07080b", dialGlow: "#f08aa8", strap: "#d5a39b", hands: "#ffffff" },
      },
    ],
  },
  {
    slug: "kestrel-diver-200",
    name: "Diver 200",
    brand: "Kestrel",
    category: "sports",
    description:
      "A 200 m automatic diver with a sea-green dial, luminous markers and a screw-down crown, on a vented rubber strap.",
    price: 58000,
    bestSeller: true,
    movement: "Automatic",
    caseSize: 44,
    caseMaterial: "Stainless steel",
    strapMaterial: "Rubber",
    dialColor: "Green",
    waterResistance: "200 m",
    gender: "Men",
    accent: "#1fa37c",
    variants: [
      {
        sku: "KS-D200-GRBK",
        label: "Sea green / Black rubber",
        stock: 8,
        look: { face: "classic", caseColor: steel, dial: "#0f5a47", dialGlow: "#27c79a", strap: "#14161a", hands: "#f4fff9" },
      },
      {
        sku: "KS-D200-BLBL",
        label: "Deep blue / Blue rubber",
        stock: 5,
        look: { face: "classic", caseColor: steel, dial: "#12357a", dialGlow: "#3f8be0", strap: "#16284f", hands: "#f4fff9" },
      },
    ],
  },
  {
    slug: "kestrel-trail-chrono",
    name: "Trail Chrono",
    brand: "Kestrel",
    category: "sports",
    description:
      "A lightweight chronograph for the outdoors: tachymeter scale, blue dial and a bright orange strap you can find at the bottom of a pack.",
    price: 32000,
    movement: "Quartz",
    caseSize: 43,
    caseMaterial: "Stainless steel",
    strapMaterial: "Leather",
    dialColor: "Blue",
    waterResistance: "100 m",
    gender: "Men",
    accent: "#e2703a",
    variants: [
      {
        sku: "KS-T430-BLOR",
        label: "Blue dial / Orange leather",
        stock: 11,
        look: { face: "chrono", caseColor: steel, dial: "#15418f", dialGlow: "#e2703a", strap: "#c8562a", hands: "#ffffff" },
      },
    ],
  },
  {
    slug: "arzoo-duo-classic",
    name: "Duo Classic Set",
    brand: "Arzoo",
    category: "couple",
    description:
      "Two matching watches in one box, 40 mm and 34 mm, with cream dials and gold cases. A wedding and anniversary favourite.",
    price: 29900,
    movement: "Quartz",
    caseSize: 40,
    caseMaterial: "Gold PVD steel",
    strapMaterial: "Leather",
    dialColor: "White",
    waterResistance: "30 m",
    gender: "Unisex",
    accent: "#c9a45a",
    variants: [
      {
        sku: "AZ-DUO-WHBR",
        label: "Cream dial / Brown leather",
        stock: 9,
        look: { face: "classic", caseColor: gold, dial: "#efe9dc", dialGlow: "#ffffff", strap: "#5a3a26", hands: "#3b2a1c" },
      },
    ],
  },
];

export const featuredSlugs = [
  "patek-philippe-nautilus-chronograph",
  "a-lange-sohne-perpetual-calendar-lumen",
  "meridian-open-heart-azure",
  "meridian-skeleton-copper",
  "kestrel-diver-200",
  "volt-pulse-2",
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function findVariant(sku: string) {
  for (const product of products) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return undefined;
}

export function totalStock(product: Product) {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function currentPrice(product: Product) {
  return product.salePrice ?? product.price;
}

export type Badge = { label: string; tone: "accent" | "muted" };

export function badgeFor(product: Product): Badge | undefined {
  const stock = totalStock(product);
  if (stock === 0) return { label: "Out of stock", tone: "muted" };
  if (product.salePrice) return { label: "Sale", tone: "accent" };
  if (product.isNew) return { label: "New", tone: "accent" };
  if (product.bestSeller) return { label: "Best seller", tone: "accent" };
  if (stock <= 5) return { label: `Only ${stock} left`, tone: "muted" };
  return undefined;
}
