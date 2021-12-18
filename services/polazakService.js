const moment=require('moment')
module.exports.kreirajPolaskeZaRedVoznje=(red_voznje_id,autobus_id,vreme_polaska,pocetak_vazenja,rok_vazenja,ponedeljak,utorak,sreda,cetvrtak,petak,subota,nedelja)=>//kreira sve polaske za odredjeni red voznje
{
    var dani=[ponedeljak,utorak,sreda,cetvrtak,petak,subota,nedelja];
    pocetak_vazenja=moment(pocetak_vazenja).endOf('day');
    rok_vazenja=moment(rok_vazenja).endOf('day');
    var polasci_modeli=[]
    for(var i=0;i<7;i++)
    {
        if(dani[i]==1)//znaci da tog dana ima polazak i=0-ponedeljak i=1-utorak
        {
            var datum=pocetak_vazenja.format('YYYY-MM-DD');
            var polazak=moment(datum+' '+vreme_polaska).day((i+1)%7)//moment() vraca objekat koji sadrzi trenutni polazak metoda day() setuje dan na odredjeni dan u nedelji,dani krecu od nedelje,a kod nas od ponedeljka zbog toga dodajem 1 i radim moduo na taj nacin ponedeljak koji je u momentu na indeksu 6 sada dolazi na indeks 0 (6+1)%7=0
            if(pocetak_vazenja>polazak)
            {
                polazak=polazak.add(7,'days');
            }   
            while(polazak<=rok_vazenja)
            {
                var model={red_voznje_id:red_voznje_id,autobus_id:autobus_id,vreme_polaska:polazak.format('YYYY-MM-DD HH:mm')};
                polasci_modeli.push(model);
                polazak=polazak.add(7,'days');
            }
        }
    }
    return polasci_modeli;
    //console.log(datum,rok_vazenja,moment(rok_vazenja,'YYYY-MM-DD'),rok_vazenja,moment('2021-12-01').day());
}