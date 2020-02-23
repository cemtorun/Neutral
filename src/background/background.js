chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    console.log(request);
    sendResponse({});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if ((tab.url.includes("amazon.ca/") || tab.url.includes("amazon.com/")) && tab.url.includes('/cart/')) {
        chrome.browserAction.setPopup({
            tabId: tabId,
            popup: 'src/popup/checkout.html'
        });
    }
});