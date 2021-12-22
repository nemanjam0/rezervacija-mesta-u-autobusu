const moment=require('moment')
module.exports.dodajMinuteNaVreme=(vreme,minuti)=>
{
    return moment('2021-12-12 '+vreme).add(minuti,'m').format('HH:mm');//kako bi smo formirali moment objekat moramo datum zbog toga vrsimo konkatenaciju unetog vremena sa nekim random datumom
}