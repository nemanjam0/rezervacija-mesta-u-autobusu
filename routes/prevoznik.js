import express from 'express'
import * as prevoznikController from "../controllers/PrevoznikController.js";
import path from 'path'
import { v4 } from 'uuid'
import multer from "multer";
const router = express.Router();
import { autorizacijaZaTipNaloga, autorizacijaZaResurs, TipNaloga } from '../services/autorizacijaService.js'
//https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/logo/');
    },
    filename: function (req, file, callback) {
        callback(null, v4() + '-' + Date.now() + path.extname(file.originalname));
        //uuid nam pomaze da preimenujemo fajl u neko random ime i na to dodajemo timestamp i ekstenziju fajla posto po defaultu multer cuva fajl bez ekstenzije
        //mogli smo i samo timestamp da dodamo na ime kako bi sprecili da dodje do prepisivanja,ako korisnik uploaduje 2 razlicita fajla sa istim imenom
    }
});
var upload = multer({ storage: storage })
router.post('/kreiraj', upload.single('logo'), autorizacijaZaTipNaloga(TipNaloga.admin), prevoznikController.sacuvaj);
router.get('/kreiraj', autorizacijaZaTipNaloga(TipNaloga.admin), prevoznikController.kreiraj);
router.get('/lista', autorizacijaZaTipNaloga(TipNaloga.admin), prevoznikController.lista);
router.get('/:id/izmeni', autorizacijaZaTipNaloga(TipNaloga.admin), prevoznikController.izmeni);
router.post('/:id/izmeni/', upload.single('logo'), autorizacijaZaTipNaloga(TipNaloga.admin), prevoznikController.promeni);
export default router;