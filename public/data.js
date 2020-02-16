// Variables to Set
var historicalKG = 0;
var goalTonnes = 10;
var percentDonated = 0.6;
var totalEmissions;
var lastFour = [];


// GLOBALS FOR DATA
var CO2_TREND = [];
var ENERGY_TREND = [];
var WATER_TREND = [];
var CATEGORY_PIE = [];
var PURCHASE_HISTORY = [];

function recalculate() {

    //Variables Calculated
    totalEmissions = historicalKG * 0.00110231; //convert to tons
    totalEmissions = parseInt(totalEmissions, 10)
    var febEmittions = totalEmissions;

    //whale image 
    console.log("recalculate");
    lastFour = [];
    for (var i = 0; i < 4; i++) {
        let index = PURCHASE_HISTORY.length - 1 - i;
        if (index >= 0) {
            lastFour.push(PURCHASE_HISTORY[i]);
            console.log(PURCHASE_HISTORY[i]);
        }
    }

    const gridElems = document.getElementsByClassName("grid-name");
    const gridElemsCarbon = document.getElementsByClassName("grid-carbon");
    for (var i = 0; i < lastFour.length; i++) {
        gridElems[i].innerHTML = lastFour[i].name;
        gridElemsCarbon[i].innerHTML = lastFour[i].co2 + " kg/CO2";
    }

    // progress bar 
    var barWidth = totalEmissions / goalTonnes;
    document.getElementById("p-bar").style.width = barWidth * 100 + "%";

    var donatedAmount = totalEmissions * percentDonated;
    donatedAmount = parseInt(donatedAmount, 10)


    var nationalAverageCompare = (historicalKG / 19958.1 * 0.2); //divided by 22 ton average 20% is travel/stuff
    nationalAverageCompare = parseInt(nationalAverageCompare, 10)

    var treeNum = donatedAmount / 0.1299999821 / 60;
    treeNum = parseInt(treeNum, 10);

    var treeDollar = treeNum * 1.13;
    treeDollar = parseInt(treeDollar, 10);

    var barWidth2 = donatedAmount / totalEmissions;
    document.getElementById("p-bar2").style.width = (barWidth2 * 100) + "%";

    document.querySelector('.totalEmissions').innerHTML = totalEmissions;
    document.querySelector('.nationalAverageCompare').innerHTML = nationalAverageCompare;
    document.querySelector('.febEmittions').innerHTML = febEmittions;
    document.querySelector('.totalEmissions2').innerHTML = totalEmissions;
    document.querySelector('.totalEmissions3').innerHTML = totalEmissions;
    document.querySelector('.goalTonnes').innerHTML = goalTonnes;
    document.querySelector('.donatedAmount2').innerHTML = donatedAmount;
    document.querySelector('.treeNum').innerHTML = treeNum;
    document.querySelector('.treeDollar').innerHTML = treeDollar;

}


document.addEventListener('DOMContentLoaded', init, false);

function init() {
    getData();

    //event listeners
    document.getElementById("changeWhale").addEventListener("click", changeWhales);

    document.getElementById("changeTree").addEventListener("click", function() {
        document.getElementById('dataVisual').src = "tree.png";
        whales = totalEmissions / 0.1299999821 / 60;
        whales = parseInt(whales, 10);
        whales += " trees"
        document.querySelector('.whales').innerHTML = whales;

    });
    document.getElementById("changePizza").addEventListener("click", function() {
        document.getElementById('dataVisual').src = "pizza.png";
        whales = totalEmissions / 0.33085874;
        whales = parseInt(whales, 10);
        whales += " pizzas"
        document.querySelector('.whales').innerHTML = whales;
    });
    document.getElementById("changeWater").addEventListener("click", function() {
        document.getElementById('dataVisual').src = "water.png";
        document.querySelector('.whales').innerHTML = whales;
    });

}

function changeWhales() {
    document.getElementById('dataVisual').src = "whale.png";
    var whales = totalEmissions / 29937.096;
    whales = whales.toFixed(2);
    if (whales < 1) {
        whales = whales * 100;
        whales += "% of a whale's weight";
    } else {
        whales += " whales";
    }
    document.querySelector('.whales').innerHTML = whales;
}

function getData() {
    chrome.storage.local.get('amazon_product_info', function(result) {
        CO2_TREND = [];
        CATEGORY_PIE = [];
        PURCHASE_HISTORY = [];
        result.amazon_product_info.forEach(product => {
            let category = product.api_category;
            if (product.api_category.includes("/")) {
                category = product.api_category.split("/")[1];
            }

            if (product.purchase_date) {
                CO2_TREND.push({
                    date: product.purchase_date,
                    co2: product.api_co2_result.CO2e
                });
                WATER_TREND.push({
                    date: product.purchase_date,
                    co2: product.api_co2_result.water
                });
                ENERGY_TREND.push({
                    date: product.purchase_date,
                    co2: product.api_co2_result.energy
                });
                CATEGORY_PIE.push({
                    category: category,
                    co2: product.api_co2_result.CO2e
                });
                PURCHASE_HISTORY.push({
                    name: product.product_name,
                    date: product.purchase_date,
                    co2: product.api_co2_result.CO2e
                });
            }
        });

        post_recieve();
    });
}

function post_recieve() {
    recalculate();
    carbon();
    changeWhales();
}