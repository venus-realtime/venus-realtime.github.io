const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({window:{}});
for (const file of ['demos.js','demo-engine.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/assets',file),'utf8'),context);
const scenes = Object.fromEntries(context.window.VENUS_DEMOS.map(scene => [scene.id,scene]));
const frame = (id,t) => JSON.parse(JSON.stringify(context.window.VenusScene.frame(scenes[id],t)));

test('The whistle response appears at 16 s, after a period of observation', () => {
  const waiting=frame('proactive',15.9), response=frame('proactive',16);
  assert.deepEqual(waiting.visible,[0]);
  assert.deepEqual(waiting.channels,['listen']);
  assert.deepEqual(response.visible,[0,1,2]);
  assert.deepEqual(response.channels,['listen','speak']);
});
test('Delegation overlaps with input, then returns to speech', () => {
  assert.deepEqual(frame('delegation',9).channels,['listen','speak']);
  assert.deepEqual(frame('delegation',10).channels,['listen','delegate']);
  assert.deepEqual(frame('delegation',14.9).visible,[0,1,2]);
  assert.deepEqual(frame('delegation',15).channels,['listen','speak']);
  assert.deepEqual(frame('delegation',15).visible,[0,1,2,3]);
});
test('An interruption stops the original response before the new answer', () => {
  assert.deepEqual(frame('interruption',12.9).channels,['listen','speak']);
  assert.deepEqual(frame('interruption',13).channels,['listen']);
  assert.deepEqual(frame('interruption',13).active,[2]);
  assert.deepEqual(frame('interruption',15).channels,['listen','speak']);
  assert.deepEqual(frame('interruption',15).active,[3]);
});
test('Film position follows the paper’s 40 s axis, not the playback endpoint', () => {
  assert.equal(frame('proactive',16).filmProgress,.4);
  assert.equal(frame('delegation',20).filmProgress,.5);
});
test('Rewinding hides future dialogue and completion does not stick', () => {
  assert.equal(frame('interruption',30).complete,true);
  assert.equal(frame('interruption',13).complete,false);
  assert.deepEqual(frame('interruption',13).visible,[0,1,2]);
  assert.deepEqual(frame('interruption',0).visible,[]);
});
test('Out-of-range positions clamp and a completed scene has no active channels', () => {
  assert.equal(frame('proactive',-5).time,0);
  const end=frame('delegation',100);
  assert.equal(end.time,22);
  assert.equal(end.complete,true);
  assert.deepEqual(end.channels,[]);
  assert.deepEqual(end.active,[]);
});
