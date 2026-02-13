import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      toast.error("Username can only contain lowercase letters, numbers and underscores");
      return;
    }

    setLoading(true);

    // Check if username is taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      toast.error("Username is already taken");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Update the auto-created profile with the chosen username
    // Small delay to let the trigger create the profile
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ username: username.toLowerCase() })
          .eq("user_id", user.id);
      }
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
            kenos<span className="text-primary">.lol</span>
          </Link>
          <p className="mt-2 text-muted-foreground">Create your account</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-0 bg-background/50 rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                <span className="pl-3 text-sm text-muted-foreground select-none">kenos.lol/</span>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="yourname"
                  required
                  minLength={3}
                  className="border-0 bg-transparent focus-visible:ring-0 pl-0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-background/50"
              />
            </div>
            <Button type="submit" className="w-full glow-purple" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
