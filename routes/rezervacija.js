const express=require("express");
const { route } = require("express/lib/application");
const rezervacijaController = require("../controllers/RezervacijaController");
let router=express.Router();
router.get('/prikaz/:red_voznje_id/:pocetna_destinacija/:krajnja_destinacija/:broj_putnika/:enkodovano_vreme/:tip_karte', rezervacijaController.prikazi);
router.get('/termini/:pocetna_destinacija_id/:krajnja_destinacija_id/:enkodovan_datum/:prevoznik_id',rezervacijaController.terminiZaPovratak)
router.get('/autobus/:red_voznje_id/:broj_putnika/:pocetna_destinacija_id/:krajnja_destinacija_id/:datum_enkodovan/:vreme_enkodovano/:naziv_putovanja',rezervacijaController.prikaziAutobus);//naziv putovanja je jedino bitan za dodeljivanja imena
router.post('/kreiraj/:tip_putovanja',rezervacijaController.rezervisi);
router.get('/rezervisanostsedista/:polazak_id/:pocetna_destinacija_id/:krajnja_destinacija_id/:red/:mesto_u_redu',rezervacijaController.proveriRezervisanostSedista);
router.post('/privremenorezervisi/:polazak_id/:pocetna_destinacija_id/:krajnja_destinacija_id/:red/:mesto_u_redu/:vreme_isteka',rezervacijaController.privremenoRezervisi);
router.post('/obrisiprivremeno/:privremeno_sediste_id',rezervacijaController.privremenoObrisi);
router.get('/moje',rezervacijaController.prikaziMoje);
router.get('/prikazirezervisana/:rezervacija_id',rezervacijaController.prikaziRezervisanaSedista);
router.get('/prikazi/:id_karte/:sifra_karte',rezervacijaController.prikaziKartu);
router.post('/ocitaj/:id_karte/:sifra_karte',rezervacijaController.ocitajKartu);
router.get('/citac',rezervacijaController.citac);
router.post('/citac',rezervacijaController.citacUcitaj);
module.exports=router;