module.exports = function (){
    const express = require ('express');
    const consign = require('consign');
    const bodyParser = require('body-parser');
    const expressValidator = require('express-validator');
    const expressSession = require('express-session');

    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', './app/views');

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressValidator());
    app.use(express.static('app/public'));

    app.use(expressSession({
        secret:'dsadjsald',
        resave: false,
        saveUninitialized: false
    }))

    consign().include('./app/rotas').then('./config/connection.js').then('./app/models').then('./app/controllers').into(app);

    return app;
}