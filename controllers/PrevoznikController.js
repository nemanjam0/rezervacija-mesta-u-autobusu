const express = require('express')
const { sequelize, Prevoznik } = require('../models');
const parser = require('body-parser');
const { redirect } = require('express/lib/response');
const Redirect = require('./../helpers/Redirect');
module.exports.kreiraj = (req, res) =>//prikazuje dijalog za kreiranje nove destinacije
{
    res.render('prevoznik/kreiraj')
}
module.exports.sacuvaj = async (req, res) =>//cuva novokreiranu destinaciju
{
    const logo_url = req.file ? req.file.path : undefined;//provera pre nego sto pokusamo da pristupimo svojstvu nepostojeceg objekta
    const naziv = req.body.naziv;
    const opis = req.body.opis;
    if (Redirect.backIfUndefinedOrEmpty(req, res, naziv, opis, logo_url)) {
        return;
    }
    const prevoznik = await Prevoznik.create({ naziv: naziv, logo_url: logo_url, opis: opis })
        .catch((err) => {
            Redirect.backWithValidationErrors(req, res, err)
        }
        )
    Redirect.backWithSuccess(req, res, 'Novi prevoznik uspešno kreiran.')
}
module.exports.izmeni = async (req, res) =>//prikazuje edit stranicu
{
    const id = req.params.id;
    const prevoznik = await Prevoznik.findOne({
        where: {
            id: id,
        }
    });
    if (prevoznik == null) {
        Redirect.backWithError(req, res, 'Prevoznik sa tim IDijem ne postoji');
    }
    res.render('prevoznik/izmeni', { naziv: prevoznik.naziv, opis: prevoznik.opis, id: id })
}
module.exports.promeni = (req, res) =>//cuva izmene
{
    const logo_url = req.file ? req.file.path : null;//prilikom izmene ako nije zakacio nijedan fajl onda setujemo na null
    const naziv = req.body.naziv;
    const opis = req.body.opis;
    const id = req.params.id;
    const izmene = { naziv: naziv, opis: opis };
    if (Redirect.backIfUndefinedOrEmpty(req, res, naziv, opis, id)) {
        return;
    }
    if (logo_url != null) {
        izmene.logo_url = logo_url;
    }
    Prevoznik.update(izmene, { where: { id: id } })
        .then((data) => Redirect.backWithSuccess(req, res, 'Izmene uspešno sačuvane'))
        .catch((err) => Redirect.backWithValidationErrors(req, res, err))

}
module.exports.lista = async (req, res) => {
    const prevoznici = await Prevoznik.findAll();
    res.render('prevoznik/lista', { prevoznici: prevoznici });

}