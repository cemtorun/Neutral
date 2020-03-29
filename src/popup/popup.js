(() => {
    popupHandler = new PopupHandler();

    popupHandler.RunForCurrentTab();

    chrome.storage.onChanged.addListener(popupHandler.DataChangeCallback);
})();