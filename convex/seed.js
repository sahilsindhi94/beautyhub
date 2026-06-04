import { mutation } from "./_generated/server";

const initialProducts = [
  {
    name: "Luminous Silk Foundation",
    brand: "Armani Beauty",
    category: "Makeup",
    description: "An award-winning, oil-free foundation that delivers buildable, medium coverage and a luminous, glowy-skin finish for a natural makeup look.",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop",
    price: 4500,
    oldPrice: 5200,
    rating: 4.8,
    stock: 50,
    featured: true
  },
  {
    name: "Advanced Night Repair Serum",
    brand: "Estée Lauder",
    category: "Skincare",
    description: "A deep- and fast-penetrating face serum with hyaluronic acid that reduces the look of multiple signs of aging.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    price: 8500,
    oldPrice: 9000,
    rating: 4.9,
    stock: 120,
    featured: true
  },
  {
    name: "Olaplex No. 7 Bonding Oil",
    brand: "Olaplex",
    category: "Haircare",
    description: "A highly concentrated, weightless styling oil that repairs damaged and compromised hair.",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
    price: 2800,
    rating: 4.7,
    stock: 200,
    featured: true
  },
  {
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    category: "Fragrance",
    description: "A luminous and sophisticated fragrance that lays on the skin like an amber floral and woody breeze.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
    price: 24000,
    rating: 5.0,
    stock: 15,
    featured: true
  },
  {
    name: "Rose Quartz Facial Roller",
    brand: "Herbivore",
    category: "Beauty Tools",
    description: "A facial rolling tool designed to massage the face and help with the absorption of your favorite skincare products.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
    price: 1800,
    oldPrice: 2200,
    rating: 4.5,
    stock: 80,
    featured: false
  },
  {
    name: "Matte Revolution Lipstick",
    brand: "Charlotte Tilbury",
    category: "Makeup",
    description: "A matte lipstick that features a long-lasting, buildable, and hydrating formula.",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
    price: 3200,
    rating: 4.6,
    stock: 150,
    featured: false
  },
  {
    name: "C-Firma Fresh Day Serum",
    brand: "Drunk Elephant",
    category: "Skincare",
    description: "A super-potent vitamin C day serum packed with a powerful antioxidant complex.",
    image: "https://images.unsplash.com/photo-1615397323758-c0b9687eeb8f?q=80&w=600&auto=format&fit=crop",
    price: 6800,
    oldPrice: 7500,
    rating: 4.4,
    stock: 90,
    featured: false
  },
  {
    name: "Moroccanoil Treatment",
    brand: "Moroccanoil",
    category: "Haircare",
    description: "A versatile, argan oil-infused hair treatment and styler that promotes softer, stronger hair with increased shine.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
    price: 3600,
    rating: 4.8,
    stock: 110,
    featured: false
  },
  {
    name: "Black Opium Eau de Parfum",
    brand: "Yves Saint Laurent",
    category: "Fragrance",
    description: "A captivating floral gourmand scent, twisted with an overdose of black coffee.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
    price: 9500,
    oldPrice: 10500,
    rating: 4.7,
    stock: 45,
    featured: true
  },
  {
    name: "Pro-Glow Foundation Brush",
    brand: "Sephora Collection",
    category: "Beauty Tools",
    description: "A brush that provides a smooth, flawless finish and is perfect for applying liquid and cream foundations.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    price: 1500,
    rating: 4.3,
    stock: 200,
    featured: false
  },
  {
    name: "Radiant Creamy Concealer",
    brand: "NARS",
    category: "Makeup",
    description: "An award-winning concealer that provides medium-to-buildable coverage and a natural, radiant finish.",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop",
    price: 2700,
    rating: 4.8,
    stock: 130,
    featured: false
  },
  {
    name: "Protini Polypeptide Cream",
    brand: "Drunk Elephant",
    category: "Skincare",
    description: "A protein moisturizer that combines an array of signal peptides to improve the look of skin's tone, texture, and firmness.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    price: 5800,
    rating: 4.6,
    stock: 85,
    featured: true
  },
  {
    name: "Perfect hair Day Dry Shampoo",
    brand: "Living Proof",
    category: "Haircare",
    description: "A dry shampoo that actually cleans hair, eliminating oil, sweat, and odor.",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
    price: 2400,
    oldPrice: 2800,
    rating: 4.5,
    stock: 160,
    featured: false
  },
  {
    name: "Gypsy Water Eau de Parfum",
    brand: "Byredo",
    category: "Fragrance",
    description: "A woody aromatic fragrance for women and men. An ode to the beauty of Romani culture.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
    price: 18500,
    rating: 4.9,
    stock: 25,
    featured: true
  },
  {
    name: "NuFACE Trinity Facial Toning Device",
    brand: "NuFACE",
    category: "Beauty Tools",
    description: "An award-winning, multi-solution, skin-care device designed with interchangeable treatment attachments.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
    price: 28000,
    oldPrice: 32000,
    rating: 4.7,
    stock: 10,
    featured: true
  },
  {
    name: "Better Than Sex Volumizing Mascara",
    brand: "Too Faced",
    category: "Makeup",
    description: "An intensely black, volumizing mascara for the sexiest, most defined lashes possible.",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
    price: 2200,
    rating: 4.4,
    stock: 180,
    featured: false
  },
  {
    name: "Watermelon Glow Niacinamide Dew Drops",
    brand: "Glow Recipe",
    category: "Skincare",
    description: "A breakthrough, multi-use highlighting serum that hydrates and visibly reduces the look of hyperpigmentation for a dewy, reflective glow.",
    image: "https://images.unsplash.com/photo-1615397323758-c0b9687eeb8f?q=80&w=600&auto=format&fit=crop",
    price: 3200,
    rating: 4.8,
    stock: 140,
    featured: true
  },
  {
    name: "Color Wow Dream Coat Supernatural Spray",
    brand: "Color Wow",
    category: "Haircare",
    description: "An anti-frizz spray that keeps hair frizz-free for days, no matter the weather.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
    price: 2600,
    rating: 4.6,
    stock: 100,
    featured: false
  },
  {
    name: "Santal 33 Eau de Parfum",
    brand: "Le Labo",
    category: "Fragrance",
    description: "A unisex fragrance that captures a defining image of the spirit of the American West.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
    price: 22000,
    oldPrice: 24000,
    rating: 4.8,
    stock: 30,
    featured: false
  },
  {
    name: "Tweezerman Slant Tweezer",
    brand: "Tweezerman",
    category: "Beauty Tools",
    description: "Professional quality, 25-degree slanted tip is the perfect angle for working against the brow bone.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
    price: 1800,
    rating: 4.9,
    stock: 250,
    featured: false
  }
];

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // Only insert if empty
    const existing = await ctx.db.query("products").first();
    if (existing) {
      return "Products already seeded.";
    }
    
    for (const product of initialProducts) {
      await ctx.db.insert("products", product);
    }
    
    return `Seeded ${initialProducts.length} products successfully.`;
  },
});
