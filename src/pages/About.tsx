import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Flame, Leaf, Sun, Recycle, Palette, Code2, Lightbulb } from "lucide-react";

const flavors = [
  {
    title: "STREET SOUL",
    desc: "The authentic taste of bustling Indian bazaars and corner stalls.",
    icon: <Flame className="w-8 h-8" />,
    color: "bg-primary",
  },
  {
    title: "SPICE MARKET",
    desc: "A curated collection of aromatic blends from across the subcontinent.",
    icon: <Sun className="w-8 h-8" />,
    color: "bg-saffron",
  },
  {
    title: "HEAT WAVE",
    desc: "For those who believe food should make you sweat with joy.",
    icon: <Leaf className="w-8 h-8" />,
    color: "bg-accent",
  },
];

// ── CHANGE: hardcoded static path — always your photo, never a user's ────────
// Place your photo at: public/about-avatar.jpg (or .png)
// Then update this path to match your filename exactly.
const FOUNDER_AVATAR = "/about-avatar.jpg";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 bg-background">

      {/* ── Hero ── */}
      <section className="py-20 text-center bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-6">
            OUR KITCHEN STORY
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            It started on one of those evenings when my parents had gone out of station
            and I was home alone. I opened the fridge and stared at a sad collection of
            random vegetables, peas stored in an ice-cream box (typical Indian things), and some leftover rice - and had
            absolutely no idea what to make.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            I ended up ordering in, again. But that moment stuck with me. Why isn't there
            something that just tells you what you can cook with what you already have?
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            That frustration is what built{" "}
            <span className="font-bold text-primary">What's in my Fridge?</span> - a place
            where no leftover goes to waste and every random ingredient has a recipe
            waiting for it.
          </p>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-primary text-center mb-4">
            THE PHILOSOPHY
          </h2>
          <p className="text-center text-muted-foreground max-w-lg mx-auto mb-10">
            Turning leftovers into feasts. Every carrot, every onion, every pinch of
            cumin has a purpose.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Recycle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl text-primary mb-2">REDUCE WASTE</h3>
              <p className="text-sm text-muted-foreground">
                Cook what you have. Waste nothing. Love everything.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
              <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center mx-auto mb-3">
                <Palette className="w-7 h-7" style={{ color: "#E6960C" }} />
              </div>
              <h3 className="font-display text-xl text-primary mb-2">RETRO VIBES</h3>
              <p className="text-sm text-muted-foreground">
                Inspired by vintage Indian poster art and street culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Flavors ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-primary text-center mb-10">
            THE FLAVORS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flavors.map((f) => (
              <div
                key={f.title}
                className={`${f.color} text-primary-foreground rounded-2xl p-8 text-center shadow-lg`}
              >
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="font-display text-2xl mb-2">{f.title}</h3>
                <p className="text-sm opacity-90">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Builder ── */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-primary text-center mb-12">
            THE BUILDER
          </h2>

          <div className="max-w-md mx-auto bg-card border-2 border-border rounded-2xl p-8 text-center">

            {/* Static founder photo — never changes based on who is logged in */}
            <img
              src={FOUNDER_AVATAR}
              alt="Aishwarya Aiyandra Sujith"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-5 border-4 border-primary/20"
              style={{ boxShadow: "0 4px 20px rgba(211,47,47,0.15)" }}
              onError={(e) => {
                // If photo file is missing, fall back to initials avatar
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            {/* Fallback initials — shown only if photo file is missing */}
            <div
              className="w-24 h-24 rounded-full items-center justify-center mx-auto mb-5 font-display text-2xl text-white"
              style={{
                background: "#D32F2F",
                boxShadow: "0 4px 20px rgba(211,47,47,0.25)",
                display: "none",
              }}
            >
              AA
            </div>

            <h3 className="font-display text-2xl text-primary mb-1">
              Aishwarya Aiyandra Sujith
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Founder, Designer &amp; Developer
            </p>

            {/* Role chips */}
            <div className="flex justify-center gap-2 flex-wrap mb-6">
              {[
                { icon: <Code2 size={12} strokeWidth={2.5} />,     label: "Built the app"   },
                { icon: <Palette size={12} strokeWidth={2.5} />,   label: "Designed the UI" },
                { icon: <Lightbulb size={12} strokeWidth={2.5} />, label: "Had the idea"    },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: "hsl(var(--primary) / 0.08)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  {chip.icon}
                  {chip.label}
                </span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Built this entirely from scratch - frontend, backend, database, and design.
              What started as a frustrated evening staring at an empty fridge turned into
              a full-stack app. Proud of every line of it.
            </p>
          </div>
        </div>
      </section>

    </main>
    <Footer />
  </div>
);
export default About;