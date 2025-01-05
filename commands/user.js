const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("perfil")
        .setDescription("Exibe os dados do seu perfil no cassino"),

    async execute(interaction) {
        const membro = interaction.user;

        try {
            // Consulta ao banco para buscar o perfil do usuário
            const { data: userProfile, error } = await supabase
                .from("users")
                .select("nome, saldo, dt_registro, type, deposito")
                .eq("userId", membro.id)
                .single();

            if (error || !userProfile) {
                return await interaction.reply(
                    `${membro.username}, você ainda não está registrado! Use o comando /registrar para criar seu perfil.`
                );
            }

            // Depuração: Verifica se algum campo está ausente
     
            // Converte a data de registro (timestamptz) para um formato amigável
            const dtRegistro = new Date(userProfile.dt_registro).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

            // Geração de cor aleatória
            const colors = ["#0000FF", "#008000", "#FF0000", "#FFFF00", "#FFC0CB", "#FFA500", "#800080"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            // Construção do embed
            const embed = new EmbedBuilder()
                .setColor(randomColor)
                .setTitle(`Perfil de ${userProfile.nome} <:emo:1320418542746865725>`)
                .addFields(
                    { name: "Nome", value: userProfile.nome, inline: true },
                    { name: "Saldo", value: `${userProfile.saldo} fichas`, inline: true },
                    { name: "Depositados", value: `${userProfile.deposito ?? 0} fichas`, inline: true },
                    { name: "Cargo", value: userProfile.type, inline: true },
                    { name: "Data de Registro", value: dtRegistro, inline: false }
                )
                .setThumbnail(membro.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Cassino do Zada", iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply("Ocorreu um erro ao buscar seu perfil. Tente novamente mais tarde.");
        }
    },
};
