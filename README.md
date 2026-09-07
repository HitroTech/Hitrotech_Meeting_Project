# HitroTech Meet

A lightweight, branded video conferencing page for HitroTech — start or join a secure video meeting instantly, no downloads or accounts required.

## Tech Stack

- **HTML / CSS / JavaScript** — no framework, no build step
- **[Jitsi Meet External API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)** — powers the actual video/audio calling via Jitsi's free public server (`meet.jit.si`)
- Deployed as a static site on **Vercel**

## Project Structure

```

meeting_project/
├── index.html      # page structure
├── style.css       # all styling (light/dark aware)
├── script.js       # form validation + Jitsi call setup
├── assets/
│   └── logo.png    # HitroTech logo
└── README.md
```

## How It Works

1. User enters a **room name** and their **display name** on the landing page.
2. Both fields are validated client-side (required, length limits, allowed characters).
3. On submit, the browser is **redirected to `meet.jit.si`** with a room scoped to `HitroTechMeet-<room>`, so it doesn't collide with unrelated public rooms.
4. No backend, database, or account system — Jitsi's public infrastructure handles the actual video/audio.

### Why a redirect instead of an embedded iframe?

Jitsi's public server explicitly disconnects **embedded** calls (via its iframe/External API) after 5 minutes, with the message *"Embedding meet.jit.si is only meant for demo purposes."* That restriction does not apply to a normal full-page redirect, so this app hands off to `meet.jit.si` directly instead of embedding it. The trade-off: HitroTech branding is visible on the landing/launch page, but the call itself runs on Jitsi's own site.

**If persistent in-call branding is needed later**, the options are:
- **Jitsi as a Service (JaaS)** — 8x8's hosted product, built for embedding with your own branding; free tier available (~10,000 participant-minutes/month), needs an 8x8 account + API setup.
- **Self-hosting Jitsi** — full control (own branding, no limits), needs a VPS (e.g. Oracle Cloud's Always Free tier).

## Run Locally

No build tools needed. Either:

- Open `index.html` directly in a browser, **or**
- Serve it locally for a cleaner experience:
  ```bash
  npx serve .
  ```
  then visit the printed local URL.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Leave build settings empty (it's a static site — no build command needed).
4. Click **Deploy**. Your live link will look like `https://<project-name>.vercel.app`.

## Notes

- This uses Jitsi's **free public server**, so there's no hosting cost and no server to maintain.
- Room names are restricted to letters, numbers, and hyphens to keep meeting URLs clean and valid.
- Branding (logo, colors, tagline) is used with HitroTech's authorization.
