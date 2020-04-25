(() => {
    //initializer = new Initializer();
    backgroundMessage = new BackgroundMessage();
    popupSwitcher = new PopupSwitcher();

    //chrome.runtime.onInstalled.addListener(initializer.OnInstalled);
    //chrome.runtime.onStartup.addListener(initializer.OnStartup);
    chrome.runtime.onMessage.addListener(backgroundMessage.Listener);
    chrome.tabs.onUpdated.addListener(popupSwitcher.OnUpdated);
    chrome.tabs.onActivated.addListener(popupSwitcher.OnActivated);
})();