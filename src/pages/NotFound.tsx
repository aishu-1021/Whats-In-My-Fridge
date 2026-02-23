import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import FloatingEmojis from "@/components/FloatingEmojis";

const NotFound = () => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1 sunburst-bg relative overflow-hidden flex items-center justify-center">
      <FloatingEmojis />
      <div className="text-center relative z-10 px-4">
        <h1 className="font-display text-[10rem] md:text-[14rem] text-primary leading-none mb-0">404</h1>
        <h2 className="font-display text-3xl md:text-4xl text-primary mb-3">RECIPE NOT FOUND</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like this page got eaten. Maybe check the fridge again?
        </p>
        <Link to="/">
          <Button variant="hero" size="xl">← BACK TO HOME</Button>
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
