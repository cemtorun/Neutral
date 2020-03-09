(() => {
    collectionFrontend = new CollectionFrontend();

    const url = location.href;
    collectionFrontend.RunForURL(url);
    collectionFrontend.StartURLChangeListener();
})();
