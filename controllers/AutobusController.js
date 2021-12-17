const express=require('express')
const {sequelize,Autobus}=require('../models');
const parser = require('body-parser');
const Redirect=require('./../helpers/Redirect');
module.exports.kreiraj=(req,res)=>//prikazuje dijalog za kreiranje nove destinacije
{
    res.render('autobus/kreiraj')
}
module.exports.sacuvaj=async (req,res)=>//cuva novokreiranu destinaciju
{
    var naziv=req.body.naziv;
    var broj_redova=req.body.broj_redova;
    var broj_sedista_levo=req.body.broj_sedista_levo;  
    var broj_sedista_desno=req.body.broj_sedista_desno;  
    var broj_sedista_u_zadnjem_redu=req.body.broj_sedista_u_zadnjem_redu;  
    console.log(typeof req.body.broj_sedista_u_zadnjem_redu );
    if(Redirect.backIfUndefinedOrEmpty(req,res,naziv,broj_redova,broj_sedista_levo,broj_sedista_desno,broj_sedista_u_zadnjem_redu))
    {
        return;
    }
    autobus=await Autobus.create({naziv:naziv,broj_redova:broj_redova,broj_sedista_levo:broj_sedista_levo,broj_sedista_desno:broj_sedista_desno,broj_sedista_u_zadnjem_redu})
    .catch((err)=>
    {
        Redirect.backWithValidationErrors(req,res,err)
    }
    )
    Redirect.backWithSuccess(req,res,'Autobus uspešno kreiran');
}
