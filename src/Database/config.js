const sqlite3 = require('sqLite3')
const { open } = require('sqLite')

module.exports = () => {
    return open({
        filename:'./database.sqlite',
        driver: sqlite3.Database
    });
    
}