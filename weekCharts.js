let currentValue = 0;
let regionApiUrl = '';
let statusApiUrl = '';
let queueApiUrl = '';
let issueCategoryApiUrl = '';

regionApiUrl = weeklyRegionURL(currentValue);
statusApiUrl = weeklyStatusURL(currentValue);
queueApiUrl = weeklyQueueURL(currentValue);
issueCategoryApiUrl = weeklyIssueCategoryURL(currentValue);

fetch(regionApiUrl)
        .then(response => response.json())
        .then(data => {
            // Sort data by count in descending order
            data.sort((a, b) => b.count - a.count);

            // Group all elements after the top 3 into a single "Other" category
            const otherCount = data.slice(3).reduce((sum, item) => sum + item.count, 0);
            const otherData = {
                REGION: 'Other',
                count: otherCount
            };
            data.splice(3, data.length - 3, otherData);

            // Create pie chart
            const pieChartEl = document.getElementById('pie-chart').getContext('2d');

            new Chart(pieChartEl, {
                type: 'pie',
                data: {
                    labels: data.map(item => item.REGION),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#003f5c',
                            '#7a5195',
                            '#ef5675',
                            '#ffa600'
                        ]

                    }]
                }




            });
        })
        .catch(error => console.error(error));

    fetch(statusApiUrl)
        .then(response => response.json())
        .then(data => {

            const doughnutChartEL = document.getElementById('doughtnut-chart').getContext('2d');
            new Chart(doughnutChartEL, {
                type: 'doughnut',
                data: {
                    labels: data.map(item => item.STATUS),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#665191',
                            '#a05195',
                            '#d45087',
                            '#f95d6a',
                            '#ff7c43'
                        ]
                    }]
                }
            });
        })
        .catch(error => console.error(error));

    fetch(queueApiUrl)
        .then(response => response.json())
        .then(data => {
            const barChartEl = document.getElementById('bar-chart').getContext('2d');
            new Chart(barChartEl, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.QUEUE),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#003f5c',
                            '#2f4b7c',
                            '#665191',
                            '#a05195',
                            '#d45087',
                            '#f95d6a',
                            '#ff7c43',
                            '#ffa600'
                        ]
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
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

        })
        .catch(error => console.error(error));

    fetch(issueCategoryApiUrl)
        .then(response => response.json())
        .then(data => {
            // Sort data by count in descending order
            data.sort((a, b) => b.count - a.count);

            // Group all elements after the top 3 into a single "Other" category
            const otherCount = data.slice(3).reduce((sum, item) => sum + item.count, 0);
            const otherData = {
                ISSUECATEGORY: 'Other',
                count: otherCount
            };
            data.splice(3, data.length - 3, otherData);

            // Create pie chart
            const polarAreaChartEl = document.getElementById('polarArea-chart').getContext('2d');
            new Chart(polarAreaChartEl, {
                type: 'polarArea',
                data: {
                    labels: data.map(item => item.ISSUECATEGORY),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#003f5c',
                            '#7a5195',
                            '#ef5675',
                            '#ffa600'
                        ]
                    }]
                }
            });
        })
        .catch(error => console.error(error));

    fetch(regionApiUrl)
        .then(response => response.json())
        .then(data => {
            const result = getHighestCountAndRegion(data);
            document.getElementById('region-name').innerHTML = result.region;
            document.getElementById('region-count').innerHTML = result.count;
            console.log(result.count);
            console.log(result.region);
        })
        .catch(error => console.error(error));
    fetch(statusApiUrl)
        .then(response => response.json())
        .then(data => {
            const result = getHighestCountAndStatus(data);
            document.getElementById('Status-name').innerHTML = result.status;
            document.getElementById('Status-count').innerHTML = result.count;
            console.log(result.count);
            console.log(result.status);
        })
        .catch(error => console.error(error));
    fetch(issueCategoryApiUrl)
        .then(response => response.json())
        .then(data => {
            const result = getHighestCountAndRegion(data);
            document.getElementById('Issue-name').innerHTML = result.issuecategory;
            document.getElementById('Issue-count').innerHTML = result.count;
            console.log(result.count);
            console.log(result.issuecategory);
        })
        .catch(error => console.error(error));
        fetch(statusApiUrl)
        .then(response => response.json())
        .then(data => {
          const totalCount = getTotalCount(data);
        document.getElementById('total-count').innerHTML = totalCount;
          console.log(totalCount);
        })
        .catch(error => console.error(error));

    const range = calculateWeeksAgoRange(currentValue); // calculate range for 6 months ago
    const resultElement = document.getElementById('start-end-date');
    resultElement.textContent = `${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`;



// Set up event listeners for the prev and next buttons
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
prevBtn.addEventListener("click", () => changeValue(-1));
nextBtn.addEventListener("click", () => changeValue(1));


function changeValue(delta) {
    // Check if the new value after adding the delta is less than zero
    if (currentValue + delta < 0) {
        // If it is, set the current value to zero
        currentValue = 0;
        regionApiUrl = weeklyRegionURL(currentValue);
        statusApiUrl = weeklyStatusURL(currentValue);
        queueApiUrl = weeklyQueueURL(currentValue);
        issueCategoryApiUrl = weeklyIssueCategoryURL(currentValue);
    } else {
        // Otherwise, update the current value by the specified delta
        currentValue += delta;
        console.log(currentValue);


    }
    //check if the canvas is not empty before creating a new chart and destroying the old one
    var canv1 = document.getElementById('pie-chart');
    var canv2 = document.getElementById('doughtnut-chart');
    var canv3 = document.getElementById('polarArea-chart');
    var canv4 = document.getElementById('bar-chart');
    // Check if the canvas element exists
    if (canv1) {
        // Get the chart instance from the canvas
        const chart = Chart.getChart(canv1);

        // Check if a chart exists and destroy it
        if (chart) {
            chart.destroy();
        }
    }
    if (canv2) {
        // Get the chart instance from the canvas
        const chart = Chart.getChart(canv2);

        // Check if a chart exists and destroy it
        if (chart) {
            chart.destroy();
        }
    }
    if (canv3) {
        // Get the chart instance from the canvas
        const chart = Chart.getChart(canv3);

        // Check if a chart exists and destroy it
        if (chart) {
            chart.destroy();
        }
    }
    if (canv4) {
        // Get the chart instance from the canvas
        const chart = Chart.getChart(canv4);

        // Check if a chart exists and destroy it
        if (chart) {
            chart.destroy();
        }
    }





    regionApiUrl = weeklyRegionURL(currentValue);
    statusApiUrl = weeklyStatusURL(currentValue);
    queueApiUrl = weeklyQueueURL(currentValue);
    issueCategoryApiUrl = weeklyIssueCategoryURL(currentValue);

    fetch(regionApiUrl)
        .then(response => response.json())
        .then(data => {
            // Sort data by count in descending order
            data.sort((a, b) => b.count - a.count);

            // Group all elements after the top 3 into a single "Other" category
            const otherCount = data.slice(3).reduce((sum, item) => sum + item.count, 0);
            const otherData = {
                REGION: 'Other',
                count: otherCount
            };
            data.splice(3, data.length - 3, otherData);

            // Create pie chart
            const pieChartEl = document.getElementById('pie-chart').getContext('2d');

            new Chart(pieChartEl, {
                type: 'pie',
                data: {
                    labels: data.map(item => item.REGION),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#003f5c',
                            '#7a5195',
                            '#ef5675',
                            '#ffa600'
                        ]

                    }]
                }




            });
        })
        .catch(error => console.error(error));

    fetch(statusApiUrl)
        .then(response => response.json())
        .then(data => {

            const doughnutChartEL = document.getElementById('doughtnut-chart').getContext('2d');
            new Chart(doughnutChartEL, {
                type: 'doughnut',
                data: {
                    labels: data.map(item => item.STATUS),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#665191',
                            '#a05195',
                            '#d45087',
                            '#f95d6a',
                            '#ff7c43'
                        ]
                    }]
                }
            });
        })
        .catch(error => console.error(error));

    fetch(queueApiUrl)
        .then(response => response.json())
        .then(data => {
            const barChartEl = document.getElementById('bar-chart').getContext('2d');
            new Chart(barChartEl, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.QUEUE),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#003f5c',
                            '#2f4b7c',
                            '#665191',
                            '#a05195',
                            '#d45087',
                            '#f95d6a',
                            '#ff7c43',
                            '#ffa600'
                        ]
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
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

        })
        .catch(error => console.error(error));

    fetch(issueCategoryApiUrl)
        .then(response => response.json())
        .then(data => {
            // Sort data by count in descending order
            data.sort((a, b) => b.count - a.count);

            // Group all elements after the top 3 into a single "Other" category
            const otherCount = data.slice(3).reduce((sum, item) => sum + item.count, 0);
            const otherData = {
                ISSUECATEGORY: 'Other',
                count: otherCount
            };
            data.splice(3, data.length - 3, otherData);

            // Create pie chart
            const polarAreaChartEl = document.getElementById('polarArea-chart').getContext('2d');
            new Chart(polarAreaChartEl, {
                type: 'polarArea',
                data: {
                    labels: data.map(item => item.ISSUECATEGORY),
                    datasets: [{
                        data: data.map(item => item.count),
                        backgroundColor: [
                            '#003f5c',
                            '#7a5195',
                            '#ef5675',
                            '#ffa600'
                        ]
                    }]
                }
            });
        })
        .catch(error => console.error(error));

    fetch(regionApiUrl)
        .then(response => response.json())
        .then(data => {
            const result = getHighestCountAndRegion(data);
            document.getElementById('region-name').innerHTML = result.region;
            document.getElementById('region-count').innerHTML = result.count;
            console.log(result.count);
            console.log(result.region);
        })
        .catch(error => console.error(error));
    fetch(statusApiUrl)
        .then(response => response.json())
        .then(data => {
            const result = getHighestCountAndStatus(data);
            document.getElementById('Status-name').innerHTML = result.status;
            document.getElementById('Status-count').innerHTML = result.count;
            console.log(result.count);
            console.log(result.status);
        })
        .catch(error => console.error(error));
    fetch(issueCategoryApiUrl)
        .then(response => response.json())
        .then(data => {
            const result = getHighestCountAndRegion(data);
            document.getElementById('Issue-name').innerHTML = result.issuecategory;
            document.getElementById('Issue-count').innerHTML = result.count;
            console.log(result.count);
            console.log(result.issuecategory);
        })
        .catch(error => console.error(error));
        fetch(statusApiUrl)
        .then(response => response.json())
        .then(data => {
          const totalCount = getTotalCount(data);
        document.getElementById('total-count').innerHTML = totalCount;
          console.log(totalCount);
        })
        .catch(error => console.error(error));

    const range = calculateWeeksAgoRange(currentValue); // calculate range for 6 months ago
    const resultElement = document.getElementById('start-end-date');
    resultElement.textContent = `${range.start.toLocaleDateString()} - ${range.end.toLocaleDateString()}`;



}


function weeklyRegionURL(month) {
    return `http://localhost:5500/weekly-data/${month}/REGION`;
}
function weeklyStatusURL(month) {
    return `http://localhost:5500/weekly-data/${month}/STATUS`;
}
function weeklyQueueURL(month) {
    return `http://localhost:5500/weekly-data/${month}/QUEUE`;
}
function weeklyIssueCategoryURL(month) {
    return `http://localhost:5500/weekly-data/${month}/ISSUECATEGORY`;
}

function getHighestCountAndRegion(data) {
    let maxCount = 0;
    let regionWithMaxCount = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i].count > maxCount) {
            maxCount = data[i].count;
            regionWithMaxCount = data[i].REGION;
        }
        return { count: maxCount, region: regionWithMaxCount };
    }
}


function getHighestCountAndStatus(data) {
    let maxCount = 0;
    let STATUSWithMaxCount = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i].count > maxCount) {
            maxCount = data[i].count;
            STATUSWithMaxCount = data[i].STATUS;
        }
        return { count: maxCount, status: STATUSWithMaxCount };
    }

}
function getHighestCountAndIssueCategory(data) {
    let maxCount = 0;
    let ISSUECATEGORYWithMaxCount = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i].count > maxCount) {
            maxCount = data[i].count;
            ISSUECATEGORYWithMaxCount = data[i].ISSUECATEGORY;
        }
        return { count: maxCount, issuecategory: ISSUECATEGORYWithMaxCount };
    }
}
function calculateWeeksAgoRange(numWeeksAgo) {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 7 * (numWeeksAgo - 1)));
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6);
    return { start, end };
}

function getTotalCount(array) {
    return array.reduce((total, obj) => {
      return total + obj.count;
    }, 0);
}
