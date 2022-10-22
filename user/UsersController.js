const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs"); // Biblioteca para colocar hash na senha


router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
});

router.post("/users/create", function (req, res) {
    var email = req.body.email;
    var senha = req.body.senha;


    User.findOne({ where: { email: email } }).then(user => { // Buscar por um onde email = email
        if (user == undefined) { // se não achou email já cadastrado então pode cadastrar
            var salt = bcrypt.genSaltSync(10); // sincronização de Sal gerado
            var hash = bcrypt.hashSync(senha, salt); // tem sincronização com senha e salt

            User.create({
                email: email,
                senha: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/")
            })
        } else { // se achou algum email já cadastrado então:
            res.redirect("/")
        }
    })
    //res.json({email, senha}); // Teste 
})

router.get("/login", (req,res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req,res) => { // Autenticação de Usuário
    var email = req.body.email;
    var senha = req.body.senha;

    User.findOne({where: {email: email}}).then(user => { // Pesquisar por um em Usuário onde Email = email
        if(user != undefined) { // Se existir usuário com esse e-mail
            // Validar senha
            var correct = bcrypt.compareSync(senha, user.senha)
            // comparar a senha digitada com a senha no banco de dados

            if(correct) { // Se a senha tá correta então fazer o login
                req.session.user = { // fazer uma sessão para receber id do usuário e email 
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
                // res.json(req.session.user); Pra testar
            } else {
                res.redirect("/login")
            }

        } else {
            res.redirect("/login")
        }
    });
});
router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router;
