# my-first

A demo landing page for **SeldonEVOHub / my-first**.

It is a single static page: dark surface, bilingual hero, three feature cards, and a small live-typing signal you can recolor. There is no build step, no backend, and no account.

## Preview locally

**Open the file.** Double-click `index.html`, or drag it into a browser window.

**Or serve the folder.** From this directory:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## What you should see

- A dark landing page with a Chinese and English headline
- A “What this is” section and three feature cards: cloud coding, GitHub workflow, and PR delivery
- A signal panel that types a sample delivery log
- Amber, Celadon, and Iris tones that change the page glow
- Hover on the log pauses the typing (on a device with a pointer)

Fonts load from Google Fonts when you are online. Offline, the page falls back to system serif, sans, and monospace faces.

## Files

| Path | Role |
| --- | --- |
| `index.html` | Page structure and copy |
| `assets/styles.css` | Layout, color, motion |
| `assets/main.js` | Typing log, accent tone, scroll state |
| `assets/favicon.svg` | Tab icon |
