const initTables = require ('../initTables')
const createUsers = require ('./usuarios/createUser')
const loginUsers = require ('./usuarios/loginUsers')
const addProduct = require ('./produtos/addProduct')
const getProduct = require ('./produtos/getProduct')

module.exports = {
    initTables,
    createUsers,
    loginUsers,
    addProduct,
    getProduct
}