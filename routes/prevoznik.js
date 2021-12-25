const express=require("express");
const prevoznikController = require("../controllers/PrevoznikController");
let router=express.Router();
const path = require('path');
const uuid=require('uuid')
const multer  = require('multer')
//https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/logo/');
    },
    filename: function(req, file, callback) {
        callback(null, uuid.v4() + '-' + Date.now() + path.extname(file.originalname));
        //uuid nam pomaze da preimenujemo fajl u neko random ime i na to dodajemo timestamp i ekstenziju fajla posto po defaultu multer cuva fajl bez ekstenzije
        //mogli smo i samo timestamp da dodamo na ime kako bi sprecili da dodje do prepisivanja,ako korisnik uploaduje 2 razlicita fajla sa istim imenom
    }
});
var upload = multer({ storage: storage })
router.post('/kreiraj', upload.single('logo'),prevoznikController.sacuvaj);
router.get('/kreiraj', prevoznikController.kreiraj);
router.get('/lista', prevoznikController.lista);
router.get('/:id/izmeni', prevoznikController.izmeni);
router.post('/:id/izmeni/',upload.single('logo'), prevoznikController.promeni);
module.exports=router;