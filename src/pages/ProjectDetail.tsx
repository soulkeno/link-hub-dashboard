import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, Heart, Clock, Package, Box, Puzzle, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeConfig: Record<string, { label: string; icon: any }> = {
  texture_pack: { label: "Texture Pack", icon: Package },
  plugin: { label: "Plugin", icon: Puzzle },
  modpack: { label: "Modpack", icon: Box },
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase.from("projects").select("*").eq("id", id).single();
      setProject(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleDownload = async () => {
    if (!project?.file_url) return;
    await supabase.rpc("increment_download_count", { project_id: project.id });
    window.open(project.file_url, "_blank");
    setProject((p: any) => p ? { ...p, download_count: p.download_count + 1 } : p);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Project not found</p>
        <Button asChild variant="outline"><Link to="/discover">Back to Discover</Link></Button>
      </div>
    );
  }

  const config = typeConfig[project.type] || typeConfig.texture_pack;
  const TypeIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/30">
        <Link to="/" className="font-minecraft text-lg tracking-tight text-foreground">
          kenos<span className="text-primary">.lol</span>
        </Link>
        <Button variant="ghost" asChild><Link to="/discover">Discover</Link></Button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/discover" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8">
          {/* Main */}
          <div className="flex-1">
            <div className="flex items-start gap-5 mb-6">
              <div className="h-20 w-20 rounded-xl bg-secondary flex items-center justify-center border border-border/50 shrink-0">
                {project.icon_url ? (
                  <img src={project.icon_url} alt="" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <TypeIcon className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h1 className="font-minecraft text-xl mb-1">{project.title}</h1>
                <p className="text-sm text-muted-foreground">{config.label}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {project.download_count}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {project.like_count}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{project.description || "No description provided."}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-72 space-y-4">
            <Button
              onClick={handleDownload}
              className="w-full glow-green gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(142_70%_45%_/_0.4)]"
              disabled={!project.file_url}
            >
              <Download className="h-4 w-4" /> Download
            </Button>

            {project.minecraft_versions?.length > 0 && (
              <div className="glass-card rounded-xl p-4">
                <h3 className="font-display text-sm font-semibold mb-3">Compatibility</h3>
                <p className="text-xs text-muted-foreground mb-2">Minecraft: Java Edition</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.minecraft_versions.map((v: string) => (
                    <span key={v} className="text-[11px] px-2 py-1 rounded bg-secondary border border-border/50 text-muted-foreground">{v}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card rounded-xl p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Published {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectDetail;
