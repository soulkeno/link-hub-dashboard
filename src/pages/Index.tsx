import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Link2, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

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
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild className="glow-purple">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 md:pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your identity, one link
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.1]"
        >
          Stand out with your{" "}
          <span className="text-primary glow-text-purple">personal</span> biolink
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl"
        >
          Create a stunning profile with custom backgrounds, music, badges, and social links — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Button size="lg" asChild className="glow-purple text-base px-8">
            <Link to="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8">
            <Link to="/login">Log In</Link>
          </Button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {[
            { icon: Link2, title: "All Your Links", desc: "Discord, GitHub, Roblox, YouTube & more — all in one beautiful page." },
            { icon: Sparkles, title: "Fully Customizable", desc: "Video backgrounds, music, badges, and colors. Make it truly yours." },
            { icon: Shield, title: "Fast & Secure", desc: "Built with modern tech. Your data stays safe and your profile loads instantly." },
          ].map((f, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-6 text-left hover:border-primary/30 transition-all duration-300 hover:glow-purple"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* URL Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 glass-card rounded-2xl p-8 max-w-md w-full"
        >
          <p className="text-sm text-muted-foreground mb-2">Your profile link</p>
          <div className="flex items-center gap-2 bg-background/50 rounded-lg px-4 py-3 border border-border/50">
            <span className="text-muted-foreground">kenos.lol/</span>
            <span className="text-primary font-medium">yourname</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground border-t border-border/30">
        © 2026 kenos.lol — All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
