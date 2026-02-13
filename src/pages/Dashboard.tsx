import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { LogOut, Plus, Trash2, Package, Box, Puzzle, Upload, Download, Heart, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const ADMIN_USERNAME = "keno";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Upload form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("texture_pack");
  const [versions, setVersions] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, projectsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data);
      setProjects(projectsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const isAdmin = profile?.username?.toLowerCase() === ADMIN_USERNAME;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    if (!title.trim()) { toast.error("Title is required"); return; }
    setUploading(true);

    try {
      let iconUrl = "";
      let fileUrl = "";

      if (iconFile) {
        const ext = iconFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-icon.${ext}`;
        const { error } = await supabase.storage.from("project-icons").upload(path, iconFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("project-icons").getPublicUrl(path);
        iconUrl = urlData.publicUrl;
      }

      if (projectFile) {
        const ext = projectFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-file.${ext}`;
        const { error } = await supabase.storage.from("project-files").upload(path, projectFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("project-files").getPublicUrl(path);
        fileUrl = urlData.publicUrl;
      }

      const mcVersions = versions.split(",").map(v => v.trim()).filter(Boolean);

      const { error } = await supabase.from("projects").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        type,
        status: "published",
        icon_url: iconUrl,
        file_url: fileUrl,
        minecraft_versions: mcVersions,
      });

      if (error) throw error;

      toast.success("Project uploaded!");
      setShowUpload(false);
      setTitle(""); setDescription(""); setVersions(""); setIconFile(null); setProjectFile(null);
      // Refresh
      const { data } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setProjects(data || []);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects(projects.filter(p => p.id !== id));
    toast.success("Deleted");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const typeIcons: Record<string, any> = { texture_pack: Package, plugin: Puzzle, modpack: Box };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-6 h-14">
          <Link to="/" className="font-minecraft text-lg tracking-tight">
            kenos<span className="text-primary">.lol</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="transition-all duration-300 hover:scale-105">
              <Link to="/discover">Discover</Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-minecraft text-xl mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {profile?.display_name || profile?.username}</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowUpload(!showUpload)} className="glow-green gap-2 transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4" /> Upload
            </Button>
          )}
        </div>

        {/* Upload Form */}
        {showUpload && isAdmin && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Upload Project</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-minecraft">Title</Label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Texture Pack" required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-minecraft">Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="texture_pack">Texture Pack</SelectItem>
                        <SelectItem value="modpack">Modpack</SelectItem>
                        <SelectItem value="plugin">Plugin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-minecraft">Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your project..." className="bg-background/50 min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-minecraft">MC Versions (comma-separated)</Label>
                  <Input value={versions} onChange={e => setVersions(e.target.value)} placeholder="1.20.x, 1.21.x" className="bg-background/50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-minecraft">Icon</Label>
                    <Input type="file" accept="image/*" onChange={e => setIconFile(e.target.files?.[0] || null)} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-minecraft">File (.zip, .jar)</Label>
                    <Input type="file" accept=".zip,.jar,.rar,.7z" onChange={e => setProjectFile(e.target.files?.[0] || null)} className="bg-background/50" />
                  </div>
                </div>
                <Button type="submit" disabled={uploading} className="glow-green transition-all duration-300 hover:scale-105">
                  <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Publish"}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Projects List */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold mb-4">{isAdmin ? "Your Projects" : "Your Account"}</h2>
          {!isAdmin && (
            <div className="glass-card rounded-xl p-6 text-center text-muted-foreground">
              <p>You're logged in as <span className="text-foreground font-medium">{profile?.username}</span></p>
              <p className="text-sm mt-2">Browse content on the <Link to="/discover" className="text-primary hover:underline">Discover</Link> page.</p>
            </div>
          )}
          {isAdmin && projects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No projects yet. Upload your first one!</p>
            </div>
          )}
          {projects.map(p => {
            const Icon = typeIcons[p.type] || Package;
            return (
              <motion.div key={p.id} whileHover={{ scale: 1.01 }} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center border border-border/50 shrink-0">
                  {p.icon_url ? <img src={p.icon_url} alt="" className="h-full w-full rounded-lg object-cover" /> : <Icon className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/project/${p.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors">{p.title}</Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {p.download_count}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {p.like_count}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
