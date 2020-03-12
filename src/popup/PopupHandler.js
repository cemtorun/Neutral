class PopupHandler extends AbstractWebsiteHandler {
    constructor() {
        super();
    }

    RunAmazonProductPage = (url) => {
        // FIND ASIN
        const product_id = findASINfromURL(url);

        chrome.storage.local.get('amazon_product_info', function (result) {
            const cur_prod = result.amazon_product_info.filter((p) => p.product_id == product_id)[0];
      
            const popupPage = location.href;
            if (popupPage.includes("product")) {
              document.getElementById("name").innerHTML = cur_prod.product_name;
              document.getElementById("category").innerHTML = cur_prod.api_category;
      
              // Display appropriate image
              // Default image - shopping.png
              var product_image = document.getElementById("product-image");
      
              if (cur_prod.api_category.includes("/Home & Garden")) {
                console.log(`Category is home`);
                product_image.src = "../../../media/categories/home.png";
                product_image.minWidth = "200px";
              } else if (cur_prod.api_category.includes("/Computers & Electronics")) {
                console.log(`Category is electronics`);
                product_image.src = "../../../media/categories/electronics.png";
                product_image.minWidth = "150px";
              } else if (cur_prod.api_category.includes("/Shopping/Toys")) {
                console.log(`Category is toys`);
                product_image.src = "../../../media/categories/toys.png";
                product_image.minWidth = "150px";
              } else if (cur_prod.api_category.includes("/Home & Garden/Bed & Bath")) {
                console.log(`Category is bath`);
                product_image.src = "../../../media/categories/bath-toiletries.png";
                product_image.minWidth = "150px"
              } else {
                product_image.src = "../../../media/categories/shopping.png";
                product_image.minWidth = "200px"
              }
            }
            if (popupPage.includes("details")) {
              document.getElementById("name").innerHTML = cur_prod.product_name;
              document.getElementById("co2e").innerHTML = cur_prod.api_co2_result.CO2e;
              document.getElementById("co2e_water").innerHTML = cur_prod.api_co2_result.water;
            }
          });
    }

    RunAmazonCartPage = (url) => {

      let execute = `
      a = document.querySelectorAll("div[data-itemtype='active']");
      ret = "";
      for (let i = 0; i < a.length; i++) {
          ret+=a[i].dataset.asin + ":" + a[i].dataset.quantity + "|";
      }
      ret.substr(0,ret.length - 1)
    `;
    chrome.tabs.executeScript({
      code: execute
    }, (obj) => {
      console.log(obj);

      let co2_total = 0;
      let co2_water = 0;
      const cart = (obj[0]).split("|");
      const product_ids = [];
      cart.forEach(p => {

        // Find product ASIN
        const data = p.split(":");
        const product_id = data[0];
        product_ids.push(product_id);
        const quantity = data[1];

        chrome.storage.local.get('amazon_product_info', function (result) {
          const cur_prod = result.amazon_product_info.filter((p) => p.product_id == product_id)[0];
          co2_total += cur_prod.api_co2_result.CO2e * quantity;
          co2_water += cur_prod.api_co2_result.water * quantity;
          document.getElementById("co2e").innerHTML = co2_total;
          document.getElementById("co2e_water").innerHTML = co2_water;
        });
      });

      // Update storage to include purchase
      chrome.storage.local.get('amazon_product_info', function (result) {
        const newData = [];
        const currData = result.amazon_product_info;
        currData.forEach((data) => {
          const data_changed = data;
          if (product_ids.includes(data_changed.product_id)) {
            data_changed.purchase_date = new Date().getUTCDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
          }
          newData.push(data_changed);
        });

        chrome.storage.local.set({amazon_product_info: newData}, () => {
          console.log(newData);
        });
      });

    });
    }
}