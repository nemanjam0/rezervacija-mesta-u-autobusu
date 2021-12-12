(function()
{
    window.addEventListener('load',function()
    {
        console.log('loaded');
        init();
    });
    function init()
    {
        const dom=
        {
            pretragaPocetna:document.querySelector('.pretraga .pocetna-lokacija'),
            pretragaKrajnja:document.querySelector('.pretraga .krajnja-lokacija'),
            pretragaDatum:document.querySelector('.pretraga .datum-polaska'),
            rezervacijaForma:document.querySelector('form.rezervacija'),
            sedistaBtns:document.querySelectorAll('form.rezervacija .sediste'),
            izabranoBrojac:document.querySelector('form.rezervacija .izabrano'),
            ukupnoZaRezervaciju:document.querySelector('form.rezervacija .ukupno'),
            povratnoRadioBtns:document.querySelectorAll('form.rezervacija .povratno'),
            datumPovratka:document.querySelector('form.rezervacija .datum_povratka'),
            vremePovratka:document.querySelector('form.rezervacija .vreme_povratka'),
            stanice:document.querySelectorAll('.stanice'),
            staniceLista:document.querySelector('.stanice-lista'),
            cenovnikBtn:document.querySelector('#cenovnik-btn'),
        }
        postaviDanasnjiDatum();
        setEventListeners();
        function postaviDanasnjiDatum()
        {
            const danasnjiDatum=moment().format('Y-M-D');
            if(dom.pretragaDatum)
            {
                dom.pretragaDatum.min=danasnjiDatum;
                dom.pretragaDatum.value=danasnjiDatum;
            }
            if(dom.datumPovratka)
            {
                dom.datumPovratka.min=danasnjiDatum;
                dom.datumPovratka.value=danasnjiDatum;
            }
        }
        function setEventListeners()
        {
         dom.sedistaBtns.forEach((btn)=>btn.addEventListener('click',sedisteClick));
         dom.povratnoRadioBtns.forEach((btn)=>btn.addEventListener('click',povratnoClick));
         dom.stanice.forEach((stanica)=>stanica.addEventListener('change',izabranaStanica));
         dom.cenovnikBtn.addEventListener('click',ucitajCenovnik);
        }
        function izabranaStanica(event)
        {
            var odabrano=event.target.getAttribute('odabrano');
            if(odabrano==null)//znaci da pre toga nije bila birana stanica iz tog select boxa
            {
                var nova_stanica=event.target.parentNode.cloneNode(true);
                var redni_broj=nova_stanica.querySelector('.redni-br')
                dom.staniceLista.appendChild(nova_stanica);
                redni_broj.innerHTML=(parseInt(redni_broj.innerHTML.replace('.',''))+1)+'.';
                nova_stanica.addEventListener('change',izabranaStanica);

                
            }
            event.target.setAttribute('odabrano','1')
            //console.log(event.target.value);
        }
        function ucitajCenovnik()
        {
            var stanice=izvuciStanice();
            nacrtajTabeluZaCenovnik(stanice)
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
                stanice.push(obj);
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
            for(var i=0;i<stanice.length+1;i++)
            {
                var red=document.createElement('tr')
                tbody.append(red)
                for(var j=0;j<stanice.length;j++)
                {
                    if(i==0 && j==0)
                    {
                        var polje=document.createElement('th')
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
                        var polje=document.createElement('th')
                        if(i>j)
                        {
                            polje.innerHTML=""
                        }
                        else
                        {
                            polje.innerHTML="x"
                        }
                        red.append(polje);
                    }
                }
            }
        }
        function povratnoClick(event)
        {
            if(event.target.value=='da')
            {
                console.log('da');
            }
        }
        function sedisteClick(event)
        {
            const red=event.target.dataset.red;
            const poz=event.target.dataset.poz;
            if(event.target.classList.contains('slobodno'))
            {
                if(proveriDozvoljenostRezervacije())
                {
                    if(proveriDostupnostSedista(red,poz))
                    {
                        povecajBrojRezervisanihSedista();
                        event.target.classList.add('moja-rezervacija');
                        event.target.classList.remove('slobodno');
                    }
                }
            }
            
            
        }
        function povecajBrojRezervisanihSedista()
        {
            dom.izabranoBrojac.innerText=parseInt(dom.izabranoBrojac.innerText)+1;
        }
        function proveriDozvoljenostRezervacije()//proverava da li je korisnik vec izabrao sva mesta za koje je zahtevao rezervaciju
        {
            const br_izabranih=parseInt(dom.izabranoBrojac.innerText);
            const br_dozvoljenih=parseInt(dom.ukupnoZaRezervaciju.innerText);
            return br_izabranih<br_dozvoljenih;
        }
        function proveriDostupnostSedista(red,pozicija)
        {
            return true;
        }
    }
})();