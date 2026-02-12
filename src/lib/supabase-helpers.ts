import { supabase } from "@/integrations/supabase/client";

export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export const SOCIAL_PLATFORMS = [
  { id: "discord", label: "Discord", icon: "MessageCircle" },
  { id: "github", label: "GitHub", icon: "Github" },
  { id: "twitter", label: "Twitter / X", icon: "Twitter" },
  { id: "instagram", label: "Instagram", icon: "Instagram" },
  { id: "tiktok", label: "TikTok", icon: "Music2" },
  { id: "youtube", label: "YouTube", icon: "Youtube" },
  { id: "telegram", label: "Telegram", icon: "Send" },
  { id: "email", label: "Email", icon: "Mail" },
  { id: "website", label: "Website", icon: "Globe" },
  { id: "spotify", label: "Spotify", icon: "Music" },
  { id: "roblox", label: "Roblox", icon: "Gamepad2" },
  { id: "twitch", label: "Twitch", icon: "Tv" },
  { id: "steam", label: "Steam", icon: "Joystick" },
  { id: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { id: "custom", label: "Custom Link", icon: "Link" },
] as const;

export const PRESET_BADGES = [
  { name: "Staff", icon: "🛡️" },
  { name: "OG", icon: "👑" },
  { name: "Verified", icon: "✅" },
  { name: "Early Supporter", icon: "🌟" },
  { name: "Bug Hunter", icon: "🐛" },
  { name: "Donor", icon: "💎" },
  { name: "Premium", icon: "⭐" },
  { name: "Developer", icon: "💻" },
  { name: "Designer", icon: "🎨" },
  { name: "Moderator", icon: "🔨" },
  { name: "Partner", icon: "🤝" },
  { name: "Contributor", icon: "🔥" },
  { name: "VIP", icon: "🏆" },
  { name: "Content Creator", icon: "📹" },
  { name: "Music Lover", icon: "🎵" },
  { name: "Gamer", icon: "🎮" },
  { name: "Artist", icon: "🖌️" },
  { name: "Streamer", icon: "📺" },
] as const;
