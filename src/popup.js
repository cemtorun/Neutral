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
});
