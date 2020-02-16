'use strict';

chrome.tabs.getSelected(null, function (tab) {
  const url = tab.url;
  if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && !url.includes("/cart/")) {

    // Find product ASIN
    if (!url || url.split("/").length <= 5)
      return;
    const url_info = url.split("/");
    const product_id = url_info[5];

    chrome.storage.local.get('amazon_product_info', function (result) {
      const cur_prod = result.amazon_product_info.filter((p) => p.product_id == product_id)[0];

      const popupPage = location.href;
      if (popupPage.includes("product")) {
        document.getElementById("name").innerHTML = cur_prod.product_name;
        document.getElementById("category").innerHTML = cur_prod.api_category;
      }
      if (popupPage.includes("details")) {
        document.getElementById("name").innerHTML = cur_prod.product_name;
        document.getElementById("co2e").innerHTML = cur_prod.api_co2_result.CO2e;
      }
    });
  }

  if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && url.includes("/cart/")) {
    let execute = `
      let a = document.querySelectorAll("div[data-itemtype='active']");
      let ret = "";
      for (let i = 0; i < a.length; i++) {
          ret+=a[i].dataset.asin + ":" + a[i].dataset.quantity + "|";
      }
      ret.substr(0,ret.length - 1)
    `
    chrome.tabs.executeScript(tab.id, {      
      code: execute
    }, (obj) => {
      console.log(obj);

      let co2_total = 0;
      const cart = (obj[0]).split("|");
      cart.forEach(p => {

        // Find product ASIN
        const data = p.split(":");
        const product_id = data[0];
        const quantity = data[1];

        chrome.storage.local.get('amazon_product_info', function (result) {
          const cur_prod = result.amazon_product_info.filter((p) => p.product_id == product_id)[0];
          co2_total += cur_prod.api_co2_result.CO2e * quantity;
          document.getElementById("co2e").innerHTML = co2_total;
        });
      });
    });
  }
});
