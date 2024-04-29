const { Client } = require('pg'); 

const client = new Client({
    user: 'gen_user',
    host: '82.97.244.142',
    database: 'default_db',
    password: '3Ld66{a:B+c}go',
    port: 5432,
});

client.connect();
module.exports = { client };
