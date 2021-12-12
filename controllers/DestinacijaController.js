const express=require('express')
const {sequelize,Destinacija}=require('./../models');
const parser = require('body-parser');
const Redirect=require('./../helpers/Redirect');
const { redirect } = require('express/lib/response');
module.exports.kreiraj=(req,res)=>//prikazuje dijalog za kreiranje nove destinacije
{
    res.render('destinacija/kreiraj')
}
module.exports.sacuvaj=async (req,res)=>//cuva novokreiranu destinaciju
{
    var naziv=req.body.naziv;
    var cena_peronske=req.body.cena_peronske;
    if(Redirect.backIfUndefined(req,res,naziv,cena_peronske))
    {
        return;
    }
    var destinacija=await Destinacija.create({ime:naziv,cena_peronske:cena_peronske}) 
    .catch((err)=>
    {
        Redirect.backWithValidationErrors(req,res,err)
    }
    )
    Redirect.backWithSuccess(req,res,'Destinacija uspešno dodata');
}
module.exports.izmeni= async(req,res)=>//prikazuje edit stranicu
{
    var id=req.params.id;
    const destinacija = await Destinacija.findOne({
        where: {
          id:id,
        }
      });
    if(destinacija==null)
    {
        Redirect.backWithError(req,res,'Destinacija sa tim IDijem ne postoji');
    }
    res.render('destinacija/izmeni',{naziv:destinacija.ime,cena_peronske:destinacija.cena_peronske,id:id})
}
module.exports.promeni=(req,res)=>//cuva izmene
{
    var naziv=req.body.naziv;
    var cena_peronske=req.body.cena_peronske
    var id=req.params.id;
    if(Redirect.backIfUndefined(req,res,naziv,cena_peronske,id))
    {
        return;
    }
    Destinacija.update({ime:naziv,cena_peronske:cena_peronske},{where:{id:id}})
    .then((data)=>Redirect.backWithSuccess(req,res,'Izmene uspešno sačuvane'))
    .catch((err)=>Redirect.backWithValidationErrors(req,res,err))
}
