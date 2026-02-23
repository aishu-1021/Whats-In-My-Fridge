import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingEmojis from "@/components/FloatingEmojis";
import { useApp } from "@/contexts/AppContext";
import { Search, Flame, Coffee, Soup } from "lucide-react";

const trendingIngredients = ["Ginger", "Coriander", "Chilies", "Paneer", "Potatoes"];

const categories = [
  { icon: <Flame className="w-8 h-8" />, title: "CHAAT CORNER", desc: "Tangy, crunchy, and utterly addictive street snacks", tags: ["🌶️ Medium", "🍋 Tangy"] },
  { icon: <Soup className="w-8 h-8" />, title: "CURRY HOUSE", desc: "Rich, aromatic curries that hug your soul", tags: ["🔥 Spicy", "🧈 Rich"] },
  { icon: <Coffee className="w-8 h-8" />, title: "TEA TIME", desc: "Perfect evening snacks with your masala chai", tags: ["☕ Light", "🍪 Crispy"] },
];

const Index = () => {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setSearchQuery } = useApp();

  const handleSearch = () => {
    if (input.trim()) {
      setSearchQuery(input.trim());
      navigate(`/results?q=${encodeURIComponent(input.trim())}`);
    }
  };

  const handleChipClick = (ingredient: string) => {
    const newInput = input ? `${input}, ${ingredient}` : ingredient;
    setInput(newInput);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="sunburst-bg relative overflow-hidden py-20 md:py-32 flex-shrink-0">
        <FloatingEmojis />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary mb-4 leading-tight">
            WHAT'S IN MY FRIDGE?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Turn your leftover veggies into delicious Indian street food chaats and curries.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter ingredients (e.g. paneer, potato)..."
                className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-border bg-card text-foreground font-body text-base focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <Button variant="hero" onClick={handleSearch} className="h-14 whitespace-nowrap">
              FIND RECIPES →
            </Button>
          </div>

          {/* Trending chips */}
          <div className="mt-6">
            <span className="font-bold text-sm tracking-widest text-muted-foreground uppercase">Trending Ingredients</span>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {trendingIngredients.map((ing) => (
                <button
                  key={ing}
                  onClick={() => handleChipClick(ing)}
                  className="bg-secondary text-secondary-foreground font-bold text-sm px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors"
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-primary text-center mb-10">STREET FOOD CATEGORIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const colors = ["bg-primary", "bg-saffron", "bg-accent"];
              return (
                <div key={i} className={`${colors[i]} text-primary-foreground rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform shadow-lg`}>
                  <div className="flex justify-center mb-4">{cat.icon}</div>
                  <h3 className="font-display text-2xl mb-2">{cat.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{cat.desc}</p>
                  <div className="flex justify-center gap-2">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="bg-primary-foreground/20 text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-navy text-navy-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">JOIN THE CLUB</h2>
          <p className="text-sm opacity-80 mb-8 max-w-md mx-auto">
            Get weekly recipes, spice tips, and food hacks delivered straight to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 h-12 px-5 rounded-full bg-navy-foreground/10 border border-navy-foreground/30 text-navy-foreground placeholder:text-navy-foreground/50 focus:outline-none focus:border-navy-foreground transition-colors"
            />
            <Button variant="hero" size="lg" onClick={() => setEmail("")}>
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
