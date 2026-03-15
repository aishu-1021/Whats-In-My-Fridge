import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ShoppingBag, Printer, Plus, Trash2 } from "lucide-react";

const Bazaar = () => {
  const { bazaarList, toggleBazaarItem, removeBazaarItem, addBazaarItem } = useApp();
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      addBazaarItem(newItem);
      setNewItem("");
    }
  };

  // ── counts ───────────────────────────────────────────────────────────────
  const totalItems     = bazaarList.length;
  const remainingItems = bazaarList.filter((i) => !i.bought).length;

  // ── WhatsApp share ───────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    if (bazaarList.length === 0) return;

    const lines = bazaarList.map((item) =>
      `${item.bought ? "✅" : "☐"} ${item.name}`
    );

    const message =
      `🛒 My Bazaar List — What's In My Fridge?\n\n` +
      lines.join("\n") +
      `\n\n_${remainingItems} item${remainingItems !== 1 ? "s" : ""} still to pick up_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">
            YOUR BAZAAR LIST
          </h1>
          <p className="text-muted-foreground mb-4">
            Missing ingredients for your next feast
          </p>

          {/* ── Counter badge ────────────────────────────────────────────── */}
          {totalItems > 0 && (
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground
                text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full">
                <ShoppingBag className="w-3.5 h-3.5" />
                {totalItems} {totalItems === 1 ? "item" : "items"} to buy
              </span>

              {remainingItems < totalItems && (
                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700
                  text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full">
                  ✓ {totalItems - remainingItems} picked up
                </span>
              )}
            </div>
          )}

          {/* ── Empty state ─────────────────────────────────────────────── */}
          {bazaarList.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl text-primary mb-2">LIST IS EMPTY!</h2>
              <p className="text-muted-foreground">
                Add missing ingredients from recipe pages.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {bazaarList.map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-4 bg-secondary/30 rounded-full px-6 py-4
                    border-2 border-border transition-all ${item.bought ? "opacity-60" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => toggleBazaarItem(item)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className={`flex-1 font-bold ${
                    item.bought ? "line-through text-muted-foreground" : ""
                  }`}>
                    {item.name}
                  </span>
                  <button
                    onClick={() => removeBazaarItem(item)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Add item ────────────────────────────────────────────────── */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add an ingredient..."
              className="flex-1 h-12 px-5 rounded-full border-2 border-border bg-card
                focus:outline-none focus:border-primary transition-colors"
            />
            <Button onClick={handleAdd} size="lg">
              <Plus className="w-4 h-4 mr-1" /> ADD
            </Button>
          </div>

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" /> PRINT LIST
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
              onClick={handleWhatsApp}
              disabled={bazaarList.length === 0}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              SEND TO WHATSAPP
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Bazaar;