(() => {
    popupHandler = new PopupHandler();

    chrome.tabs.query({ active: true }, popupHandler.Listener);
})();