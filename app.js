const express=require('express');
const {sequelize,Korisnik,RedVoznje,Stanica,Polazak,Cenovnik,Prevoznik}=require('./models');
const destinacija_rute=require('./routes/destinacija');
const moment=require('moment');
const prevoznik_rute=require('./routes/prevoznik');
const pocetne_rute=require('./routes/pocetne');
const autobus_rute=require('./routes/autobus');
const redvoznje_rute=require('./routes/redvoznje');
const rezervacija_rute=require('./routes/rezervacija');
const parser = require('body-parser');
const {Op}=require('sequelize');
const session = require('express-session')
const polazakService=require('./services/polazakService')
const cenovnikService=require('./services/cenovnikService')
const {dodajMinuteNaVreme}=require('./helpers/Vreme');
const app=express();
app.use(express.static('public'))
app.use(parser.urlencoded({ extended: true }));
app.use(session({
    secret: 'xXHqhUDmqhHSq',
    resave: false,
    saveUninitialized: true,
  }))

app.set('view engine','pug')
app.use('/',function (req, res, next) {
    if(req.method=='POST')//samo post ima req.body,radimo ovo preventivno kako ne bi cuvao podatke prilikom zahteva za staticke fajlove i na taj nacin obrisao vec sacuvane podatke posto je tada req.body objekat prazan
    {
        req.session.old_data=req.body;
    }
    res.locals.old=(param,default_value="")=>//kreiramo novi metod koji smestamo u res.locals objekat kako bi smo mogli da ga koristimo u pug templatima,njegova svrha je da nam vrati podatke iz prethodog zahteva,ovu funkcionalnost koristimo ako se javila neka greska prilikom validacije(kako korisnik ne bi morao sve od pocetka da unosi)
    {//default_value nam koristi prilikom izmene tj. kada vrsimo izmenu nekog entiteta prvo formi prosledimo vrednosti iz baze,a posle ako prilikom izmene dodje do greske u validaciji onda saljemo podatke koje korisnik izmenio,a ne podatke iz baze
        if((typeof req.session.old_data)!=='undefined' && (typeof req.session.old_data[param])!=='undefined')//proveravamo da li postoji trazeni podatak
        {
            return req.session.old_data[param];
        }
        else
        {
            return default_value;
        }
    }
    res.locals.success=req.session.success || "";
    res.locals.error=req.session.error || "";
    req.session.error="";
    req.session.success="";
    res.locals.korisnik_id=req.session.korisnik_id;
    res.locals.tip_naloga=req.session.tip_naloga;
    next();
})
app.use('/',pocetne_rute)
app.use('/destinacija',destinacija_rute)
app.use('/prevoznik',prevoznik_rute)
app.use('/redvoznje',redvoznje_rute);
app.use('/autobus',autobus_rute);
app.use('/rezervacija',rezervacija_rute);
app.get('/t',async (req,res)=>
{
    req.session.korisnik_id=1;
    req.session.tip_naloga='admin';
    res.end();
})
//app.get('/login')
app.listen({port:5000},async()=>
{
    console.log("Server started");
    //await sequelize.sync({force:true});
})
    

