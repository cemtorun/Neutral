class BackgroundMessage {
    constructor() {

    }

    Listener = (request, sender, sendResponse) => {
        if (!!request.data) {
            switch (request.type) {
                case "AMAZON_CO2_INFORMATION":
                    this.Handle_AmazonCO2Information(request.data);
                    break;
                case "AMAZON_CART_INFORMATION":
                    this.Handle_AmazonCartInformation(request.data);
                    break;
                default:
                    console.log("INVALID REQUEST TYPE");
            }
        } else {
            console.log("INVALID REQUEST DATA");
        }
    }

    Handle_AmazonCO2Information = (data) => {
        // AUGMENT RESULT FIELDS
        let info = JSON.parse(JSON.stringify(data));
        info = {
            ...info,
            api_category: "",
            api_co2_result: {},
        }

        // QUERY BACKEND
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log(xhttp.responseText);

                if (this.status == 200) {
                    // PARSE API CALL DATA
                    const content = JSON.parse(xhttp.responseText);
                    info.api_category = content.category;
                    info.api_co2_result = content.values;

                    // STORE IN CHROME
                    let currData = [];
                    chrome.storage.local.get('amazon_product_info', function (result) {
                        console.log(result);
                        if (result && result.amazon_product_info) {
                            currData = result.amazon_product_info;
                        }

                        let newData = currData.filter((product) => product.product_id != data.product_id);
                        newData.push(info);
                        chrome.storage.local.set({ amazon_product_info: newData }, function () {
                            console.log(newData);
                        });
                    });
                }
            }
        }
        xhttp.open("POST", "http://neutral-dev.tk:1234/get-values", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({
            "text": info.product_name + ". " + info.product_desc,
            "price": info.price,
        }));
    }

    Handle_AmazonCartInformation = async (data) => {
        const info = JSON.parse(JSON.stringify(data));

        // GET CUMULATIVE CART DATA
        let co2_total = 0;
        let co2_water = 0;
        let donation_value = 0;
        let products = [];

        // FETCH CACHED PRODUCT INFO FROM STORAGE
        chrome.storage.local.get('amazon_product_info', async function (result) {
            let product_ids = [];
            data.forEach(item => {
                const ASIN = item.product_id;
                const QUANTITY = item.quantity;

                const cur_prod = result.amazon_product_info.filter((p) => p.product_id == ASIN)[0];
                cur_prod.quantity = QUANTITY;
                co2_total += cur_prod.api_co2_result.co2e * QUANTITY;
                co2_water += cur_prod.api_co2_result.water * QUANTITY;
                product_ids.push(ASIN);
                products.push(cur_prod);
            });
            donation_value = co2_total * 0.04545454545;

            // SET CART DATA
            let cartData = {
                co2: co2_total,
                donation: donation_value,
                water: co2_water,
                products: products,
            };

            // CHECK CART CHANGE
            chrome.storage.local.get('amazon_cart_info', async function (result) {
                if (!_.isEqual(cartData, result.amazon_cart_info)) {
                    console.log("Cart changed!");

                    // REGISTER PURCHASE(S)
                    let purchases = [];
                    products.forEach(async (product) => {
                        const purchase = {
                            "product_name": product.product_name,
                            "product_category": product.api_category,
                            "price": product.price,
                            "quantity": product.quantity,
                            "purchase_location": "amazon",
                            "purchase_date": new Date().toISOString(),
                        };

                        // ON BACKEND
                        const loggedIn = await isLoggedIn();
                        if (loggedIn) {
                            const xhttp = new XMLHttpRequest();
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == 4) {
                                    console.log(xhttp.responseText);
                                }
                            }
                            xhttp.open("POST", "http://neutral-dev.tk:1337/purchases", true);
                            xhttp.setRequestHeader("Content-type", "application/json");
                            const token = await getUser().jwt;
                            xhttp.setRequestHeader("Authorization", "Bearer " + token);
                            xhttp.send(JSON.stringify(purchase));
                        }
                        purchases.push(purchase);
                    });

                    // LOCALLY
                    chrome.storage.local.get('neutral_purchases', function (result) {
                        if (result && result.neutral_purchases) {
                            purchases.push(...result.neutral_purchases);
                        }
                        chrome.storage.local.set({ neutral_purchases: purchases }, null);
                        console.log(purchases);
                    });
                }
            });

            // CACHE CART IN STORAGE
            chrome.storage.local.set({ amazon_cart_info: cartData }, () => {
                console.log(cartData);
            });
        });
    }
}