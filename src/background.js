'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

console.log("before url check");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
});



// chrome.tabs.query({active: true, activeWindow: true}}, function(tab) {
//   var url = tab.url;
//   console.log(`cchecking url ${url}');
//   if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && url.includes('/cart/')) {
//       console.log("change window");
//       chrome.browserAction.onClicked.addListener(function() {
//          chrome.windows.create({'url': '../public/checkout.html', 'type': 'popup'}, function(window) {
//          });
//       });
//   }
// });
