class AbstractWebsiteHandler {
    constructor() {

    }

    RunForCurrentTab = () => {
        chrome.tabs.query({active: true, currentWindow: true}, this.ActiveTabQuery);
    }

    ActiveTabQuery = (tabs) => {
        var currTab = tabs[0];
        if (currTab) {
            this.RunForURL(currTab.url);
        }
    }

    RunForURL = (url) => {
        if (!!url) {
            if        ((url.includes("amazon.ca/") || url.includes("amazon.com/")) 
                    && !url.includes("/cart/")
                    && findASINfromURL(url)) {
                this.RunAmazonProductPage(url);

            } else if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) 
                     && url.includes("/cart/")) {
                this.RunAmazonCartPage(url);
                
            } else {
                this.RunOtherPage(url);
            }
        }
    }

    RunAmazonProductPage = (url) => { }
    RunAmazonCartPage = (url) => { }
    RunOtherPage = (url) => { }
}