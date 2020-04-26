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

        if (isLoggedIn()) {
            // GET PURCHASES FROM BACKEND
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    if (xhttp.status == 200) {

                        // PARSE API CALL DATA
                        const content = JSON.parse(xhttp.responseText);
                        content.forEach(product => {
                            this.DisplayEmissionsData(product);
                        });
                    }
                }
            }
            xhttp.open("GET", "http://neutral-dev.tk:1337/purchases", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.setRequestHeader("Authorization", "Bearer " + getUser().jwt);
            xhttp.send();
        } else {
            // GET PURCHASES FROM LOCAL STORE
            chrome.storage.local.get('neutral_purchases', function (result) {
                result.neutral_purchases.forEach(product => {
                    this.DisplayEmissionsData(product);
                });
            });
        }
    }

    DisplayEmissionsData = (product) => {
        // GET EMISSION VALUES FROM BACKEND
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log(xhttp.responseText);
                if (this.status == 200) {

                    // GET CURRENT DATA
                    let co2_total = Number(document.getElementById("co2e").innerHTML);
                    let water_total = Number(document.getElementById("co2e_water").innerHTML);

                    // PARSE API CALL DATA
                    const content = JSON.parse(xhttp.responseText);
                    co2_total += content.values.co2e * product.quantity;
                    water_total += content.values.water * product.quantity;

                    // UPDATE POPUP
                    if (document.getElementById("co2e"))
                        document.getElementById("co2e").innerHTML = _kg(co2_total);
                    if (document.getElementById("co2e_water"))
                        document.getElementById("co2e_water").innerHTML = _L(water_total);
                }
            }
        }
        xhttp.open("POST", "http://neutral-dev.tk:1234/get-values", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({
            "category": product.product_category,
            "price": product.price,
        }));
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