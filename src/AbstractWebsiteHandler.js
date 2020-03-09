class AbstractWebsiteHandler {
    constructor() {

    }

    RunForURL = (url) => {
        if (!!url) {
            if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && !url.includes("/cart/")) {
                this.RunAmazonProductPage(url);
            } else if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && url.includes("/cart/")) {
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