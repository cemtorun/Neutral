class PopupHandler extends AbstractWebsiteHandler {
    constructor() {
        super();
    }

    DataChangeCallback = (changes, areaName) => {
        if (areaName == "local") {
            this.RunForCurrentTab();
        }
    }
    
    // TODO NEEDS TO CHANGE -> Get All User purchases here from API END POINT
    RunOtherPage = (url) => { 
        // GET AMAZON EMISIONS DATA
        chrome.storage.local.get('amazon_product_info', function (result) {
            let co2_total = 0;
            let water_total = 0;
            result.amazon_product_info.forEach(product => {
                if (product.purchase_date) {
                    co2_total += product.api_co2_result.CO2e;
                    water_total += product.api_co2_result.water;
                }
            });

            // DISPLAY ONTO POPUP
            if (document.getElementById("co2e"))
                document.getElementById("co2e").innerHTML = _kg(co2_total);
            if (document.getElementById("co2e_water"))
                document.getElementById("co2e_water").innerHTML = _L(water_total);
        });
    }

    RunAmazonProductPage = (url) => {
        // FIND ASIN
        const product_id = findASINfromURL(url);

        // FETCH CACHED PRODUCT INFO FROM STORAGE
        chrome.storage.local.get('amazon_product_info', function (result) {
            const cur_prod = result.amazon_product_info.filter((p) => p.product_id == product_id)[0];

            if (!!cur_prod) {
                // SET MEDIA IMAGE
                var product_image = document.getElementById("product-image");
        
                if (cur_prod.api_category.includes("/Home & Garden")) {
                    product_image.src = "../../../media/categories/home.png";
                } else if (cur_prod.api_category.includes("/Computers & Electronics")) {
                    product_image.src = "../../../media/categories/electronics.png";
                } else if (cur_prod.api_category.includes("/Shopping/Toys")) {
                    product_image.src = "../../../media/categories/toys.png";
                } else if (cur_prod.api_category.includes("/Home & Garden/Bed & Bath")) {
                    product_image.src = "../../../media/categories/bath-toiletries.png";
                } else {
                    product_image.src = "../../../media/categories/shopping.png";
                }

                // DISPLAY PRODUCT INFORMATION
                document.getElementById("name").innerHTML = cur_prod.product_name;
                document.getElementById("co2e").innerHTML = _kg(cur_prod.api_co2_result.co2e);
                document.getElementById("co2e_water").innerHTML = _L(cur_prod.api_co2_result.water);
            }
        });
    }

    RunAmazonCartPage = (url) => {
        // FETCH CACHED CART INFO FROM STORAGE
        chrome.storage.local.get('amazon_cart_info', function (result) {
            if (document.getElementById("co2e"))
                document.getElementById("co2e").innerHTML = _kg(result.amazon_cart_info.co2);
            if (document.getElementById("co2e_water"))
                document.getElementById("co2e_water").innerHTML = _L(result.amazon_cart_info.water);
            if (document.getElementById("donate-value"))
                document.getElementById("donate-value").innerHTML = "$" + _$(result.amazon_cart_info.donation);
            if (document.getElementsByClassName("donate-button")[0])
                document.getElementsByClassName("donate-button")[0].value = "Donate $" + _$(result.amazon_cart_info.donation);
        });
    }
}