(() => {
    popupHandler = new PopupHandler();

    popupHandler.RunForCurrentTab();

    chrome.storage.onChanged.addListener(popupHandler.DataChangeCallback);

    document.getElementById("action-close").addEventListener("click", (e) => {
        e.preventDefault();
        window.close();
    })
    document.getElementById("action-dashboard").addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    })
})();