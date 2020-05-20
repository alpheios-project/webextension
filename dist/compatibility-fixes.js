/*
May 2020:
In a Firefox webextentsion cancelAnimationFrame must be called in a window context, otherwise it will report
the follwoing error:
    TypeError: 'cancelAnimationFrame' called on an object that does not implement interface Window.
This prevents ineract.js from acting properly if used within a webextensiion in Firefox.
Ideally, this should be fixed within interact.js. However, a temporary fix below should prevent it
from happening in the meantime.
See https://github.com/taye/interact.js/pull/810#issue-406181248 and
https://github.com/taye/interact.js/pull/810#issuecomment-616931439
for more details.
 */
window.requestAnimationFrame = window.requestAnimationFrame.bind(window)
window.cancelAnimationFrame = window.cancelAnimationFrame.bind(window)
/* End of a Firefox webextension fix */