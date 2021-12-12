const express=require("express");
const korisnikController = require("../controllers/KorisnikController");
let router=express.Router();
router.get('/prijava',korisnikController.prijava);
router.get('/registracija',korisnikController.registracija);
router.post('/prijava',korisnikController.prijavi_korisnika);
router.post('/registracija',korisnikController.registruj);
module.exports=router;