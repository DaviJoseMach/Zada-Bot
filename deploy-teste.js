const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
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

// Instância REST
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Deploy para a guild
(async () => {
    try {
        console.log(`Resetando ${commands.length} comandos para a guild...`);

        // Registra comandos na guild
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log("Comandos registrados com sucesso na guild!");
    } catch (error) {
        console.error("Erro ao registrar comandos na guild:", error);
    }
})();
