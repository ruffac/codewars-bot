import { CommandNames } from "../commands.js";
import { join } from "../commands/join.js";
import { start } from "../commands/start.js";
import { status } from "../commands/status.js";
import { stop } from "../commands/stop.js";

export const interactionCreateHandler = async (interaction) => {
  console.log(
    `From ${interaction.user.username}, command ${interaction.commandName}`,
  );
  if (!interaction.isChatInputCommand()) return;
  try {
    switch (interaction.commandName) {
      case CommandNames.start:
        await start(interaction);
        break;
      case CommandNames.join:
        await join(interaction);
        break;
      case CommandNames.status:
        await status(interaction);
        break;
      case CommandNames.stop:
        await stop(interaction);
        break;
      default:
        await interaction.reply(
          "Hmmm, we seem to not know what to do with that. Please send a message to the admin.",
        );
        break;
    }
  } catch (e) {
    console.error(e);
    const msg =
      "Ouch! An error has occurred. Please try again at a later time...";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
    throw new Error("INTERACTION ERROR");
  }
};
