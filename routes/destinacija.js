import express from 'express'
import * as destinacijaController from "../controllers/DestinacijaController.js";
import { autorizacijaZaTipNaloga, autorizacijaZaResurs, TipNaloga } from '../services/autorizacijaService.js'
const router = express.Router();
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.kreiraj);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.sacuvaj);
router.get('/:id/izmeni', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.izmeni);
router.get('/lista', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.lista);
router.post('/:id/izmeni/', autorizacijaZaTipNaloga(TipNaloga.admin), destinacijaController.promeni);
export default router;