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

/*
This script will be loaded and executed by the `tabs.executeScript()`.
This function will return a Promise that will resolve to an array of objects.
The array's values represent the result of the script in every injected frame.
The result of the script is the last evaluated statement, which is similar
to what would be output (the results, not any console.log() output)
if you executed the script in the Web Console.
The result values must be structured clonable, or the `tabs.executeScript()`
will throw an error.
See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript#Return_value
for more detials.

Thus, `undefined` below serves as a simple structured clonable return value
of `tabs.executeScript()`.
 */
undefined
