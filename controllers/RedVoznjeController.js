const express=require('express')
const {sequelize,RedVoznje,Prevoznik,Autobus,Destinacija,Cenovnik,Stanica,Polazak}=require('../models');
const parser = require('body-parser');
const { redirect } = require('express/lib/response');
const Redirect=require('./../helpers/Redirect');
const polazakService=require('./../services/polazakService');
module.exports.kreiraj=async (req,res)=>//prikazuje dijalog za kreiranje nove destinacije
{
    const prevoznici = Prevoznik.findAll();
    const autobusi =  Autobus.findAll();
    const destinacije =  Destinacija.findAll();
    const danasnji_datum=(new Date()).toISOString().split('T')[0];
    res.render('redvoznje/kreiraj',{danasnji_datum:danasnji_datum,prevoznici:await prevoznici,autobusi:await autobusi,destinacije:await destinacije});
}
module.exports.sacuvaj= async (req,res)=>//cuva novokreiranu destinaciju
{
    console.log('hit');
    var str=JSON.stringify(req.body);
    var naziv=req.body.naziv;
    var ponedeljak=req.body.ponedeljak ? '1':'0';
    var utorak=req.body.utorak ? '1':'0'
    var sreda=req.body.sreda ? '1':'0'
    var cetvrtak=req.body.cetvrtak ? '1':'0'
    var petak=req.body.petak ? '1':'0'
    var subota=req.body.subota ? '1':'0'
    var nedelja=req.body.nedelja ? '1':'0'
    var vreme_polaska=req.body.vreme_polaska;
    var autobus_id=req.body.autobus;
    var rok_vazenja=req.body.rok_vazenja;
    var idovi_stanica=req.body.stanice;
    var prevoznik=req.body.prevoznik;
    var vremena=req.body.vreme;//sadrzi niz koji za svaku stanicu sadrzi broj minuta od pocetne stanice
    var kilometri=req.body.kilometri;//sadrzi niz koji za svaku stanicu sadrzi broj kilometra od pocetne stanice
    var cenovnik_modeli=[];
    var stanice_modeli=[];
   /* Redvoznje.create(red_voznje_model).catch(err=>{
        Redirect.backWithError(req,res,'Došlo je do greške');
    })*/
    var k=1;
    var red_voznje_model={naziv:naziv,prevoznik_id:prevoznik,rok_vazenja:rok_vazenja,vreme_polaska:vreme_polaska,ponedeljak:ponedeljak,utorak:utorak,sreda:sreda,cetvrtak:cetvrtak,petak:petak,subota:subota,nedelja:nedelja};

    //console.log(red_voznje_model,cenovnik_modeli,stanice_modeli,polasci_modeli);
   // res.send(JSON.stringify(jedansmer_cenovnik))
   // res.end(JSON.stringify(cenovnik_modeli))
    //res.end(str);
   try
   {
    const rezultat= await sequelize.transaction(async(t)=>
    {
        var redvoznje=await RedVoznje.create(red_voznje_model) 
            for(var stanica of req.body.stanice)
            {
                stanice_modeli.push({red_voznje_id:redvoznje.id,destinacija_id:stanica,redni_broj:k,broj_minuta_od_pocetka:req.body.vreme[k-1],broj_km_od_pocetka:kilometri[k-1]})
                k++;
            }
            for(var input_key in req.body)//prolazimo kroz sva polja objekta(input_key sadrzi naziv polja)
            {
                if(input_key.startsWith('karta_'))//ako naziv polja pocinje sa karta to znaci da je input sa cenovnikom
                {//npr karta_2_4['jedan_smer']   2 predstavlja id pocetne stanice,4 predstavlja id krajnje stanice
                    var cene=req.body[input_key];//pristupamo vrednosti tog polja pomocu kljuca
                    var podaci=input_key.split('_')//delimo taj string na delove primer stringa karta_2_4
                    var pocetna_stanica=podaci[1];//podaci[0]='karta' podaci[1]=2 ovaj podatak predstavlja ID pocetne stanice
                    var krajnja_stanica=podaci[2];//podaci[2]=4 ovaj podatak predsavlja id krajnje stanice
                    var info={red_voznje_id:redvoznje.id,cena_jedan_smer:cene.jedan_smer,cena_povratna:cene.povratna,pocetna_destinacija_id:pocetna_stanica,krajnja_destinacija_id:krajnja_stanica};
                    cenovnik_modeli.push(info);//kreiramo novi entitet koji dodajemo u niz modela,koje cemo zatim ubaciti u bazu
                }
            }
            var stanice=await Stanica.bulkCreate(stanice_modeli,{validate:true})
            var cenovnici=await Cenovnik.bulkCreate(cenovnik_modeli,{validate:true})
            var polasci_modeli=polazakService.kreirajPolaskeZaRedVoznje(redvoznje.id,autobus_id,vreme_polaska,rok_vazenja,ponedeljak,utorak,sreda,cetvrtak,petak,subota,nedelja) 
            var polasci=await Polazak.bulkCreate(polasci_modeli,{validate:true})
    })
   }
    catch(err)
    {
        //console.log(err);
        Redirect.backWithValidationErrors(req,res,err);
        return;
    }
    Redirect.backWithSuccess(req,res,'Red vožnje uspešno kreiran.');
      
            
      
   
      //console.log(rezultat.sql);
}
module.exports.izmeni=(req,res)=>//prikazuje edit stranicu
{
    
}
module.exports.promeni=(req,res)=>//cuva izmene
{
    
}