'use strict';

const API_GOOGLE_NLP = "https://language.googleapis.com/v1beta2/documents:classifyText?key=AIzaSyCi6QuyfyYaU0N6kpN_A5OcmqIZ3uEB5cg";
const API_LOCAL_CO2E = "https://c19f391b.ngrok.io/OneDrive/Programming/TH2020/co2e.php";


/* AMAZON BACKGROUND INFORMATION COLLECTION */
function amazon_product_information_collection() {
  const url = location.href;
  console.log(location.href);

  if ((url.includes("amazon.ca/") || url.includes("amazon.com/")) && !url.includes("/cart/")) {
    const data = {
      product_id: "",
      product_name: "",
      product_desc: "",
      price: 0.0,
      api_classification: {},
      api_category: "",
      api_co2_result: {}
    }

    // Find product ASIN
    const url_info = url.split("/");
    data.product_id = url_info[5];

    // Find product Title
    const product = document.getElementById("productTitle").innerHTML.trim();
    data.product_name = product;

    // Find product description
    const descs = document.getElementById("feature-bullets").children[0].children;
    let desc = "";
    let apiInput;
    for (let i = 0; i < descs.length; i++) {
      if (descs[i] && descs[i].children && descs[i].children[0])
        if (!descs[i].children[0].innerHTML.includes("<"))
          desc += descs[i].children[0].innerHTML.trim() + ". ";
    }
    data.product_desc = desc;
    apiInput = product + ". " + desc;

    // Find product price
    const price_data = document.getElementById("priceblock_ourprice") || document.getElementById("priceblock_saleprice") || document.getElementById("priceblock_dealprice");
    const price = price_data.innerHTML.replace("$", "").replace("CDN", "").replace("&nbsp;", "").trim();
    data.price = price;

    // Get classification information
    let queryObj = {
      "document": {
          "type": "PLAIN_TEXT",
          "language": "en",
          "content": apiInput
      }
    };
    const xhttp1 = new XMLHttpRequest();
    xhttp1.open("POST", API_GOOGLE_NLP, false);
    xhttp1.setRequestHeader("Content-type", "application/json");
    xhttp1.send(JSON.stringify(queryObj));
    let classification = JSON.parse(xhttp1.responseText);
    data.api_classification = classification;

    // USE THIS CATEGORY
    let category = classification.categories[0].name;
    data.api_category = category;

    // Get CO2e information
    const xhttp2 = new XMLHttpRequest();
    xhttp2.open("POST", API_LOCAL_CO2E, false);
    xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp2.send("category=" + encodeURIComponent(category) + "&price=" + price);

    // USE THIS CO2 DATA
    let co2e_data = JSON.parse(xhttp2.responseText);
    data.api_co2_result = co2e_data;

    // Store in chrome
    let currData = [];
    chrome.storage.local.get('amazon_product_info', function(result) {
      if (!!result) {
        currData = result;
      } else {
        chrome.storage.local.set({amazon_product_info: []}, function() {
          console.log("Local storage initialized");
        });
      }
    });
  
    let contains = false;
    currData.forEach((product) => {
      if (product.product_id == data.product_id) {
        product = data;
        contains = true;
      }
    });
    if (!contains)
      currData.push(data);
    chrome.storage.local.set({amazon_product_info: currData}, function() {
      console.log(currData);
    });
    console.log(data);
  }
}
setTimeout(amazon_product_information_collection, 2500);

var oldURL = "";
var currentURL = window.location.href;
function checkURLchange(currentURL){
    if(currentURL != oldURL){
        setTimeout(amazon_product_information_collection, 2500);
        oldURL = currentURL;
    }

    oldURL = window.location.href;
    setTimeout(function() {
        checkURLchange(window.location.href);
    }, 1000);
}
checkURLchange();


// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ADD_ITEMS') {
    console.log(`New items have been added to cart ${request.payload.items}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
