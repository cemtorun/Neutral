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



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(tab.url);
    console.log(tab.url.includes("amazon.ca/") && tab.url.includes('/cart/'));
    if ((tab.url.includes("amazon.ca/") || tab.url.includes("amazon.com/")) && tab.url.includes('/cart/')) {
        chrome.browserAction.setPopup({
            tabId: tabId,
            popup: 'checkout.html'
        });
    }
});
//   chrome.tabs.get(tab_id, function(tab) {
//     url = tab.url;
//     // console.log(`checking url ${url}');
//     console.log(url);
//     if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && url.includes('/cart/')) {
//         console.log("change window");
//         chrome.browserAction.setPopup({popup: "../public/checkout.html"}, function() {
//           console.log("changed window");
//         });
//         // chrome.windows.create({'url': '../public/checkout.html', 'type': 'popup'}, function(window) {
//         //   console.log("changed window");
//         // });
//     }
//   });
// });
