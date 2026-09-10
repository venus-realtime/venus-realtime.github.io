# Venus-Realtime project website

A responsive static academic project page based on the authorized Overleaf manuscript, dated September 9, 2026.

## Content

- Two 9B conversational frontends and the shared asynchronous Harness.
- Three figures extracted from the source manuscript: Figures 1, 3, and 5.
- Selected benchmark scores with evaluation scope and conditions.
- Manuscript link and a copyable BibTeX reference.

The manuscript supplies no public Venus code, model, arXiv, or DOI URL, so none is invented. The manuscript link opens Overleaf and may require access permission.

## Edit and preview

The complete website is in `dist/`; no dependencies or build step are required.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

- `dist/index.html`: website content.
- `dist/assets/site.css`: responsive layout and theme.
- `dist/assets/site.js`: citation-copy interaction.
- `dist/assets/*.png`: manuscript figures.
- `dist/.nojekyll`: static GitHub Pages marker.

## Publishing

The intended GitHub Pages URL is `https://venus-realtime.github.io/`. This requires management rights to the `venus-realtime` account or organization and its `venus-realtime.github.io` repository. A Sites private preview is separate from this GitHub Pages destination.

For GitHub Pages, publish the contents of `dist/` at the repository's publishing root. Do not publish private notes, downloaded source files, or authentication material in `work/`. Current deployment details are recorded in `work/`.
