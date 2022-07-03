import * as Redirect from './../helpers/Redirect.js'
import bcrypt from 'bcrypt'
import sequelize from '../models/index.js';
const { Korisnik } = sequelize.models;

export const prijava = (req, res) =>//stranica
{
    res.render('korisnik/prijava')
}
export const prijavi_korisnika = async (req, res) =>//POST tj prijava
{
    const { email, lozinka, zahtevan_url } = req.body;

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
export const noviPrikazi = (req, res) =>//stranica
{
    res.render('korisnik/novi')
}
export const novi = async (req, res) =>//POST/registracija
{
    const { ime, prezime, broj_telefona, email, sifra, tip_naloga } = req.body;

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
export const registracija = (req, res) =>//stranica
{
    res.render('korisnik/registracija')
}
export const registruj = async (req, res) =>//POST/registracija
{

    const { ime, prezime, broj_telefona, email, sifra } = req.body;
    
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
export const odjava = async (req, res) => {
    req.session.korisnik_id = null;
    req.session.tip_naloga = null;
    res.locals.tip_naloga = null;
    res.locals.tip_naloga = null;
    res.redirect('/');
}