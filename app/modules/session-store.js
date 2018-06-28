const path = require('path');
const session = require('express-session');

const SQLiteStore = require('connect-sqlite3')(session);
const appRoot = require('app-root-path');

module.exports = new SQLiteStore({
    table: "sessions",
    db: "sessionsDB",
    dir: path.join(appRoot.path, 'data')
});