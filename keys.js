const {Markup} = require('telegraf')

function getKeyboard() {
    return Markup.keyboard([
        ['Показать все записи'],
        ['/start']
     
   ])
}
module.exports= getKeyboard (); 



