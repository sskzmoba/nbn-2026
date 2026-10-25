> Follows the master rules in D:\claudecode\CLAUDE.md.

# NBN-2026 — "Guiding Lights" microsite

## Goal
A promo microsite for **Guiding Lights — Celebrating Educators Who Shape Generations**,
an initiative by alumni of Sainik School Kazhakootam (SSKZM Old Boys Association, OBA),
in remembrance of N. B. N. Sir, a former master. It brings together school principals,
teachers and distinguished speakers for conversations on education and a felicitation
of educators. It honours NBN Sir's legacy of making science accessible, nurturing
curiosity and teaching with humility and compassion.

## Programme facts (from flyer + programme card + WhatsApp concept note, 2026-10-25)
- **Date:** Saturday, 21 November 2026, 10:00 AM – 3:00 PM (programme begins 10:30 AM)
- **Venue:** Cariappa Auditorium, Pangode, Thiruvananthapuram. (It is inside the
  Pangode military station, but public text says only "Cariappa Auditorium, Pangode"
  — user's wish, 2026-10-25.)
- **Schedule:**
  - 10:00–10:30 Arrival, registration, meet & greet (tea and snacks)
  - 10:30–11:00 Inaugural session: 10:30 welcome and tribute to N. B. N. Sir;
    10:45 Special Address, "Inspiring the Next Generation to Serve" (encouraging young
    people to join the Armed Forces)
  - 11:00–11:30 Fireside Chat: "The Teachers and Experiences That Shape Us"
  - 11:30–12:30 Panel: "When Answers Are Everywhere, What Should Schools Teach?"
  - 12:30–1:00 Keynote: "Leading Schools That Shape Generations"
  - 1:00–1:45 Felicitation ceremony
  - 1:45–2:00 Vote of thanks and group photographs
  - 2:00–3:00 Lunch and networking
- Concept text (name, tagline, session descriptions) is in the WhatsApp note; use it
  as the site's "About" copy.
- **Attendance: by invitation only** (no public registration form).
- **N. B. N. Sir:** N. Balakrishnan Nair (1929–2016). Served Sainik School Kazhakootam
  from 1962 until his retirement in 1989.

## Live addresses (2026-10-25)
- Repo: https://github.com/sskzmoba/nbn-2026 (public). GitHub Pages serves **only
  `docs/`** from `main`, so build.md, `video/` and `_source/` are never on the website
  (build.md and `video/` are still readable in the public repo).
- **Review copy: https://nbn.sskzmoba.org/v1/**, shared with the organising group.
- https://nbn.sskzmoba.org/ shows a "website coming soon" holding page (`docs/index.html`).
- DNS: CNAME `nbn` → `sskzmoba.github.io` in ResellerClub (record id 169586966, TTL
  38400; in this panel the TTL applies to all CNAMEs, so leave it as is). Added 2026-10-25.
- **To go live** (only with the user's go-ahead): copy `docs/v1/*` to `docs/`
  (replacing the holding page), change `og:url`/`og:image` in index.html from `/v1/`
  to `/`, remove `noindex` if indexing is agreed, commit and push. Keep `/v1/` or
  delete it.
- Rollback: `git revert` the commit and push; Pages redeploys within a minute or two.
- HTTPS: certificate issued 2026-10-25, "Enforce HTTPS" on. Lesson: add the DNS record
  *before* attaching the custom domain on GitHub, or the first check fails and the
  certificate waits (fixed with "Check again" in repo Settings → Pages).
- Local preview: `.claude/launch.json` runs a small Node static server on `docs/`
  (port 5181); open http://localhost:5181/v1/.

## Folder layout
- `_source/` — untouched originals. **Not published**: keep out of the public repo
  via `.gitignore`, and keep a backup copy in the OBA Google Drive.
  - `artwork/poster-v1.jpeg` (1122×1402), `artwork/programme-card-v1.jpeg` (1024×1536)
  - `photos/nbn-sir-portrait.png` (1095×1437, B&W studio portrait)
  - `photos/school-main-building-hires.jpg` (8980×4280, 22 MB; real photo of the main
    building; used with SSKZM OBA permission, credited "SSKZM OBA")
  - `logos/sainik-school-crest.jpeg`: the **school's crest** ("Ministry of Defence"
    ring). **Not used**: it suggests an official school event.
  - `logos/oba-crest.jpeg`: OBA logo. The site and video use the identical transparent
    PNG copied from the Adventures repo (`img/oba-logo.png`).
  - `audio/asatoma-2.mp3` (21 s, single voice on F♯): **the chant used**. Recorded for
    SSKZM OBA; credited "SSKZM OBA" (singer's name can be added later). The three
    lines run 0.3–18.5 s; the closing "Om" (18.7 s on) is cut.
  - `audio/pixabay-pavamana-mantra-kalsstockmedia.mp3`: Pixabay Content Licence,
    AI-generated, 1:11. Downloaded 2026-10-25 as a fallback; **not used**.
  - `audio/segments.html`: listening page used to pick chant parts.
- Site in `docs/v1/` (same file layout as Adventures): `index.html`, `styles.css`,
  `app.js`, `guiding-lights.ics`, `img/` (web-sized images, each < 250 KB; `og.jpg` =
  link preview), `audio/chant.mp3` (website chant), `film/guiding-lights.mp4` (not linked from the page since 2026-10-25; kept as a download
  link for organisers: https://nbn.sskzmoba.org/v1/film/guiding-lights.mp4).
  `docs/index.html` = holding page, `docs/CNAME` = nbn.sskzmoba.org.
- Fonts (chosen 2026-10-25 from a side-by-side comparison of 4 options): **Libre
  Caslon Display** (titles) + **Libre Caslon Text** (everything else), Tiro Devanagari
  Sanskrit for the prayer. Same fonts in the video.
- `video/`: Remotion project for the WhatsApp film (see "Video" below).

## Video: WhatsApp Status film (built 2026-10-25)
- 45 s, 1080×1920, 30 fps, H.264. Remotion 4.0.538 (same as Adventures; free for
  non-profits). Source: `video/src/GuidingLights.tsx`.
- Storyboard: the prayer lines (each appears as it is sung) → N. B. N. Sir portrait
  → "GUIDING LIGHTS" title over the school photo (bell) → five sessions → date, time and
  venue → OBA logo, "An initiative by alumni of Sainik School Kazhakootam",
  nbn.sskzmoba.org (bell).
- Soundtrack: `video/audio/make-soundtrack.js` trims the chant, adds a reverb, and
  synthesises a tanpura drone tuned to the chant's F♯ and two soft bells. Only the
  chant is a third-party recording.
- Re-render after a text change (in `video/`):
  1. Decode the chant once:
     `node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe -i ../_source/audio/asatoma-2.mp3 -c:a pcm_s16le -ar 44100 -ac 2 audio/chant-source.wav`
  2. `node audio/make-soundtrack.js audio/chant-source.wav`
  3. `npm run render`, then `npm run render:og`
  4. Copy `out/guiding-lights.mp4` to `../docs/v1/film/` and `out/og.jpg` to
     `../docs/v1/img/`.
  The website chant plays at **normal speed** (user's decision, 2026-10-25, after
  trying 1.2× and 1.25×). Step 2 above also writes `audio/chant-web.wav`; convert it with
  `ffmpeg -i audio/chant-web.wav -c:a libmp3lame -b:a 128k ../docs/v1/audio/chant.mp3`.
  A sped-up version is possible without changing pitch: `ffmpeg -af atempo=1.2` on
  `chant-source.wav`, then `node audio/make-soundtrack.js <that file> 1.2` (writes only
  `chant-web.wav`). If the speed changes, update `LINES_CHANT` and `CHANT_END` in
  `docs/v1/app.js` to the new times at which each line is sung.
- The date card says "BY INVITATION". The closing card shows nbn.sskzmoba.org: the
  bare address shows the holding page until the site goes live, so share the video
  publicly only after launch (or with the /v1/ link during review).
- `npm run studio` opens a live preview for editing text and timings.

## Website plan (agreed 2026-10-25; v1 built)
One page that scrolls, in this order:
1. **Opening (about 8 s, skippable):** dark screen. The three lines of the
   Brihadaranyaka Upanishad prayer appear one at a time, in Devanagari with
   transliteration and English beneath (no "Om" at the start, no "shanti" at the end):
   *asato mā sad gamaya / tamaso mā jyotir gamaya / mṛtyor mā amṛtaṃ gamaya*
   ("Lead me from the unreal to the real, from darkness to light, from death to
   immortality"). NBN Sir's portrait then fades in with "In remembrance of N. B. N. Sir".
   "Darkness to light" leads straight into the name **Guiding Lights**.
   - Chant audio plays **only when the visitor taps "Play chant"**. Phones block
     autoplay with sound, and many people will open the link in public.
   - A "Skip intro ›" button. The opening plays once per visit and is cut short for
     visitors who have reduced motion turned on.
   - Timings (set in `docs/v1/app.js`): without sound, the lines appear at 0.2 / 1.2 /
     2.2 s, the portrait at 4.2 s, and the site at 8 s. After "Play chant", the lines
     restart in time with the chant (1.0 / 7.3 / 13.7 s), the portrait follows at
     19.5 s, and the site opens 2.5 s after the chant ends.
   - Audio source to decide: best is a recording by an alumnus, teacher or the
     school, made for this. Never a clip taken from YouTube (copyright).
2. **Guiding Lights hero:** title, tagline, date, time, venue, and the school photo as
   the backdrop. Buttons: Add to calendar (.ics), Directions (map link),
   Register (only if needed), WhatsApp enquiry.
3. **In remembrance of N. B. N. Sir:** portrait, full name, years at the school,
   subject, a short tribute. Optionally 3–5 short memories from alumni (with consent).
4. **The concept:** from the WhatsApp note: what Guiding Lights is, the name, the
   tagline.
5. **Programme:** the timetable as real text (searchable, readable aloud by screen
   readers), not an image.
6. **The conversations:** cards for the Special Address, Fireside Chat, Panel and
   Keynote, each with its theme line. Speaker slots read "To be announced" and are
   filled in as speakers confirm.
7. **Felicitation:** for now, *who* is honoured (categories) and *why*. Names go up
   only after each honouree has agreed (DPDP Act: consent before publishing a name
   or photo). After the event this becomes "Educators honoured", with photos.
8. **Venue and entry:** address, map link, entry rules for the military station
   (ID, guest list). No photos taken inside the military station.
9. **Footer:** organised by alumni of SSKZM (OBA logo), WhatsApp button, share
   button, downloads of the poster and programme card.
After 21 Nov the same page becomes the record of the event: photos, highlight video,
list of honourees.

Cost ₹0 (GitHub Pages). The 13 MB promo film sits in the repo (well under GitHub's
100 MB file limit). Longer event recordings go on YouTube, never in the repo.

### Video ideas (from the poster)
1. **Site opening animation:** built in HTML/CSS, not a video file. Light on mobile
   data, and text stays editable.
2. **Promo film for WhatsApp Status:** done as a 45 s Remotion film (see "Video" above).
3. **"The teacher who shaped me":** 30–60 s phone clips from alumni and speakers about
   NBN Sir or a teacher who mattered. Shared one a day in the run-up. Matches the
   Fireside Chat theme and is the most shareable. Needs each person's consent.
4. **Speaker announcement cards** as each speaker confirms (stills or 10 s clips).
5. **Event day:** record the sessions (check that filming is allowed at the military
   station), then a 2–3 minute highlights film on YouTube, embedded on the site.

### Decisions
- [x] Chant: `asatoma-2.mp3`, recorded for SSKZM OBA; credit "SSKZM OBA" (2026-10-25)
- [x] Logos: OBA logo only (2026-10-25)
- [x] Registration form: not needed, attendance is by invitation (2026-10-25)
- [x] School photo: SSKZM OBA permission; credit "SSKZM OBA" (2026-10-25)
- [x] Address: `nbn.sskzmoba.org`, review copy at `/v1/` (2026-10-25)
- [x] Fonts: Libre Caslon (2026-10-25)
- [x] Removed from the site: the Upanishad reference note under the prayer, and the
      "The name" / "The tagline" headings (2026-10-25)
- [x] Mobile navigation: normal scrolling. No one-screen "pages", snap scrolling or
      per-section chevrons; a slim section menu was offered and not needed for now
      (2026-10-25)
- [ ] Search indexing: v1 is `noindex`. Decide at launch (wa.me numbers in links are
      readable by search engines).
- [ ] Honourees: name them before the event, or only after?

## Decisions (2026-10-25)
- **Separate project and repo**, not a worktree/subfolder of the Adventures site
  (`sskzmoba/fall-in`, adventures.sskzmoba.org). Reason: GitHub Pages allows one custom
  domain per repo; different audience, tone and lifespan; cleaner handover.
- Repo `sskzmoba/nbn-2026` (public, GitHub Pages, ₹0) and address `nbn.sskzmoba.org`
  (CNAME at ResellerClub, ₹0): both created 2026-10-25, see "Live addresses".
- Same approach as Adventures: plain HTML/CSS/JS, no build step, mobile-first,
  contacts behind WhatsApp buttons, any data collection via Google Forms only.
  Copy (don't share) useful CSS / logo (`img/oba-logo.png`) from the Adventures repo.
- Open question: allow search indexing? (Adventures is `noindex`; this formal,
  public-facing programme probably should be findable.)
- **Deadline:** event is 21 Nov 2026, so the site must be live by about 1 Nov to be
  worth sharing.

## Problems found in the current artwork (2026-10-25)
- OBA logo on the poster is misspelt ("ASSOCIATTION", "SANIK SCHOOL"). It looks
  AI-redrawn. Replace it with the real logo file.
- The school building image looks AI-generated. Confirm it matches the real campus,
  or use a real photo.
- No speaker, panellist or chief-guest names appear anywhere yet.
- Uneven spacing in the time column of the programme card (1:00 / 1:45 / 2:00 rows).
- The "Special Address" (Armed Forces) appears on the poster and programme card but not
  in the concept note. Is it part of the theme or a separate item?

## Inputs still needed from the user
- [x] Existing flyer + programme details (banner-1.jpeg, progamme-1.jpeg, concept note)
- [ ] What to change in the banners (the user wants changes; specifics to come)
- [ ] Editable source of the artwork (Canva/Photoshop/AI tool?), or else rebuild it
- [x] NBN Sir portrait, school photo, school crest (2026-10-25)
- [x] OBA logo (2026-10-25)
- [ ] Speakers: special address, fireside chat, panellists + moderator, keynote
- [ ] Who is felicitated (names or categories) and how they are chosen
- [x] About NBN Sir: N. Balakrishnan Nair, 1929–2016, SSKZM 1962–1989 (2026-10-25)
- [x] Attendance: by invitation (2026-10-25)
- [ ] WhatsApp contact person(s) for enquiries (placeholder on the site for now)

## Work
- [x] Project folder + build.md + CLAUDE.md created (2026-10-25)
- [x] Flyer, programme card and concept note received (2026-10-25)
- [x] Source files organised into `_source/` (2026-10-25)
- [x] Website plan drafted (2026-10-25)
- [x] Go-ahead on the website plan + WhatsApp video (2026-10-25)
- [x] Site v1 built locally, tested at 375 px and desktop (2026-10-25). Yellow "[...]"
      boxes mark text still to come.
- [x] WhatsApp video v1 + link-preview image rendered (2026-10-25)
- [ ] User listens to the video and website chant (mix levels, drone)
- [x] Fonts switched to Libre Caslon in site + video; video re-rendered with
      "By invitation" (2026-10-25)
- [x] Repo created, Pages from `docs/`, DNS CNAME added, HTTPS certificate issued and
      enforced; review copy published at
      https://nbn.sskzmoba.org/v1/ (2026-10-25, user's request)
- [x] Round 2 changes (2026-10-25): website chant 1.2× with faster text, "Enter" →
      "Skip intro", "Military Station" removed from site, calendar file and video
      (video re-rendered); share section trimmed to the WhatsApp button
- [x] "Watch the film" button removed from the site; it repeated the page and cost
      13 MB of mobile data. The film is for WhatsApp sharing only (2026-10-25)
- [x] Mobile first screen fixed (2026-10-25): hero sizes scale with screen height (`svh`),
      buttons side by side; title, date, venue and both buttons fit on phones from
      360×600 up (checked 360×560 to 412×730; also iPhone SE in Safari, 375×548).
      Website chant back to 1.2×.
- [x] Mobile sections tightened (2026-10-25): phone-only rules (< 720 px) in styles.css:
      section padding 64 → 44 px, smaller NBN photo, compact cards, programme as a
      two-column list (time | session). Page at 375×667 went from 6,938 to about 6,000
      px; programme from 1.8 to 1.3 screens. No snap scrolling or forced one-screen
      sections (readability first). Desktop unchanged.
- [x] Website chant back to normal speed (user, 2026-10-25). Short screens (height
      ≤ 640 px, e.g. WhatsApp in-app browser on iPhone) show "Guiding Lights" on one line
      so both buttons fit; checked 360×460 to 412×730. CSS/JS links carry `?v=N`: raise
      it after every CSS/JS edit so phones do not use a cached old file.
- [ ] Organising group reviews /v1/; collect feedback
- [ ] Collect remaining inputs above; fill in the yellow boxes
- [ ] Revised poster + programme card
- [ ] Go live at the root address (only with go-ahead)
