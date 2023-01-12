require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('MongoDb conectado!')
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const route = require('./routes');
const path = require('path');

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'anau ujqwbfujqwbfu1234u0841290(!@$* 124wjqig1291',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//Meu middleware
//Como não colocamos o endpoint(rota) esse middleware irá funcionar para todas as rotas.
app.use((req, res, next) => {
    res.locals.minhaVariavelLocal = 'TESTANDO A VARIAVEL QUE VAI PARA TODOS OS ENDPOINTS';
    next();
})
app.use(route);

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Servindo rodando na porta 3000!');
    });
})