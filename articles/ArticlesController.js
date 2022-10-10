const express = require('express');
const router = express.Router();

router.get("/articles", function(req,res) {
    res.send("<h1>Artigos:</h1>")
})

module.exports = router