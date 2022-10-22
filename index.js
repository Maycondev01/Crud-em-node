const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session")
const connection = require('./database/database')

// Controllers
const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const UsersController = require("./user/UsersController")

// Models
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./user/User")

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

// Sessões
app.use(session({ // Igual o Sal do Bcrypt
    secret: "qualquercoisa", cookie: { maxAge: 3000000} 
}))


// Body Parser
app.use(bodyParser.urlencoded({ extended: false })); // Aceitar dados de formulário
app.use(bodyParser.json())  // Aceitar dados JSON.

//Arquivos Static
app.use(express.static('public'));


// Router dos Controllers
app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use("/", UsersController);

/* Como testar o express-session 
app.get("/session", (req,res) => {
    req.session.treinamento = "Formação Node.js"
    req.session.ano = 2022
    req.session.email = "mayconlundgren186@gmail.com"
    req.session.user = {
        username: "maycondouglas",
        email: "email@email.com",
        id: 10
    }
    res.send('Sessão gerada')
});
*/

app.get("/leitura", (req,res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user,
    })
});

app.get("/", function (req, res) {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        })
    });
})

app.get("/:slug", function (req, res) {
    var slug = req.params.slug;
    Article.findOne({
        where: { slug: slug }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories });
            });
        } else {
            res.redirect("/");
        }
    }).catch((e) => {
        res.redirect("/")
    })
})


app.get("/category/:slug", function (req, res) {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }] // Join | Juntar: Quando o Sequelize busca uma Categoria Inclua os Artigos
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories }) // Só conseguimos acessar por conta do include ^
            });
        } else {
            res.redirect("/")
        }
    }).catch(e => {
        res.redirect("/")
    });
});

app.listen(8080, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Servidor Online!')
    }
})