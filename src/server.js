const http = require ('http')
const app = require ('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const Database = require ('./Database/init')
Database.init()
app.listen(port,()=>console.log('Server start in port' , port));