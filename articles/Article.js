const Sequelize = require('sequelize');
const connection = require("../database/database");
const Category = require("../categories/Category");


const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article); // Uma Categoria Pertence a muitos Artigos 1 P M
Article.belongsTo(Category); // Um Artigo Pertence a Uma Categoia 1 P 1

module.exports = Article;