const express=require("express");
const korisnikController = require("../controllers/KorisnikController");
const {pretragaPrikazi} = require("../controllers/RedVoznjeController");
const {autorizacijaPrijavljen,autorizacijaOdjavljen,TipNaloga}=require('../services/autorizacijaService')
let router=express.Router();
router.get('/prijava', autorizacijaOdjavljen , korisnikController.prijava);
router.get('/registracija', autorizacijaOdjavljen , korisnikController.registracija);
router.post('/prijava', autorizacijaOdjavljen , korisnikController.prijavi_korisnika);
router.post('/registracija', autorizacijaOdjavljen , korisnikController.registruj);
router.post('/odjava', autorizacijaPrijavljen ,korisnikController.odjava);
router.get('/',pretragaPrikazi);
module.exports=router;