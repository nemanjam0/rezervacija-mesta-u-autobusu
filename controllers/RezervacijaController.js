const express = require('express')
const { sequelize, RedVoznje, Prevoznik, Autobus, Destinacija, Cenovnik, Stanica, Polazak, Rezervacija, RezervisanoSediste, PrivremenoRezervisanoSediste, Povratak } = require('../models');
const parser = require('body-parser');
const moment = require('moment')
const { redirect } = require('express/lib/response');
const Redirect = require('./../helpers/Redirect');
const { Op, QueryTypes } = require('sequelize');
const cenovnikService = require('./../services/cenovnikService');
const rezervacijaService = require('./../services/rezervacijaService');
const { dodajMinuteNaVreme } = require('./../helpers/Vreme');
const { imaPristupResursu, TipNaloga } = require('../services/autorizacijaService')
module.exports.prikazi = async (req, res) =>//prikazuje dijalog za kreiranje nove destinacije
{
    const red_voznje_id = req.params.red_voznje_id;
    const pocetna_destinacija_id = req.params.pocetna_destinacija;
    const krajnja_destinacija_id = req.params.krajnja_destinacija;
    const povratno = req.params.tip_karte == 'povratna';
    let cena_karte = 0;
    const danasnji_datum = moment().format('YYYY-MM-DD');
    const broj_putnika = req.params.broj_putnika;
    const vreme_polaska = moment(decodeURIComponent(req.params.enkodovano_vreme), 'DD.MM.YYYY h:m:s');
    const satnica_polaska = vreme_polaska.format("h:m:s");
    const cenovnik = await cenovnikService.nadjiZaDestinacijeIDatum(pocetna_destinacija_id, krajnja_destinacija_id, vreme_polaska.format('YYYY-MM-DD'), red_voznje_id);
    const datum_polaska_srpski_format = vreme_polaska.format('DD.MM.YYYY.');
    const datum_polaska = vreme_polaska.format('YYYY-MM-DD');
    if (povratno) {
        cena_karte = cenovnik[0].cena_povratna + cenovnik[0].pocetna_destinacija.cena_peronske + cenovnik[0].krajnja_destinacija.cena_peronske
    }
    else {
        cena_karte = cenovnik[0].cena_jedan_smer + cenovnik[0].pocetna_destinacija.cena_peronske;
    }
    const polazak = await Polazak.findOne({
        where:
        {
            red_voznje_id: red_voznje_id,
            vreme_polaska: vreme_polaska
        },
        include:
            [
                {
                    model: Autobus,
                    as: 'autobus',
                }
            ],
    })
    const destinacije = await Destinacija.findAll({
        where:
        {
            id:
            {
                [Op.or]: [pocetna_destinacija_id, krajnja_destinacija_id],
            }
        }
    })
    const pocetna_destinacija = destinacije[(destinacije[0].id != pocetna_destinacija_id) + 0];//+0 kako bi konvertovali boolean u int
    const krajnja_destinacija = destinacije[(destinacije[1].id == krajnja_destinacija_id) + 0];
    const d = [pocetna_destinacija, krajnja_destinacija];
    console.log(polazak);
    const autobus = polazak.autobus;
    res.render('rezervacija/prikazi', { cena_karte, datum_polaska, vreme_polaska_sa_prve_stanice: cenovnik[0].red_voznje.vreme_polaska, broj_putnika: broj_putnika, autobus, polazak, red_voznje_id: red_voznje_id, pocetna_destinacija_povratnog_id: krajnja_destinacija_id, krajnja_destinacija_povratnog_id: pocetna_destinacija_id, danasnji_datum: danasnji_datum, povratno: povratno, datum_polaska_srpski_format: datum_polaska_srpski_format, cenovnik: cenovnik[0], dodajMinuteNaVreme: dodajMinuteNaVreme, satnica_polaska: satnica_polaska });
    //res.end(JSON.stringify(cenovnik));
}
module.exports.terminiZaPovratak = async (req, res) => {
    const pocetna_destinacija_id = req.params.pocetna_destinacija_id;
    const krajnja_destinacija_id = req.params.krajnja_destinacija_id;
    const datum_polaska = decodeURIComponent(req.params.enkodovan_datum);
    const prevoznik_id = req.params.prevoznik_id;
    const cenovnici = await cenovnikService.nadjiZaDestinacijeIDatum(pocetna_destinacija_id, krajnja_destinacija_id, datum_polaska, null, prevoznik_id);
    const vremena = [];
    cenovnici.forEach(cenovnik => vremena.push({ red_voznje_id: cenovnik.red_voznje.id, vreme_polaska_sa_prve_stanice: cenovnik.red_voznje.vreme_polaska, vreme: dodajMinuteNaVreme(cenovnik.red_voznje.vreme_polaska, cenovnik.red_voznje.stanice[0].broj_minuta_od_pocetka) }));
    res.end(JSON.stringify(vremena.sort((a, b) => a.vreme > b.vreme ? 1 : -1)));
}
module.exports.prikaziAutobus = async (req, res) => {
    const red_voznje_id = req.params.red_voznje_id;
    const pocetna_destinacija_id = req.params.pocetna_destinacija_id;
    const krajnja_destinacija_id = req.params.krajnja_destinacija_id;
    const broj_putnika = req.params.broj_putnika;
    const naziv_putovanja = req.params.naziv_putovanja;
    const vreme = decodeURIComponent(req.params.vreme_enkodovano);
    const datum = decodeURIComponent(req.params.datum_enkodovan);
    console.log(datum, vreme);
    const vreme_polaska = moment(datum + " " + vreme, "YYYY-MM-DD hh:mm:ss");
    console.log(vreme_polaska);
    const polazak = await Polazak.findOne({
        where:
        {
            red_voznje_id: red_voznje_id,
            vreme_polaska: vreme_polaska
        },
        include:
            [
                {
                    model: Autobus,
                    as: 'autobus',
                }
            ],
    })
    const rezervisana_sedista = await rezervacijaService.prikaziZauzetaSediste(polazak.id, pocetna_destinacija_id, krajnja_destinacija_id);
    res.render('rezervacija/autobus-sedista', { rezervisana_sedista, naziv_putovanja, autobus: polazak.autobus, polazak, broj_putnika, pocetna_destinacija_id, krajnja_destinacija_id })
}
module.exports.rezervisi = async (req, res) => {
    const tip_putovanja = req.params.tip_putovanja;
    const prvi_smer_naziv_putovanja = req.body.nazivi_putovanja[0];
    const prvi_smer_pocetna_destinacija_id = req.body[prvi_smer_naziv_putovanja + '_pocetna_destinacija_id'];
    const prvi_smer_krajnja_destinacija_id = req.body[prvi_smer_naziv_putovanja + '_krajnja_destinacija_id'];
    const prvi_smer_polazak_id = req.body[prvi_smer_naziv_putovanja + '_polazak_id'];
    const prvi_smer_sedista = req.body[prvi_smer_naziv_putovanja + '_rezervacija'];
    const povratak_naziv_putovanja = req.body.nazivi_putovanja[1];
    const povratak_pocetna_destinacija_id = req.body[povratak_naziv_putovanja + '_pocetna_destinacija_id'];
    const povratak_krajnja_destinacija_id = req.body[povratak_naziv_putovanja + '_krajnja_destinacija_id'];
    const povratak_polazak_id = req.body[povratak_naziv_putovanja + '_polazak_id'];
    const povratak_sedista = req.body[povratak_naziv_putovanja + '_rezervacija'];
    const polazak = await Polazak.findOne({
        where:
        {
            id: prvi_smer_polazak_id
        },
    });
    const red_voznje_id = polazak.red_voznje_id;
    const cenovnik = await cenovnikService.nadjiZaDestinacijeIDatum(prvi_smer_pocetna_destinacija_id, prvi_smer_krajnja_destinacija_id, moment(polazak.vreme_polaska).format('YYYY-MM-DD'), red_voznje_id);
    const korisnik_id = req.session.korisnik_id;
    const platio = req.body.placanje;
    if (tip_putovanja == 'jedansmer') {
        const cena_po_karti = cenovnik[0].pocetna_destinacija.cena_peronske + cenovnik[0].cena_jedan_smer;


        const pocetna_rezervacija_id = await rezervacijaService.kreirajRezervaciju(prvi_smer_polazak_id, korisnik_id, platio, prvi_smer_pocetna_destinacija_id, prvi_smer_krajnja_destinacija_id, prvi_smer_sedista, cena_po_karti);
    }
    else {
        if (Redirect.backIfUndefinedOrEmpty(req, res, povratak_pocetna_destinacija_id, povratak_krajnja_destinacija_id)) {
            return;
        }
        const cena_po_karti = cenovnik[0].pocetna_destinacija.cena_peronske + cenovnik[0].krajnja_destinacija.cena_peronske + cenovnik[0].cena_povratna;
        const pocetna_rezervacija_id = await rezervacijaService.kreirajRezervaciju(prvi_smer_polazak_id, korisnik_id, platio, prvi_smer_pocetna_destinacija_id, prvi_smer_krajnja_destinacija_id, prvi_smer_sedista, cena_po_karti);
        const povratna_rezervacija_id = await rezervacijaService.kreirajRezervaciju(povratak_polazak_id, korisnik_id, platio, povratak_pocetna_destinacija_id, povratak_krajnja_destinacija_id, povratak_sedista, 0);
        const povratak = await Povratak.create({
            prva_rezervacija_id: pocetna_rezervacija_id,
            povratak_id: povratna_rezervacija_id,
        })
    }
    Redirect.backWithSuccess(req, res, 'Rezervacija uspešno kreirana');
}
module.exports.proveriRezervisanostSedista = async (req, res) => {
    const pocetna_destinacija_id = req.params.pocetna_destinacija_id;
    const krajnja_destinacija_id = req.params.krajnja_destinacija_id;
    const red = req.params.red;
    const mesto_u_redu = req.params.mesto_u_redu;
    const polazak_id = req.params.polazak_id;
    const sediste = await rezervacijaService.prikaziZauzetaSediste(polazak_id, pocetna_destinacija_id, krajnja_destinacija_id, red, mesto_u_redu);
    let odg = {};
    if (Object.keys(sediste).length == 0) {
        odg = JSON.stringify({ sediste: `${red}_${mesto_u_redu}`, zauzeto: 0 });
    }
    else {
        odg = JSON.stringify({ sediste: `${red}_${mesto_u_redu}`, zauzeto: 1 });
    }
    console.log(odg);
    res.send(odg);
}
module.exports.privremenoRezervisi = async (req, res) => {
    const pocetna_destinacija_id = req.params.pocetna_destinacija_id;
    const krajnja_destinacija_id = req.params.krajnja_destinacija_id;
    const red = req.params.red;
    const mesto_u_redu = req.params.mesto_u_redu;
    const vreme_isteka = decodeURIComponent(req.params.vreme_isteka);
    const polazak_id = req.params.polazak_id;
    const korisnik_id = req.session.korisnik_id;
    const sediste = await rezervacijaService.privremenoRezervisi(polazak_id, korisnik_id, pocetna_destinacija_id, krajnja_destinacija_id, red, mesto_u_redu, vreme_isteka)
    console.log(sediste.id);
    res.send({ id: sediste.id });
}
module.exports.privremenoObrisi = async (req, res) => {
    const id = req.params.privremeno_sediste_id;
    await rezervacijaService.obrisiPrivremeno(id, req.session.korisnik_id);
    res.end();
}
module.exports.prikaziMoje = async (req, res) => {
    const rezervacije = await rezervacijaService.prikaziZaKorisnika(req.session.korisnik_id);
    const trenutni_datum = moment().format('YYYY-MM-DD')
    const sutrasnji_datum = moment().add(1, 'days').format('YYYY-MM-DD')
    const statistika = await rezervacijaService.statistika(req.session.korisnik_id, trenutni_datum, sutrasnji_datum);
    console.log(statistika);
    res.render('rezervacija/moje', { rezervacije: rezervacije, moment: moment, statistika: statistika });
}
module.exports.prikaziRezervisanaSedista = async (req, res) => {
    const rezervacija_id = req.params.rezervacija_id;
    const rezervacija = await rezervacijaService.nadjiRezervacijuSaSedistima(rezervacija_id)
    const vlasnik_resursa_id = rezervacija.korisnik_id;
    if (!imaPristupResursu(vlasnik_resursa_id, req.session.korisnik_id, req.session.tip_naloga, TipNaloga.admin, TipNaloga.kondukter, TipNaloga.prodavac)) {
        res.render('403');
        return;
    }
    const pocetna_stanica = await Stanica.findOne({
        where:
        {
            red_voznje_id: rezervacija.polazak.red_voznje_id,
            destinacija_id: rezervacija.pocetna_destinacija_id
        },
    })
    const vreme_polaska = moment(rezervacija.polazak.vreme_polaska).add(pocetna_stanica.broj_minuta_od_pocetka, 'minutes').format('DD.MM.YYYY. HH:mm')
    res.render('rezervacija/rezervisana-sedista', { rezervacija, vreme_polaska })
}
module.exports.prikaziKartu = async (req, res) => {
    const broj_karte = req.params.id_karte;
    const sifra_karte = req.params.sifra_karte;
    const rezervacija = await rezervacijaService.nadjiRezervacijuSaSedistima(null, broj_karte);
    const vlasnik_resursa_id = rezervacija.korisnik_id;
    if (!imaPristupResursu(vlasnik_resursa_id, req.session.korisnik_id, req.session.tip_naloga, TipNaloga.admin, TipNaloga.kondukter, TipNaloga.prodavac)) {
        res.render('403');
        return;
    }
    if (rezervacija.length == 0 || rezervacija.rezervisana_sedista.length == 0) {
        Redirect.toRouteWithError(req, res, '/rezervacija/citac', 'Karta sa tim brojem ne postoji.')
        return;
    }
    const pocetna_stanica = await Stanica.findOne({
        where:
        {
            red_voznje_id: rezervacija.polazak.red_voznje_id,
            destinacija_id: rezervacija.pocetna_destinacija_id
        },
    })
    const vreme_polaska = moment(rezervacija.polazak.vreme_polaska).add(pocetna_stanica.broj_minuta_od_pocetka, 'minutes').format('DD.MM.YYYY. HH:mm')
    res.render('rezervacija/karta', { rezervacija: rezervacija, vreme_polaska })
}
module.exports.ocitajKartu = async (req, res) => {
    const broj_karte = req.params.id_karte;
    const sifra_karte = req.params.sifra_karte;
    const rezervacija = await rezervacijaService.nadjiRezervacijuSaSedistima(null, broj_karte);
    if (rezervacija.length == 0 || rezervacija.rezervisana_sedista.length == 0) {
        Redirect.toRouteWithError(req, res, '/rezervacija/citac', 'Karta sa tim brojem ne postoji.')
        return;
    }
    const pogresna_sifra = 0;
    if (rezervacija.rezervisana_sedista[0].sifra_karte != sifra_karte) {
        pogresna_sifra = 1;
    }
    if (pogresna_sifra == 1) {
        Redirect.toRouteWithError(req, res, '/rezervacija/citac', 'Pograšna šifra karte.')
        return;
    }
    else {
        if (rezervacija.rezervisana_sedista[0].ocitana == 1) {
            Redirect.toRouteWithError(req, res, '/rezervacija/citac', 'Karta je već očitana.')
            return;
        }
        else {
            await RezervisanoSediste.update({ ocitana: 1 }, { where: { id: broj_karte } })
            Redirect.backToRouteWithSuccess(req, res, '/rezervacija/citac', 'Karta očitana.')
        }
    }
}
module.exports.citac = function (req, res) {
    res.render('rezervacija/citac');
}
module.exports.citacUcitaj = function (req, res) {
    const broj_karte = req.body.broj_karte;
    const sifra_karte = req.body.sifra_karte;
    res.redirect(`../rezervacija/prikazi/${broj_karte}/${sifra_karte}`);
}


