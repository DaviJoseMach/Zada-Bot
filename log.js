const interactionLogs = []; // Inicializa o array de logs

function logInteraction(interaction) {
    const log = {
        command: interaction.commandName,
        server: interaction.guild?.name || "Desconhecido",
        serverId: interaction.guild?.id || "Desconhecido",
        channel: interaction.channel?.name || "Desconhecido",
        channelId: interaction.channel?.id || "Desconhecido",
        timestamp: new Date(),
    };

    interactionLogs.unshift(log); // Adiciona no início do array
    if (interactionLogs.length > 30) {
        interactionLogs.pop(); // Remove o mais antigo se exceder 100 entradas
    }
}

function getLogs() {
    return interactionLogs; // Retorna os logs armazenados
}

module.exports = {
    logInteraction,
    getLogs,
};
