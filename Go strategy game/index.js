'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = socketio(server);

let number = 0;

const pelitaulukko = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const homepath = path.join(__dirname, 'index.html');

const user = new Map();

app.use(express.static(path.join(__dirname, 'resources')));

app.get('/peli', (req, res) =>
    res.sendFile(path.join(homepath))
);

io.on('connection', socket => {
    socket.on('disconnect', () => number--);
    if (number < 2) {
        number++;
        user.set(socket.id, { number: number, pisteet: 0,socketid:socket.id });
        socket.emit('platform', pelitaulukko);
        //console.log(socket.id);
    }
    else {
        socket.emit('Peli täynnä')
    }
    socket.on('Klikattu', (rivi, sarake) => {
        const merkki = user.get(socket.id).number;
        //console.log('merkki',rivi,sarake);
        if (pelitaulukko[rivi][sarake] === 0) {
            pelitaulukko[rivi][sarake] = merkki;
        }
        else {
            socket.emit('Wrong move');
        }
        
        //tarkistaVaaka(rivi,sarake,merkki);
        //tarkistaPysty(sarake, rivi, merkki);
        tarkastaPisteet(socket.id,rivi, sarake, merkki);

        //console.log(pelitaulukko);
        io.emit('Paivitapeli', pelitaulukko);
        let tulos = {};
        user.forEach(pelaaja => tulos[pelaaja.number] = pelaaja.pisteet);
        io.emit('pisteet',tulos);
        
        //console.log(number);
    });

});
server.listen(port,host,() =>
    console.log('Palvelin toimii')
);
 
function tarkistaVaaka(rivi,alkusarake,merkki) {
        let apuX = alkusarake;
        const sarakkeet = [];
        while (apuX >= 0 && pelitaulukko[rivi][apuX] === merkki) {
            apuX--;
        }
        if (alkusarake!==apuX) {
            for (let i = apuX + 1;i<pelitaulukko.length && pelitaulukko[rivi][i] === merkki; i++) {
                sarakkeet.push(i);
            }
        
        }
    return sarakkeet;
   
}

function tarkistaPysty(sarake,alkurivi,merkki) {
        let apuY = alkurivi;
        const rivit = [];
        while (apuY >= 0 && pelitaulukko[apuY][sarake] === merkki) {
            apuY--;
            
        }
        if (alkurivi !== apuY) {
             for (let i = apuY + 1;i<pelitaulukko[sarake].length && pelitaulukko[i][sarake] === merkki; i++) {
                rivit.push(i);
             }
        }    
    return rivit;
    
}
function tarkastaPisteet(socketid,rivi, sarake, merkki) {
    const tulosX = tarkistaVaaka(rivi, sarake, merkki);
    const pelaaja = user.get(socketid);
    if (tulosX.length >= 3) {
        pelaaja.pisteet++;
        for (let x of tulosX) {
            pelitaulukko[rivi][x] = 3;
        }
    }
    const tulosY = tarkistaPysty(sarake, rivi, merkki);
    if (tulosY.length >= 3) {
        pelaaja.pisteet++;
        for (let x of tulosY) {
            pelitaulukko[x][sarake] = 3;
        }
    }
}