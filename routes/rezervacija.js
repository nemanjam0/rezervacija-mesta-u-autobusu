const express=require("express");
const rezervacijaController = require("../controllers/RezervacijaController");
let router=express.Router();
router.get('/prikaz/:red_voznje_id/:pocetna_destinacija/:krajnja_destinacija/:broj_putnika/:enkodovano_vreme/:tip_karte', rezervacijaController.prikazi);
router.get('/termini/:pocetna_destinacija_id/:krajnja_destinacija_id/:enkodovan_datum/:prevoznik_id',rezervacijaController.terminiZaPovratak)
router.get('/autobus/:red_voznje_id/:broj_putnika/:pocetna_destinacija_id/:krajnja_destinacija_id/:datum_enkodovan/:vreme_enkodovano',rezervacijaController.prikaziAutobusZaPovratak);
module.exports=router;