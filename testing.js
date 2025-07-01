var s = document.createElement('script');
s.src = 'https://raw.githack.com/grinn/ADT-IS-BrowserTrixBehaviors/main/fixAbsoluteReferences.js';
s.onload = function() {
  (async () => {
    const gen = MyBehavior.prototype.run.call({}, {
      getState: (msg) => msg // dummy ctx.getState that just returns the message
    });
    for await (const step of gen) {
      console.log("Yielded:", step);
    }
  })();
};
document.head.appendChild(s);

