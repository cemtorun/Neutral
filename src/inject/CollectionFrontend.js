class CollectionFrontend extends AbstractWebsiteHandler {
    constructor() {
        super();
        this.URLChangeListener =  {
            Handle: 0,
            OldURL: "",
            Interval: 1001
        };
    }

    RunAmazonProductPage = (url) => {
        const data = {
            product_id: "",
            product_name: "",
            product_desc: "",
            price: 0.0,
            api_classification: {},
            api_category: "",
            api_co2_result: {},
            purchase_date: undefined
        }

        // FIND ASIN
        data.product_id = findASINfromURL(url);

        // FIND PRODUCT TITLE
        if (!document.getElementById("productTitle"))
            return;
        const PRODUCT = document.getElementById("productTitle").innerHTML.trim();
        data.product_name = PRODUCT;

        // FIND PRODUCT DESCRIPTION
        let desc = "";
        if (document.getElementById("feature-bullets") &&
            document.getElementById("feature-bullets").children && 
            document.getElementById("feature-bullets").children[0] && 
            document.getElementById("feature-bullets").children[0].children) {
            const descs = document.getElementById("feature-bullets").children[0].children;
            for (let i = 0; i < descs.length; i++) {
                if (descs[i] && descs[i].children && descs[i].children[0])
                    if (!descs[i].children[0].innerHTML.includes("<"))
                        desc += descs[i].children[0].innerHTML.trim() + ". ";
            }
        }
        data.product_desc = desc;

        // FIND PRODUCT PRICE
        const PRICE_DATA = document.getElementById("priceblock_ourprice") || 
                           document.getElementById("priceblock_saleprice") || 
                           document.getElementById("priceblock_dealprice");
        if (!PRICE_DATA)
            return;
        const PRICE = PRICE_DATA.innerHTML.replace("$", "").replace("CDN", "").replace("&nbsp;", "").trim();
        data.price = PRICE;

        // FORM GCP CLASSIFICATION API INPUT
        let queryObj = {
            document: {
                type: "PLAIN_TEXT",
                language: "en",
                content: PRODUCT + ". " + desc
            }
        };

        // GET CLASSIFICATION INFORMATION
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", API_GOOGLE_NLP, false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(queryObj));
        const CLASSIFICATION = JSON.parse(xhttp.responseText);
        data.api_classification = CLASSIFICATION;

        // FIND ROOT CLASSIFICATION CATEGORY
        let category;
        if (!CLASSIFICATION || !CLASSIFICATION.categories || !CLASSIFICATION.categories[0])
            category = "OTHER";
        else
            category = CLASSIFICATION.categories[0].name;
        data.api_category = category;

        // GET CO2 EMISSION INFORMATION
        chrome.runtime.sendMessage({
            type: "AMAZON_CO2_INFORMATION",
            data: data
        }, (response) => {
            console.log("CO2 Emission Collection: " + response)
        })
    }

    StartURLChangeListener = () => {
        this.URLChangeListener.OldURL = "";
        this.URLChangeListener.Handle = setInterval(this.URLChangeHandler, this.URLChangeListener.Interval);
    }
    EndURLChangeListener = () => {
        stopInterval(this.URLChangeListener.Handle);
    }
    URLChangeHandler = () => {
        const curURL = window.location.href;
        if(curURL != this.URLChangeListener.OldURL){
            this.RunForURL(curURL);
        }
        this.URLChangeListener.OldURL = curURL;
    }
}