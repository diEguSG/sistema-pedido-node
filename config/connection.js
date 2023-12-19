const connection = function (){

    const mysql = require('mysql');

    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sistema_pedido',
    }
    )
}

module.exports = connection;