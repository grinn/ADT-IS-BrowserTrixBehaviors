class FixAbsoluteReferences
{
  // required: an id for this behavior, will be displayed in the logs
  // when the behavior is run.
  static id = "Fix Absolute References";

  // required: a function that checks if a behavior should be run
  // for a given page.
  // This function can check the DOM / window.location to determine
  // what page it is on. The first behavior that returns 'true'
  // for a given page is used on that page.
  static isMatch() {
    return window.location.href.toLowerCase().startsWith("https://guilfordcountync.prod.govaccess.org");
  }

  static init () {
    return { state: {} };
  }

  // optional: if true, will also check isMatch() and possibly run
  // this behavior in each iframe.
  // if false, or not defined, this behavior will be skipped for iframes.
  // static runInIframes = false;

  // optional: if defined, provides a way to define a custom way to determine
  // when a page has finished loading beyond the standard 'load' event.
  //
  // if defined, the crawler will await 'awaitPageLoad()' before moving on to
  // post-crawl processing operations, including link extraction, screenshots,
  // and running main behavior
  /* async awaitPageLoad() {

  } */

  // required: the main behavior async iterator, which should yield for
  // each 'step' in the behavior.
  // When the iterator finishes, the behavior is done.
  // (See below for more info)
  async* run(ctx) {
    //... yield ctx.log("starting behavior");

    // Add NCGUILCO_subscribe_overlay=1 to local storage to hide the popover
    localStorage.setItem("NCGUILCO_subscribe_overlay", "1");

    ctx.log("Set overlay bit 1225.");
    ctx.log("Do another thing.");

    
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

    ctx.log(`Fixing absolute references in ${selectors.length} selectors...`);
    
    for (const [selector, attr] of selectors) {
      ctx.log(`Processing selector: ${selector}, attribute: ${attr}, matching elements: ${document.querySelectorAll(selector).length}`);
      for (const el of document.querySelectorAll(`${selector}[${attr}]`)) {
        const oldVal = el.getAttribute(attr);
        const newVal = fixUrl(oldVal);
        if (oldVal !== newVal) {
          // Update the attribute with the new value
          el.setAttribute(attr, newVal);
          ctx.log(`Fixed ${attr} in ${selector} element: ${oldVal}`);
        }
      }
    }

    //... yield ctx.log("a step has been performed");
  }


}