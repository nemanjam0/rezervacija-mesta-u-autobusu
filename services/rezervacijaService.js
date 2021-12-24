const {sequelize,RedVoznje,Prevoznik,Autobus,Destinacija,Cenovnik,Stanica,Polazak,Rezervacija,RezervisanoSediste,PrivremenoRezervisanoSediste,Povratak}=require('../models');
const {Op,QueryTypes}=require('sequelize');
module.exports.prikaziZauzetaSediste=async (polazak_id,pocetna_destinacija_id,krajnja_destinacija_id)=>
{
    var stanice_upit=`SELECT stanice.* FROM polasci 
    INNER JOIN redovi_voznje ON redovi_voznje.id=polasci.red_voznje_id
    INNER JOIN stanice ON (stanice.red_voznje_id=redovi_voznje.id AND (destinacija_id=:pocetna_destinacija_id OR destinacija_id=:krajnja_destinacija_id))
    WHERE polasci.id=:polazak_id ORDER BY stanice.redni_broj ASC`
    let stanice=await sequelize.query(
        stanice_upit,
        {
          replacements: { polazak_id: polazak_id,pocetna_destinacija_id:pocetna_destinacija_id,krajnja_destinacija_id:krajnja_destinacija_id },
          type: QueryTypes.SELECT
        }
      );
    var pocetna_stanica_rb=stanice[0].redni_broj;
    var krajnja_stanica_rb=stanice[1].redni_broj;
    console.log(stanice,pocetna_stanica_rb,krajnja_stanica_rb);
    var upit=`SELECT rezervisana_sedista.*
    FROM rezervisana_sedista
    INNER JOIN rezervacije ON rezervisana_sedista.rezervacija_id=rezervacije.id
    INNER JOIN polasci ON polasci.id=rezervacije.polazak_id
    INNER JOIN stanice as pocetna_stanica ON (polasci.red_voznje_id=pocetna_stanica.red_voznje_id AND rezervacije.pocetna_destinacija_id=pocetna_stanica.destinacija_id)
    INNER JOIN stanice as krajnja_stanica ON (polasci.red_voznje_id=krajnja_stanica.red_voznje_id AND rezervacije.krajnja_destinacija_id=krajnja_stanica.destinacija_id)
    WHERE polazak_id=:polazak_id AND pocetna_stanica.redni_broj<:krajnja_stanica_rb AND krajnja_stanica.redni_broj>:pocetna_stanica_rb`;
    let rezervisana_sedista=await sequelize.query(
        upit,
        {
          replacements: { 
            polazak_id: polazak_id,
            pocetna_destinacija_id:pocetna_destinacija_id,
            krajnja_destinacija_id:krajnja_destinacija_id,
            pocetna_stanica_rb:pocetna_stanica_rb,
            krajnja_stanica_rb:krajnja_stanica_rb },
          type: QueryTypes.SELECT
        }
      );
      var asocijativni_niz_rezervisanih_sedista=[];
      rezervisana_sedista.forEach((rezervisano_sediste)=>
      {
          asocijativni_niz_rezervisanih_sedista[rezervisano_sediste.red.toString()+'_'+rezervisano_sediste.mesto_u_redu.toString()]=true;
      })
      return asocijativni_niz_rezervisanih_sedista;
}
module.exports.kreirajRezervaciju=async (polazak_id,korisnik_id,platio,pocetna_destinacija_id,krajnja_destinacija_id,sedista,transakcija=null)=>
{
    var rezervacija_model=
    {
        polazak_id:polazak_id,
        korisnik_id:korisnik_id,
        pocetna_destinacija_id:pocetna_destinacija_id,
        krajnja_destinacija_id:krajnja_destinacija_id,
        platio:platio,
    }
    var rezervisana_sedista_modeli=[];
    console.log(rezervacija_model);
    var rezervacija=await Rezervacija.create(rezervacija_model)

    sedista.forEach((sediste)=>
    {
        var podaci=sediste.split('_');
        rezervisana_sedista_modeli.push({rezervacija_id:rezervacija.id,red:podaci[0],mesto_u_redu:podaci[1],cena_karte:100});
        
    })
    var sedista=await RezervisanoSediste.bulkCreate(rezervisana_sedista_modeli);
    return rezervacija.id;
}
