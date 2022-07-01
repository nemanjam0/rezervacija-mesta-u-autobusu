const express = require('express')
const { sequelize, Korisnik } = require('./../models');
const parser = require('body-parser');
const Redirect = require('./../helpers/Redirect');
const bcrypt = require('bcrypt');
module.exports.prijava = (req, res) =>//stranica
{
    res.render('korisnik/prijava')
}
module.exports.prijavi_korisnika = async (req, res) =>//POST tj prijava
{
    const email = req.body.email;
    const lozinka = req.body.lozinka;
    const zahtevan_url = req.body.zahtevan_url;
    if (Redirect.backIfUndefinedOrEmpty(req, res, email, lozinka))//ako vrati true znaci da je uradio redirect i poslao response,time prekidamo izvrsenje logike ispod posto podaci nisu validni tj. nisu svi podaci uneti
    {
        return;
    }
    const korisnik = await Korisnik.findOne({
        where: {
            email: email
        }
    });

    if (korisnik == null) {
        req.session.error = 'Greška korisnik sa tim emailom i lozinkom ne postoji.'
        res.redirect('back');
    }
    else {
        const sifra_je_validna = await bcrypt.compare(lozinka, korisnik.sifra);
        if (sifra_je_validna) {
            req.session.korisnik_id = korisnik.id;
            req.session.tip_naloga = korisnik.tip_naloga;
            if (zahtevan_url) {
                res.redirect(decodeURI(zahtevan_url));
            }
            else {
                res.redirect('/')
            }
        }
        else {
            req.session.error = 'Greška korisnik sa tim emailom i lozinkom ne postoji.'
            res.redirect('back');
        }
    }
    res.end();
}
module.exports.noviPrikazi = (req, res) =>//stranica
{
    res.render('korisnik/novi')
}
module.exports.novi = async (req, res) =>//POST/registracija
{
    const ime = req.body.ime;
    const prezime = req.body.prezime;
    const broj_telefona = req.body.broj_telefona;
    const email = req.body.email;
    const sifra = req.body.sifra;
    const tip_naloga = req.body.tip_naloga;
    if (Redirect.backIfUndefinedOrEmpty(req, res, ime, prezime, broj_telefona, email, sifra, tip_naloga)) {
        return 1;
    }
    const salt = await bcrypt.genSalt(15);
    const hesovana_sifra = await bcrypt.hash(sifra, salt);
    const korisnik = await Korisnik.create({ ime: ime, prezime: prezime, broj_telefona: broj_telefona, email: email, sifra: hesovana_sifra, tip_naloga })
        .catch((err) => {
            Redirect.backWithValidationErrors(req, res, err)
        }
        )

    if (korisnik) {
        Redirect.backToRouteWithSuccess(req, res, '/korisnik/kreiraj', 'Novi korisnik uspešno kreiran');
    }
}
module.exports.registracija = (req, res) =>//stranica
{
    res.render('korisnik/registracija')
}
module.exports.registruj = async (req, res) =>//POST/registracija
{
    const ime = req.body.ime;
    const prezime = req.body.prezime;
    const broj_telefona = req.body.broj_telefona;
    const email = req.body.email;
    const sifra = req.body.sifra;
    if (Redirect.backIfUndefinedOrEmpty(req, res, ime, prezime, broj_telefona, email, sifra)) {
        return 1;
    }
    const salt = await bcrypt.genSalt(15);
    const hesovana_sifra = await bcrypt.hash(sifra, salt);
    const korisnik = await Korisnik.create({ ime: ime, prezime: prezime, broj_telefona: broj_telefona, email: email, sifra: hesovana_sifra, tip_naloga: 'korisnik' })
        .catch((err) => {
            Redirect.backWithValidationErrors(req, res, err)
        }
        )

    if (korisnik) {
        res.redirect('/prijava');
    }
}
module.exports.odjava = async (req, res) => {
    req.session.korisnik_id = null;
    req.session.tip_naloga = null;
    res.locals.tip_naloga = null;
    res.locals.tip_naloga = null;
    res.redirect('/');
}