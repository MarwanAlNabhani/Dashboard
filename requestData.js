const {createPool} = require('mysql')

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'omantel',
    connectionLimit: 10
})

function weeklyData(numWeeksAgo, columnNames, callback) {
    const columnName = columnNames;
    const queryString = `SELECT ${columnName}, COUNT(*) as count FROM omantel_data WHERE WEEK(OPENTIME) = WEEk(NOW()) - ? GROUP BY ${columnName}`;
    const queryParams = [numWeeksAgo];

    pool.query(queryString, queryParams, callback);
}

function monthlyData(numMonthsAgo, columnNames, callback) {
    const columnName = columnNames;
    const queryString = `SELECT ${columnName}, COUNT(*) as count FROM omantel_data WHERE MONTH(OPENTIME) = MONTH(NOW()) - ? GROUP BY ${columnName}`;
    const queryParams = [numMonthsAgo];

    pool.query(queryString, queryParams, callback);
}

module.exports = { monthlyData, weeklyData };
