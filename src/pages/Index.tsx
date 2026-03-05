import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingEmojis from "@/components/FloatingEmojis";
import { useApp } from "@/contexts/AppContext";
import { Search, Flame, Coffee, Soup, Refrigerator, ShoppingBag, ChefHat, Star } from "lucide-react";

const trendingIngredients = ["Ginger", "Coriander", "Chilies", "Paneer", "Potatoes"];

const categories = [
  {
    icon: <Flame className="w-8 h-8" />,
    title: "CHAAT CORNER",
    desc: "Tangy, crunchy, and utterly addictive street snacks",
    tags: ["🌶️ Medium", "🍋 Tangy"],
  },
  {
    icon: <Soup className="w-8 h-8" />,
    title: "CURRY HOUSE",
    desc: "Rich, aromatic curries that hug your soul",
    tags: ["🔥 Spicy", "🧈 Rich"],
  },
  {
    icon: <Coffee className="w-8 h-8" />,
    title: "TEA TIME",
    desc: "Perfect evening snacks with your masala chai",
    tags: ["☕ Light", "🍪 Crispy"],
  },
];

const steps = [
  {
    icon: <Refrigerator className="w-10 h-10 text-primary" />,
    step: "01",
    title: "ADD YOUR INGREDIENTS",
    desc: "Tell us what's sitting in your fridge and pantry. Even random leftovers count!",
  },
  {
    icon: <Search className="w-10 h-10 text-saffron" />,
    step: "02",
    title: "WE FIND THE RECIPES",
    desc: "Our smart engine matches thousands of Indian recipes to exactly what you have.",
  },
  {
    icon: <ChefHat className="w-10 h-10 text-accent" />,
    step: "03",
    title: "COOK & ENJOY",
    desc: "Follow the steps, cook up a storm, and save your favourites for next time.",
  },
];

const stats = [
  { number: "50,000+", label: "Recipes Available" },
  { number: "10,000+", label: "Happy Chefs" },
  { number: "500+", label: "Ingredients Tracked" },
  { number: "0", label: "Food Wasted" },
];

const testimonials = [
  {
    name: "Priya S.",
    location: "Mumbai",
    text: "I had random leftover vegetables and this app turned them into the most amazing sabzi! Never throwing anything away again.",
    rating: 5,
  },
  {
    name: "Rahul K.",
    location: "Bangalore",
    text: "The pantry feature is genius. It remembers my staples so I only have to enter the special ingredients. 10/10!",
    rating: 5,
  },
  {
    name: "Meera T.",
    location: "Delhi",
    text: "Found a Boiled Egg Curry recipe with only 3 ingredients I had at home. My family thought I'd ordered from a restaurant!",
    rating: 5,
  },
];

const Index = () => {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setSearchQuery, isLoggedIn } = useApp();

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

      {/* -------------------------------------------------------
          HERO SECTION
      ------------------------------------------------------- */}
      <section className="sunburst-bg relative overflow-hidden py-20 md:py-32 flex-shrink-0">
        <FloatingEmojis />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest">
            🌶️ INDIA'S SMARTEST RECIPE FINDER
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary mb-4 leading-tight">
            WHAT'S IN MY FRIDGE?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Turn your leftover veggies into delicious Indian street food chaats and curries. No waste. Just taste.
          </p>

          {/* Show search bar if logged in, otherwise show Get Started button */}
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button variant="hero" className="h-14 px-10 text-lg">
                  GET STARTED — IT'S FREE →
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="h-14 px-10 text-lg border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5">
                  LOG IN
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------
          STATS SECTION
      ------------------------------------------------------- */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="font-display text-4xl md:text-5xl text-primary-foreground">{stat.number}</p>
                <p className="text-primary-foreground/80 text-sm font-bold mt-1 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
          HOW IT WORKS SECTION
      ------------------------------------------------------- */}
      <section className="py-20 bg-background" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-3">HOW IT WORKS</h2>
            <p className="text-muted-foreground max-w-md mx-auto">From empty fridge to full plate in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-border z-0" />

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 text-center bg-card border-2 border-border rounded-2xl p-8 hover:-translate-y-1 transition-transform">
                <div className="w-20 h-20 rounded-full bg-background border-2 border-border flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="font-display text-5xl text-border mb-2">{step.step}</div>
                <h3 className="font-display text-xl text-primary mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {!isLoggedIn && (
            <div className="text-center mt-12">
              <Link to="/auth">
                <Button variant="hero" className="h-14 px-10">
                  START COOKING NOW →
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------
          CATEGORIES SECTION
      ------------------------------------------------------- */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-3">STREET FOOD CATEGORIES</h2>
            <p className="text-muted-foreground max-w-md mx-auto">From the streets of Mumbai to your kitchen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const colors = ["bg-primary", "bg-saffron", "bg-accent"];
              return (
                <div
                  key={i}
                  className={`${colors[i]} text-primary-foreground rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform shadow-lg cursor-pointer`}
                  onClick={() => isLoggedIn ? navigate("/results") : navigate("/auth")}
                >
                  <div className="flex justify-center mb-4">{cat.icon}</div>
                  <h3 className="font-display text-2xl mb-2">{cat.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{cat.desc}</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="bg-primary-foreground/20 text-xs font-bold px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
          TESTIMONIALS SECTION
      ------------------------------------------------------- */}
      <section className="py-20 bg-background" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-3">WHAT CHEFS ARE SAYING</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Real cooks. Real kitchens. Real delicious results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card border-2 border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-saffron text-saffron" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-display text-primary text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------
          FINAL CTA SECTION
      ------------------------------------------------------- */}
      {!isLoggedIn && (
        <section className="py-20 sunburst-bg relative overflow-hidden">
          <FloatingEmojis />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-display text-4xl md:text-6xl text-primary mb-4">
              READY TO COOK?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
              Join thousands of home chefs turning their fridges into feasts. Free forever.
            </p>
            <Link to="/auth">
              <Button variant="hero" className="h-14 px-12 text-lg">
                CREATE FREE ACCOUNT →
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------
          NEWSLETTER SECTION
      ------------------------------------------------------- */}
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