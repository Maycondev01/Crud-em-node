const express = require('express');
const router = express.Router();
const Category = require('../categories/Category') // Model Category
const Article = require("./Article")
const slugify = require("slugify")

router.get("/admin/articles", function(req,res) {
    Article.findAll({
        include: [{model: Category}] // Inclua Os Dados Do Model Category
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    })
})

router.get("/admin/articles/new", function(req,res) {
    Category.findAll().then(categories  => {
        res.render("admin/articles/new", {categories: categories})
    })
})

router.post("/articles/save", function(req,res) {
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

router.post("/articles/delete", function(req,res) {
    var id = req.body.id;
    if(id != undefined) {
        Article.destroy({ where: {id: id}}).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", (req,res) => {
    var id = req.params.id;
    if(isNaN(id)) {
        res.redirect("/admin/articles");
    }
    Article.findByPk(id).then(articles => {
        if(articles != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {articles: articles, categories: categories});
            })
        } else {
            res.redirect("/admin/articles")
        }
    }).catch((err) => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", function(req,res) {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title: title, slug: slugify(title), body: body, categoryId: category}, {
        where: {id:id}
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(e => {
        res.redirect("/")
    })
})

module.exports = router