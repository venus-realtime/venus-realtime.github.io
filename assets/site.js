(() => {
  const copyButton = document.getElementById('copy-citation');
  const copyStatus = document.getElementById('copy-status');
  const citation = document.getElementById('bibtex');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent);
      copyStatus.textContent = 'Citation copied to clipboard.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges(); selection.addRange(range);
      copyStatus.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });

  const demos = window.VENUS_DEMOS || [];
  const tabs = Array.from(document.querySelectorAll('.demo-tab'));
  const panel = document.getElementById('demo-panel');
  const media = document.getElementById('demo-media');
  const controls = document.getElementById('demo-controls');
  let current, time = 0, playing = false, frame = 0, previous = 0;
  let scrubber, playButton, timeLabel, transcript, stateLabel;
  const timestamp = value => `00:${String(Math.floor(value)).padStart(2, '0')}`;
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function stop() {
    playing = false; cancelAnimationFrame(frame); previous = 0;
    if (playButton) { playButton.textContent = time >= current.duration ? 'Replay walkthrough' : 'Play walkthrough'; playButton.setAttribute('aria-pressed', 'false'); }
  }
  function update() {
    if (!current || current.type !== 'walkthrough') return;
    time = Math.min(current.duration, Math.max(0, time));
    scrubber.value = String(time);
    scrubber.setAttribute('aria-valuetext', `${timestamp(time)} of ${timestamp(current.duration)}`);
    timeLabel.textContent = `${timestamp(time)} / ${timestamp(current.duration)}`;
    const state = current.states.filter(event => event.time <= time).at(-1);
    stateLabel.textContent = time >= current.duration ? 'Walkthrough complete' : state.label;
    current.events.forEach((event, i) => {
      const el = transcript.children[i];
      const active = time >= event.time && (time < event.end || time >= current.duration && event.end === current.duration);
      el.classList.toggle('is-active', active);
      el.classList.toggle('has-played', time >= event.time);
      if (active) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    if (time >= current.duration) stop();
  }
  function tick(now) {
    if (!playing) return;
    if (previous) time += (now - previous) / 1000;
    previous = now; update();
    if (playing) frame = requestAnimationFrame(tick);
  }
  function toggle() {
    if (playing) { stop(); return; }
    if (time >= current.duration) time = 0;
    playing = true; previous = 0;
    playButton.textContent = 'Pause walkthrough'; playButton.setAttribute('aria-pressed', 'true');
    frame = requestAnimationFrame(tick);
  }
  function showWalkthrough() {
    const visual = node('div', 'stream-context');
    visual.append(node('span', 'stream-label', current.input));
    if (current.filmstrip) {
      const strip = node('img', 'filmstrip'); strip.src = current.filmstrip; strip.alt = current.filmstripAlt;
      visual.append(strip);
    } else {
      const lanes = node('div', 'audio-lanes');
      const listen = node('div', '', 'LISTEN'); listen.append(node('span', 'listening-lane', 'Incoming speech'));
      const speak = node('div', '', 'SPEAK'); speak.append(node('span', 'speaking-lane', 'Response → interruption → new response'));
      lanes.append(listen, speak); visual.append(lanes);
    }
    stateLabel = node('p', 'walkthrough-state'); visual.append(stateLabel); media.append(visual);
    transcript = node('ol', 'walkthrough-transcript');
    transcript.setAttribute('aria-label', 'Full example transcript with current step highlighted');
    current.events.forEach(event => {
      const item = node('li', 'transcript-item' + (event.role === 'Venus' ? ' from-venus' : '') + (event.kind ? ' ' + event.kind : ''));
      const head = node('div', 'transcript-head');
      head.append(node('strong', '', event.role), node('span', '', timestamp(event.time)));
      item.append(head, node('p', '', event.text));
      if (event.interrupted) item.append(node('span', 'transcript-note', 'Interrupted before the sentence finishes'));
      transcript.append(item);
    });
    media.append(transcript);
    const bar = node('div', 'playback-bar');
    playButton = node('button', 'walkthrough-play', 'Play walkthrough'); playButton.type = 'button'; playButton.setAttribute('aria-pressed', 'false'); playButton.addEventListener('click', toggle);
    scrubber = node('input', 'timeline-slider'); scrubber.type = 'range'; scrubber.min = '0'; scrubber.max = String(current.duration); scrubber.step = '.1'; scrubber.value = '0'; scrubber.setAttribute('aria-label', 'Walkthrough timeline');
    scrubber.addEventListener('input', () => { time = Number(scrubber.value); previous = 0; update(); });
    timeLabel = node('span', 'playback-time');
    bar.append(playButton, scrubber, timeLabel); controls.append(bar);
    const chapters = node('div', 'walkthrough-chapters');
    current.marks.forEach(mark => {
      const button = node('button', '', `${String(mark.time).padStart(2, '0')}s · ${mark.label}`); button.type = 'button';
      button.addEventListener('click', () => { stop(); time = mark.time; update(); }); chapters.append(button);
    });
    controls.append(chapters, node('p', 'playback-note', current.note)); update();
  }
  function showVideo() {
    const video = node('video', 'recorded-demo'); video.controls = true; video.playsInline = true; video.preload = 'metadata'; video.src = current.src;
    if (current.poster) video.poster = current.poster;
    if (current.captions) { const track = node('track'); track.kind = 'captions'; track.src = current.captions; track.srclang = current.language || 'en'; track.label = 'Captions'; video.append(track); }
    video.append(node('p', '', 'Your browser does not support this video.'));
    video.addEventListener('error', () => {
      const message = node('p', 'video-error', 'The recording could not be loaded. ');
      const link = node('a', '', 'Open the video directly'); link.href = current.src; link.target = '_blank'; link.rel = 'noopener'; message.append(link); media.append(message);
    }, {once: true});
    media.append(video);
  }
  function select(id, focus = false) {
    const match = demos.find(demo => demo.id === id);
    if (!match) return;
    stop(); media.querySelector('video')?.pause(); current = match; time = 0;
    media.replaceChildren(); controls.replaceChildren(); playButton = null;
    tabs.forEach(tab => { const active = tab.dataset.demo === id; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; if (active && focus) tab.focus(); });
    panel.setAttribute('aria-labelledby', 'tab-' + id);
    document.getElementById('demo-model').textContent = current.model;
    document.getElementById('demo-format').textContent = current.type === 'video' ? 'RECORDED DEMO' : 'PAPER EXAMPLE REPLAY';
    document.getElementById('demo-category').textContent = current.category;
    document.getElementById('demo-title').textContent = current.title;
    document.getElementById('demo-summary').textContent = current.summary;
    document.getElementById('demo-source').textContent = current.source;
    const figureLink = document.getElementById('demo-figure-link'); figureLink.href = current.figure; figureLink.hidden = !current.figure;
    if (current.type === 'video') showVideo(); else showWalkthrough();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.demo));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next].dataset.demo, true); }
    });
  });
  document.querySelector('.hero-example').addEventListener('click', () => select('interruption'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); media.querySelector('video')?.pause(); } });
  if (demos.length) select(demos[0].id);
})();
