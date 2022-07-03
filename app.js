import express from 'express'
import destinacija_rute from './routes/destinacija.js';
import prevoznik_rute from './routes/prevoznik.js';
import pocetne_rute from './routes/pocetne.js';
import autobus_rute from './routes/autobus.js';
import redvoznje_rute from './routes/redvoznje.js';
import rezervacija_rute from './routes/rezervacija.js';
import korisnik_rute from './routes/korisnik.js';
import parser from 'body-parser';
import session from 'express-session'
import { dodajMinuteNaVreme } from './helpers/Vreme.js';
const app = express();
app.use(express.static('public'))
app.use(parser.urlencoded({ extended: true }));
app.use(session({
    secret: 'xXHqhUDmqhHSq',
    resave: false,
    saveUninitialized: true,
}))

app.set('view engine', 'pug')
app.use('/', function (req, res, next) {
    if (req.method == 'POST')//samo post ima req.body,radimo ovo preventivno kako ne bi cuvao podatke prilikom zahteva za staticke fajlove i na taj nacin obrisao vec sacuvane podatke posto je tada req.body objekat prazan
    {
        req.session.old_data = req.body;
    }
    res.locals.old = (param, default_value = "") =>//kreiramo novi metod koji smestamo u res.locals objekat kako bi smo mogli da ga koristimo u pug templatima,njegova svrha je da nam vrati podatke iz prethodog zahteva,ovu funkcionalnost koristimo ako se javila neka greska prilikom validacije(kako korisnik ne bi morao sve od pocetka da unosi)
    {//default_value nam koristi prilikom izmene tj. kada vrsimo izmenu nekog entiteta prvo formi prosledimo vrednosti iz baze,a posle ako prilikom izmene dodje do greske u validaciji onda saljemo podatke koje korisnik izmenio,a ne podatke iz baze
        if ((typeof req.session.old_data) !== 'undefined' && (typeof req.session.old_data[param]) !== 'undefined')//proveravamo da li postoji trazeni podatak
        {
            return req.session.old_data[param];
        }
        else {
            return default_value;
        }
    }
    res.locals.success = req.session.success || "";
    res.locals.error = req.session.error || "";
    req.session.error = "";
    req.session.success = "";
    res.locals.korisnik_id = req.session.korisnik_id;
    res.locals.tip_naloga = req.session.tip_naloga;
    next();
})
app.use('/', pocetne_rute)
app.use('/destinacija', destinacija_rute)
app.use('/prevoznik', prevoznik_rute)
app.use('/redvoznje', redvoznje_rute);
app.use('/autobus', autobus_rute);
app.use('/rezervacija', rezervacija_rute);
app.use('/korisnik', korisnik_rute);
app.get('/t', async (req, res) => {
    req.session.korisnik_id = 11;
    req.session.tip_naloga = 'admin';
    res.redirect('/');
})
//app.get('/login')
app.listen({ port: 5000 }, async () => {
    console.log("Server started");
    //await sequelize.sync({force:true});
})


