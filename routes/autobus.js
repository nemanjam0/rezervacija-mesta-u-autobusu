import express from 'express'
import * as autobusController from '../controllers/AutobusController.js';
import { autorizacijaZaTipNaloga, autorizacijaZaResurs, TipNaloga } from '../services/autorizacijaService.js'

let router = express.Router();
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), autobusController.kreiraj);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), autobusController.sacuvaj);
export default  router;