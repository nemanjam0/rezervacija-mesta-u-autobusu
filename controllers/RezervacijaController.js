const express=require('express')
const {sequelize,RedVoznje,Prevoznik,Autobus,Destinacija,Cenovnik,Stanica,Polazak}=require('../models');
const parser = require('body-parser');
const moment=require('moment')
const { redirect } = require('express/lib/response');
const Redirect=require('./../helpers/Redirect');
const {Op}=require('sequelize');
const cenovnikService=require('./../services/cenovnikService');
const {dodajMinuteNaVreme}=require('./../helpers/Vreme');
module.exports.prikazi=async (req,res)=>//prikazuje dijalog za kreiranje nove destinacije
{
    var red_voznje_id=req.params.red_voznje_id;
    var pocetna_destinacija_id=req.params.pocetna_destinacija;
    var krajnja_destinacija_id=req.params.krajnja_destinacija;
    var povratno=req.params.tip_karte=='povratna';
    var danasnji_datum=moment().format('YYYY-MM-DD');
    var broj_putnika=req.params.broj_putnika;
    var vreme_polaska=moment(decodeURIComponent(req.params.enkodovano_vreme),'DD.MM.YYYY h:m:s');
    var satnica_polaska=vreme_polaska.format("h:m:s");
    var cenovnik=await cenovnikService.nadjiZaDestinacijeIDatum(pocetna_destinacija_id,krajnja_destinacija_id,vreme_polaska.format('YYYY-MM-DD'),red_voznje_id);
    var datum_polaska_srpski_format=vreme_polaska.format('DD.MM.YYYY.');
    var datum_polaska=vreme_polaska.format('YYYY-MM-DD');
    var polazak=await Polazak.findOne({
        where:
        {
            red_voznje_id:red_voznje_id,
            vreme_polaska:vreme_polaska
        },
        include:
        [
            {
                model:Autobus,
                as:'autobus',
            }
        ],
    })
    var destinacije=await Destinacija.findAll({
        where:
        {
            id:
            {
                [Op.or]:[pocetna_destinacija_id,krajnja_destinacija_id],
            }
        }
    })
    var pocetna_destinacija=destinacije[(destinacije[0].id!=pocetna_destinacija_id)+0];//+0 kako bi konvertovali boolean u int
    var krajnja_destinacija=destinacije[(destinacije[1].id==krajnja_destinacija_id)+0];
    var d=[pocetna_destinacija,krajnja_destinacija];
    var autobus=polazak.autobus;
    polazak=JSON.parse(JSON.stringify(polazak));
    res.render('rezervacija/prikazi',{datum_polaska,vreme_polaska_sa_prve_stanice:cenovnik[0].red_voznje.vreme_polaska,broj_putnika:broj_putnika,autobus,polazak,red_voznje_id:red_voznje_id,pocetna_destinacija_povratnog_id:krajnja_destinacija_id,krajnja_destinacija_povratnog_id:pocetna_destinacija_id,danasnji_datum:danasnji_datum,povratno:povratno,datum_polaska_srpski_format:datum_polaska_srpski_format,cenovnik:cenovnik[0],dodajMinuteNaVreme:dodajMinuteNaVreme,satnica_polaska:satnica_polaska});
    //res.end(JSON.stringify(cenovnik));
}
module.exports.terminiZaPovratak=async (req,res)=>
{
    var pocetna_destinacija_id=req.params.pocetna_destinacija_id;
    var krajnja_destinacija_id=req.params.krajnja_destinacija_id;
    var datum_polaska=decodeURIComponent(req.params.enkodovan_datum);
    var prevoznik_id=req.params.prevoznik_id;
    var cenovnici=await cenovnikService.nadjiZaDestinacijeIDatum(pocetna_destinacija_id,krajnja_destinacija_id,datum_polaska,null,prevoznik_id);
    var vremena=[];
    cenovnici.forEach(cenovnik=>vremena.push({red_voznje_id:cenovnik.red_voznje.id,vreme_polaska_sa_prve_stanice:cenovnik.red_voznje.vreme_polaska,vreme:dodajMinuteNaVreme(cenovnik.red_voznje.vreme_polaska,cenovnik.red_voznje.stanice[0].broj_minuta_od_pocetka)}));
    res.end(JSON.stringify(vremena.sort((a,b)=> a.vreme>b.vreme ? 1:-1)));
}
module.exports.prikaziAutobusZaPovratak=async (req,res)=>
{
    var red_voznje_id=req.params.red_voznje_id;
    var pocetna_destinacija_id=req.params.pocetna_destinacija_id;
    var krajnja_destinacija_id=req.params.krajnja_destinacija_id;
    var broj_putnika=req.params.broj_putnika;
    var vreme=decodeURIComponent(req.params.vreme_enkodovano);
    var datum=decodeURIComponent(req.params.datum_enkodovan);
    console.log(datum,vreme);
    var vreme_polaska=moment(datum+" "+vreme,"YYYY-MM-DD hh:mm:ss");
    console.log(vreme_polaska);
    var polazak=await Polazak.findOne({
        where:
        {
            red_voznje_id:red_voznje_id,
            vreme_polaska:vreme_polaska
        },
        include:
        [
            {
                model:Autobus,
                as:'autobus',
            }
        ],
    })
    res.render('rezervacija/autobus-sedista',{autobus:polazak.autobus,polazak,broj_putnika,pocetna_destinacija_id,krajnja_destinacija_id})
}

