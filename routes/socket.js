const express = require('express');
router = express.Router();

router.get('/testRoute', function (req, res) {
    res.send("Test success");
})


module.exports = router;