function adminAuth(req,res,next) { // Middleware para permitir acessos as rotas
    if(req.session.user != undefined) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = adminAuth