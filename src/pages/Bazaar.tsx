import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ShoppingBag, Printer, Smartphone, Plus, Trash2 } from "lucide-react";

const Bazaar = () => {
  const { bazaarList, toggleBazaarItem, removeBazaarItem, addBazaarItem } = useApp();
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      addBazaarItem(newItem);
      setNewItem("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">YOUR BAZAAR LIST</h1>
          <p className="text-muted-foreground mb-8">Missing ingredients for your next feast</p>

          {bazaarList.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl text-primary mb-2">LIST IS EMPTY!</h2>
              <p className="text-muted-foreground">Add missing ingredients from recipe pages.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {bazaarList.map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-4 bg-secondary/30 rounded-full px-6 py-4 border-2 border-border transition-all ${
                    item.bought ? "opacity-60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => toggleBazaarItem(item.name)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className={`flex-1 font-bold ${item.bought ? "line-through text-muted-foreground" : ""}`}>
                    🛒 {item.name}
                  </span>
                  <button onClick={() => removeBazaarItem(item.name)} className="text-muted-foreground hover:text-primary">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add item */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add an ingredient..."
              className="flex-1 h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
            />
            <Button onClick={handleAdd} size="lg">
              <Plus className="w-4 h-4 mr-1" /> ADD
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> PRINT LIST
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Smartphone className="w-4 h-4 mr-2" /> SEND TO PHONE
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bazaar;
