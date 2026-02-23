import { Link } from "react-router-dom";
import { Refrigerator } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-navy-foreground pt-12 pb-6">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Refrigerator className="w-6 h-6" />
          <span className="font-display text-lg">WHAT'S IN MY FRIDGE?</span>
        </div>
        <p className="text-sm opacity-80 leading-relaxed">
          Turn your leftover veggies into delicious Indian street food. Reduce waste, eat amazing.
        </p>
        <div className="flex gap-3 mt-4 text-xl">
          <span className="cursor-pointer hover:scale-110 transition-transform">📸</span>
          <span className="cursor-pointer hover:scale-110 transition-transform">🐦</span>
          <span className="cursor-pointer hover:scale-110 transition-transform">📘</span>
          <span className="cursor-pointer hover:scale-110 transition-transform">▶️</span>
        </div>
      </div>
      <div>
        <h4 className="font-display text-lg mb-3">EXPLORE</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
          <li><Link to="/results" className="hover:opacity-100 transition-opacity">Recipes</Link></li>
          <li><Link to="/saved" className="hover:opacity-100 transition-opacity">Saved Recipes</Link></li>
          <li><Link to="/bazaar" className="hover:opacity-100 transition-opacity">Bazaar List</Link></li>
          <li><Link to="/pantry" className="hover:opacity-100 transition-opacity">Pantry Setup</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg mb-3">COMPANY</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
          <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
          <li><span className="cursor-pointer hover:opacity-100 transition-opacity">Privacy Policy</span></li>
          <li><span className="cursor-pointer hover:opacity-100 transition-opacity">Terms of Service</span></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-8 pt-6 border-t border-navy-foreground/20 text-center text-sm opacity-60">
      © 2026 What's in my Fridge? All rights reserved. Made with 🌶️ in India.
    </div>
  </footer>
);

export default Footer;
