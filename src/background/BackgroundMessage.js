class BackgroundMessage {
    constructor() {

    }

    Listener = (request, sender, sendResponse) => {
        if (!!request.data) {
            switch(request.type) {
                case "AMAZON_CO2_INFORMATION":
                    this.Handle_AmazonCO2Information(request.data);
                    break;
                default:
                    console.log("INVALID REQUEST TYPE");
            }
        } else {
            console.log("INVALID REQUEST DATA");
        }
    }

    Handle_AmazonCO2Information = (data) => {
        const info = JSON.parse(JSON.stringify(data));
        info.api_co2_result = {
            CO2e: 0,
            water: 0,
            energy: 0,
            category: ""
        }

        // GET MESSAGE DATA
        const CATEGORY = data.api_category;
        const PRICE = data.price;
        if (!CATEGORY || !PRICE)
            return;
        
        // QUERY DB FOR MAPPINGS AND VALUES
        const db = openDatabase(DB.name, DB.version, DB.desc, DB.size);
        db.transaction((tx) => {
            tx.executeSql(`SELECT csd_category FROM mappings where google_category = ?`, [CATEGORY], (tx, results) => {
                let mapping = 0;
                if (results.length > 0) {
                    mapping = results[0].csd_category;
                }

                // GET CO2 DATA
                tx.executeSql(`SELECT * FROM csd_values where id = ?`, [mapping], (tx, results) => {
                    if (mapping == 0) {
                        info.api_co2_result.CO2e = PRICE * 0.5;
                        info.api_co2_result.water = PRICE * 15;
                        info.api_co2_result.energy = PRICE * 5;
                    }
                    if (results.length > 0) {
                        info.api_co2_result.CO2e = PRICE * results[0].CO2e;
                        info.api_co2_result.water = PRICE * results[0].water;
                        info.api_co2_result.energy = PRICE * results[0].energy;
                        info.api_co2_result.category = results[0].category;
                    }

                    // STORE IN CHROME
                    let currData = [];
                    chrome.storage.local.get('amazon_product_info', function(result) {
                        console.log(result);
                        if (result && result.amazon_product_info) {
                            currData = result.amazon_product_info;
                        }

                        let newData = currData.filter((product) => product.product_id != data.product_id);
                        newData.push(info);
                            
                        chrome.storage.local.set({amazon_product_info: newData}, function() {
                            console.log(newData);
                        });
                    });
                });
            });
        });
    }
}