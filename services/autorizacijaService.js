

export const autorizacijaZaTipNaloga = (...tip_naloga) => {
    return function (req, res, next) {
        let tipovi_naloga = Array.from(tip_naloga)
        if (typeof (req.session.korisnik_id) == 'undefined' || req.session.korisnik_id == null) {
            var zahtevan_url = encodeURI(req.originalUrl);
            res.render('korisnik/prijava', { zahtevan_url });
        }
        else if (tipovi_naloga.includes(req.session.tip_naloga)) {
            next();
        }
        else {
            res.render('403')
        }
    }
}
export const autorizacijaZaResurs = (vlasnik_resursa_id, ...tip_naloga) => {
    return function (req, res, next) {
        let tipovi_naloga = Array.from(tip_naloga)
        if (typeof (req.session.korisnik_id) == 'undefined' || req.session.korisnik_id == null) {
            var zahtevan_url = encodeURI(req.originalUrl);
            res.render('korisnik/prijava', { zahtevan_url });
        }
        else if (req.session.tip_naloga == 'admin' || tipovi_naloga.includes(req.session.tip_naloga) || req.session.korisnik_id == vlasnik_resursa_id) {
            next();
        }
        else {
            res.render('403')
        }
    }
}
export const autorizacijaPrijavljen = (req, res, next) => {
    if (typeof (req.session.korisnik_id) != 'undefined' && req.session.korisnik_id != null) {
        next();
    }
    else {
        var zahtevan_url = encodeURI(req.originalUrl);
        res.render('korisnik/prijava', { zahtevan_url });
    }
}
export const autorizacijaOdjavljen = (req, res, next) => {
    if (typeof (req.session.korisnik_id) == 'undefined' || req.session.korisnik_id == null) {
        next();
    }
    else {
        res.render('403.html')
    }
}
export const imaPristupResursu = (vlasnik_resursa_id, korisnik_id, korisnik_tip_naloga, ...tip_naloga) => {
    let tipovi_naloga = Array.from(tip_naloga)
    if (korisnik_tip_naloga == 'admin' || tipovi_naloga.includes(korisnik_tip_naloga) || korisnik_id == vlasnik_resursa_id) {
        return true;
    }
    else {
        return false;
    }
}
export const TipNaloga = Object.freeze(
    {
        admin: 'admin',
        kondukter: 'kondukter',
        vozac: 'vozac',
        prodavac: 'prodavac',
        korisnik: 'korisnik',

    })
