(() => {
    initializer = new Initializer();
    backgroundMessage = new BackgroundMessage();
    popupSwitcher = new PopupSwitcher();

    chrome.runtime.onInstalled.addListener(initializer.OnInstalled);
    chrome.runtime.onMessage.addListener(backgroundMessage.Listener);
    chrome.tabs.onUpdated.addListener(popupSwitcher.Listener);
})();