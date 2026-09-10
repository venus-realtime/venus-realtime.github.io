# Venus-Realtime

Project website for **Venus-Realtime: A full-duplex interaction system with asynchronous delegation**.

**Public website:** https://venus-realtime.github.io/

## Website content

A demo-led presentation of proactive audio–visual interaction, full-duplex speech and asynchronous delegation. It includes three interactive paper-example walkthroughs with playback, scrubbing, chapter navigation and complete transcripts; research highlights; expandable system and evaluation details; and a copyable citation.

The reading order is overview → demos → results → method → paper. Navigation follows that order; architecture and detailed benchmarks expand on demand.

The walkthroughs are **illustrations reconstructed from Figure 4**, not real model recordings or a live service. All dialogue and scores come from the September 9, 2026 manuscript. The delegation transcript is translated from Chinese and its example traffic information is not current guidance.

## Local preview

The complete static site is in `dist/`. There are no dependencies or build steps.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

## Add recorded demos

Edit `dist/assets/demos.js`. For an existing scene, set `type` to `video` and add a direct video URL or a path to a file inside `dist/`. The viewer uses a native video player with keyboard controls and no autoplay. Update the scene title, summary and source to describe the real recording.

```js
{
  id: 'proactive',
  type: 'video',
  src: './assets/demos/proactive.mp4',
  poster: './assets/demos/proactive-poster.jpg',
  captions: './assets/demos/proactive.en.vtt',
  language: 'en',
  // Keep and update the existing model, category, title, summary and source.
}
```

`poster`, `captions` and `language` are optional. Use owned or authorized footage and captions. Never add API keys or credentials to the static website. The manuscript provides no public Venus model/code download URL, so none has been invented.

## Files

- `dist/index.html`: page content and navigation.
- `dist/assets/site.css`: responsive styling.
- `dist/assets/site.js`: walkthroughs, video playback and citation copying.
- `dist/assets/demos.js`: demo content and media settings.
- `dist/assets/*example.png`: original Figure 4 examples.
- `dist/assets/*filmstrip.jpg`: original manuscript image strips.
- `dist/assets/fonts/InterVariable.woff2`: self-hosted Inter variable font.

## Typography and editorial style

Inter is bundled from the [official Inter distribution](https://rsms.me/inter/) with its SIL Open Font License in `dist/assets/fonts/OFL.txt`. It is served locally; visitors do not need to contact an external font provider. The layout uses 400, 500 and 600 weights, a 16 px body size, and a 13 px minimum for supporting labels. Heading sizes adapt to viewport width. Code uses a system monospace face; metrics and timestamps use tabular numerals.

Use sentence case for headings and interface labels. Preserve official names (`Venus-Realtime-Omni`, `Venus-Realtime-Audio`, `Venus-Realtime-Harness`), benchmark names and acronyms. Use `BibTeX`, `Figure 4` and `13 s` rather than all-caps labels or zero-padded figure numbers. Keep dynamic demo labels consistent with the initial HTML.

## Deployment

The `main` branch holds source; the `gh-pages` branch publishes the contents of `dist/` at the site root. The private Sites preview is a separate deployment of the same static output. Workspace-only downloads and notes in `work/` and packaged deliverables in `outputs/` are excluded from Git.
