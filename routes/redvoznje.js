const express=require("express");
const redVoznjeController = require("../controllers/RedVoznjeController");
const {autorizacijaZaTipNaloga,autorizacijaZaResurs,TipNaloga}=require('../services/autorizacijaService')
let router=express.Router();
router.get('/kreiraj',  autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.kreiraj);
router.post('/kreiraj',  autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.sacuvaj);
router.get('/:id/kopiraj',  autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.kopiraj);
router.post('/:id/kopiraj', autorizacijaZaTipNaloga(TipNaloga.admin),  redVoznjeController.sacuvajkopiju);
router.get('/pretraga', redVoznjeController.pretragaPrikazi);
router.get('/lista',  autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.lista);
router.post('/pretraga', redVoznjeController.rezultatiPretrage);
module.exports=router;