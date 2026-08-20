# Compliment & Fortune

A mobile-friendly page: guests choose a photo from their library, write an
optional note, tap one button (which doubles as consent + 18+ confirmation),
and instantly see a compliment + fortune pulled from a pre-written pool of
200 of each — no live AI calls. Their photo, note, and reading get sent to
your Telegram chat.

## How it's structured

```
/index.html      → the guest-facing page
/style.css        → styling
/app.js           → front-end logic
/data.js          → the 200 compliments + 200 fortunes (edit freely)
/server/          → small backend that forwards entries to Telegram
```

**Important:** GitHub Pages only serves static files — it cannot run the
`/server` backend. You'll deploy the two parts separately:
- `index.html` / `style.css` / `app.js` / `data.js` → GitHub Pages (free)
- `/server` → a small Node host like Render, Railway, or Fly.io (free tiers
  available)

This split keeps your Telegram bot token out of your public GitHub repo and
out of anyone's browser dev tools.

## 1. Deploy the front-end (GitHub Pages)

1. Create a new GitHub repo and push everything **except** the `/server`
   folder's `.env` (there isn't one yet — just don't create it in the repo).
2. In the repo: **Settings → Pages → Source** → select your main branch,
   root folder. Save.
3. GitHub gives you a URL like `https://yourname.github.io/your-repo/`.
   That's the link your QR code will point to.

## 2. Deploy the backend

1. Push the `/server` folder to GitHub too (or a separate repo — either
   works, as long as your host can pull `/server` as the root).
2. Create an account on a host that runs Node servers for free, e.g.
   [Render](https://render.com) or [Railway](https://railway.app).
3. Create a new Web Service, point it at your repo/`/server` folder.
4. Set the **Start Command** to `npm start` and **Build Command** to
   `npm install`.
5. In the host's dashboard, add environment variables:
   - `TELEGRAM_BOT_TOKEN` = your bot's token (from @BotFather)
   - `TELEGRAM_CHAT_ID` = your chat ID (see below if you don't have it)
6. Deploy. You'll get a URL like `https://your-app.onrender.com`.

### Getting your Telegram chat ID
1. Message your bot anything on Telegram.
2. Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser.
3. Look for `"chat":{"id": ...}` — that number is your chat ID.

## 3. Connect front-end to backend

Open `app.js`, find this line near the top:

```js
const BACKEND_URL = 'https://YOUR-BACKEND-URL.example.com';
```

Replace it with your real backend URL from step 2, then commit and push.
GitHub Pages will pick up the change automatically.

## 4. Make your QR code

Once your GitHub Pages URL is live, generate a QR code pointing to it using
any QR generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com/)).
Since the URL won't change, you only need to do this once.

## 5. Test it end to end

Open the GitHub Pages link on your phone, choose a photo, write a note,
tap the button, and confirm the reading shows up on screen and the entry
lands in your Telegram chat.

---

## Editing the compliments/fortunes

Open `data.js`. There are four small phrase lists (`COMPLIMENT_A`,
`COMPLIMENT_B`, `FORTUNE_A`, `FORTUNE_B`) that get combined into 200 unique
compliments and 200 unique fortunes. Add, remove, or rewrite lines in any
pool to change the tone — no other code needs to change.

---

## Reusable prompt (if you want to rebuild this from scratch)

Paste this as one message to recreate the whole project:

> Build a mobile-friendly "compliment and fortune" web page with these
> requirements:
> 1. Guests need no login of any kind — they just open a link (scanned via
>    QR code) and use the page directly.
> 2. Flow is two steps only: (1) choose a photo from their device's photo
>    library (no camera capture option), (2) a single button that both
>    submits the entry and states "I'm 18+ and I consent to my photo & note
>    being processed and shared with the organizer" — no separate consent
>    checkbox.
> 3. After tapping submit, instantly show a "compliment" and a "fortune"
>    pulled from a pre-written pool of 200 compliments and 200 fortunes
>    (funny, confident, flirty-but-not-explicit tone) — shuffled so entries
>    don't repeat back-to-back. No live AI calls for this step.
> 4. Send the guest's photo, their optional note, and the compliment/fortune
>    shown to them to a Telegram chat via a bot.
> 5. Structure the whole thing as a GitHub-repo-ready project: a static
>    front-end (deployable to GitHub Pages) plus a small Node/Express
>    backend (deployable to Render/Railway) that holds the Telegram bot
>    token as a server-side environment variable, never exposed in the
>    public front-end code.
> 6. Give it a distinctive visual design (not a generic template look) with
>    an appealing animated background, and include a README with full
>    deployment steps for both the front-end and backend.
