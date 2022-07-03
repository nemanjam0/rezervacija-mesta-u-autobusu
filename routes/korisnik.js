import express from 'express'
import * as korisnikController from "../controllers/KorisnikController.js";
import { autorizacijaZaTipNaloga, autorizacijaZaResurs, TipNaloga } from '../services/autorizacijaService.js'

let router = express.Router();
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), korisnikController.noviPrikazi);
router.post('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), korisnikController.novi);

export default router;