var s = document.createElement('script');
s.src = 'https://raw.githack.com/grinn/ADT-IS-BrowserTrixBehaviors/main/Behaviors/fixAbsoluteReferences.js';
s.onload = function() {
  (async () => {
    FixAbsoluteReferences.prototype.run.call({}, {
      getState: (msg) => msg, // dummy ctx.getState that just returns the message
      log: (msg) => console.log(msg) // dummy ctx.log that just logs to console
    }).next();
  })();
};
document.head.appendChild(s);

