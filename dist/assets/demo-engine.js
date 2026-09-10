// Deterministic scene state. Animation and controls share this timeline.
window.VenusScene = {
  frame(demo, position) {
    const time = Math.max(0, Math.min(demo.duration, Number(position) || 0));
    const complete = time >= demo.duration;
    const phaseIndex = demo.phases.reduce((index, phase, i) => phase.time <= time ? i : index, 0);
    const phase = demo.phases[phaseIndex];
    return {
      time, complete, phaseIndex, phase,
      channels: complete ? [] : phase.channels,
      visible: demo.events.map((event, i) => event.time <= time ? i : -1).filter(i => i >= 0),
      active: complete ? [] : demo.events.map((event, i) => time >= event.time && time < event.end ? i : -1).filter(i => i >= 0),
      chapter: demo.marks.reduce((index, mark, i) => mark.time <= time ? i : index, -1),
      filmProgress: demo.filmstripDuration ? Math.min(1, time / demo.filmstripDuration) : 0
    };
  }
};
