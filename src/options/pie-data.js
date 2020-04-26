var myPie;

function drawPie() {
    let largest = "";
    let largestVal = -1;
    for (let key in CATEGORY_PIE_DATA) {
        if (CATEGORY_PIE_DATA[key] > largestVal) {
            largest = key;
            largestVal = CATEGORY_PIE_DATA[key];
        }
    }
    document.getElementById("category-title").innerHTML = largest;

    const ctx = document.getElementById("category-chart");
    if (myPie)
        myPie.destroy();
        
    myPie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(CATEGORY_PIE_DATA),
            datasets: [{
                label: "",
                data: Object.values(CATEGORY_PIE_DATA),
                backgroundColor: pieColors,
                borderColor: "white"
            }]
        },
        options: {
        }
    });
}

function pieColors(context) {
    let value = Object.keys(CATEGORY_PIE_DATA)[context.dataIndex];
    return "#" + intToRGB(hashCode(value));
}
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}
function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}