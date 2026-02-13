import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Gamepad2 } from "lucide-react";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      if (username.length < 3) {
        toast.error("Username must be at least 3 characters");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      // Update username
      const { supabase } = await import("@/integrations/supabase/client");
      setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles").update({ username: username.toLowerCase(), display_name: username }).eq("user_id", user.id);
        }
        setLoading(false);
        navigate("/dashboard");
      }, 1000);
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="font-minecraft text-2xl tracking-tight text-foreground inline-block">
            kenos<span className="text-primary">.lol</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <p className="text-muted-foreground text-sm">{isSignup ? "Create your account" : "Welcome back, player"}</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          {/* Toggle */}
          <div className="flex rounded-lg bg-background/50 p-1 mb-6">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${!isSignup ? "bg-primary text-primary-foreground glow-green" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${isSignup ? "bg-primary text-primary-foreground glow-green" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                <Label htmlFor="username" className="text-xs font-minecraft">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="steve"
                  required
                  minLength={3}
                  className="bg-background/50"
                />
              </motion.div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-minecraft">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@minecraft.net"
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-minecraft">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50"
              />
            </div>
            <Button type="submit" className="w-full glow-green transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_hsl(142_70%_45%_/_0.4)]" disabled={loading}>
              {loading ? "Loading..." : isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
