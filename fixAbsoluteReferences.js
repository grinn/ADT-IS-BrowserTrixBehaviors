class MyBehavior
{
  // required: an id for this behavior, will be displayed in the logs
  // when the behavior is run.
  static id = "My Behavior Id";

  // required: a function that checks if a behavior should be run
  // for a given page.
  // This function can check the DOM / window.location to determine
  // what page it is on. The first behavior that returns 'true'
  // for a given page is used on that page.
  static isMatch() {
    return window.location.href.toLowerCase().startsWith("https://guilfordcountync.prod.govaccess.org");
  }

  // optional: if true, will also check isMatch() and possibly run
  // this behavior in each iframe.
  // if false, or not defined, this behavior will be skipped for iframes.
  static runInIframes = false;

  // optional: if defined, provides a way to define a custom way to determine
  // when a page has finished loading beyond the standard 'load' event.
  //
  // if defined, the crawler will await 'awaitPageLoad()' before moving on to
  // post-crawl processing operations, including link extraction, screenshots,
  // and running main behavior
  async awaitPageLoad() {

  }

  // required: the main behavior async iterator, which should yield for
  // each 'step' in the behavior.
  // When the iterator finishes, the behavior is done.
  // (See below for more info)
  async* run(ctx) {
    //... yield ctx.getState("starting behavior");

    // Add NCGUILCO_subscribe_overlay=1 to local storage to hide the popover
    localStorage.setItem("NCGUILCO_subscribe_overlay", "1");

    // Hotfix: Replace old domain references in common elements
    const oldDomains = [
      "www.guilfordcountync.gov",
      "guilfordcountync.gov"
    ];
    const newDomain = "guilfordcountync.prod.govaccess.org";

    // Helper to replace domain in a URL string
    function fixUrl(url) {
      if (!url) return url;
      let fixed = url;
      for (const oldDomain of oldDomains) {
        fixed = fixed.replace(
          new RegExp(`https?://(${oldDomain.replace(/\./g, "\\.")})`, "gi"),
          `https://${newDomain}`
        );
      }
      return fixed;
    }

    // List of [selector, attribute] pairs to fix
    const selectors = [
      ["a", "href"],
      ["img", "src"],
      ["script", "src"],
      ["link", "href"],
      ["iframe", "src"],
      ["video", "src"],
      ["audio", "src"],
      ["source", "src"],
      ["embed", "src"],
      ["object", "data"],
      ["form", "action"]
    ];

    for (const [selector, attr] of selectors) {
      document.querySelectorAll(`${selector}[${attr}]`).forEach(el => {
        const oldVal = el.getAttribute(attr);
        const newVal = fixUrl(oldVal);
        if (oldVal !== newVal) {
          el.setAttribute(attr, newVal);
        }
      });
    }

    //... yield ctx.getState("a step has been performed");
  }


}