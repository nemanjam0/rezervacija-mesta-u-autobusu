
import * as Redirect from './../helpers/Redirect.js'
import sequelize from '../models/index.js';
const { Autobus } = sequelize.models;
export const kreiraj = (req, res) =>//prikazuje dijalog za kreiranje nove destinacije
{
    res.render('autobus/kreiraj')
}

export const sacuvaj = async (req, res) =>//cuva novokreiranu destinaciju
{
    const { naziv, broj_redova, broj_sedista_levo, broj_sedista_desno, broj_sedista_u_zadnjem_redu } = req.body;
    if (Redirect.backIfUndefinedOrEmpty(req, res, naziv, broj_redova, broj_sedista_levo, broj_sedista_desno, broj_sedista_u_zadnjem_redu)) {
        return;
    }
    const autobus = await Autobus.create({ naziv: naziv, broj_redova: broj_redova, broj_sedista_levo: broj_sedista_levo, broj_sedista_desno: broj_sedista_desno, broj_sedista_u_zadnjem_redu })
        .catch((err) => {
            Redirect.backWithValidationErrors(req, res, err)
        }
        )
    Redirect.backWithSuccess(req, res, 'Autobus uspešno kreiran');
}
