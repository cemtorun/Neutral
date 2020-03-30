(() => {
    popupHandler = new PopupHandler();

    popupHandler.RunForCurrentTab();

    chrome.storage.onChanged.addListener(popupHandler.DataChangeCallback);

    // Close tab button(s)
    Array.from(document.getElementsByClassName("action-close")).forEach(node => {
        node.addEventListener("click", (e) => {
            e.preventDefault();
            window.close();
        })
    });

    // Dashboard buttons
    Array.from(document.getElementsByClassName("action-dashboard")).forEach(node => {
        node.addEventListener("click", (e) => {
            e.preventDefault();
            chrome.runtime.openOptionsPage();
        })
    });
})();