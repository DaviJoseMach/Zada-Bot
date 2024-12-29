const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Removendo comandos específicos da guild...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        );
        console.log('✅ Comandos da guild removidos!');
    } catch (error) {
        console.error('❌ Erro ao remover comandos da guild:', error);
    }
})();
