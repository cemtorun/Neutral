(() => {
    backgroundMessage = new BackgroundMessage();
    popupSwitcher = new PopupSwitcher();

    chrome.runtime.onMessage.addListener(backgroundMessage.Listener);
    chrome.tabs.onUpdated.addListener(popupSwitcher.OnUpdated);
    chrome.tabs.onActivated.addListener(popupSwitcher.OnActivated);
})();