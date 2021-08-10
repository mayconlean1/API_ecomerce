module.exports = function envConfig (){
    process.env.JWT_SECRET = 'SECRET'

    process.env.MYSQL_USER = "dbuser"
    process.env.MYSQL_DATABASE = 'db_tests'
    process.env.MYSQL_PASSWORD = "123456"
    process.env.MYSQL_DATABASE = 'db_tests'
    process.env.MYSQL_HOST = "localhost"
    process.env.MYSQL_PORT = 3306

    process.env.ADMIN_EMAIL = 'test_admin@email.com'
    process.env.ADMIN_PASSWORD = '123456'
    
}