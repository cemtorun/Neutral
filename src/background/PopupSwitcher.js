class PopupSwitcher extends AbstractWebsiteHandler {
    constructor() {
        super();
    }

    OnUpdated = (tabId, changeInfo, tab) => {
        // This runs when any tab Update happens on any tab
        this.RunForCurrentTab();
    }

    OnActivated = (activeInfo) => {
        // This runs when the selected tab changes
        this.RunForCurrentTab();
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