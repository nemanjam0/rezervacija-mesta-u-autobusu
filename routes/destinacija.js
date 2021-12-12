const express=require("express");
const destinacijaController = require("../controllers/DestinacijaController");
let router=express.Router();
router.get('/kreiraj', destinacijaController.kreiraj);
router.post('/kreiraj', destinacijaController.sacuvaj);
router.get('/:id/izmeni', destinacijaController.izmeni);
router.post('/:id/izmeni/', destinacijaController.promeni);
module.exports=router;