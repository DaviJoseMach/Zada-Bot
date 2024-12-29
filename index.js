const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { logInteraction } = require("./log");

// dotenv
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN } = process.env;

// importação dos comandos
const fs = require("node:fs");
const path = require("node:path");

// Função para carregar comandos de uma pasta
function loadCommandsFromFolder(folderPath) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`O comando em ${filePath} está com "data" ou "execute" ausentes`);
        }
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carregar comandos da pasta "commands"
const commandsPath = path.join(__dirname, "commands");
loadCommandsFromFolder(commandsPath);

// Carregar comandos da pasta "admin"
const adminCommandsPath = path.join(__dirname, "admin");
loadCommandsFromFolder(adminCommandsPath);

// Login do bot e configuração de Rich Presence
client.once(Events.ClientReady, c => {
    console.log(`Pronto! Login realizado como ${c.user.tag}`);

    // Configurando Rich Presence
    client.user.setPresence({ 
        activities: [{ 
            name: 'Urubu do Pix', 
            type: ActivityType.Streaming,  
        }], 
        status: 'online' 
    });
});

client.login(TOKEN);

// Listener de interações com o bot
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // Registrar a interação
    logInteraction(interaction);

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error("Comando não encontrado");
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply("Houve um erro ao executar esse comando!");
    }
});