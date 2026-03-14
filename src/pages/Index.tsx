import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";
import {
  Search, Flame, Coffee, Soup,
  Refrigerator, ChefHat, Star, ArrowRight,
  ChevronLeft, ChevronRight
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const trendingIngredients = ["Ginger", "Coriander", "Chilies", "Paneer", "Potatoes"];

const categories = [
  {
    icon: <Flame className="w-8 h-8" />,
    title: "CHAAT CORNER",
    desc: "Tangy, crunchy, and utterly addictive street snacks",
    tags: ["Medium", "Tangy"],
    query: "chaat, aloo tikki, pani puri, bhel puri, samosa",
  },
  {
    icon: <Soup className="w-8 h-8" />,
    title: "CURRY HOUSE",
    desc: "Rich, aromatic curries that hug your soul",
    tags: ["Spicy", "Rich"],
    query: "curry, masala, dal, paneer, chicken curry",
  },
  {
    icon: <Coffee className="w-8 h-8" />,
    title: "TEA TIME",
    desc: "Perfect evening snacks with your masala chai",
    tags: ["Light", "Crispy"],
    query: "pakora, biscuit, sandwich, upma, poha",
  },
];

const steps = [
  {
    icon: <Refrigerator className="w-10 h-10" style={{ color: "hsl(var(--primary))" }} />,
    step: "01",
    title: "ADD YOUR INGREDIENTS",
    desc: "Tell us what's sitting in your fridge and pantry. Even random leftovers count!",
    accent: "hsl(var(--primary))",
    lightBg: "hsl(var(--primary) / 0.08)",
  },
  {
    icon: <Search className="w-10 h-10" style={{ color: "#E6960C" }} />,
    step: "02",
    title: "WE FIND THE RECIPES",
    desc: "Our smart engine matches thousands of Indian recipes to exactly what you have.",
    accent: "#E6960C",
    lightBg: "rgba(230,150,12,0.08)",
  },
  {
    icon: <ChefHat className="w-10 h-10" style={{ color: "#2E7D32" }} />,
    step: "03",
    title: "COOK & ENJOY",
    desc: "Follow the steps, cook up a storm, and save your favourites for next time.",
    accent: "#2E7D32",
    lightBg: "rgba(46,125,50,0.08)",
  },
];

const stats = [
  { target: 50000, suffix: "+", label: "Recipes Available" },
  { target: 10000, suffix: "+", label: "Happy Chefs" },
  { target: 500,   suffix: "+", label: "Ingredients Tracked" },
  { target: 0,     suffix: "",  label: "Food Wasted" },
];

// ── Extended testimonials (more cards = better carousel feel) ──────────────
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
  {
    name: "Arjun P.",
    location: "Chennai",
    text: "As a hostel student with barely anything in the kitchen, this app is a lifesaver. Made dosa with just rice flour and curd!",
    rating: 5,
  },
  {
    name: "Sneha R.",
    location: "Pune",
    text: "My kids are picky eaters but every recipe this app suggested was a hit. The spice level filter is brilliant.",
    rating: 5,
  },
];

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered || target === 0) { setCount(target); return; }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return count;
}

function StatCounter({ target, suffix, label, triggered, delay }: {
  target: number; suffix: string; label: string; triggered: boolean; delay: number;
}) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!triggered) return;
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [triggered, delay]);
  const count = useCountUp(target, 1800, active);
  const formatted = target >= 1000
    ? `${Math.floor(count / 1000)}k${suffix}`
    : `${count}${suffix}`;
  return (
    <div style={{ textAlign: "center" }}>
      <p className="font-display text-primary-foreground"
        style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1 }}>
        {formatted}
      </p>
      <p className="text-primary-foreground/75 font-bold tracking-wide"
        style={{ fontSize: 13, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
    </div>
  );
}

// ─── useInView hook ───────────────────────────────────────────────────────────

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Testimonial Carousel ─────────────────────────────────────────────────────

function TestimonialCarousel() {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = testimonials.length;

  const goTo = (idx: number, dir: "left" | "right") => {
    setAnimDir(dir);
    setActive((idx + total) % total);
  };

  const prev = () => goTo(active - 1, "left");
  const next = () => goTo(active + 1, "right");

  // Auto-advance every 3.5 s, pause on hover
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => goTo(active + 1, "right"), 3500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused]);

  // Visible indices: prev, active, next (3-up on desktop)
  const indices = [
    (active - 1 + total) % total,
    active,
    (active + 1) % total,
  ];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {indices.map((idx, pos) => {
          const t = testimonials[idx];
          const isCenter = pos === 1;
          return (
            <div
              key={`${idx}-${pos}`}
              className="testi-card bg-card border-2 border-border rounded-2xl p-6"
              style={{
                transition: "opacity 0.4s ease, transform 0.4s ease",
                opacity:   isCenter ? 1 : 0.55,
                transform: isCenter ? "scale(1.03)" : "scale(0.97)",
                boxShadow: isCenter ? "0 8px 32px rgba(0,0,0,0.10)" : "none",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-saffron text-saffron" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
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
          );
        })}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-5">

        {/* Prev button */}
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            width: 38, height: 38, borderRadius: "50%",
            border: "2px solid #E0D6C2",
            background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary))";
            (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary) / 0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E0D6C2";
            (e.currentTarget as HTMLButtonElement).style.background = "white";
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} style={{ color: "hsl(var(--primary))" }} />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? "right" : "left")}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width:  i === active ? 22 : 8,
                height: 8,
                borderRadius: 99,
                border: "none",
                background: i === active
                  ? "hsl(var(--primary))"
                  : "hsl(var(--primary) / 0.25)",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={next}
          aria-label="Next"
          style={{
            width: 38, height: 38, borderRadius: "50%",
            border: "2px solid #E0D6C2",
            background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary))";
            (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary) / 0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E0D6C2";
            (e.currentTarget as HTMLButtonElement).style.background = "white";
          }}
        >
          <ChevronRight size={16} strokeWidth={2.5} style={{ color: "hsl(var(--primary))" }} />
        </button>
      </div>

      {/* Pause indicator */}
      {paused && (
        <p className="text-center text-xs text-muted-foreground mt-3 tracking-wide">
          Paused
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Index = () => {
  const [input,   setInput]   = useState("");
  const [email,   setEmail]   = useState("");
  const [subDone, setSubDone] = useState(false);
  const navigate = useNavigate();
  const { setSearchQuery, isLoggedIn } = useApp();

  const { ref: statsRef, visible: statsVisible } = useInView(0.3);
  const { ref: stepsRef, visible: stepsVisible } = useInView(0.15);

  const handleSearch = () => {
    if (input.trim()) {
      setSearchQuery(input.trim());
      navigate(`/results?q=${encodeURIComponent(input.trim())}`);
    }
  };
  const handleChipClick = (ingredient: string) => {
    setInput((prev) => prev ? `${prev}, ${ingredient}` : ingredient);
  };
  const handleSubscribe = () => {
    if (email.trim()) { setSubDone(true); setEmail(""); }
  };

  return (
    <>
      <style>{`
        @keyframes statFadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .stat-cell { animation: statFadeUp 0.5s ease both; }

        @keyframes stepReveal {
          from { opacity:0; transform:translateY(28px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .step-card-hidden  { opacity: 0; }
        .step-card-visible { animation: stepReveal 0.55s cubic-bezier(0.34,1.26,0.64,1) both; }

        .step-card {
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
        }
        .step-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,0,0,0.10); }
        .step-card:hover .step-number { opacity: 1; }
        .step-number { transition: opacity 0.2s ease; opacity: 0.2; }
        .step-icon-wrap { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
        .step-card:hover .step-icon-wrap { transform: scale(1.1); }

        .cat-card {
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
        }
        .cat-card:hover { transform: translateY(-7px) scale(1.01); box-shadow: 0 16px 40px rgba(0,0,0,0.15); }

        .testi-card {
          transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
        }
        .testi-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.10); }

        .hero-input:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
        }
        .trend-chip { transition: background 0.15s, transform 0.15s, color 0.15s; }
        .trend-chip:hover { background: hsl(var(--primary)); color: white; transform: translateY(-2px); }

        @keyframes checkPop {
          from { transform:scale(0.5); opacity:0; }
          to   { transform:scale(1);   opacity:1; }
        }
        .sub-success { animation: checkPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* ── HERO ── */}
        <section className="sunburst-bg relative overflow-hidden py-20 md:py-32 flex-shrink-0">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest">
              INDIA'S SMARTEST RECIPE FINDER
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary mb-4 leading-tight">
              WHAT'S IN MY FRIDGE?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
              Turn your leftover ingredients into delicious Indian street food. No waste. Just taste.
            </p>
            {isLoggedIn ? (
              <>
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text" value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Enter ingredients (e.g. paneer, potato)..."
                      className="hero-input w-full h-14 pl-12 pr-4 rounded-full border-2 border-border bg-card text-foreground font-body text-base focus:outline-none transition-all"
                    />
                  </div>
                  <Button variant="hero" onClick={handleSearch} className="h-14 whitespace-nowrap">
                    FIND RECIPES →
                  </Button>
                </div>
                <div className="mt-6">
                  <span className="font-bold text-xs tracking-widest text-muted-foreground uppercase">
                    Trending Ingredients
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {trendingIngredients.map((ing) => (
                      <button key={ing} onClick={() => handleChipClick(ing)}
                        className="trend-chip bg-secondary text-secondary-foreground font-bold text-sm px-4 py-2 rounded-full">
                        {ing}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/auth">
                  <Button variant="hero" className="h-14 px-10 text-lg">GET STARTED — IT'S FREE →</Button>
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

        {/* ── STATS ── */}
        <section ref={statsRef as React.RefObject<HTMLElement>} className="bg-primary py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {stats.map((stat, i) => (
                <div key={i} className="relative">
                  {i > 0 && (
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2"
                      style={{ width: 1, height: 48, background: "rgba(255,255,255,0.18)" }} />
                  )}
                  <div className="stat-cell" style={{ animationDelay: `${i * 0.12}s` }}>
                    <StatCounter target={stat.target} suffix={stat.suffix} label={stat.label}
                      triggered={statsVisible} delay={i * 150} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          ref={stepsRef as React.RefObject<HTMLElement>}
          className="py-24 bg-background" id="how-it-works"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">
                Simple Process
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-primary mb-3">HOW IT WORKS</h2>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                From empty fridge to full plate in 3 simple steps.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-stretch gap-0">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center flex-1 min-w-0">
                  <div
                    className={`step-card step-card-${stepsVisible ? "visible" : "hidden"} relative flex-1 bg-card border-2 border-border rounded-2xl p-8 overflow-hidden`}
                    style={{ animationDelay: `${i * 0.14}s` }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: step.accent, borderRadius: "14px 14px 0 0" }} />
                    <div className="step-number font-display absolute top-4 right-5 text-6xl select-none pointer-events-none" style={{ color: step.accent, lineHeight: 1 }}>
                      {step.step}
                    </div>
                    <div className="step-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: step.lightBg }}>
                      {step.icon}
                    </div>
                    <h3 className="font-display text-lg mb-3" style={{ color: step.accent }}>{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex items-center justify-center flex-shrink-0 px-3">
                      <ArrowRight size={22} strokeWidth={1.5} style={{ color: step.accent, opacity: 0.4 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!isLoggedIn && (
              <div className="text-center mt-12">
                <Link to="/auth">
                  <Button variant="hero" className="h-14 px-10">START COOKING NOW →</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
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
                  <div key={i}
                    className={`cat-card ${colors[i]} text-primary-foreground rounded-2xl p-8 text-center shadow-lg cursor-pointer`}
                    onClick={() => {
                      if (!isLoggedIn) { navigate("/auth"); return; }
                      setSearchQuery(cat.query);
                      navigate(`/results?q=${encodeURIComponent(cat.query)}`);
                    }}
                  >
                    <div className="flex justify-center mb-4">{cat.icon}</div>
                    <h3 className="font-display text-2xl mb-2">{cat.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{cat.desc}</p>
                    <div className="flex justify-center gap-2 flex-wrap">
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

        {/* ── TESTIMONIALS — auto-scroll carousel ── */}
        {/* CHANGE: Replaced static 3-column grid with TestimonialCarousel component.
            Auto-advances every 3.5s, pauses on hover, has prev/next buttons and dot indicators. */}
        <section className="py-20 bg-background" id="testimonials">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl md:text-5xl text-primary mb-3">WHAT CHEFS ARE SAYING</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Real cooks. Real kitchens. Real delicious results.</p>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        {!isLoggedIn && (
          <section className="py-20 sunburst-bg relative overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="font-display text-4xl md:text-6xl text-primary mb-4">READY TO COOK?</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                Join thousands of home chefs turning their fridges into feasts. Free forever.
              </p>
              <Link to="/auth">
                <Button variant="hero" className="h-14 px-12 text-lg">CREATE FREE ACCOUNT →</Button>
              </Link>
            </div>
          </section>
        )}

        {/* ── NEWSLETTER ── */}
        <section className="bg-navy text-navy-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-3">JOIN THE CLUB</h2>
            <p className="text-sm opacity-80 mb-8 max-w-md mx-auto">
              Get weekly recipes, spice tips, and food hacks delivered straight to your inbox.
            </p>
            {subDone ? (
              <div className="sub-success flex items-center justify-center gap-2 text-primary-foreground font-bold text-base">
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                You're in! Welcome to the club.
              </div>
            ) : (
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Your email address"
                  className="flex-1 h-12 px-5 rounded-full bg-navy-foreground/10 border border-navy-foreground/30 text-navy-foreground placeholder:text-navy-foreground/50 focus:outline-none focus:border-navy-foreground transition-colors"
                />
                <Button variant="hero" size="lg" onClick={handleSubscribe}>SUBSCRIBE</Button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};
export default Index;