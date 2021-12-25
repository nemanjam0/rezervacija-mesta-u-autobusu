const moment=require('moment')
const {sequelize,RedVoznje,Prevoznik,Autobus,Destinacija,Cenovnik,Stanica,Polazak}=require('../models');
const {Op}=require('sequelize');
module.exports.nadjiZaDestinacijeIDatum=async (pocetna_destinacija_id,krajnja_destinacija_id,datum_polaska,specifican_red_voznje=null,specifican_prevoznik=null)=>//kreira sve polaske za odredjeni red voznje
{
    
    datum_polaska=moment(datum_polaska);
    var dan_u_nedelji=datum_polaska.day()!=0 ? datum_polaska.day():datum_polaska.day()+7;//da bi nedelja bila 7. a ne 0. dan preglednije je
    var uslov_red_voznje=
    {
        rok_vazenja:
        {
            [Op.gte]:datum_polaska,
        },
        pocetak_vazenja:
        {
            [Op.lte]:datum_polaska,
        }
    }
    var naziv_dana="";
    if(specifican_red_voznje!=null)
    {
        uslov_red_voznje.id=specifican_red_voznje;
    }
    if(specifican_prevoznik!=null)
    {
        uslov_red_voznje.prevoznik_id=specifican_prevoznik;
    }
    switch(dan_u_nedelji)
    {
        case 1: { uslov_red_voznje.ponedeljak=1; naziv_dana="Ponedeljak"; break;}
        case 2: { uslov_red_voznje.utorak=1; naziv_dana="Utorak"; break;}
        case 3: { uslov_red_voznje.sreda=1; naziv_dana="Sreda"; break;}
        case 4: { uslov_red_voznje.cetvrtak=1; naziv_dana="Četvrtak"; break;}
        case 5: { uslov_red_voznje.petak=1; naziv_dana="Petak"; break;}
        case 6: { uslov_red_voznje.subota=1; naziv_dana="Subota"; break;}
        case 7: { uslov_red_voznje.nedelja=1; naziv_dana="Nedelja"; break;}
    }
    var cenovnici=await Cenovnik.findAll({
        where:
        {
            pocetna_destinacija_id:pocetna_destinacija_id,
            krajnja_destinacija_id:krajnja_destinacija_id,
        },
        include:
        [
            {
                model:RedVoznje,
                include:
                [{
                    model:Stanica,
                    as:'stanice', 
                    where:
                    {
                        destinacija_id:
                        {
                            [Op.or]:[pocetna_destinacija_id,krajnja_destinacija_id]
                        }
                    }
                },
                {
                    model:Prevoznik,
                    as:'prevoznik', 
                    
                }],
               
                as:'red_voznje',
                where:uslov_red_voznje
            },
            {
                model:Destinacija,
                as:'pocetna_destinacija'
            },
            {
                model:Destinacija,
                as:'krajnja_destinacija'
            }
             
        ],
        order: [[{model:RedVoznje,as:'red_voznje'},{model:Stanica,as:'stanice'},'redni_broj', 'asc'],[{model:RedVoznje,as:'red_voznje'},'vreme_polaska', 'asc']]
        
    })
    console.log(cenovnici);
    return cenovnici;
}
