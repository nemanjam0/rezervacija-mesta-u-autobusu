const express=require("express");
const autobusController = require("../controllers/AutobusController");
let router=express.Router();
router.get('/kreiraj', autobusController.kreiraj);
router.post('/kreiraj', autobusController.sacuvaj);
module.exports=router;