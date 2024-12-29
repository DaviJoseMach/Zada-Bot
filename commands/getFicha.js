const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getficha")
        .setDescription("Resgate 80 fichas a cada 10 horas"),

    async execute(interaction) {
        const membro = interaction.user;
        const now = Date.now(); // Hora atual em milissegundos
        const fichasToResgatar = 80;

        try {
            // Buscar o usuário no banco
            const { data: user, error } = await supabase
                .from("users")
                .select("saldo, last_rescue_time")
                .eq("userId", membro.id)
                .single();

            if (error || !user) {
                return interaction.reply(
                    "Você ainda não foi registrado no sistema. Use o comando `/registrar` para se registrar."
                );
            }

            // Verificar se já se passaram 10 horas desde o último resgate
            const lastRescueTime = user.last_rescue_time || 0;
            const timePassed = now - lastRescueTime;

            // 10 horas em milissegundos
            const tenHoursInMs = 10 * 60 * 60 * 1000;

            if (timePassed < tenHoursInMs) {
                const timeRemaining = tenHoursInMs - timePassed;
                const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60)); // Em horas
                return interaction.reply(
                    `Você precisa esperar mais ⏳ **${hoursRemaining} horas** antes de resgatar as fichas novamente`
                );
            }

            // Atualizar o saldo e o tempo do último resgate
            const newSaldo = (user.saldo || 0) + fichasToResgatar;

            const { error: updateError } = await supabase
                .from("users")
                .update({
                    saldo: newSaldo,
                    last_rescue_time: now,
                })
                .eq("userId", membro.id
                );

            if (updateError) {
                console.error("Erro ao atualizar os dados no Supabase:", updateError);
                return interaction.reply("Erro ao salvar seus dados, tente novamente mais tarde.");
            }

            // Responder ao usuário
            return interaction.reply(`Você resgatou com sucesso **80 fichas!** Seu saldo agora é *${newSaldo}* fichas.`);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("Erro ao acessar os dados, tente novamente mais tarde.");
        }
    },
};
