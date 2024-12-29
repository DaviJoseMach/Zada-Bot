const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const supabase = require("../db-connect");

module.exports = {
    data: new SlashCommandBuilder()
       .setName("info")
       .setDescription("Informações sobre o cassino"),

    async execute (interaction){
        
        try{
            const { data : infos, error} = await supabase
            .from("users")
            .select("saldo", {count: "exact"});

            if (error) {
                console.error("Erro ao buscar informações dos usuários:", error);
                return interaction.reply("Houve um erro ao buscar os dados dos usuários.");
            }

            const trezoitaoemoji = "<:trezoitao:1320411282477809786>"
            const saldoTotal = infos.reduce((total, user) => total + user.saldo, 0);
            const totalUsers = infos.length;

            const embed = new EmbedBuilder()
                .setColor("#4682B4")
                .setTitle(`${trezoitaoemoji} | Informações sobre o Cassino`)
                .setDescription("Como será que estamos? <a:quest:1320418607552925796>")
                .addFields(
                    { name: "Saldo total", value: `${saldoTotal} fichas`, inline: true },
                    { name: "Total de usuários", value: `${totalUsers} pessoas`, inline: true }
                )
                .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
                .setFooter({ text: "Cassino do Zada", iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch(error){
            console.log(error)
            await interaction.reply("Ocorreu um erro ao buscar as informações. Tente novamente mais tarde.");
        }

    }
    
}