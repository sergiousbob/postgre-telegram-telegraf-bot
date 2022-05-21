const { Pool } = require('pg')
const Cursor = require('pg-cursor');
require ('dotenv').config ()
const {Telegraf, Markup} = require ("telegraf");
const  getKeyboard  = require('./keys');


const pool = new Pool({
    user : `${process.env.DB_USER}`, 
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`,
    password: `${process.env.DB_PASSWORD}`,
    port: `${process.env.DB_PORT}`,
});


const bot = new Telegraf(process.env.BOT_TOKEN)

let query = [];

function addQuery (text)
{
    query.push(text)
}

bot.start(async (ctx) => {
   return  ctx.replyWithHTML('<b>Добра тебе, человек!</b>\n <i>Данный телеграм-бот '+
   'позволяет выполнить поиск товара.</i>\n <i>Для поиска товара  введите его наименование.\n'+
   ' Для просмотра всех товаров наберите "Показать все записи"</i>', getKeyboard)
    })
 

bot.hears('Показать все записи', ctx => {


    try {
        (async () => {
            const client = await pool.connect();

            const query = 'SELECT * FROM public."user"';
        
            const cursor = await client.query(new Cursor(query));
      
           
            cursor.read(1000000, (err, rows) => {
               
                ctx.reply ( `${JSON.stringify(rows)}`);

      
            })
        })();

    } catch (e){
        console.error (e)
    }

})


bot.on('text', async (ctx) => {
        
         try {
        (async () => {
            const client = await pool.connect();

            const query = `SELECT * FROM public."user" WHERE naimenovanie = '${ctx.message.text}'`;
        
            const cursor = await client.query(new Cursor(query));
        
            cursor.read(1000000, (err, rows) => {
               
                if (JSON.stringify(rows) == '[]') {
                    ctx.reply ('нет товара на складе!');
                }else
                 ctx.reply ( `Вот ваш товар:\n ${JSON.stringify(rows)}`);

                })
        })();

    } catch (e){
        console.error (e)
    }

})

bot.launch ()





