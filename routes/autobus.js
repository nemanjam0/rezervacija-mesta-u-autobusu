const express=require("express");
const autobusController = require("../controllers/AutobusController");
const {autorizacijaZaTipNaloga,autorizacijaZaResurs,TipNaloga}=require('../services/autorizacijaService')
let router=express.Router();
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), autobusController.kreiraj);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), autobusController.sacuvaj);
module.exports=router;