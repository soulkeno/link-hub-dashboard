import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Package, Shield, Zap, Download, Box, Puzzle } from "lucide-react";

const GlowCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-7 text-left overflow-hidden group cursor-default"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, hsl(142 70% 45% / 0.15), transparent 60%)`
            : "none",
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, hsl(142 70% 45% / 0.3), transparent 60%)`
            : "none",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <div className="relative z-10">
        <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setHeroMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" ref={heroRef}>
      {/* Ambient cursor glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${heroMouse.x}px ${heroMouse.y}px, hsl(142 70% 45% / 0.06), transparent 50%)`,
        }}
      />
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/8 blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(142_70%_45%_/_0.03)_1px,transparent_1px),linear-gradient(to_right,hsl(142_70%_45%_/_0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 md:px-12 py-5 relative z-10"
      >
        <Link to="/" className="font-minecraft text-lg tracking-tight text-foreground">
          kenos<span className="text-primary">.lol</span>
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
            <Link to="/discover">Discover</Link>
          </Button>
          <Button asChild className="glow-green transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(142_70%_45%_/_0.4)]">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 md:pt-36 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary backdrop-blur-sm font-minecraft text-[10px]">
            <Sparkles className="h-3.5 w-3.5" />
            Minecraft Content Hub
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-minecraft text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-4xl leading-[1.3]"
        >
          Texture Packs,
          <br />
          <span className="text-primary glow-text-green">Mods & Plugins</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-7 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
        >
          Discover and download the best Minecraft content. Curated texture packs, modpacks, and plugins — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Button size="lg" asChild className="glow-green text-base px-8 h-12 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(142_70%_45%_/_0.4)]">
            <Link to="/discover">
              Browse Content <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 border-border/60 hover:bg-card/60 transition-all duration-300 hover:scale-105">
            <Link to="/login">Sign In</Link>
          </Button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full"
        >
          <GlowCard
            icon={Package}
            title="Texture Packs"
            desc="High-quality resource packs to transform your Minecraft world with stunning visuals."
          />
          <GlowCard
            icon={Box}
            title="Modpacks"
            desc="Curated modpack collections ready to install. New gameplay experiences await."
          />
          <GlowCard
            icon={Puzzle}
            title="Plugins"
            desc="Server plugins to enhance your multiplayer experience with new features and tools."
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex items-center gap-12 md:gap-20 text-center"
        >
          {[
            { val: "Free", label: "Always" },
            { val: "∞", label: "Downloads" },
            { val: "Curated", label: "Content" },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-minecraft text-xl md:text-2xl text-primary">{s.val}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground border-t border-border/20">
        © 2026 kenos.lol — All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
