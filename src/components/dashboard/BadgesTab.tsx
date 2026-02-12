import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESET_BADGES } from "@/lib/supabase-helpers";
import { uploadFile } from "@/lib/supabase-helpers";
import { UserBadge } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Award, Plus, Upload } from "lucide-react";

interface BadgesTabProps {
  badges: UserBadge[];
  toggleBadge: (name: string, icon?: string, isCustom?: boolean) => Promise<void>;
  userId: string;
}

export function BadgesTab({ badges, toggleBadge, userId }: BadgesTabProps) {
  const [customName, setCustomName] = useState("");
  const [customUploading, setCustomUploading] = useState(false);
  const [customIconUrl, setCustomIconUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isBadgeActive = (name: string) => badges.some((b) => b.badge_name === name);

  const handleCustomIconUpload = async (file: File) => {
    setCustomUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const url = await uploadFile("badge-icons", path, file);
      setCustomIconUrl(url);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
    setCustomUploading(false);
  };

  const addCustomBadge = async () => {
    if (!customName.trim()) return;
    await toggleBadge(customName.trim(), customIconUrl, true);
    setCustomName("");
    setCustomIconUrl("");
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {PRESET_BADGES.map((badge) => (
              <button
                key={badge.name}
                onClick={() => toggleBadge(badge.name)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  isBadgeActive(badge.name)
                    ? "border-primary bg-primary/10 glow-purple"
                    : "border-border/30 bg-background/30 hover:border-border"
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{badge.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Custom Badge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Badge Name</Label>
              <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="My Badge" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Badge Icon</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCustomIconUpload(e.target.files[0])} />
              <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()} disabled={customUploading}>
                <Upload className="h-4 w-4 mr-1" /> {customUploading ? "Uploading..." : customIconUrl ? "✓ Uploaded" : "Upload Icon"}
              </Button>
            </div>
          </div>
          <Button onClick={addCustomBadge} disabled={!customName.trim()} className="glow-purple">
            Add Custom Badge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
