const { REST, Routes } = require("discord.js");

// dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID } = process.env; // GUILD_ID removido, pois comandos globais não dependem de uma guild específica.

// importação dos comandos
const fs = require("node:fs");
const path = require("node:path");

// Carrega comandos da pasta "commands"
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

// Carrega comandos da pasta "admin"

const adminPath = path.join(__dirname, "admin");
const adminFiles = fs.readdirSync(adminPath).filter(file => file.endsWith(".js"));

// Array para armazenar todos os comandos
const commands = [];

// Adiciona comandos da pasta "commands"
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Adiciona comandos da pasta "admin"
for (const file of adminFiles) {
    const command = require(`./admin/${file}`);
    commands.push(command.data.toJSON());
}

// instância REST
const rest = new REST({ version: "10" }).setToken(TOKEN);

// deploy
(async () => {
    try {
        console.log(`Resetando ${commands.length} comandos globais...`);
        
        // PUT para comandos globais
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log("✅ Comandos globais registrados com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao registrar comandos globais:", error);
    }
})();
