const express=require('express')
const {sequelize,Korisnik}=require('./../models');
const parser = require('body-parser');
const Redirect=require('./../helpers/Redirect');
function kreirajNovogKorisnika(req,res)//za kreiranje korisnika koji nije obican nego admin,kondukter
{
    console.log('kreiram');
    Korisnik.create({email:"tes213t@gmail.com",sifra:'testtet',tip_naloga:'korisnik'}).catch(err=>{
        console.log(err)
    })
  
}
module.exports.prijava=(req,res)=>//stranica
{
    res.render('korisnik/prijava')
}
module.exports.prijavi_korisnika=async (req,res)=>//POST tj prijava
{
    var email=req.body.email;
    var lozinka=req.body.lozinka;
    if(Redirect.backIfUndefinedOrEmpty(req,res,email,lozinka))//ako vrati true znaci da je uradio redirect i poslao response,time prekidamo izvrsenje logike ispod posto podaci nisu validni tj. nisu svi podaci uneti
    {
        return;
    }
    const korisnik = await Korisnik.findOne({
        where: {
          email:email,
          sifra:lozinka,
        }
      });
    if(korisnik==null)
    {
        req.session.error='Greška korisnik sa tim emailom i lozinkom ne postoji.'
        res.redirect('back');
    }
    else
    {
        req.session.korisnik_id=korisnik.id;
        res.redirect('/')
    }
    res.end();
}
module.exports.registracija=(req,res)=>//stranica
{
    res.render('korisnik/registracija')
}
module.exports.registruj=async (req,res)=>//POST/registracija
{
    var korisnik=await Korisnik.create({ime:req.body.ime,prezime:req.body.prezime,broj_telefona:req.body.broj_telefona,email:req.body.email,sifra:req.body.sifra,tip_naloga:'korisnik'})
    .catch((err)=>
    {
        Redirect.backWithValidationErrors(req,res,err)
    }
    )
}

module.exports.kreirajNovogKorisnika=kreirajNovogKorisnika;