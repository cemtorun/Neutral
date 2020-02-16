function init2() {
    carbon();
}

document.addEventListener('DOMContentLoaded', init2, false);



document.getElementById("type-co2").addEventListener("click", carbon);
document.getElementById("type-energy").addEventListener("click", energy);
document.getElementById("type-water").addEventListener("click", water);

var selected = "carbon";
var colour;
var bgColour;
var graphLabel;

function carbon() {
    colour = "rgb(121,200,166)";
    bgColour = "rgb(121,200,166,0.5)";
    graphLabel = "Carbon Usage";
    drawGraph();
}

function energy() {
    colour = "rgb(255,200,69)";
    bgColour = "rgb(255,200,69,0.5)";
    graphLabel = "Energy Usage";
    drawGraph();
}

function water() {
    colour = "rgb(101,193,214)";
    bgColour = "rgb(101,193,214,0.5)";
    graphLabel = "Water Usage";
    drawGraph();
}


function drawGraph() {
    var ctx = document.getElementById('co2-chart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: graphLabel,
                data: [12, 19, 3, 5, 2, 3],
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