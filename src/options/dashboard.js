// Variables to Set
var historicalKG = 1000000;
var goalTonnes = 1200;
var percentDonated = 0.6;


// GLOBALS FOR DATA
var CO2_TREND = [];
var ENERGY_TREND = [];
var WATER_TREND = [];
var CATEGORY_PIE = [];
var PURCHASE_HISTORY = [];

var CO2_TREND_DATA = [];
var ENERGY_TREND_DATA = [];
var WATER_TREND_DATA = [];
var CATEGORY_PIE_DATA = [];
var PURCHASE_HISTORY_DATA = [];


//Variables Calculated
var totalEmissions = 0;
var totalWater = 0;


// progress bar 
var barWidth = totalEmissions / goalTonnes;
//document.getElementById("p-bar").style.width = barWidth * 100 + "%";

var donatedAmount = totalEmissions * percentDonated;
donatedAmount = parseInt(donatedAmount, 10)


var nationalAverageCompare = (historicalKG / 19958.1 * 0.2); //divided by 22 ton average 20% is travel/stuff
nationalAverageCompare = parseInt(nationalAverageCompare, 10)

var treeNum = donatedAmount / 0.1299999821 / 60;
treeNum = parseInt(treeNum, 10);

var treeDollar = treeNum * 1.13;
treeDollar = parseInt(treeDollar, 10);

var barWidth2 = donatedAmount / totalEmissions;
//document.getElementById("p-bar2").style.width = (barWidth2 * 100) + "%";

document.addEventListener('DOMContentLoaded', init, false);
function init() {
    getData();
}

//event listeners
document.getElementById("changeWhale").addEventListener("click", changeWhales);

function changeWhales() {
    document.getElementById('dataVisual').src = "../../media/whale.png";
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

document.getElementById("changeTree").addEventListener("click", function () {
    document.getElementById('dataVisual').src = "../../media/tree.png";
    whales = totalEmissions / 0.1299999821 / 60;
    whales = parseInt(whales, 10);
    whales += " trees"
    document.querySelector('.whales').innerHTML = whales;

});

document.getElementById("changePizza").addEventListener("click", function () {
    document.getElementById('dataVisual').src = "../../media/pizza.png";
    whales = totalEmissions / 0.33085874;
    whales = parseInt(whales, 10);
    whales += " pizzas"
    document.querySelector('.whales').innerHTML = whales;
});

document.getElementById("changeWater").addEventListener("click", function () {
    document.getElementById('dataVisual').src = "../../media/water.png";
    whales = totalWater;
    whales = parseInt(whales, 10);
    whales += " L of water"
    document.querySelector('.whales').innerHTML = whales;
});

function getData() {
    let currData = [];
    chrome.storage.local.get('amazon_product_info', function (result) {
        result.amazon_product_info.forEach(product => {
            let category = product.api_category;
            if (product.api_category.includes("/")) {
                category = product.api_category.split("/")[1];
            }

            if (product.purchase_date) {
                CO2_TREND.push({
                    date: product.purchase_date,
                    data: product.api_co2_result.CO2e
                });
                WATER_TREND.push({
                    date: product.purchase_date,
                    data: product.api_co2_result.water
                });
                ENERGY_TREND.push({
                    date: product.purchase_date,
                    data: product.api_co2_result.energy
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

        CO2_TREND_DATA = [];
        CO2_TREND.forEach((e) => {
            if (!CO2_TREND_DATA[e.date])
                CO2_TREND_DATA[e.date] = 0;
            CO2_TREND_DATA[e.date] += e.data;
            totalEmissions += e.data;
        });

        WATER_TREND_DATA = [];
        WATER_TREND.forEach((e) => {
            if (!WATER_TREND_DATA[e.date])
                WATER_TREND_DATA[e.date] = 0;
            WATER_TREND_DATA[e.date] += e.data;
            totalWater += e.data;
        });

        ENERGY_TREND_DATA = [];
        ENERGY_TREND.forEach((e) => {
            if (!ENERGY_TREND_DATA[e.date])
                ENERGY_TREND_DATA[e.date] = 0;
            ENERGY_TREND_DATA[e.date] += e.data;
        });

        carbon();
        changeWhales();
        updatePage();
    });
}

function updatePage() {
    // Shoving into doc
    document.querySelector('.totalEmissions').innerHTML = _kg(totalEmissions);
    //document.querySelector('.nationalAverageCompare').innerHTML = nationalAverageCompare;
    //document.querySelector('.febEmittions').innerHTML = febEmittions;
    //document.querySelector('.totalEmissions2').innerHTML = totalEmissions;
    //document.querySelector('.totalEmissions3').innerHTML = totalEmissions;
    //document.querySelector('.goalTonnes').innerHTML = goalTonnes;
    //document.querySelector('.donatedAmount2').innerHTML = donatedAmount;
    //document.querySelector('.treeNum').innerHTML = treeNum;
    //document.querySelector('.treeDollar').innerHTML = treeDollar;

    let count = 0;
    const names = document.querySelectorAll(".history .history-row .grid-item.grid-name");
    const vals = document.querySelectorAll(".history .history-row .grid-item.grid-carbon");
    for (let i = PURCHASE_HISTORY.length - 1; i >= 0; i--) {
        names[count].innerHTML = PURCHASE_HISTORY[i].name;
        vals[count].innerHTML = _kg(PURCHASE_HISTORY[i].co2) + " kg of CO2";
        if (count++ > 4)
            break;
    }
}