import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/hooks/useProfile";
import { uploadFile } from "@/lib/supabase-helpers";
import { toast } from "sonner";
import { Upload, Image, Video, Music, Type, MapPin, Palette, Sparkles } from "lucide-react";

interface CustomizeTabProps {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  userId: string;
}

export function CustomizeTab({ profile, updateProfile, userId }: CustomizeTabProps) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [username, setUsername] = useState(profile.username);
  const [accentColor, setAccentColor] = useState(profile.accent_color);
  const [textColor, setTextColor] = useState(profile.text_color);
  const [bgColor, setBgColor] = useState(profile.bg_color);
  const [uploading, setUploading] = useState("");

  const avatarRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (bucket: string, file: File, field: "avatar_url" | "background_url" | "music_url") => {
    setUploading(field);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const url = await uploadFile(bucket, path, file);
      await updateProfile({ [field]: url });
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
    setUploading("");
  };

  const saveGeneral = () => {
    updateProfile({ display_name: displayName, bio, location, username, accent_color: accentColor, text_color: textColor, bg_color: bgColor });
  };

  return (
    <div className="space-y-6">
      {/* Asset uploaders */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Upload className="h-4 w-4 text-primary" /> Assets</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Image className="h-3.5 w-3.5" /> Avatar</Label>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload("avatars", e.target.files[0], "avatar_url")} />
            <Button variant="outline" className="w-full" onClick={() => avatarRef.current?.click()} disabled={uploading === "avatar_url"}>
              {uploading === "avatar_url" ? "Uploading..." : "Upload Image"}
            </Button>
            {profile.avatar_url && <img src={profile.avatar_url} className="h-16 w-16 rounded-full object-cover border border-border" />}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Background Video</Label>
            <input ref={bgRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload("backgrounds", e.target.files[0], "background_url")} />
            <Button variant="outline" className="w-full" onClick={() => bgRef.current?.click()} disabled={uploading === "background_url"}>
              {uploading === "background_url" ? "Uploading..." : "Upload Video"}
            </Button>
            {profile.background_url && <p className="text-xs text-muted-foreground truncate">✓ Video uploaded</p>}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Music className="h-3.5 w-3.5" /> Music (MP3)</Label>
            <input ref={musicRef} type="file" accept="audio/mpeg,audio/mp3" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload("audio", e.target.files[0], "music_url")} />
            <Button variant="outline" className="w-full" onClick={() => musicRef.current?.click()} disabled={uploading === "music_url"}>
              {uploading === "music_url" ? "Uploading..." : "Upload MP3"}
            </Button>
            {profile.music_url && <p className="text-xs text-muted-foreground truncate">✓ Music uploaded</p>}
          </div>
        </CardContent>
      </Card>

      {/* General */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Type className="h-4 w-4 text-primary" /> General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Username (URL slug)</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-background/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-background/50 resize-none" rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-background/50" />
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Colors</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-9 w-12 rounded border border-border cursor-pointer" />
              <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="bg-background/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-12 rounded border border-border cursor-pointer" />
              <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="bg-background/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-12 rounded border border-border cursor-pointer" />
              <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-background/50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glow settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Glow Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Glow on Username</Label>
            <Switch checked={profile.glow_username} onCheckedChange={(v) => updateProfile({ glow_username: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Glow on Socials</Label>
            <Switch checked={profile.glow_socials} onCheckedChange={(v) => updateProfile({ glow_socials: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Glow on Badges</Label>
            <Switch checked={profile.glow_badges} onCheckedChange={(v) => updateProfile({ glow_badges: v })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveGeneral} className="glow-purple">Save Changes</Button>
    </div>
  );
}
