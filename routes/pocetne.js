import express from 'express'
import * as korisnikController from "../controllers/KorisnikController.js";
import { autorizacijaOdjavljen, autorizacijaPrijavljen } from '../services/autorizacijaService.js'
import { pretragaPrikazi } from "../controllers/RedVoznjeController.js";
let router = express.Router();
router.get('/prijava', autorizacijaOdjavljen, korisnikController.prijava);
router.get('/registracija', autorizacijaOdjavljen, korisnikController.registracija);
router.post('/prijava', autorizacijaOdjavljen, korisnikController.prijavi_korisnika);
router.post('/registracija', autorizacijaOdjavljen, korisnikController.registruj);
router.post('/odjava', autorizacijaPrijavljen, korisnikController.odjava);
router.get('/', pretragaPrikazi);
export default router;