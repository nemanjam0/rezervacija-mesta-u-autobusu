import moment from 'moment';
import * as Redirect from './../helpers/Redirect.js'
import * as polazakService from './../services/polazakService.js';
import * as cenovnikService from './../services/cenovnikService.js';
import { dodajMinuteNaVreme } from './../helpers/Vreme.js';
import sequelize from '../models/index.js';
const { Autobus, Cenovnik, Destinacija, Polazak, Prevoznik, RedVoznje, Stanica } = sequelize.models;
export const pretragaPrikazi = async (req, res) =>//prikazuje dijalog za kreiranje nove destinacije
{
    const destinacije = await Destinacija.findAll();
    const danasnji_datum = (new Date()).toISOString().split('T')[0];
    res.render('redvoznje/pretraga', { destinacije: destinacije, danasnji_datum: danasnji_datum });
}
export const rezultatiPretrage = async (req, res) =>//prikazuje dijalog za kreiranje nove destinacije
{

    const datum_polaska = moment(req.body.datum_polaska);
    const datum_polaska_srpski_format = datum_polaska.format('DD.MM.YYYY.');
    const broj_putnika = req.body.broj_putnika;
    let naziv_dana = "";
    const pocetna_destinacija_id = req.body.pocetna_lokacija;
    const krajnja_destinacija_id = req.body.krajnja_lokacija;
    const destinacije = await Destinacija.findAll();
    const cenovnici = await cenovnikService.nadjiZaDestinacijeIDatum(pocetna_destinacija_id, krajnja_destinacija_id, datum_polaska.format('YYYY-MM-DD'));
    const dan_u_nedelji = datum_polaska.day() != 0 ? datum_polaska.day() : datum_polaska.day() + 7;
    switch (dan_u_nedelji) {
        case 1: naziv_dana = "Ponedeljak"; break;
        case 2: naziv_dana = "Utorak"; break;
        case 3: naziv_dana = "Sreda"; break;
        case 4: naziv_dana = "Četvrtak"; break;
        case 5: naziv_dana = "Petak"; break;
        case 6: naziv_dana = "Subota"; break;
        case 7: naziv_dana = "Nedelja"; break;
    }
    //kreiraj metodu za dodavanje minuta na vreme i prosledi je u res.locals ili smesti u promenjivu koju ces da saljes kao parametar viewu

    res.render('redvoznje/pretraga', { naziv_dana: naziv_dana, broj_putnika: broj_putnika, datum_polaska: datum_polaska_srpski_format, destinacije: destinacije, cenovnici: cenovnici, dodajMinuteNaVreme: dodajMinuteNaVreme });
}
export const kreiraj = async (req, res) =>//prikazuje dijalog za kreiranje nove destinacije
{
    const prevoznici = Prevoznik.findAll();
    const autobusi = Autobus.findAll();
    const destinacije = Destinacija.findAll();
    const danasnji_datum = (new Date()).toISOString().split('T')[0];
    res.render('redvoznje/kreiraj', { danasnji_datum: danasnji_datum, prevoznici: await prevoznici, autobusi: await autobusi, destinacije: await destinacije });
}
export const sacuvaj = async (req, res) =>//cuva novokreiranu destinaciju
{
    const str = JSON.stringify(req.body);
    const naziv = req.body.naziv;
    const ponedeljak = req.body.ponedeljak ? '1' : '0';
    const utorak = req.body.utorak ? '1' : '0'
    const sreda = req.body.sreda ? '1' : '0'
    const cetvrtak = req.body.cetvrtak ? '1' : '0'
    const petak = req.body.petak ? '1' : '0'
    const subota = req.body.subota ? '1' : '0'
    const nedelja = req.body.nedelja ? '1' : '0'
    const vreme_polaska = req.body.vreme_polaska;
    const autobus_id = req.body.autobus;
    const pocetak_vazenja = req.body.pocetak_vazenja;
    const rok_vazenja = req.body.rok_vazenja;
    const idovi_stanica = req.body.stanice;
    const prevoznik = req.body.prevoznik;
    const vremena = req.body.vreme;//sadrzi niz koji za svaku stanicu sadrzi broj minuta od pocetne stanice
    const kilometri = req.body.kilometri;//sadrzi niz koji za svaku stanicu sadrzi broj kilometra od pocetne stanice
    const cenovnik_modeli = [];
    const stanica_modeli = [];
    /* Redvoznje.create(red_voznje_model).catch(err=>{
         Redirect.backWithError(req,res,'Došlo je do greške');
     })*/
    const k = 1;
    const red_voznje_model = { naziv: naziv, prevoznik_id: prevoznik, pocetak_vazenja: pocetak_vazenja, rok_vazenja: rok_vazenja, vreme_polaska: vreme_polaska, ponedeljak: ponedeljak, utorak: utorak, sreda: sreda, cetvrtak: cetvrtak, petak: petak, subota: subota, nedelja: nedelja };

    //console.log(red_voznje_model,cenovnik_modeli,stanica_modeli,polasci_modeli);
    // res.send(JSON.stringify(jedansmer_cenovnik))
    // res.end(JSON.stringify(cenovnik_modeli))
    //res.end(str);
    try {
        const rezultat = await sequelize.transaction(async (t) => {
            const redvoznje = await RedVoznje.create(red_voznje_model, { transaction: t })
            for (const stanica of req.body.stanice) {
                stanica_modeli.push({ red_voznje_id: redvoznje.id, destinacija_id: stanica, redni_broj: k, broj_minuta_od_pocetka: req.body.vreme[k - 1], broj_km_od_pocetka: kilometri[k - 1] })
                k++;
            }
            for (const input_key in req.body)//prolazimo kroz sva polja objekta(input_key sadrzi naziv polja)
            {
                if (input_key.startsWith('karta_'))//ako naziv polja pocinje sa karta to znaci da je input sa cenovnikom
                {//npr karta_2_4['jedan_smer']   2 predstavlja id pocetne stanice,4 predstavlja id krajnje stanice
                    const cene = req.body[input_key];//pristupamo vrednosti tog polja pomocu kljuca
                    const podaci = input_key.split('_')//delimo taj string na delove primer stringa karta_2_4
                    const pocetna_stanica = podaci[1];//podaci[0]='karta' podaci[1]=2 ovaj podatak predstavlja ID pocetne stanice
                    const krajnja_stanica = podaci[2];//podaci[2]=4 ovaj podatak predsavlja id krajnje stanice
                    const info = { red_voznje_id: redvoznje.id, cena_jedan_smer: cene.jedan_smer, cena_povratna: cene.povratna, pocetna_destinacija_id: pocetna_stanica, krajnja_destinacija_id: krajnja_stanica };
                    cenovnik_modeli.push(info);//kreiramo novi entitet koji dodajemo u niz modela,koje cemo zatim ubaciti u bazu
                }
            }
            const stanice = await Stanica.bulkCreate(stanica_modeli, { validate: true, transaction: t })
            const cenovnici = await Cenovnik.bulkCreate(cenovnik_modeli, { validate: true, transaction: t })
            const polasci_modeli = polazakService.kreirajPolaskeZaRedVoznje(redvoznje.id, autobus_id, vreme_polaska, pocetak_vazenja, rok_vazenja, ponedeljak, utorak, sreda, cetvrtak, petak, subota, nedelja)
            const polasci = await Polazak.bulkCreate(polasci_modeli, { validate: true, transaction: t })
        })
    }
    catch (err) {
        //console.log(err);
        Redirect.backWithValidationErrors(req, res, err);
        return;
    }
    Redirect.backWithSuccess(req, res, 'Red vožnje uspešno kreiran.');




    //console.log(rezultat.sql);
}
export const kopiraj = async (req, res) =>//prikazuje edit stranicu
{
    const id = req.params.id;
    const danasnji_datum = (new Date()).toISOString().split('T')[0];
    const autobusi = await Autobus.findAll();
    res.render('redvoznje/kopiraj', { id: id, danasnji_datum: danasnji_datum, autobusi: autobusi });

}
export const sacuvajkopiju = async (req, res) =>//cuva izmene
{
    const id = req.params.id;
    const naziv = req.body.naziv;
    const ponedeljak = req.body.ponedeljak ? '1' : '0';
    const utorak = req.body.utorak ? '1' : '0'
    const sreda = req.body.sreda ? '1' : '0'
    const cetvrtak = req.body.cetvrtak ? '1' : '0'
    const petak = req.body.petak ? '1' : '0'
    const subota = req.body.subota ? '1' : '0'
    const nedelja = req.body.nedelja ? '1' : '0'
    const vreme_polaska = req.body.vreme_polaska;
    const rok_vazenja = req.body.rok_vazenja;
    const pocetak_vazenja = req.body.pocetak_vazenja;
    const obrni_smer = req.body.obrni_smer ? true : false;
    const autobus_id = req.body.autobus;
    const red_voznje = await RedVoznje.findByPk(id);
    const stanice = await Stanica.findAll(
        {
            where: {
                red_voznje_id: id,
            },
            attributes:
            {
                exclude: ['id', 'vreme_kreiranja', 'poslednja_izmena']
            },
            raw: true,
        }
    )
    const cenovnik = await Cenovnik.findAll(
        {
            where: {
                red_voznje_id: id,
            },
            attributes:
            {
                exclude: ['id', 'vreme_kreiranja', 'poslednja_izmena']
            },
            raw: true,
        }
    )
    const broj_stanica = stanice.length;
    const najdalja = { minuti: 0, kilometri: 0 }
    if (obrni_smer) {
        stanice.forEach((stanica) => {
            if (stanica.broj_km_od_pocetka > najdalja.kilometri) {
                najdalja.kilometri = stanica.broj_km_od_pocetka;
                najdalja.minuti = stanica.broj_minuta_od_pocetka;
            }
        })
    }
    const red_voznje_kopija = { naziv: naziv, prevoznik_id: red_voznje.prevoznik_id, pocetak_vazenja: pocetak_vazenja, rok_vazenja: rok_vazenja, vreme_polaska: vreme_polaska, ponedeljak: ponedeljak, utorak: utorak, sreda: sreda, cetvrtak: cetvrtak, petak: petak, subota: subota, nedelja: nedelja };
    try {

        const rezultat = await sequelize.transaction(async function (t) {
            const redvoznje = await RedVoznje.create(red_voznje_kopija, { transaction: t })
            this.stanice.forEach((stanica) => {
                stanica.red_voznje_id = redvoznje.id;
                if (obrni_smer) {
                    stanica.redni_broj = broj_stanica + 1 - stanica.redni_broj
                    stanica.broj_km_od_pocetka = najdalja.kilometri - stanica.broj_km_od_pocetka;
                    stanica.broj_minuta_od_pocetka = najdalja.minuti - stanica.broj_minuta_od_pocetka;
                }

            })
            this.cenovnik.forEach((cena) => {
                cena.red_voznje_id = redvoznje.id
                if (obrni_smer) {
                    const pom = cena.pocetna_destinacija_id;
                    cena.pocetna_destinacija_id = cena.krajnja_destinacija_id;
                    cena.krajnja_destinacija_id = pom;

                }
            })
            const generisaniPolasci = polazakService.kreirajPolaskeZaRedVoznje(redvoznje.id, this.autobus_id, vreme_polaska, pocetak_vazenja, rok_vazenja, ponedeljak, utorak, sreda, cetvrtak, petak, subota, nedelja)
            const stanice_nove = await Stanica.bulkCreate(this.stanice, { validate: true, transaction: t })
            const cenovnici = await Cenovnik.bulkCreate(this.cenovnik, { validate: true, transaction: t })
            const polasci = await Polazak.bulkCreate(generisaniPolasci, { validate: true, transaction: t })
        }.bind({ cenovnik: cenovnik, stanice: stanice, autobus_id: autobus_id, rok_vazenja: rok_vazenja, pocetak_vazenja: pocetak_vazenja, ponedeljak: ponedeljak, utorak: utorak, sreda: sreda, cetvrtak: cetvrtak, petak: petak, subota: subota, nedelja: nedelja }));
    }
    catch (err) {
        Redirect.backWithValidationErrors(req, res, err);
        return;
    }
    Redirect.backWithSuccess(req, res, "Novi red vožnje uspesno kreiran");
}
export const lista = async (req, res) => {
    const redovi_voznje = await RedVoznje.findAll({
        include:
            [
                {
                    model: Prevoznik,
                    as: 'prevoznik',
                }
            ],
    });
    res.render('redvoznje/lista', { redovi_voznje: redovi_voznje, moment: moment });

}