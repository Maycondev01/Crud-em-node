const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database')
const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const Article = require("./articles/Article")
const Category = require("./categories/Category")

// DataBase 
connection
.authenticate()
.then(() => {
    console.log("Database Connected")
}).catch((err) => {
    console.log(err)
})

// VIEW ENGINE
app.set('view engine', 'ejs'); 

// Body Parser
app.use(bodyParser.urlencoded({ extended: false})); // Aceitar dados de formulário
app.use(bodyParser.json())  // Aceitar dados JSON.

//Arquivos Static
app.use(express.static('public'));

app.get("/", function(req,res) {
    res.render("index")
})

app.use("/", CategoriesController);

app.use("/", ArticlesController);

app.listen(8080, function(err) {
    if(err) {
        console.log(err)
    } else {
        console.log('Servidor Online!')
    }
})