import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { SOCIAL_PLATFORMS, PRESET_BADGES } from "@/lib/supabase-helpers";
import {
  MessageCircle, Github, Twitter, Instagram, Music2, Youtube, Send, Mail,
  Globe, Music, Gamepad2, Tv, Joystick, Linkedin, Link, Volume2, VolumeX, MapPin
} from "lucide-react";

const iconMap: Record<string, any> = {
  MessageCircle, Github, Twitter, Instagram, Music2, Youtube, Send, Mail,
  Globe, Music, Gamepad2, Tv, Joystick, Linkedin, Link,
};

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
      if (!p) { setLoading(false); return; }
      setProfile(p);

      const [linksRes, badgesRes] = await Promise.all([
        supabase.from("social_links").select("*").eq("user_id", p.user_id).order("sort_order"),
        supabase.from("user_badges").select("*").eq("user_id", p.user_id).order("sort_order"),
      ]);
      setLinks(linksRes.data || []);
      setBadges(badgesRes.data || []);

      // increment view
      supabase.rpc("increment_view_count", { profile_username: username });
      setLoading(false);

      // Update tab title
      document.title = `@${username} | kenos.lol`;
    };
    load();
  }, [username]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">This profile doesn't exist.</p>
        </div>
      </div>
    );
  }

  const bgStyle = profile.bg_color ? { backgroundColor: profile.bg_color } : {};

  return (
    <div className="min-h-screen relative flex items-center justify-center" style={bgStyle}>
      {/* Video background */}
      {profile.background_url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
          src={profile.background_url}
        />
      )}
      <div className="fixed inset-0 bg-black/50 z-[1]" />

      {/* Audio */}
      {profile.music_url && <audio ref={audioRef} src={profile.music_url} loop />}

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-4 my-8"
      >
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 text-center shadow-2xl">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className={`w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/20 ${profile.glow_username ? "glow-purple" : ""}`}
            />
          ) : (
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary ${profile.glow_username ? "glow-purple" : ""}`}>
              {(profile.display_name || profile.username)?.[0]?.toUpperCase()}
            </div>
          )}

          {/* Name + badges */}
          <h1
            className={`font-display text-2xl font-bold mb-1 ${profile.glow_username ? "glow-text-white" : ""}`}
            style={{ color: profile.text_color }}
          >
            {profile.display_name || profile.username}
          </h1>

          {badges.length > 0 && (
            <div className={`flex items-center justify-center gap-1.5 mb-3 flex-wrap ${profile.glow_badges ? "glow-white" : ""}`}>
              {badges.map((b: any) => {
                const preset = PRESET_BADGES.find((pb) => pb.name === b.badge_name);
                return (
                  <span key={b.id} className="text-sm" title={b.badge_name}>
                    {b.badge_icon_url ? (
                      <img src={b.badge_icon_url} alt={b.badge_name} className="h-4 w-4 inline" />
                    ) : preset ? (
                      preset.icon
                    ) : (
                      "⭐"
                    )}
                  </span>
                );
              })}
            </div>
          )}

          {profile.bio && (
            <p className="text-sm mb-4 opacity-80" style={{ color: profile.text_color }}>{profile.bio}</p>
          )}

          {profile.location && (
            <p className="text-xs mb-4 opacity-60 flex items-center justify-center gap-1" style={{ color: profile.text_color }}>
              <MapPin className="h-3 w-3" /> {profile.location}
            </p>
          )}

          {/* Social links */}
          {links.length > 0 && (
            <div className={`flex items-center justify-center gap-3 flex-wrap ${profile.glow_socials ? "glow-white" : ""}`}>
              {links.map((link: any) => {
                const plat = SOCIAL_PLATFORMS.find((p) => p.id === link.platform);
                const IconComp = plat ? iconMap[plat.icon] || Link : Link;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                    title={link.label || plat?.label || link.platform}
                    style={{ color: profile.accent_color }}
                  >
                    <IconComp className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Music player */}
        {profile.music_url && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={toggleMusic}
            className="mt-4 mx-auto flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm hover:bg-black/60 transition-all"
            style={{ color: profile.text_color }}
          >
            {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {playing ? "Playing" : "Play Music"}
          </motion.button>
        )}

        {/* View count */}
        <p className="mt-4 text-center text-xs opacity-40" style={{ color: profile.text_color }}>
          {profile.view_count} views
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
