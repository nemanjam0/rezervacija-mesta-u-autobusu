const express=require('express');
const {sequelize,Korisnik}=require('./models');
const korisnik_rute=require('./routes/korisnici');
const destinacija_rute=require('./routes/destinacija');
const prevoznik_rute=require('./routes/prevoznik');
const pocetne_rute=require('./routes/pocetne');
const autobus_rute=require('./routes/autobus');
const redvoznje_rute=require('./routes/redvoznje');
const parser = require('body-parser');
const session = require('express-session')
const polazakService=require('./services/polazakService')
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
    next();
})
app.use('/',pocetne_rute)
app.use('/destinacija',destinacija_rute)
app.use('/prevoznik',prevoznik_rute)
app.use('/redvoznje',redvoznje_rute);
app.use('/autobus',autobus_rute);
app.get('/t',(req,res)=>
{
    polazakService.kreirajPolaskeZaRedVoznje(1,1,'12:00','2021-12-27',1,1,0,1,1,1,0);
    res.end('ucitano');
})
app.get('/start',(req,res)=>
{
    req.session.data=Math.floor(Math.random() * 10000)
    res.send(200,req.session.data)
    //korisnikController.kreirajNovogKorisnika(req,res);
})

app.get('/view',(req,res)=>
{
    res.send(200,req.session.korisnik_id)
})
app.post('/registracija',(req,res)=>
{
    const {email,sifra,tip_naloga}=req.body;
    const newUser=Korisnik.create({email:email,sifra:sifra,tip_naloga:tip_naloga}).catch(err=>console.log(err));
    console.log(newUser);
  
})
app.get('/registracija',async(req,res)=>
{
    res.sendFile(__dirname+'\\stranice\\registracija.html');
})
//app.get('/login')
app.listen({port:5000},async()=>
{
    console.log("Server started");
    //await sequelize.sync({force:true});
})
    

