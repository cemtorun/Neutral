class PopupHandler extends AbstractWebsiteHandler {
    constructor() {
        super();
    }

    DataChangeCallback = (changes, areaName) => {
        if (areaName == "local") {
            this.RunForCurrentTab();
        }
    }
    
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

        chrome.storage.local.get('amazon_product_info', function (result) {
            const cur_prod = result.amazon_product_info.filter((p) => p.product_id == product_id)[0];
      
            const popupPage = location.href;
            if (popupPage.includes("product") && !!cur_prod) {
                document.getElementById("name").innerHTML = cur_prod.product_name;
                document.getElementById("category").innerHTML = cur_prod.api_category;
        
                // Display appropriate image
                // Default image - shopping.png
                var product_image = document.getElementById("product-image");
        
                if (cur_prod.api_category.includes("/Home & Garden")) {
                    product_image.src = "../../../media/categories/home.png";
                    product_image.minWidth = "200px";
                } else if (cur_prod.api_category.includes("/Computers & Electronics")) {
                    product_image.src = "../../../media/categories/electronics.png";
                    product_image.minWidth = "150px";
                } else if (cur_prod.api_category.includes("/Shopping/Toys")) {
                    product_image.src = "../../../media/categories/toys.png";
                    product_image.minWidth = "150px";
                } else if (cur_prod.api_category.includes("/Home & Garden/Bed & Bath")) {
                    product_image.src = "../../../media/categories/bath-toiletries.png";
                    product_image.minWidth = "150px"
                } else {
                    product_image.src = "../../../media/categories/shopping.png";
                    product_image.minWidth = "200px"
                }
            }
            if (popupPage.includes("details")) {
                document.getElementById("name").innerHTML = cur_prod.product_name;
                document.getElementById("co2e").innerHTML = _kg(cur_prod.api_co2_result.CO2e);
                document.getElementById("co2e_water").innerHTML = _L(cur_prod.api_co2_result.water);
            }
        });
    }

    RunAmazonCartPage = (url) => {
        chrome.storage.local.get('amazon_cart_info', function (result) {
            if (document.getElementById("co2e"))
                document.getElementById("co2e").innerHTML = _kg(result.amazon_cart_info.co2);
            if (document.getElementById("co2e_water"))
                document.getElementById("co2e_water").innerHTML = _L(result.amazon_cart_info.water);
            if (document.getElementById("donate-value"))
                document.getElementById("donate-value").innerHTML = "$" +  _$(result.amazon_cart_info.donation);
            if (document.getElementsByClassName("donate-button")[0])
                document.getElementsByClassName("donate-button")[0].value = "Donate $" + _$(result.amazon_cart_info.donation);
        });
    }
}