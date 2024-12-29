const { SlashCommandBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setar-saldo")
        .setDescription("Seta um saldo à conta de outro usuário (apenas para administradores).")
        .addIntegerOption(option =>
            option.setName("quantia")
                .setDescription("Quantidade de fichas para adicionar.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("userid")
                .setDescription("ID do Discord do usuário que receberá as fichas.")
                .setRequired(true)
        ),

    async execute(interaction) {
        const membro = interaction.user;

        // Obtém os argumentos
        const quantia = interaction.options.getInteger("quantia");
        const destinatarioId = interaction.options.getString("userid");

        // Valida a quantia
        if (quantia <= 0) {
            return interaction.reply("🚫 A quantia deve ser maior que 0.");
        }

        try {
            // Verifica se o usuário é um administrador
            const { data: usuario, error: usuarioError } = await supabase
                .from("users")
                .select("type")
                .eq("userId", membro.id)
                .single();

            if (usuarioError || !usuario) {
                return interaction.reply("🚫 Não foi possível verificar sua permissão no sistema.");
            }

            if (usuario.type !== "admin") {
                return interaction.reply("🚫 Apenas administradores podem executar este comando.");
            }

            // Localiza o destinatário no banco de dados
            const { data: destinatario, error: destinatarioError } = await supabase
                .from("users")
                .select("saldo")
                .eq("userId", destinatarioId)
                .single();

            if (destinatarioError || !destinatario) {
                return interaction.reply(`🚫 Usuário com ID **${destinatarioId}** não encontrado.`);
            }

            // Atualiza o saldo do destinatário
            const novoSaldoDestinatario = destinatario.saldo = quantia;

            const { error: updateError } = await supabase
                .from("users")
                .update({ saldo: novoSaldoDestinatario })
                .eq("userId", destinatarioId);

            if (updateError) {
                console.error("Erro ao atualizar o saldo do destinatário:", updateError);
                return interaction.reply("Erro ao atualizar os dados do destinatário. Tente novamente mais tarde.");
            }

            // Confirma a adição de fichas
            return interaction.reply(`✅ **${quantia} fichas** foram setadas ao usuário➡️ <@${destinatarioId}>.`);
        } catch (error) {
            console.error("Erro ao processar o comando:", error);
            return interaction.reply("Erro ao acessar os dados. Tente novamente mais tarde.");
        }
    },
};
