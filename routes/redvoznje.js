const express=require("express");
const redVoznjeController = require("../controllers/RedVoznjeController");
let router=express.Router();
router.get('/kreiraj', redVoznjeController.kreiraj);
router.post('/kreiraj', redVoznjeController.sacuvaj);
router.get('/:id/izmeni', redVoznjeController.izmeni);
router.post('/:id/izmeni/', redVoznjeController.promeni);
module.exports=router;