document.getElementById("type-co2").addEventListener("click", carbon);
document.getElementById("type-energy").addEventListener("click", energy);
document.getElementById("type-water").addEventListener("click", water);

var selected = "carbon";
var colour;
var bgColour;
var graphLabel;
var chartData = [];
var chartDates = [];

function carbon() {
    colour = "rgb(121,200,166)";
    bgColour = "rgb(121,200,166,0.5)";
    graphLabel = "Carbon Usage";
    chartData = [];
    chartDates = [];
    historicalKG = 0;
    for (var i = 0; i < CO2_TREND.length; i++) {
        console.log(CO2_TREND)

        chartData.push(CO2_TREND[i].co2);
        chartDates.push(CO2_TREND[i].date);
        historicalKG += CO2_TREND[i].co2;

    }

    drawGraph();
}

function energy() {
    colour = "rgb(255,200,69)";
    bgColour = "rgb(255,200,69,0.5)";
    graphLabel = "Energy Usage";
    chartData = [];
    chartDates = [];
    for (var i = 0; i < ENERGY_TREND.length; i++) {
        console.log(ENERGY_TREND)
        chartData.push(ENERGY_TREND[i].energy);
        chartDates.push(ENERGY_TREND[i].date);

    }

    drawGraph();
}

function water() {
    colour = "rgb(101,193,214)";
    bgColour = "rgb(101,193,214,0.5)";
    graphLabel = "Water Usage";
    chartData = [];
    chartDates = [];
    for (var i = 0; i < WATER_TREND.length; i++) {
        console.log(WATER_TREND)
        chartData.push(WATER_TREND[i].water);
        chartDates.push(WATER_TREND[i].date);

    }
    drawGraph();
}


function drawGraph() {
    var ctx = document.getElementById('co2-chart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartDates,
            datasets: [{
                label: chartDates,
                data: chartData,
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
    recalculate();
}

var ctx2 = document.getElementById('category-chart');
var myDoughnutChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        datasets: [{

            backgroundColor: "rgb(121,200,166)",
            borderColor: "rgb(121,200,166)",
            data: [10, 20, 30]
        }],



        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ],
    },
    options: {
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