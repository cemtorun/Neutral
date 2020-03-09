class PopupSwitcher extends AbstractWebsiteHandler {
    constructor() {
        super();
    }

    Listener = (tabId, changeInfo, tab) => {
        this.RunForURL(tab.url);
    }

    RunAmazonProductPage = (url) => {
        chrome.browserAction.setPopup({
            popup: 'src/popup/html/product.html'
        });
    }

    RunAmazonCartPage = (url) => {
        chrome.browserAction.setPopup({
            popup: 'src/popup/html/checkout.html'
        });
    }

    RunOtherPage = (url) => {
        chrome.browserAction.setPopup({
            popup: 'src/popup/html/default.html'
        });
    }
}