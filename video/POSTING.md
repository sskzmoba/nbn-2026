# Guiding Lights 2026 — video posting ledger

The one list of every video made after the event (21 Nov 2026): the file, where it goes, when, and whether it is
checked and posted. Update a row when something changes. All video work happens in this folder (one thread).

- Instagram: **@sskzmoba** (new main account, 24 Nov 2026; the old `obasskzm` is locked).
- YouTube: channel "SSKZM OBA" (@SSKZMOBA). Full film: https://youtu.be/GicfgyElS9M. Playlist "Guiding Lights 2026"
  (film first, then the Shorts). Banner, logo, description and links set 24 Nov. Clickable description links and
  "Related video" on Shorts wait for YouTube's video verification (requested 24 Nov, about 24 hours).
- Before a guest's video goes out, the coordinator checks that guest's part. Capt Breeze approves his own video.
- On Instagram, use **Invite collaborator** for the guest(s) in the video, then phone their office to accept.
- Folders: `F` = `D:\claudecode\oba\events\nbn-2026\.claude\worktrees\admiring-wu-e6735d\video\out`,
  `B` = `D:\temp\NBN\bites`, `N` = `D:\temp\NBN`.

## Posting order

| Day | Video | File | Instagram | YouTube | Checked | Posted |
|---|---|---|---|---|---|---|
| — | Voices from the day (4:17, 16:9) | `F\final\… (1080p master).mp4`, thumbnail `F\final\… YouTube thumbnail.jpg` | link in bio | ✅ video | ✅ | ✅ YouTube 24 Nov |
| 0 | The teacher's story, "Held on" (45 s, vertical) | `F\insta\Guiding Lights 2026 - The teacher's story (held on 21 Nov).mp4` | Reel, first post | Short | ✅ | ✅ Instagram + YouTube 24 Nov |
| 1 | Instagram highlights (1:44, vertical) | `F\insta\Guiding Lights 2026 - Instagram highlights.mp4` | Reel, guests as collaborators | Short | ✅ | ✅ Instagram + YouTube 24 Nov (collaborators pending) |
| 1–2 | Event highlights v4 (1:36, 16:9, organisers' edit) | `N\GuidingLightsHighlights-v4-musicB.mp4` | — (or a feed post) | video | ☐ ElevenLabs licence | ☐ |
| 2 | Dr B Ashok IAS (speaker video) | `B\guiding-lights-dr-b-ashok.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 3 | Dr K Vasuki IAS | `B\guiding-lights-dr-vasuki.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 4 | Smt Amala Akkineni | `B\guiding-lights-amala-akkineni.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 5 | Prof Dr Jancy James | `B\guiding-lights-prof-jancy-james.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 6 | Dr TR John | `B\guiding-lights-dr-tr-john.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 7 | Shri R Abhilash | `B\guiding-lights-r-abhilash.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 8 | Col Sidharth Karanbir Gurung | `B\guiding-lights-col-gurung.mp4` | Reel | Short | ☐ | ☐ |
| 9 | Kamal Krishnan PS | `B\guiding-lights-kamal-krishnan.mp4` | Reel + collaborator | Short | ☐ | ☐ |
| 10 | Capt(IN) KM Breeze Antony on NBN Sir | `B\breeze-obapresident-on-nbn-sir.mp4` | Reel | Short | ☐ Breeze approves | ☐ |
| 11 | Welcome and thanks (Col Pramod M, Lt Col Arun Sathyan) | `B\guiding-lights-welcome-and-thanks.mp4` | Reel | Short | ☐ | ☐ |

Each speaker video has a `-whatsapp.mp4` copy (720p) next to it for WhatsApp.

## Carousels (1080×1350, Instagram; PDF for LinkedIn)
Files in `F\carousels\<deck>\` (one JPEG per slide) and `F\carousels\… (LinkedIn).pdf`; PDFs also in the Drive folder
"08 Report and press kit" next to the 7-day plan doc.
| Day | Carousel | Slides | Checked | Posted |
|---|---|---|---|---|
| 2 | 32 educators honoured (`honoured`) | 10 | ☐ names and schools | ☐ |
| 4 | The panel in quotes (`panel`): Kamal, Vasuki, Jancy, TR John, Abhilash | 7 | ☐ | ☐ |
| 6 | With gratitude (`thanks`) | 5 | ☐ | ☐ |

Quotes are the exact spoken words (checked against the word timings). 7-day plan (captions, tagging list):
https://docs.google.com/document/d/1sNbT-PERdv_SLpUWPUosiy-GjEpeOLOjZMxfJsBS45I/edit

## Not in the posting plan
- Guest reels of about 20 s (`F\insta\guests\…`): use only for WhatsApp Status. The speaker videos above replace them.
- Breeze's full NBN Sir talk (`BreezeTalk`, 7:53, 16:9): YouTube, once Breeze approves.

## Source and rebuild (all in `video/`)
| Video | Composition | Built by |
|---|---|---|
| Voices from the day | `SpeakersFilm` | `tools/build-speakers-film.py` |
| Instagram highlights | `InstaReel` | `tools/build-insta-reel.py` |
| 20 s guest reels | `InstaGuest-<id>` | `tools/build-insta-reel.py` |
| Teacher's story, held on | `TeachersStoryHeld` | — |
| YouTube thumbnail | `YouTubeThumb` | — |
| Speaker videos | `Bite-<key>` | `tools/bites/prep_bite.py`, `render_bite.sh <key> <name>` |
| Breeze full talk | `BreezeTalk` | `tools/bites/prep_full.py` |
| Carousels | `CarouselHonoured`, `CarouselPanel`, `CarouselThanks` (`src/Carousels.tsx`, `src/carousel-honourees.json`) | `remotion still --frame=<slide-1>` |
| Event highlights cards | `HighlightsIntro`, `HighlightsOutro` | `tools/highlights/*.py` (middle section, flash and shake fixes) |

Media (footage, music, photos) live in `public/film/` and `public/breeze/`, which are gitignored. Keep a copy on
Drive.
