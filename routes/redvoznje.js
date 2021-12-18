const express=require("express");
const redVoznjeController = require("../controllers/RedVoznjeController");
let router=express.Router();
router.get('/kreiraj', redVoznjeController.kreiraj);
router.post('/kreiraj', redVoznjeController.sacuvaj);
router.get('/:id/kopiraj', redVoznjeController.kopiraj);
router.post('/:id/kopiraj/', redVoznjeController.sacuvajkopiju);
module.exports=router;