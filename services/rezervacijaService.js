const {sequelize,Rezervacija,RezervisanoSediste,PrivremenoRezervisanoSediste,Destinacija,Polazak,Autobus,RedVoznje,Prevoznik}=require('../models');
const {Op,QueryTypes}=require('sequelize');
const moment=require('moment')
module.exports.prikaziZauzetaSediste=async (polazak_id,pocetna_destinacija_id,krajnja_destinacija_id,specificno_sediste_red=null,specificno_sediste_mesto_u_redu=null)=>
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
    var upit=`SELECT rezervisana_sedista.*
    FROM rezervisana_sedista
    INNER JOIN rezervacije ON rezervisana_sedista.rezervacija_id=rezervacije.id
    INNER JOIN polasci ON polasci.id=rezervacije.polazak_id
    INNER JOIN stanice as pocetna_stanica ON (polasci.red_voznje_id=pocetna_stanica.red_voznje_id AND rezervacije.pocetna_destinacija_id=pocetna_stanica.destinacija_id)
    INNER JOIN stanice as krajnja_stanica ON (polasci.red_voznje_id=krajnja_stanica.red_voznje_id AND rezervacije.krajnja_destinacija_id=krajnja_stanica.destinacija_id)
    WHERE polazak_id=:polazak_id AND 
    pocetna_stanica.redni_broj<:krajnja_stanica_rb AND 
    krajnja_stanica.redni_broj>:pocetna_stanica_rb`;
    var upit_privremena=`SELECT privremeno_rezervisana_sedista.*
    FROM privremeno_rezervisana_sedista
    INNER JOIN polasci ON polasci.id=privremeno_rezervisana_sedista.polazak_id
    INNER JOIN stanice as pocetna_stanica ON (polasci.red_voznje_id=pocetna_stanica.red_voznje_id AND privremeno_rezervisana_sedista.pocetna_destinacija_id=pocetna_stanica.destinacija_id)
    INNER JOIN stanice as krajnja_stanica ON (polasci.red_voznje_id=krajnja_stanica.red_voznje_id AND privremeno_rezervisana_sedista.krajnja_destinacija_id=krajnja_stanica.destinacija_id)
    WHERE privremeno_rezervisana_sedista.polazak_id=:polazak_id AND 
    pocetna_stanica.redni_broj<:krajnja_stanica_rb AND 
    krajnja_stanica.redni_broj>:pocetna_stanica_rb AND 
    privremeno_rezervisana_sedista.istek_rezervacije>NOW()`;
    if(specificno_sediste_red!=null && specificno_sediste_mesto_u_redu!=null)
    {
      upit+=` AND rezervisana_sedista.red=:specificno_sediste_red
      AND rezervisana_sedista.mesto_u_redu=:specificno_sediste_mesto_u_redu`  
      upit_privremena+= ` AND privremeno_rezervisana_sedista.red=:specificno_sediste_red
      AND privremeno_rezervisana_sedista.mesto_u_redu=:specificno_sediste_mesto_u_redu`  
    }
    let rezervisana_sedista=await sequelize.query(
        upit,
        {
          replacements: { 
            polazak_id: polazak_id,
            pocetna_destinacija_id:pocetna_destinacija_id,
            krajnja_destinacija_id:krajnja_destinacija_id,
            pocetna_stanica_rb:pocetna_stanica_rb,
            krajnja_stanica_rb:krajnja_stanica_rb,
            specificno_sediste_mesto_u_redu:specificno_sediste_mesto_u_redu,
            specificno_sediste_red:specificno_sediste_red,
           },
          type: QueryTypes.SELECT
        }
      );
      let privremeno_rezervisana_sedista=await sequelize.query(
        upit_privremena,
        {
          replacements: { 
            polazak_id: polazak_id,
            pocetna_destinacija_id:pocetna_destinacija_id,
            krajnja_destinacija_id:krajnja_destinacija_id,
            pocetna_stanica_rb:pocetna_stanica_rb,
            krajnja_stanica_rb:krajnja_stanica_rb,
            specificno_sediste_mesto_u_redu:specificno_sediste_mesto_u_redu,
            specificno_sediste_red:specificno_sediste_red,
           },
          type: QueryTypes.SELECT
        }
      );
      var asocijativni_niz_rezervisanih_sedista=[];
      rezervisana_sedista.forEach((rezervisano_sediste)=>
      {
          asocijativni_niz_rezervisanih_sedista[rezervisano_sediste.red.toString()+'_'+rezervisano_sediste.mesto_u_redu.toString()]=true;
      })
      privremeno_rezervisana_sedista.forEach((rezervisano_sediste)=>
      {
          asocijativni_niz_rezervisanih_sedista[rezervisano_sediste.red.toString()+'_'+rezervisano_sediste.mesto_u_redu.toString()]=true;
      })
      return asocijativni_niz_rezervisanih_sedista;
}
module.exports.kreirajRezervaciju=async (polazak_id,korisnik_id,platio,pocetna_destinacija_id,krajnja_destinacija_id,sedista,cena_po_karti,transakcija=null)=>
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
        var sifra_karte=Math.floor(9999+Math.random() * 90000)
        rezervisana_sedista_modeli.push({rezervacija_id:rezervacija.id,red:podaci[0],mesto_u_redu:podaci[1],cena_karte:cena_po_karti,ocitana:false,sifra_karte:sifra_karte});
        
    })
    var sedista=await RezervisanoSediste.bulkCreate(rezervisana_sedista_modeli);
    return rezervacija.id;
}
module.exports.privremenoRezervisi=async (polazak_id,korisnik_id,pocetna_destinacija_id,krajnja_destinacija_id,red,mesto_u_redu,predlog_isteka)=>
{
  var istek_rezervacije=moment().add(10,'minutes');
  predlog_isteka=moment(predlog_isteka,'YYYY-MM-DD HH:mm');
  if(istek_rezervacije>predlog_isteka)
  {
    istek_rezervacije=predlog_isteka;
  }
  istek_rezervacije=istek_rezervacije.format("YYYY-MM-DD HH:mm")
  var sediste=await PrivremenoRezervisanoSediste.create(
    {
      polazak_id:polazak_id,
      korisnik_id:korisnik_id,
      pocetna_destinacija_id:pocetna_destinacija_id,
      krajnja_destinacija_id:krajnja_destinacija_id,
      red:red,
      mesto_u_redu:mesto_u_redu,
      istek_rezervacije:istek_rezervacije
    }
  )
  return sediste;
}
module.exports.obrisiPrivremeno=async (id,korisnik_id)=>
{
  var deleted=await PrivremenoRezervisanoSediste.destroy({
    where: {
        id:id,
        korisnik_id:korisnik_id
    }
})
}
module.exports.prikaziZaKorisnika=async(korisnik_id)=>
{
  var rezervacije=Rezervacija.findAll(
  {
    where:
    {
      korisnik_id:korisnik_id//od svih rezervacija prikazace samo one koje je napravio odredjeni korisnik
    },
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('rezervisana_sedista.id')), 'broj_sedista']
        //pored svih atributa modela potrebno je prikazati i broj rezervisanih sedista za svaku rezervaciju zbog toga korisntimo sequlize funkciju
        //kao prvi parametar se prosledjuje naziv funckije,kao drugi parametar kolona nad kojom se funckija primenjuje,a kao treci parametar kako ce se zvati izlaz iz funckije tj. naziv atributa
      ]
    },
    include://ukljucivanje asocijacija
    [
      {
          model:Destinacija,//pored informacija o rezervaciji zelimo da prikazemo i naziv pocetne destinacije zbog toga moramo ukljucti asocijaciju Destinacija
          as:'pocetna_destinacija', //posto 2x ukljucajemo model Destinacija za pocetnu i krajnju destinaciju moramo koristiti alijas
      },
      {
          model:Destinacija,
          as:'krajnja_destinacija', 
      },
      {
        model:RezervisanoSediste,
        as:'rezervisana_sedista', 
      },
      {//zelimo da prikazemo i naziv prevoznika kod koga je izvrsena rezervacija,ali da bi dosli do tog podataka potrebno je proci kroz vise asocijacija (odnosno tabela u bazi)
          model:Polazak,
          as:'polazak',
          include:
          [
              {
                  model:RedVoznje,//nalazimo red voznje kojem pripada polazak
                  as:'red_voznje',
                  include:
                  [
                      {
                          model:Prevoznik,//posto red voznje sadrzi relaciju sa prevoznikom tako dobijamo prevoznika
                          as:'prevoznik'
                      },
                  ]
              }
          ] 
    }
    ],
    group: ['Rezervacija.id'],//grupisemo po idiju rezervacije(zbog prebrojavanja broja sedista po rezervaciji)
    order:[['vreme_kreiranja','DESC']]
  })
  return rezervacije;
}
module.exports.nadjiRezervacijuSaSedistima=async(rezervacija_id,specificno_sediste_id=null)=>
{
  var uslov={};
  var sediste_uslov={};
  if(rezervacija_id!=null)
  {
    uslov.id=rezervacija_id;
  }

  if(specificno_sediste_id!=null)
  {
    sediste_uslov.id=specificno_sediste_id;
  }
  return Rezervacija.findOne(
    {
      where:uslov,
      
    include:
    [
      {
        model:RezervisanoSediste,
        as:'rezervisana_sedista',
        where:sediste_uslov
      },
      {
          model:Destinacija,
          as:'pocetna_destinacija', 
      },
      {
          model:Destinacija,
          as:'krajnja_destinacija', 
      },
      {
          model:Polazak,
          as:'polazak',
          include:
          [
              {
                  model:Autobus,
                  as:'autobus'
              },
              {
                  model:RedVoznje,
                  as:'red_voznje',
                  include:
                  [
                      {
                          model:Prevoznik,
                          as:'prevoznik'
                      },
                  ]
              }
          ]
        }
    ]
  }
)
}
module.exports.statistika=async (korisnik_id,pocetni_datum,krajnji_datum)=>
{
  let upit=`SELECT
  COUNT(rezervisana_sedista.id) as broj_karata,
  SUM(rezervisana_sedista.cena_karte) as ukupna_prodaja,
  COUNT(DISTINCT rezervacije.id) as broj_rezervacija
  FROM rezervacije 
  INNER JOIN rezervisana_sedista ON rezervisana_sedista.rezervacija_id=rezervacije.id
  WHERE rezervacije.vreme_kreiranja>=:pocetni_datum
  AND rezervacije.vreme_kreiranja <=:krajnji_datum 
  AND korisnik_id=:korisnik_id
  `
  let statistika=await sequelize.query(
    upit,
    {
      replacements: 
      { 
      korisnik_id:korisnik_id,
      pocetni_datum:pocetni_datum,
      krajnji_datum:krajnji_datum,
      },
      type: QueryTypes.SELECT
    }
  );
  return statistika[0];
}
