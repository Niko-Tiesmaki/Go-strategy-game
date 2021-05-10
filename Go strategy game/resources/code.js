'use strict';

(function(){
    let taulukko;
    let piste1;
    let piste2;
    let socket;
              
    //const tyylit=['tyhja'];

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        socket = io();
        socket.on('platform', pelitaulukko => platform(pelitaulukko));
        socket.on('Peli täynnä', () => alert('Peli täynnä'));
        socket.on('Wrong move', () => alert('Wrong move'));
        socket.on('Paivitapeli', pelitaulukko => platform(pelitaulukko));
        socket.on('pisteet', tulos => pisteet(tulos));
        piste1 = document.getElementById('piste1');
        piste2 = document.getElementById('piste2');
    }

    function platform(peli) {
        taulukko = document.getElementById('taulukko');
        taulukko.innerHTML ="";
            for (let rivi=0; rivi<peli.length; rivi++){
                 const tr = document.createElement('tr');
                 for (let sarake=0; sarake<peli[rivi].length; sarake++){
                    const td = document.createElement('td');
                    td.addEventListener('click', () => kasitteleKlik(rivi,sarake));
                    //td.classList.add(tyylit[peli[rivi][sarake]]);
                    //td.textContent =peli[rivi][sarake];
                     if (peli[rivi][sarake] === 1) {
                         td.setAttribute('class','nappula1');
                     }
                     else if (peli[rivi][sarake] === 2) {
                         td.setAttribute('class','nappula2');
                     }
                     else if (peli[rivi][sarake] === 3) {
                         td.setAttribute('class', 'nappula3');
                     }
                     else {
                         td.setAttribute('class','tausta');
                     }
                     tr.appendChild(td);
	             }
                 taulukko.appendChild(tr);
	        }
    }
    function kasitteleKlik(rivi, sarake) {
                socket.emit('Klikattu', rivi, sarake);
    }
    function pisteet(tulos) {
        console.log(tulos);
        piste1.textContent = tulos['1'];
        piste2.textContent = tulos['2'];
    }    
    
        
    
})();