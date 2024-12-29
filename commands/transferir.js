const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pix")
        .setDescription("Faça um PIX para outro jogador.")
        .addUserOption(option =>
            option
                .setName("destinatario")
                .setDescription("Selecione o jogador que receberá o PIX.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("quantia")
                .setDescription("Digite a quantia de fichas que deseja enviar.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const remetente = interaction.user; // Quem enviou o comando
        const destinatario = interaction.options.getUser("destinatario");
        const quantia = interaction.options.getInteger("quantia");

        // Verifica se a quantia é válida
        if (quantia <= 0) {
            return interaction.reply({
                content: "A quantia deve ser maior que zero!",
                ephemeral: true,
            });
        }

        // Busca saldo do remetente
        const { data: remetenteData, error: remetenteError } = await supabase
            .from("users")
            .select("saldo")
            .eq("userId", remetente.id)
            .single();

        if (remetenteError || !remetenteData) {
            return interaction.reply({
                content: "Não foi possível acessar seu saldo. Tente novamente mais tarde.",
                ephemeral: true,
            });
        }

        // Verifica se o remetente tem saldo suficiente
        if (remetenteData.saldo < quantia) {
            return interaction.reply({
                content: "Você não tem saldo suficiente para realizar o PIX.",
                ephemeral: true,
            });
        }

        // Busca saldo do destinatário
        const { data: destinatarioData, error: destinatarioError } = await supabase
            .from("users")
            .select("saldo")
            .eq("userId", destinatario.id)
            .single();

        if (destinatarioError || !destinatarioData) {
            return interaction.reply({
                content: "Não foi possível acessar o saldo do destinatário. Tente novamente mais tarde.",
                ephemeral: true,
            });
        }

        // Realiza a transferência
        const novoSaldoRemetente = remetenteData.saldo - quantia;
        const novoSaldoDestinatario = destinatarioData.saldo + quantia;

        const { error: updateRemetenteError } = await supabase
            .from("users")
            .update({ saldo: novoSaldoRemetente })
            .eq("userId", remetente.id);

        const { error: updateDestinatarioError } = await supabase
            .from("users")
            .update({ saldo: novoSaldoDestinatario })
            .eq("userId", destinatario.id);

        if (updateRemetenteError || updateDestinatarioError) {
            return interaction.reply({
                content: "Houve um problema ao realizar o PIX. Tente novamente mais tarde.",
                ephemeral: true,
            });
        }

        // Confirmação
        return interaction.reply({
            content: `✅ PIX realizado com sucesso! Você enviou **${quantia} fichas** para <@${destinatario.id}>.`,
        });
    },
};
