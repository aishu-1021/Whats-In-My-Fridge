import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Flame, Leaf, Sun } from "lucide-react";

const team = [
  { name: "Priya Sharma", role: "Head Chef", emoji: "👩‍🍳" },
  { name: "Arjun Patel", role: "Spice Curator", emoji: "🧑‍🍳" },
  { name: "Meera Iyer", role: "Waste Warrior", emoji: "♻️" },
  { name: "Kiran Dev", role: "Tech Lead", emoji: "💻" },
];

const flavors = [
  { title: "STREET SOUL", desc: "The authentic taste of bustling Indian bazaars and corner stalls.", icon: <Flame className="w-8 h-8" />, color: "bg-primary" },
  { title: "SPICE MARKET", desc: "A curated collection of aromatic blends from across the subcontinent.", icon: <Sun className="w-8 h-8" />, color: "bg-saffron" },
  { title: "HEAT WAVE", desc: "For those who believe food should make you sweat with joy.", icon: <Leaf className="w-8 h-8" />, color: "bg-accent" },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 bg-background">
      {/* Hero */}
      <section className="py-20 text-center bg-background">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4">OUR KITCHEN STORY</h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            We believe every ingredient deserves a chance. Our mission: reduce food waste by helping you cook with what you already have.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-primary text-center mb-4">THE PHILOSOPHY</h2>
          <p className="text-center text-muted-foreground max-w-lg mx-auto mb-10">
            Turning leftovers into feasts. Every carrot, every onion, every pinch of cumin has a purpose.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
              <span className="text-4xl">♻️</span>
              <h3 className="font-display text-xl text-primary mt-3 mb-2">REDUCE WASTE</h3>
              <p className="text-sm text-muted-foreground">Cook what you have. Waste nothing. Love everything.</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border-2 border-border text-center">
              <span className="text-4xl">🎨</span>
              <h3 className="font-display text-xl text-primary mt-3 mb-2">RETRO VIBES</h3>
              <p className="text-sm text-muted-foreground">Inspired by vintage Indian poster art and street culture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flavors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-primary text-center mb-10">THE FLAVORS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flavors.map((f) => (
              <div key={f.title} className={`${f.color} text-primary-foreground rounded-2xl p-8 text-center shadow-lg`}>
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="font-display text-2xl mb-2">{f.title}</h3>
                <p className="text-sm opacity-90">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-primary text-center mb-10">THE TEAM</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-4xl">
                  {t.emoji}
                </div>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
