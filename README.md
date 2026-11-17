# ZENTRO — Haute Atelier & Unisex Family Salon
### Kavanur, Malappuram, Kerala

Official web application for Zentro Unisex Salon Atelier in Kavanur, Malappuram. Featuring editorial high-fashion aesthetics, zero-advance WhatsApp appointment dispatch, interactive atelier archives, and video showcase.

---

## ✦ Key Features
- **Architectural Vanta Aesthetic**: Luxury editorial layout with custom typography and monochromatic contrast.
- **Zero-Advance WhatsApp Booking Concierge**: Real-time booking dispatch with dynamic time slot and service selection direct to WhatsApp (+91 9074 616121).
- **Atelier Video Showcase**: Auto-playing HTML5 high-definition video gallery with sound controls and audio coordination.
- **Curated Disciplines**: Interactive service catalog with morphology precision cuts, French balayage, K-Gloss silk therapy, clinical hydra-facials, and bridal suite rituals.
- **Guest Archives (Reviews)**: Touch and drag-enabled sliding reviews carousel with 5-star verified guest reflections.
- **Accurate GPS Mapping**: Exact atelier location pin (`11°11'41.9"N 76°03'52.6"E`) with instant Google Maps and directions deep links.

---

## ✦ Deployment to Vercel

This repository is pre-configured for instant zero-configuration deployment on [Vercel](https://vercel.com):

1. **Import Project**: Go to [vercel.com/new](https://vercel.com/new) and select the `ZENTRO-WEB` repository.
2. **Framework Preset**: Select `Other` (Static HTML).
3. **Root Directory**: `./` (default).
4. **Deploy**: Click **Deploy**.

The included `vercel.json` ensures:
- Full HTTP 206 Partial Content byte-range streaming for `.mp4` video files.
- Production cache-control headers for all assets and high-res imagery.
- Clean URLs and security headers.

---

## ✦ Project Structure
```
├── assets/                 # High-resolution logos, brand portraits, and video backups
├── css/
│   └── styles.css          # Architectural responsive CSS suite
├── Files/
│   └── Videos/             # 01.mp4 – 06.mp4 video showcase files
├── js/
│   └── app.js              # Booking concierge, video audio controller, slider logic
├── Logo/                   # Original vector and raster brand marks
├── index.html              # Core semantic editorial HTML5 document
├── vercel.json             # Vercel production deployment and header configuration
└── README.md
```

---

© 2026 Zentro Family Salon Atelier. All rights reserved.
