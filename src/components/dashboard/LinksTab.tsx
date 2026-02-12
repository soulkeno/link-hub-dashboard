import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SOCIAL_PLATFORMS } from "@/lib/supabase-helpers";
import { SocialLink } from "@/hooks/useProfile";
import { Plus, Trash2 } from "lucide-react";

interface LinksTabProps {
  socialLinks: SocialLink[];
  addSocialLink: (platform: string, url: string, label: string) => Promise<void>;
  removeSocialLink: (id: string) => Promise<void>;
}

export function LinksTab({ socialLinks, addSocialLink, removeSocialLink }: LinksTabProps) {
  const [platform, setPlatform] = useState("discord");
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  const handleAdd = async () => {
    if (!url.trim()) return;
    await addSocialLink(platform, url.trim(), label.trim());
    setUrl("");
    setLabel("");
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Add Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} className="bg-background/50" />
            <Input placeholder="Label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} className="bg-background/50" />
          </div>
          <Button onClick={handleAdd} className="glow-purple">
            <Plus className="h-4 w-4 mr-1" /> Add Link
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links added yet.</p>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const plat = SOCIAL_PLATFORMS.find((p) => p.id === link.platform);
                return (
                  <div key={link.id} className="flex items-center justify-between bg-background/30 rounded-lg px-4 py-3 border border-border/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">{plat?.label || link.platform}</span>
                      <span className="text-sm text-muted-foreground truncate">{link.url}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSocialLink(link.id)} className="shrink-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
