global.browser = require('webextension-polyfill');

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  // If the received message has the expected format...
  console.log(msg);
  if (msg.type === 'from_popup') {
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    sendResponse(document.all[0].outerHTML);
  }
});
