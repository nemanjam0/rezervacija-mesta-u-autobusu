import express from 'express';
import * as redVoznjeController from "../controllers/RedVoznjeController.js";
import { autorizacijaZaTipNaloga, autorizacijaZaResurs, TipNaloga } from '../services/autorizacijaService.js'

let router = express.Router();
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.kreiraj);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.sacuvaj);
router.get('/:id/kopiraj', autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.kopiraj);
router.post('/:id/kopiraj', autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.sacuvajkopiju);
router.get('/pretraga', redVoznjeController.pretragaPrikazi);
router.get('/lista', autorizacijaZaTipNaloga(TipNaloga.admin), redVoznjeController.lista);
router.post('/pretraga', redVoznjeController.rezultatiPretrage);
export default router;