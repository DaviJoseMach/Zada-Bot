const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Removendo comandos globais...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );
        console.log('✅ Comandos globais removidos!');
    } catch (error) {
        console.error('❌ Erro ao remover comandos globais:', error);
    }
})();
