
(function()
{
    window.addEventListener('load',function()
    {
        console.log('loaded');
        init();
    });
    const host='http://localhost:5000'
 
    function init()
    {
        const dom=
        {
            pretragaPocetna:document.querySelector('.pretraga .pocetna-lokacija'),
            pretragaKrajnja:document.querySelector('.pretraga .krajnja-lokacija'),
            pretragaDatum:document.querySelector('.pretraga .datum-polaska'),
            rezervacijaForma:document.querySelector('form.rezervacija'),
            //sedistaBtns:document.querySelectorAll('form.rezervacija .sediste'),
            //izabranoBrojac:document.querySelector('form.rezervacija .izabrano'),
            //ukupnoZaRezervaciju:document.querySelector('form.rezervacija .ukupno'),
            datumPovratka:document.querySelector('form.rezervacija .datum_povratka'),
            vremePovratka:document.querySelector('form.rezervacija .vreme_povratka'),
            stanice:document.querySelectorAll('.stanice'),
            staniceLista:document.querySelector('.stanice-lista'),
            cenovnikBtn:document.querySelector('#cenovnik-btn'),
            cenovnik:document.querySelector('#cenovnik'),
            datumPovratka:document.querySelector('#datum_povratka'),
            vremePovratka:document.querySelector("#vreme_povratka"),
            povratnoAutobus:document.querySelector('#povratno-autobus'),
            autobusJedanSmerWrapper:document.querySelector("#autobus_jedansmer"),
            placanjeRadioBtns:document.querySelectorAll('.placanje')
        }
        setEventListeners();
        function ucitajAutobus(wrapper)
        {
            console.log(wrapper);
            fetch(host+`/rezervacija/autobus/${wrapper.dataset.red_voznje_id}/${wrapper.dataset.broj_putnika}/${wrapper.dataset.pocetna_destinacija_id}/${wrapper.dataset.krajnja_destinacija_id}/${encodeURIComponent(wrapper.dataset.datum_polaska)}/${encodeURIComponent(wrapper.dataset.vreme_polaska_sa_prve_stanice)}/prvismer`)
            .then(function (response) {
                return response.text();
            }).then(function (html) {
            
                wrapper.innerHTML=html;
                postaviEventeZaAutobus(wrapper);  
            })
        }
        function postaviEventeZaAutobus(wrapper)
        {
            let sedistaBtns=wrapper.querySelectorAll('.sediste');
            let izabranoBrojac=wrapper.querySelector('.izabrano');
            let ukupnoZaRezervaciju=wrapper.querySelector('.ukupno');
            console.log(sedistaBtns);
            sedistaBtns.forEach((btn)=>btn.addEventListener('click',sedisteClick));
        }
        function setEventListeners()
        {
         
         if(dom.stanice) dom.stanice.forEach((stanica)=>stanica.addEventListener('change',izabranaStanica));
         if( dom.cenovnikBtn) dom.cenovnikBtn.addEventListener('click',ucitajCenovnik);
         if(dom.datumPovratka)
         {
            dom.datumPovratka.addEventListener('change',odabranDatumPovratka)
            var event = new Event('change');
            dom.datumPovratka.dispatchEvent(event);
         }
         if(dom.vremePovratka) dom.vremePovratka.addEventListener('change',odabranoVremePovratka);
         if(dom.autobusJedanSmerWrapper) ucitajAutobus(dom.autobusJedanSmerWrapper)
         if(dom.placanjeRadioBtns) dom.placanjeRadioBtns.forEach((btn)=>
         {
             btn.addEventListener('change',placanjePrikaz)
         })
        }
        function placanjePrikaz(event)
        {
            dom.placanjeRadioBtns.forEach((btn)=>
            {
                if(btn.checked)
                {
                    if(btn.value==1)
                    {
                        document.querySelector('.placanje-podaci').style.display='block';
                    }
                    else
                    {
                        document.querySelector('.placanje-podaci').style.display='none';
                    }
                }
            })
        }
        function odabranoVremePovratka(event)
        {
            let odabranaOpcija=event.target.querySelectorAll('option')[event.target.selectedIndex];
            fetch(host+`/rezervacija/autobus/${odabranaOpcija.dataset.red_voznje_id}/${event.target.dataset.broj_putnika}/${dom.datumPovratka.dataset.pocetna_destinacija_id}/${encodeURIComponent(dom.datumPovratka.dataset.krajnja_destinacija_id)}/${encodeURIComponent(dom.datumPovratka.value)}/${encodeURIComponent(odabranaOpcija.dataset.vreme_polaska_sa_prve_stanice)}/povratno`)
            .then(function (response) {
                return response.text();
            }).then(function (html) {
            
                dom.povratnoAutobus.innerHTML=html;
                postaviEventeZaAutobus(dom.povratnoAutobus);
            
            })
        }
        function odabranDatumPovratka(event)
        {
            //uzmi kopiraj jedanSmerWrapper kopiraj promeni dataset atribute tj zarotiraj pocetnu i krajnju stanicu promeni datum polaska,vreme polaska,ruta_id
        fetch(host+`/rezervacija/termini/${event.target.dataset.pocetna_destinacija_id}/${event.target.dataset.krajnja_destinacija_id}/${encodeURIComponent(event.target.value)}/${event.target.dataset.prevoznik_id}`)
        .then((response)=>response.json())
        .then((response)=>
        {
            dom.vremePovratka.querySelectorAll('option').forEach((option)=>
            {
                option.remove();
            })
            var option = document.createElement('option');
            option.selected=1;
            option.innerHTML = response.length>0 ? 'Odaberi vreme polaska':'';
            dom.vremePovratka.appendChild(option);
            if(response.length==0)
            {
                var el=document.querySelector('#vreme_poruka');
                el.innerText="Za odabrani datum nema nijedan polazak (za odabranog prevoznika)"
            }
            else
            {
                var el=document.querySelector('#vreme_poruka');
                el.innerText="";
            }
            response.forEach((vreme)=>
            {
                var option = document.createElement('option');
                option.innerHTML = vreme.vreme;
                option.dataset.red_voznje_id=vreme.red_voznje_id;
                option.dataset.vreme_polaska_sa_prve_stanice=vreme.vreme_polaska_sa_prve_stanice;
                option.dataset.vreme=vreme.vreme;
                dom.vremePovratka.appendChild(option);
            })
        })
        }
        function izabranaStanica(event)
        {
            var odabrano=event.target.getAttribute('odabrano');
            if(odabrano==null && typeof event.target.selectedIndex!='undefined')//znaci da pre toga nije bila birana stanica iz tog select boxa
            {
                var nova_stanica=event.target.parentNode.parentNode.cloneNode(true);
                var redni_broj=nova_stanica.querySelector('.redni-br')
                nova_stanica.querySelectorAll('input').forEach((el)=>el.readOnly=false);
                dom.staniceLista.querySelector('tbody').appendChild(nova_stanica);
                redni_broj.innerHTML=(parseInt(redni_broj.innerHTML.replace('.',''))+1)+'.';
                nova_stanica.addEventListener('change',izabranaStanica);
                event.target.setAttribute('odabrano','1')
                
            }
            //console.log(event.target.value);
        }
        function ucitajCenovnik()
        {
            dom.cenovnik.innerHTML="";//brise dugme za ucitavanje cenvovnika i informacije pre nego sto ucita cenovnik
            var stanice=izvuciStanice();
            nacrtajTabeluZaCenovnik(stanice)
            zabraniIzborStanica();
        }
        function zabraniIzborStanica()
        {
            document.querySelectorAll('.stanice').forEach((stanica)=>
            {
                stanica.style.pointerEvents='none';
            })
        }
        function izvuciStanice()
        {
            var stanice_dom=dom.staniceLista.querySelectorAll('.stanice-group .stanice')
            var stanice=[];
            var k=0;
            stanice_dom.forEach((stanica)=>
            {
                var naziv=stanica.options[stanica.selectedIndex].innerHTML;
                var obj={stanica_id:stanica.value,naziv_stanice:naziv};
                if(stanica.value!=-1)
                {
                    stanice.push(obj);
                }
                else
                {
                    stanica.closest('tr').remove();//kada generisemo cenovnik brisemo sve elemente koji sadrze ne izabranu stanicu(placeholder)
                }
            });
            return stanice;
        }
        function nacrtajTabeluZaCenovnik(stanice)
        {
            var tabela=document.createElement('table');
            var tbody=document.createElement('tbody');
            tabela.append(tbody);
            tabela.classList.add('table');
            tabela.classList.add('table-bordered');
            tabela.classList.add('table-striped');
            document.querySelector('.cenovnik').append(tabela);
            for(var i=0;i<stanice.length;i++)
            {
                var red=document.createElement('tr')
                tbody.append(red)
                for(var j=0;j<stanice.length;j++)
                {
                    if(i==0 && j==0)
                    {
                        var polje=document.createElement('td')
                        red.append(polje);
                    }
                    else if(i==0)
                    {
                        var polje=document.createElement('th')
                        polje.innerHTML=stanice[j].naziv_stanice;
                        red.append(polje);
                    }
                    else if(j==0)
                    {
                        var polje=document.createElement('th')
                        polje.innerHTML=stanice[i-1].naziv_stanice;
                        red.append(polje);
                    }
                    else
                    {
                        var polje=document.createElement('td')
                        if(i>j)
                        {
                            polje.classList.add('text-center')
                            polje.innerHTML="<strong>X</strong>"
                            console.log(i,j);
                        }
                        else
                        {
                            var pocetna_stanica=stanice[i-1].stanica_id;
                            var krajnja_stanica=stanice[j].stanica_id;
                            var unosJedanSmer=`<input type="number" name="karta_${pocetna_stanica}_${krajnja_stanica}[jedan_smer]" placeholder="Jedan smer">`
                            var unosPovratna=`<input type="number" name="karta_${pocetna_stanica}_${krajnja_stanica}[povratna]" placeholder="Povratna">`
                            polje.innerHTML=unosJedanSmer+unosPovratna;
                        }
                        red.append(polje);
                    }
                }
            }
        }
        function sedisteClick(event)
        {    
            const red=event.target.dataset.red;
            const poz=event.target.dataset.poz;

            if(event.target.classList.contains('slobodno'))
            {
                if(proveriDozvoljenostRezervacije(event.target))
                {
                    proveriDostupnostSedistaIRezervisi(event.target)
                }
            }
            else if(event.target.classList.contains('moja-rezervacija'))
            {
                const red=event.target.dataset.red;
                const poz=event.target.dataset.poz;
                obrisiRezervisanoSediste(event.target.dataset.id)
                smanjiBrojRezervisanihSedista(event.target);
                event.target.querySelector('input[type="hidden"]').remove();
                event.target.classList.remove('moja-rezervacija');
                event.target.classList.add('slobodno');
                var cena_karte=event.target.closest('.autobus-wrapper').dataset.cena_karte;
                promeniCenuRacuna(-cena_karte);
            }
            
        }
        function obrisiRezervisanoSediste(id)
        {
            fetch(host+`/rezervacija/obrisiprivremeno/${id}`,{
                method:'POST'
            });
        }
        function povecajBrojRezervisanihSedista(sediste)
        {
            promeniBrojRezervisanihSedista(sediste,1)
        }
        function smanjiBrojRezervisanihSedista(sediste)
        {
            promeniBrojRezervisanihSedista(sediste,-1)
        }
        function promeniBrojRezervisanihSedista(sediste,broj)
        {
            var brojac=sediste.closest('.autobus-wrapper').querySelector('.izabrano')
            brojac.innerText=parseInt(brojac.innerText)+broj;
        }
        function proveriDozvoljenostRezervacije(sediste)//proverava da li je korisnik vec izabrao sva mesta za koje je zahtevao rezervaciju
        {
            var brojac=sediste.closest('.autobus-wrapper').querySelector('.izabrano')
            var ukupnoDozvoljenih=sediste.closest('.autobus-wrapper').querySelector('.ukupno')
            const br_izabranih=parseInt(brojac.innerText);
            const br_dozvoljenih=parseInt(ukupnoDozvoljenih.innerText);
            return br_izabranih<br_dozvoljenih;
        }
        function proveriDostupnostSedistaIRezervisi(sediste)
        {
            const red=sediste.dataset.red;
            const poz=sediste.dataset.poz;
            var autobus=sediste.closest('.autobus-prikaz');
            var polazak_id=autobus.dataset.polazak_id;
            var pocetna_destinacija_id=autobus.dataset.pocetna_destinacija_id;
            var krajnja_destinacija_id=autobus.dataset.krajnja_destinacija_id;
            console.log(pocetna_destinacija_id,krajnja_destinacija_id,polazak_id,red,poz);
            var ruta=`/rezervacija/rezervisanostsedista/${polazak_id}/${pocetna_destinacija_id}/${krajnja_destinacija_id}/${red}/${poz}`;
            console.log(ruta);
            fetch(host+ruta)
            .then(function (response) {
                return response.json();
            }).then(function (json_response) {
                if(json_response.zauzeto==0)
                {
                    console.log('123');
                    povecajBrojRezervisanihSedista(sediste);
                    sediste.classList.add('moja-rezervacija');
                    sediste.classList.remove('slobodno');
                    var input = document.createElement("input");
                    var autobus_prikaz_element=sediste.closest('.autobus-wrapper').querySelector('.autobus-prikaz');
                    var naziv_putovanja=autobus_prikaz_element.dataset.naziv_putovanja;
                    var vreme_isteka;
                    if(typeof autobus_prikaz_element.dataset.vreme_isteka=='undefined')
                    {
                        vreme_isteka=moment().add(10,'minutes');
                        autobus_prikaz_element.dataset.vreme_isteka=vreme_isteka;
                    }
                    else
                    {
                        vreme_isteka=moment(autobus_prikaz_element.dataset.vreme_isteka);
                    }
                    console.log(naziv_putovanja);
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", naziv_putovanja+'_rezervacija[]');
                    input.setAttribute("value", red+"_"+poz);
                    sediste.appendChild(input);
                    var ruta=`/rezervacija/privremenorezervisi/${polazak_id}/${pocetna_destinacija_id}/${krajnja_destinacija_id}/${red}/${poz}/${encodeURIComponent(vreme_isteka.format('YYYY-MM-DD HH:mm'))}`;
                    fetch(host+ruta,{
                        method:'POST'
                    }).then(function (response) {
                        return response.json();
                    }).then(function(response)
                    {
                        var rezervisano_poruka=document.querySelector('.istice-poruka');
                        var cena_karte=sediste.closest('.autobus-wrapper').dataset.cena_karte;
                        promeniCenuRacuna(cena_karte);
                        if(typeof rezervisano_poruka.dataset.prikazana=='undefined')
                        {
                            console.log('x');
                            rezervisano_poruka.dataset.prikazana=1;
                            rezervisano_poruka.style.display='block'; 
                            rezervisano_poruka.innerText=`Vaša rezervacija ističe u ${vreme_isteka.format('DD.MM.YYYY HH:mm')},ako je u međuvremenu ne završite.`;
                            setTimeout(blokirajRezervaciju,10*60*1000)
                        }
                        sediste.dataset.id=response.id;
                    })
                }
                else
                {
                    console.log('1234');
                    var autobus_prikaz_element=sediste.closest('.autobus-wrapper').querySelector('.autobus-prikaz');
                    var poruka_element=document.createElement('div');
                    poruka_element.classList.add('alert');
                    poruka_element.classList.add('alert-danger');
                    poruka_element.classList.add('vec-rezervisano-poruka');
                    poruka_element.classList.add('col-3');
                    sediste.classList.remove('slobodno');
                    sediste.classList.add('rezervisano')
                    autobus_prikaz_element.insertAdjacentElement('afterend', poruka_element); 
                    poruka_element.innerText='Sedište je u međuvremenu rezervisano';
                    setTimeout(()=>
                    {
                        document.querySelector('.vec-rezervisano-poruka').style.display='none';
                    },6*1000);
                }
            })
        }
        function blokirajRezervaciju()
        {
            console.log('123');
            var submit_btn=document.querySelector('#submit-btn');
            var zabranjena_poruka=document.querySelector('.zabranjena-poruka');
            submit_btn.remove();
            zabranjena_poruka.style.display='block';
        }
        function promeniCenuRacuna(iznos_povecanja)
        {
            var iznos_el=document.querySelector('.ukupna_cena');
            var novi_iznos=parseInt(iznos_el.innerText)+parseInt(iznos_povecanja);
            iznos_el.innerText=novi_iznos;
        }
    }
})();