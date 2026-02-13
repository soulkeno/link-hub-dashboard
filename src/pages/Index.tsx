import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Link2, Shield, Zap } from "lucide-react";

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
      {/* Glow that follows cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, hsl(270 70% 60% / 0.15), transparent 60%)`
            : "none",
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, hsl(270 70% 60% / 0.3), transparent 60%)`
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
      {/* Animated ambient blobs */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${heroMouse.x}px ${heroMouse.y}px, hsl(270 70% 60% / 0.06), transparent 50%)`,
        }}
      />
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/8 blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(270_70%_60%_/_0.03)_1px,transparent_1px),linear-gradient(to_right,hsl(270_70%_60%_/_0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 md:px-12 py-5 relative z-10"
      >
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          kenos<span className="text-primary">.lol</span>
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild className="glow-purple">
            <Link to="/signup">Sign Up</Link>
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
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Your identity, one link
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-display text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight max-w-4xl leading-[1.05]"
        >
          Stand out with
          <br />
          <span className="text-primary glow-text-purple">your biolink</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-7 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
        >
          Custom backgrounds, music, badges, and social links — all in one stunning profile page.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Button size="lg" asChild className="glow-purple text-base px-8 h-12">
            <Link to="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 border-border/60 hover:bg-card/60">
            <Link to="/login">Log In</Link>
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
            icon={Link2}
            title="All Your Links"
            desc="Discord, GitHub, Roblox, YouTube & more — all in one beautiful page."
          />
          <GlowCard
            icon={Sparkles}
            title="Fully Customizable"
            desc="Video backgrounds, music, badges, and colors. Make it truly yours."
          />
          <GlowCard
            icon={Shield}
            title="Fast & Secure"
            desc="Built with modern tech. Your data stays safe and your profile loads instantly."
          />
        </motion.div>

        {/* URL Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl p-8 max-w-md w-full"
        >
          <p className="text-sm text-muted-foreground mb-3">Your profile link</p>
          <div className="flex items-center gap-2 bg-background/60 rounded-lg px-4 py-3 border border-border/30">
            <span className="text-muted-foreground">kenos.lol/</span>
            <span className="text-primary font-medium">yourname</span>
          </div>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex items-center gap-12 md:gap-20 text-center"
        >
          {[
            { val: "Free", label: "Forever" },
            { val: "∞", label: "Customization" },
            { val: "<1s", label: "Load Time" },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{s.val}</p>
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
