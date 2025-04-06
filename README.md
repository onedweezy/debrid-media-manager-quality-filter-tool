---

# 📦 Debrid Media Manager Quality Enhancer

A Tampermonkey userscript that upgrades the [debridmediamanager.com](https://debridmediamanager.com) experience by tagging, highlighting, and sorting releases based on source, tier, and quality—using logic inspired by [TrashGuides](https://trash-guides.info). Built for both desktop and mobile, with full SPA support.

---

## ✨ Features

- 🏷 **Auto-tagging** of releases with:
  - Resolution (`2160p`, `1080p`, `720p`)
  - Source type (`WEB`, `REMUX`, `ENCODE`, `4KENCODE`)
  - Tier level (Tier 1 / 2 / 3 based on release group)
  - `DV` / `HDR` detection
- 🎨 **Color-coded tiers**:
  - Gold: Tier 1
  - Silver: Tier 2
  - Peru: Tier 3
- 📌 **Automatic sorting**:
  - Top-tier, highest-resolution releases get moved to the top
- 🧠 **Release group accuracy**:
  - Ensures correct group matches only within their specific source type
- 📱 **Mobile-friendly**:
  - Handles loading delays on mobile devices
- ✂️ **Cleaner UI**:
  - Removes `line-clamp-2` to display full release titles

---

## 🧠 Tier Matching Logic

This script uses custom tier lists for release groups categorized by source type, based on the TrashGuides community standard. For example:

- **REMUX**: Tier 1 – `FraMeSToR`, `ZQ`, `BMF`, etc.
- **WEB**: Tier 1 – `NTb`, `TEPES`, `APEX`, etc.
- **ENCODE**: Tier 1 – `DON`, `CtrlHD`, `TayTO`, etc.
- And many more...

Only groups within their respective source type will be matched to avoid false tagging (e.g., `PTer` in a REMUX will not trigger a tier highlight if it's only tiered in `ENCODE`).

---

## 🚀 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Create a new script and paste the contents of `debrid-quality-enhancer.user.js`
3. Or, use the raw install

---

## 📌 SPA Compatibility

This script hooks into browser history methods (`pushState`, `replaceState`, `popstate`) to detect page changes in the SPA. It waits for the “Loading…” text to disappear before processing the page, with extra delay handling for mobile users.

---

## 📸 Preview

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/11246000-74d8-4145-86ba-ab895408eeb4" />


---

## 🛠️ Customization

Feel free to modify the release group lists or tier colors inside the script to suit your preferences.

---

## 🤝 Credits

- Inspired by the excellent work and guidelines from [TrashGuides](https://trash-guides.info)
- Script written and maintained by me
---

Let me know if you'd like a version with installation images, badges, or a hosted raw link!
