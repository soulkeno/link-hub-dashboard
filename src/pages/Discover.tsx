import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Package, Box, Puzzle, Search, Download, Heart, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ProjectType = "texture_pack" | "plugin" | "modpack";

const typeConfig: Record<ProjectType, { label: string; icon: any; color: string }> = {
  texture_pack: { label: "Texture Packs", icon: Package, color: "text-emerald-400" },
  plugin: { label: "Plugins", icon: Puzzle, color: "text-blue-400" },
  modpack: { label: "Modpacks", icon: Box, color: "text-amber-400" },
};

const ProjectCard = ({ project }: { project: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const config = typeConfig[project.type as ProjectType];

  return (
    <Link to={`/project/${project.id}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl p-5 overflow-hidden group cursor-pointer"
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, hsl(142 70% 45% / 0.1), transparent 60%)`
              : "none",
          }}
        />
        <div className="relative z-10 flex gap-4">
          <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border/50">
            {project.icon_url ? (
              <img src={project.icon_url} alt="" className="h-full w-full rounded-lg object-cover" />
            ) : (
              <config.icon className={`h-7 w-7 ${config.color}`} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-base font-semibold text-foreground truncate">{project.title}</h3>
              {project.status === "draft" && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">Draft</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description || "No description"}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {project.download_count}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {project.like_count}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Discover = () => {
  const [activeType, setActiveType] = useState<ProjectType | "all">("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setHeroMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      let query = supabase.from("projects").select("*").eq("status", "published").order("created_at", { ascending: false });
      if (activeType !== "all") query = query.eq("type", activeType);
      if (search) query = query.ilike("title", `%${search}%`);
      const { data } = await query;
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, [activeType, search]);

  const types: { key: ProjectType | "all"; label: string; icon: any }[] = [
    { key: "all", label: "All", icon: Search },
    { key: "texture_pack", label: "Texture Packs", icon: Package },
    { key: "modpack", label: "Modpacks", icon: Box },
    { key: "plugin", label: "Plugins", icon: Puzzle },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700 ease-out"
        style={{ background: `radial-gradient(800px circle at ${heroMouse.x}px ${heroMouse.y}px, hsl(142 70% 45% / 0.04), transparent 50%)` }}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 relative z-10 border-b border-border/30">
        <Link to="/" className="font-minecraft text-lg tracking-tight text-foreground">
          kenos<span className="text-primary">.lol</span>
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild className="glow-green transition-all duration-300 hover:scale-105">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-minecraft text-2xl mb-2 text-foreground">Discover</h1>
          <p className="text-muted-foreground mb-8">Browse Minecraft content</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 mb-8">
          {types.map((t) => (
            <Button
              key={t.key}
              variant={activeType === t.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(t.key)}
              className={`gap-2 transition-all duration-300 hover:scale-105 ${activeType === t.key ? "glow-green" : "border-border/50"}`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Button>
          ))}
          <div className="ml-auto">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 bg-card/40 border-border/50"
            />
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No projects found</p>
            </div>
          ) : (
            projects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Discover;
