const express = require('express');
const { monthlyData,weeklyData } = require('./requestData');

const app = express();

// Allow CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Handle GET requests to /monthly-data/:numMonthsAgo/:columnNames
app.get('/monthly-data/:numMonthsAgo/:columnNames', (req, res) => {
    const { numMonthsAgo, columnNames } = req.params;
    monthlyData(numMonthsAgo, columnNames, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(result);
        }
    });
});

app.get('/weekly-data/:numWeeksAgo/:columnNames', (req, res) => {
    const { numWeeksAgo, columnNames } = req.params;
    weeklyData(numWeeksAgo, columnNames, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(result);
        }
    });
});



app.listen(5500, () => {
    console.log('Server started on port 5500');
});