import { mutation } from "./_generated/server";

const initialProducts = [
  {
    name: "Luminous Silk Foundation",
    image: "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Advanced Night Repair Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Olaplex No. 7 Bonding Oil",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Baccarat Rouge 540",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Rose Quartz Facial Roller",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Matte Revolution Lipstick",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "C-Firma Fresh Day Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Moroccanoil Treatment",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Black Opium Eau de Parfum",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Pro-Glow Foundation Brush",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Radiant Creamy Concealer",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Protini Polypeptide Cream",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Perfect hair Day Dry Shampoo",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Gypsy Water Eau de Parfum",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "NuFACE Trinity Facial Toning Device",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Better Than Sex Volumizing Mascara",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Watermelon Glow Niacinamide Dew Drops",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Color Wow Dream Coat Supernatural Spray",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Santal 33 Eau de Parfum",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Tweezerman Slant Tweezer",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop",
  }
];

export default mutation({
  args: {},
  handler: async (ctx) => {
    let count = 0;
    for (const update of initialProducts) {
      const existing = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("name"), update.name))
        .first();
      
      if (existing) {
        await ctx.db.patch(existing._id, { image: update.image });
        count++;
      }
    }
    return `Updated ${count} product images.`;
  },
});
