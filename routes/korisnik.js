const express=require("express");
const korisnikController = require("../controllers/KorisnikController");
const {autorizacijaZaTipNaloga,autorizacijaZaResurs,TipNaloga}=require('../services/autorizacijaService')
let router=express.Router();
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), korisnikController.noviPrikazi);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), korisnikController.novi);
module.exports=router;