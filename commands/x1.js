const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');  // Adicionei as dependências necessárias
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("x1")
        .setDescription("Inicie um duelo com outro jogador")
        .addUserOption(option =>
            option.setName("oponente")
                .setDescription("O jogador que você deseja desafiar")
                .setRequired(true)),
    
    async execute(interaction) {
        const desafiante = interaction.user;
        const adversario = interaction.options.getUser("oponente");

        if (desafiante.id === adversario.id) {
            return await interaction.reply("Você não pode duelar consigo mesmo!");
        }

        try {
            const { data: userProfile, error } = await supabase
                .from("users")
                .select("nome, saldo")
                .eq("userId", desafiante.id)
                .single();

            if (error || !userProfile) {
                return await interaction.reply(
                    `${desafiante.username}, você ainda não está registrado! Use o comando /registrar para criar seu perfil.`
                );
            }

            const { data: advProfile, error: error2 } = await supabase
                .from("users")
                .select("nome, saldo")
                .eq("userId", adversario.id)
                .single();

            if (error2 || !advProfile) {
                return await interaction.reply(
                    `${adversario.username} ainda não está registrado!`
                );
            }

            if (userProfile.saldo < 100) {
                return await interaction.reply(
                    `${desafiante.username}, você não tem saldo suficiente para duelar.`
                );
            }

            if (advProfile.saldo < 100) {
                return await interaction.reply(
                    `${adversario.username} não tem saldo suficiente para duelar.`
                );
            }

            const embed = new EmbedBuilder()
                .setColor("#FF4500")
                .setTitle("<a:Sword:1323747628919554068> Desafio de X1!")
                .setDescription(
                    `${desafiante} desafiou ${adversario} para um duelo de x1!\n\n` +
                    `<a:Alert:1323747539463180288> Clique no botão abaixo para aceitar o duelo!\n` +
                    `<:Hourglass:1323747585030099015> Você tem 1 minuto para responder.`
                )
                .setFooter({ text: "Cassino do Zada", iconURL: interaction.client.user.displayAvatarURL() });

            // Criação do botão
            const button = new ButtonBuilder()
                .setCustomId('accept_duel')
                .setLabel('⚔️ Aceitar Duelo')
                .setStyle(ButtonStyle.Primary);  // Botão de estilo primário

            // Criação de uma linha de ação contendo o botão
            const row = new ActionRowBuilder().addComponents(button);

            // Envia a mensagem com o botão
            const mensagem = await interaction.reply({
                embeds: [embed],
                components: [row],
                fetchReply: true
            });

            // Ouve o evento de interação com o botão
            const client = interaction.client;

            const filtro = (btnInteraction) =>
                btnInteraction.customId === 'accept_duel' && btnInteraction.user.id === adversario.id;

            client.on('interactionCreate', async (btnInteraction) => {
                if (!btnInteraction.isButton()) return;
                if (filtro(btnInteraction)) {

                    await btnInteraction.reply(`> <a:CoCFight:1323747563048013854> @${btnInteraction.user.username}, **o duelo foi aceito!**`);
                    const players = [desafiante.id, adversario.id];
                    const winner = players[Math.floor(Math.random() * players.length)];

                    // Atualiza os saldos dos jogadores
                    const { error: error3 } = await supabase
                        .from("users")
                        .update({ saldo: userProfile.saldo + 100 })
                        .eq("userId", winner);

                    const { error: error4 } = await supabase
                        .from("users")
                        .update({ saldo: advProfile.saldo - 100 })
                        .eq("userId", players.find(player => player !== winner));

                    if (error3 || error4) {
                        return await interaction.followUp("Erro ao processar o duelo. Tente novamente mais tarde.");
                    }

                    const embedVitoria = new EmbedBuilder()
                        .setColor("#32CD32")
                        .setTitle(`<a:Money:1323747611903000586> O vencedor foi <@${winner}>  +100 fichas para você!`)
                        .setFooter({ text: "Cassino do Zada", iconURL: interaction.client.user.displayAvatarURL() });

                    await interaction.followUp({ embeds: [embedVitoria] });
                }
            });

            // Timeout para o botão expirar após 1 minuto
            setTimeout(() => {
                interaction.followUp({
                    content: "O duelo expirou porque o adversário não respondeu a tempo.",
                    embeds: []
                });
            }, 60000); 
        } catch (error) {
            await interaction.reply("Ocorreu um erro ao processar o duelo. Tente novamente mais tarde.");
        }
    },
};
