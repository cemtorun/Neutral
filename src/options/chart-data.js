//document.getElementById("type-co2").addEventListener("click", carbon);
//document.getElementById("type-energy").addEventListener("click", energy);
//document.getElementById("type-water").addEventListener("click", water);

var selected = "carbon";
var colour;
var bgColour;
var graphLabel;
var labels;
var datas;

var myChart;

function carbon() {
    colour = "rgb(121,200,166)";
    bgColour = "rgba(121,200,166,0.5)";
    graphLabel = "Carbon Usage";
    labels = Object.keys(CO2_TREND_DATA);
    datas = Object.values(CO2_TREND_DATA);
    drawGraph();
}

function energy() {
    colour = "rgb(255,200,69)";
    bgColour = "rgba(255,200,69,0.5)";
    graphLabel = "Energy Usage";
    labels = Object.keys(ENERGY_TREND_DATA);
    datas = Object.values(ENERGY_TREND_DATA);
    drawGraph();
}

function water() {
    colour = "rgb(101,193,214)";
    bgColour = "rgba(101,193,214,0.5)";
    graphLabel = "Water Usage";
    labels = Object.keys(WATER_TREND_DATA);
    datas = Object.values(WATER_TREND_DATA);
    drawGraph();
}

function drawGraph() {
    var ctx = document.getElementById('co2-chart');
    if (myChart)
        myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: graphLabel,
                data: datas,
                backgroundColor: bgColour,
                borderColor: colour,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                    }
                }
            }
        }
    });
}