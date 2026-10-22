---
inclusion: always
---

# My Dashboard — Project Steering

## Overview
A simple personal productivity dashboard built with vanilla HTML, CSS, and JavaScript. No frameworks, no backend — runs entirely in the browser using LocalStorage.

## Tech Stack
- **HTML** — structure only (`index.html`)
- **CSS** — one file: `css/style.css` (CSS Variables, Grid, Flexbox)
- **JavaScript** — one file: `js/app.js` (vanilla, no libraries)
- **Storage** — browser LocalStorage for all persistent data
- **Font** — OpenDyslexic via CDN (fonts.cdnfonts.com)

## Folder Rules
```
index.html        ← entry point
css/style.css     ← only 1 CSS file
js/app.js         ← only 1 JS file
.kiro/steering/   ← Kiro project config
```

## Features
| Feature | Description |
|---|---|
| Greeting | Shows current time, date, and time-based greeting (Good Morning/Afternoon/Evening/Night) |
| Custom Name | User can set their name — shown in greeting and topbar. Saved in LocalStorage |
| Dark / Light Mode | Toggle button in topbar. Yellow pastel for light mode. Saved in LocalStorage |
| Language | EN / ID toggle in topbar. All UI strings translated. Saved in LocalStorage |
| Focus Timer | Countdown timer with custom duration (1–120 min). Persists across refresh via LocalStorage |
| Timer Alarm | Web Audio API alarm (no external files) + in-page popup + browser notification when timer ends |
| To-Do List | Add / edit / mark done / delete tasks. Saved in LocalStorage |
| Quick Links | Add / remove favourite links as chips. Saved in LocalStorage |

## LocalStorage Keys
| Key | Value |
|---|---|
| `dashboard_theme` | `"dark"` or `"light"` |
| `dashboard_lang` | `"en"` or `"id"` |
| `dashboard_user_name` | string |
| `dashboard_timer_duration` | number (minutes) |
| `dashboard_timer_state` | JSON `{ remaining, savedAt, running }` |
| `dashboard_todos` | JSON array of `{ id, text, done }` |
| `dashboard_links` | JSON array of `{ id, name, url }` |

## i18n
All UI strings live in the `TRANSLATIONS` object at the top of `js/app.js`.
- To change any UI text → edit the matching key in `TRANSLATIONS.en` and `TRANSLATIONS.id`
- Do NOT edit text directly in `index.html` for elements with `data-i18n` or `data-i18n-placeholder` — JS will overwrite them on load

## Deployment
- Hosted on **GitHub Pages** from the `main` branch (`/ root`)
- Live URL: `https://daisymuthiah0142-gif.github.io/CodingCamp-19Okt26-DaisyMuthiah/`
- Every `git push origin main` auto-deploys within 1–2 minutes
