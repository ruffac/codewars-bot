import { SlashCommandBuilder } from "discord.js";
import { table } from "table";
import { CommandNames } from "../commands.js";
import { MAX_STUDENTS_ON_TABLE, challengesIds } from "../constants.js";
import { ChallengeModel } from "../database/models/challengeModel.js";
import { getCompletedCodeKatas } from "../utils/codewars.js";

export const buildStatus = () => {
  return new SlashCommandBuilder()
    .setName(CommandNames.status)
    .setDescription("Status of the challenge");
};

export const status = async (interaction) => {
  const { channelId } = interaction;
  const challenge = await ChallengeModel.findOne({
    channelId: channelId,
    isActive: true,
  });
  if (!challenge) {
    await interaction.reply(
      "There is no active challenge on this channel yet. But you can start one!"
    );
    return;
  }
  await interaction.reply("Fetching stats ...");

  const status = await getChallengeStatus(challenge);
  for (const msg of status) {
    await interaction.followUp(msg);
  }
};

export const getChallengeStatus = async (challenge) => {
  const now = new Date();
  const daysLeft = Math.ceil((challenge.endDate - now) / (1000 * 3600 * 24));
  const type = challenge.type;

  const progress = await getChallengeProgress(challenge.challengers, type);
  let status = [];
  const start =
    `:rocket: ${challenge.name} challenge stats :rocket:\n` +
    `${challenge.challengers.length} joined. :drum:\n`;
  status.push(start);
  progress.forEach((progress) => {
    let responseBuilder = "```\n" + progress + "\n```";
    status.push(responseBuilder);
  });
  const end =
    `${daysLeft} days left. Carry on!\n` +
    `Challenge ends on ${challenge.endDate.toLocaleString("en-US", {
      timeZone: "Asia/Singapore",
    })}`;
  status.push(end);
  return status;
};

const getChallengeProgress = async (challengers, type) => {
  let scores = [];
  for (let challenger of challengers) {
    const allKatas = (await getCompletedCodeKatas(challenger)) || [];
    const challengeIds = challengesIds[type];
    const challenges = allKatas.filter((kata) => {
      return challengeIds.includes(kata.id);
    });
    scores.push([
      challenger,
      Math.round((challenges.length / challengeIds.length) * 100),
    ]);
    scores.sort((a, b) => {
      if (a[1] === b[1]) return 0;
      else if (a[1] < b[1]) return 1;
      else return -1;
    });
  }
  let progressTable = [];
  let start = 0;
  while (start < scores.length) {
    let partial = scores.slice(start, MAX_STUDENTS_ON_TABLE + start);
    partial.splice(0, 0, ["username", "completion rate"]);
    progressTable.push(table(partial));
    start = start + MAX_STUDENTS_ON_TABLE;
  }
  return progressTable;
};
