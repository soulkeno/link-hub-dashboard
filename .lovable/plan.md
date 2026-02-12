

# kenos.lol — Biolink Platform

## 1. Landing Page (`/`)
- Dark themed hero page with a bold tagline like "Your identity, one link."
- Subtle purple/white glow accents, smooth fade-in animations
- "Sign Up for Free" and "Log In" buttons
- Preview mockups of biolink profiles and dashboard
- Navigation bar with kenos.lol branding
- Browser tab shows kenos.lol favicon and page title

## 2. Authentication (`/login`, `/signup`)
- Fully functional sign up & login using Supabase Auth (email + password)
- Clean dark-themed auth forms with glow effects
- After login, redirect to `/dashboard`
- User profiles table created automatically on signup (stores display name, username/slug, bio, etc.)

## 3. Dashboard (`/dashboard`)
- Dark UI with card-based layout, subtle white glow accents
- **Sidebar navigation**: Account, Customize, Links, Badges
- **Account tab**: Overview showing username, display name, UID, profile views count
- **Customize tab**:
  - **Asset uploaders**: Background video (MP4/WebM), Audio/Music (MP3), Profile Avatar image
  - **General customization**: Display name, bio/description, location
  - **Color customization**: Accent color, text color, background color
  - **Glow settings**: Toggle glow on username, socials, badges
- **Links tab**: Add/remove/reorder social links — supports Discord, GitHub, Twitter/X, Instagram, TikTok, YouTube, Telegram, Email, Website, Spotify, Roblox, plus custom URL links with custom labels
- **Badges tab**: Grid of 15+ pre-made badges (Staff, OG, Verified, Early Supporter, Bug Hunter, Donor, Premium, etc.) that users can toggle on/off. Plus a "Custom Badge" section where users can upload a small icon and name for a free custom badge

## 4. Public Biolink Profile (`/:username`)
- Accessible at `kenos.lol/username`
- Displays the user's:
  - Background video (fullscreen behind content)
  - Profile picture (with optional glow)
  - Display name + badge icons next to it
  - Bio/description
  - Social link icons (clickable)
  - Connected Discord presence (last seen status)
  - Music player widget at the bottom (plays uploaded MP3)
  - View counter
- Browser tab shows `@username | kenos.lol` with optional audio icon
- Clean centered card layout on dark background, matching reference style

## 5. File Storage (Supabase Storage)
- Storage buckets for: avatars, backgrounds (video), audio, custom badge icons
- Files uploaded from dashboard, URLs stored in user profile
- Proper RLS so users can only manage their own files

## 6. Design & Polish
- Fully dark theme throughout (near-black backgrounds, dark cards)
- Purple accent colors inspired by reference images
- Subtle white glow effects on interactive elements
- Smooth animations: fade-in on page load, hover-scale on cards/buttons, slide transitions in dashboard
- Responsive design for mobile and desktop
- Card-based UI for all dashboard sections

