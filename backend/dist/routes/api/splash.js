"use strict";
const router = require("express").Router();
router.get('/', (req, res) => {
    res.redirect('/login');
});
module.exports = router;
//# sourceMappingURL=splash.js.map