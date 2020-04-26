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

function updateEmissionsData(product) {

    let category = product.product_category;
    if (product.product_category.includes("/")) {
        category = product.product_category.split("/")[1];
    }

    CO2_TREND.push({
        date: product.purchase_date,
        data: product.api_co2_result.co2e
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
        co2: product.api_co2_result.co2e
    });
    PURCHASE_HISTORY.push({
        name: product.product_name,
        real_name: product.product_real_name,
        id: product.id,
        date: product.purchase_date,
        co2: product.api_co2_result.co2e
    });

    CO2_TREND_DATA = [];
    totalEmissions = 0;
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

    CATEGORY_PIE_DATA = [];
    CATEGORY_PIE.forEach((e) => {
        if (!CATEGORY_PIE_DATA[e.category])
            CATEGORY_PIE_DATA[e.category] = 0;
        CATEGORY_PIE_DATA[e.category] += e.co2;
    })

    carbon();
    drawPie();
    changeWhales();
    updatePage();
}

function getEmissionsData(product) {
    // GET EMISSION VALUES FROM BACKEND
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log(xhttp.responseText);
            if (this.status == 200) {

                // PARSE API CALL DATA
                const content = JSON.parse(xhttp.responseText);
                product.api_co2_result = content.values;

                // UPDATE PAGE
                product.product_real_name = product.product_name;
                if (product.quantity > 1) {
                    product.api_co2_result.co2e *= product.quantity;
                    product.api_co2_result.water *= product.quantity;
                    product.api_co2_result.energy *= product.quantity;
                    product.product_name += " (" + product.quantity + ")";
                }
                updateEmissionsData(product);
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

async function getData() {
    // Reset Globals
    CO2_TREND = [];
    ENERGY_TREND = [];
    WATER_TREND = [];
    CATEGORY_PIE = [];
    PURCHASE_HISTORY = [];
    CO2_TREND_DATA = [];
    ENERGY_TREND_DATA = [];
    WATER_TREND_DATA = [];
    CATEGORY_PIE_DATA = [];
    PURCHASE_HISTORY_DATA = [];
    totalEmissions = 0;
    totalWater = 0;

    const loggedIn = await isLoggedIn();
    if (loggedIn) {
        // GET PURCHASES FROM BACKEND
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                console.log(xhttp.responseText);
                if (xhttp.status == 200) {

                    // PARSE API CALL DATA
                    const content = JSON.parse(xhttp.responseText);
                    content.forEach(product => {
                        getEmissionsData(product);
                    });

                    if (content.length == 0) {
                        carbon();
                        drawPie();
                        changeWhales();
                        updatePage();
                    }
                }
            }
        }
        xhttp.open("GET", "http://neutral-dev.tk:1337/purchases", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        const token = (await getUser()).jwt;
        xhttp.setRequestHeader("Authorization", "Bearer " + token);
        xhttp.send();
    } else {
        // GET PURCHASES FROM LOCAL STORE
        chrome.storage.local.get('neutral_purchases', function (result) {
            result.neutral_purchases.forEach(product => {
                getEmissionsData(product);
            });

            if (result.neutral_purchases.length == 0) {
                carbon();
                drawPie();
                changeWhales();
                updatePage();
            }
        });
    }
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
    const actions = document.querySelectorAll(".history .history-row .grid-item.grid-action");
    const names = document.querySelectorAll(".history .history-row .grid-item.grid-name");
    const vals = document.querySelectorAll(".history .history-row .grid-item.grid-carbon");

    for (let i = 0; i < 4; i++) {
        names[i].innerHTML = "";
        vals[i].innerHTML = "";
        actions[i].innerHTML = "";
    }

    // Sort purchase history by time
    PURCHASE_HISTORY.sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let i = PURCHASE_HISTORY.length - 1; i >= 0; i--) {
        names[count].innerHTML = PURCHASE_HISTORY[i].name;
        vals[count].innerHTML = _kg(PURCHASE_HISTORY[i].co2) + " kg of CO2";

        actions[count].innerHTML = '<button id="delete-' + i + '" class="btn">X</button>';
        const newDelButton = document.getElementById("delete-" + i);
        newDelButton.addEventListener("click", (e) => {
            e.preventDefault();

            if (PURCHASE_HISTORY[i].id)
                deleteHistory(PURCHASE_HISTORY[i].id, false);
            else
                deleteHistory(PURCHASE_HISTORY[i].real_name, PURCHASE_HISTORY[i].date);
        });

        if (count++ >= 3)
            break;
    }
}

async function deleteHistory(id, date) {
    const loggedIn = await isLoggedIn();
    if (loggedIn && !date) {
        // SEND DELETE REQUEST TO BACKEND
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                console.log(xhttp.responseText);
                getData();
            }
        }
        xhttp.open("DELETE", "http://neutral-dev.tk:1337/purchases/" + id, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        const token = (await getUser()).jwt;
        xhttp.setRequestHeader("Authorization", "Bearer " + token);
        xhttp.send();
    } else {
        // DELETE FROM LOCAL STORAGE
        chrome.storage.local.get('neutral_purchases', function (result) {
            const purchases = result.neutral_purchases;
            const afterRemove = purchases.filter((purchase) => !(purchase.product_name == id && purchase.purchase_date == date));

            // SAVE CHANGES
            chrome.storage.local.set({ neutral_purchases: afterRemove }, () => {
                console.log(afterRemove);
                getData();
            });
        })
    }
}

$("#header-perm-text").on("click", async function () {
    var user = await getUser();

    if (!user) {
        document.getElementById("header").classList.toggle("show-full");
        document.getElementById("header-showing").classList.toggle("hidden");
    }
});

async function updateUserStatus() {
    var user = await getUser();
    if (user) {
        $("#login-signup").addClass("hidden");
        $("#user-info").removeClass("hidden");
        $("#header-perm-text").removeClass("pointer");
        $("#header-perm-text")[0].innerHTML = 'Hi ' + user.user.username + '! <button id="btn-logout" class="btn">Logout</button>';
        getData();
        $("#header-showing").addClass("hidden");
        $("#header").removeClass("show-full");
        $("#btn-logout").on("click", function () {
            userLogout();
            updateUserStatus();
        });
    } else {
        $("#login-signup").removeClass("hidden");
        $("#user-info").addClass("hidden");
        getData();
        $("#header-perm-text")[0].innerHTML = 'Login/Signup to sync your past purchases <i class="fas fa-arrow-down"></i>';
    }
}

$("#signup-tab").on("click", function () {
    $("#login").addClass("hidden");
    $("#signup").removeClass("hidden");
    $("#login-tab").removeClass("active");
    $("#signup-tab").addClass("active");
});

$("#login-tab").on("click", function () {
    $("#login").removeClass("hidden");
    $("#signup").addClass("hidden");
    $("#login-tab").addClass("active");
    $("#signup-tab").removeClass("active");
});

$("#signup").on("submit", function () {
    (async function () {
        try {
            var res = await userRegister($("#signupUser")[0].value, $("#signupEmail")[0].value, $("#signupPassword")[0].value);
            $("#signupUser")[0].value = "";
            $("#signupEmail")[0].value = "";
            $("#signupPassword")[0].value = "";
            $("#err-msg-login")[0].innerText = ""
            updateUserStatus();
        } catch (err) {
            $("#err-msg-signup")[0].innerText = "Error: " + err.message[0].messages[0].message;
            console.log(err);
        }
    })();
    return false;
});

$("#login").on("submit", function () {
    (async function () {
        try {
            var res = await userLogin($("#loginIdentifier")[0].value, $("#loginPassword")[0].value);
            $("#loginIdentifier")[0].value = "";
            $("#loginPassword")[0].value = "";
            $("#err-msg-login")[0].innerText = ""
            updateUserStatus();
        } catch (err) {
            $("#err-msg-login")[0].innerText = "Error: " + err.message[0].messages[0].message;
            console.log(err);
        }
    })();
    return false;
});

$("#btn-logout").on("click", function () {
    userLogout();
    updateUserStatus();
});

updateUserStatus();