// Real recordings can be added with type: 'video', src and optional poster/captions.
// The supplied examples are explicitly presented as manuscript walkthroughs.
window.VENUS_DEMOS = [
  {
    id: 'proactive', type: 'walkthrough', model: 'Venus-Realtime-Omni',
    category: 'Proactive perception', title: 'Notice the moment that matters',
    summary: 'Venus keeps watching and listening after the request, then responds when the relevant event happens.',
    source: 'Illustrated from Figure 4. No recorded model audio or video. Timeline markers come from the paper.',
    figure: './assets/proactive-example.png', filmstrip: './assets/proactive-filmstrip.jpg',
    filmstripAlt: 'Original football-match frames from the manuscript example.',
    duration: 20, input: 'Audio + video input',
    marks: [{time:3,label:'Set a reminder'},{time:16,label:'The whistle blows'}],
    states: [{time:0,label:'Following the scene'},{time:3,label:'Watching for the requested event'},{time:16,label:'Responding to the event'}],
    events: [
      {time:3, end:16, role:'You', text:'When the referee blows the whistle, please remind me.'},
      {time:16, end:20, role:'Scene event', text:'The referee blows the whistle.', kind:'event'},
      {time:16, end:20, role:'Venus', text:'The referee has blown the whistle! The game has started.'}
    ],
    note: 'The figure marks the reminder at 16 s; it does not report its speech duration. The walkthrough ends at 20 s for presentation.'
  },
  {
    id:'delegation', type:'walkthrough', model:'Venus-Realtime-Omni',
    category:'Asynchronous delegation',title:'Get answers while life keeps moving',
    summary:'The frontend acknowledges a request while the harness looks up external information. The audio–visual stream continues throughout.',
    source:'Illustrated from Figure 4. English translation of the paper’s Chinese dialogue; the traffic information belongs to that example.',
    figure:'./assets/delegation-example.png',filmstrip:'./assets/delegation-filmstrip.jpg',
    filmstripAlt:'Original driving-scene frames from the manuscript example.',
    duration:22,input:'Audio + video input',
    marks:[{time:3,label:'Ask a question'},{time:10,label:'Delegate the lookup'},{time:15,label:'Bring the answer back'}],
    states:[{time:0,label:'Following the scene'},{time:3,label:'Receiving the request'},{time:8,label:'Acknowledging'},{time:10,label:'Harness working · input continues'},{time:15,label:'Delivering the answer'}],
    events:[
      {time:3,end:8,role:'You',text:'Please check which license-plate endings are restricted in Beijing today.'},
      {time:8,end:10,role:'Venus',text:'Sure, I’ll check.'},
      {time:10,end:15,role:'Harness',text:'Querying the external service while the input stream continues.',kind:'event'},
      {time:15,end:22,role:'Venus',text:'Today, vehicles with license plates ending in 3 or 8 are restricted in Beijing, from 7:00 to 20:00.'}
    ],
    note:'Traffic information is quoted from the paper example, not current guidance. The five-second query interval is an example timeline, not a latency benchmark.'
  },
  {
    id:'interruption',type:'walkthrough',model:'Venus-Realtime-Audio',
    category:'Full-duplex conversation',title:'Change direction mid-conversation',
    summary:'Venus listens during its own response, yields to the follow-up, and answers the revised question.',
    source:'Illustrated from Figure 4. Original English dialogue; no recorded speech or live model connection.',
    figure:'./assets/interruption-example.png',duration:30,input:'Audio input',
    marks:[{time:5,label:'Venus speaks'},{time:13,label:'You interrupt'},{time:15,label:'The response adapts'}],
    states:[{time:0,label:'Listening'},{time:1,label:'Receiving the request'},{time:5,label:'Speaking and listening'},{time:13,label:'Yielding to the interruption'},{time:15,label:'Answering the follow-up'}],
    events:[
      {time:1,end:5,role:'You',text:'Help me plan a three-day road trip with safe pacing.'},
      {time:5,end:13,role:'Venus',text:'Aim for 5–7 driving hours daily, take a break every two hours, plus lunch and an…',interrupted:true},
      {time:13,end:15,role:'You',text:'What should each day look like for breaks and meals?',kind:'interruption'},
      {time:15,end:30,role:'Venus',text:'Start after breakfast, drive two hours, then take a short break. Drive two more hours, stop for lunch, and continue one to three hours before dinner and overnight rest.'}
    ],
    note:'The initial response is truncated in the original figure. Event times illustrate the conversational sequence and are not response-latency measurements.'
  }
];
