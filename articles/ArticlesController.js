const express = require('express');
const router = express.Router();
const Category = require('../categories/Category') // Model Category
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth , function (req, res) {
    Article.findAll({
        include: [{ model: Category }] // Inclua Os Dados Do Model Category
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    })
})

router.get("/admin/articles/new", adminAuth, function (req, res) {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories })
    })
})

router.post("/articles/save", adminAuth, function (req, res) {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    })
})

router.post("/articles/delete", adminAuth, function (req, res) {
    var id = req.body.id;
    if (id != undefined) {
        Article.destroy({ where: { id: id } }).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/articles");
    }
    Article.findByPk(id).then(articles => {
        if (articles != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { articles: articles, categories: categories });
            })
        } else {
            res.redirect("/admin/articles")
        }
    }).catch((err) => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", adminAuth, function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title: title, slug: slugify(title), body: body, categoryId: category
    }, {
        where: { id: id }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(e => {
        res.redirect("/")
    })
})

router.get("/articles/page/:num",  function (req, res) { // Sistema de Paginação
    var page = req.params.num; // Variável Page receber parâmetro da rota /:num
    var offset = 0; // offset | offset do CountAll | A partir da pagina | deslocamento por página
    var quant = 4; // quantidade | limit

    if (!isNaN(page) && (parseInt(page) > 1)) { // Se for um número & transformar o valor em número inteiro for maior que 1
        offset = (parseInt(page) - 1) * quant;  // Então:  offset = converter para número - 1 e multriplicar por variável quant
    }

    Article.findAndCountAll({ // Encontrar e contar/quantidade de tudo
        limit: quant, // limite de dados Json | recebendo valor 4 da variável quant
        offset: offset, // A partir de 0 artigos/page(dados)
        order: [['id', 'DESC']]
    }).then(articles => {

        var next;
        if (offset + 4 >= articles.count) { // Se ultrassar + do que o limite de pages então não ir para próxima
            next = false;
        } else { // Se não ultrapassar então ok!
            next = true;
        }

        var result = {
            page: parseInt(page), // Converter page em número inteiro
            next: next, // next recebe variável next
            articles: articles // articles recebe parâmetros articles
        }

        Category.findAll().then(categories => { // Pegar tudo de Category e colocar no parâmetro categories
            res.render("admin/articles/page", {result: result, categories: categories}) // result receber var result e para usar na view
        })
        // res.json(result); para ver como ficou os dados
    })
})

module.exports = router