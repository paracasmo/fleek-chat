#Usage
install
``` js
npm install
```

usage
```js
 node server.js <trackingString>
```

# Idea Outline
- (Anthropomorph) Twitter convo -> two entities that chat to each other about topics picked at random.
- They draw their utterances from the twitter api and use speech synthesis in Chrome to actually talk. 
- Topics reset from time to time and some configuration should be available (filters, topic lists, convo length/time, etc.)

# Ideas
- add events for control (add keyword, remove keyword, change delay, etc..)
- make behavior plugin-able
- default plugin = couple of filters + grabbing actual convos with @username mentions
- leave proper entity AI to pros
- turn this code into actual functional programming not just scripting my way out of a situation
- pass proper object to consumer, not just predefined string. need to be clear about how to serve a consumer first, though
- consider streaming this to have people call me out on my f-ups
