const express=require("express");
const destinacijaController = require("../controllers/DestinacijaController");
const {autorizacijaZaTipNaloga,autorizacijaZaResurs,TipNaloga}=require('../services/autorizacijaService')
let router=express.Router();
router.get('/kreiraj',  autorizacijaZaTipNaloga(TipNaloga.admin),destinacijaController.kreiraj);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.sacuvaj);
router.get('/:id/izmeni', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.izmeni);
router.get('/lista', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.lista);
router.post('/:id/izmeni/', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.promeni);
module.exports=router;