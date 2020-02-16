'use strict';

const API_GOOGLE_NLP = "https://language.googleapis.com/v1beta2/documents:classifyText?key=AIzaSyCi6QuyfyYaU0N6kpN_A5OcmqIZ3uEB5cg";
const API_LOCAL_CO2E = "https://c19f391b.ngrok.io/OneDrive/Programming/TH2020/co2e.php";

/* ALL PAGE FUNCTIONS */
function runPage() {
  setTimeout(amazon_product_information_collection, 2500);
}

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
    if (!url || url.split("/").length <= 5)
      return;
    const url_info = url.split("/");
    data.product_id = url_info[5];

    // Find product Title
    if (!document.getElementById("productTitle"))
      return;
    const product = document.getElementById("productTitle").innerHTML.trim();
    data.product_name = product;

    // Find product description
    let desc = "";
    let apiInput;
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
    apiInput = product + ". " + desc;

    // Find product price
    const price_data = document.getElementById("priceblock_ourprice") || 
                       document.getElementById("priceblock_saleprice") || 
                       document.getElementById("priceblock_dealprice");
    if (!price_data)
      return;
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

    // Find Category
    let category;
    if (!classification || !classification.categories || !classification.categories[0])
      category = "OTHER";
    else
      category = classification.categories[0].name;
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
      console.log(result);
      if (result && result.amazon_product_info) {
        currData = result.amazon_product_info;
      }

      let newData = currData.filter((product) => product.product_id != data.product_id);
      newData.push(data);
        
      chrome.storage.local.set({amazon_product_info: newData}, function() {
        console.log(newData);
      });
    });
  }
}

/* URL CHANGE DETECTOR */
var oldURL = "";
function checkURLchange(){
    if(window.location.href != oldURL){
        runPage();
    }
    oldURL = window.location.href;
}
setInterval(checkURLchange, 1001);

/* RUN BACKGROUND SCRIPT */
runPage();

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
