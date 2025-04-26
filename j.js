const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const axios = require("axios");
const playdl = require("play-dl");
const cheerio = require("cheerio");

// Command to display the menu
const menu = async (client, message) => {
  const menuText = `*BUNNY-MD V 0.1*
*───「 ${client.user.name} 」───*
🔥 Welcome to the main menu! 🔥

✰___ Categories ___✰
☞︎︎︎ 🚫 Administration
☞︎︎︎ 🤖 Automation
☞︎︎︎ ℹ️ Information
☞︎︎︎ 🎵 Music
☞︎︎︎ 📺 Media
☞︎︎︎ 📦 Download
☞︎︎︎ 🤝 Fun

👀 More features coming soon!
───「 ${client.user.name} 」───`;

  const bunnyImage = fs.readFileSync(path.join(__dirname, "../media/bunny.jpg"));
  const song = fs.readFileSync(path.join(__dirname, "../media/song.mp4"));

  await client.sendMessage(message.key.remoteJid, { image: bunnyImage, caption: menuText });
  await client.sendMessage(message.key.remoteJid, { video: song, caption: "Enjoy the tune!" });
};

// Administration Commands
const add = async (client, message, args) => {
  const contact = args[0];  // Get contact number
  await client.groupAdd(message.key.remoteJid, [contact]);
  await client.sendMessage(message.key.remoteJid, { text: `Successfully added ${contact} to the group!` });
};

const remove = async (client, message, args) => {
  const contact = args[0];  // Get contact number
  await client.groupRemove(message.key.remoteJid, [contact]);
  await client.sendMessage(message.key.remoteJid, { text: `Successfully removed ${contact} from the group!` });
};

// Media Downloading
const youtube = async (client, message, args) => {
  const videoURL = args.join(" ");
  if (!ytdl.validateURL(videoURL)) return client.sendMessage(message.key.remoteJid, { text: "Invalid YouTube URL" });

  const info = await ytdl.getInfo(videoURL);
  const video = ytdl(videoURL, { quality: "highest" });

  await client.sendMessage(message.key.remoteJid, {
    video: video,
    caption: info.videoDetails.title
  });
};

const tiktok = async (client, message, args) => {
  const tiktokURL = args.join(" ");
  if (!tiktokURL.includes("tiktok.com")) return client.sendMessage(message.key.remoteJid, { text: "Invalid TikTok URL" });

  const { data } = await axios.get(`https://api.tiktokv.com/?url=${tiktokURL}`);
  const videoURL = data.downloadUrl;

  await client.sendMessage(message.key.remoteJid, { video: videoURL, caption: "Here is the TikTok video!" });
};

// APK Downloading
const apk = async (client, message) => {
  const apkURL = "https://example.com/apk"; // Placeholder URL for APK
  const file = fs.createReadStream(path.join(__dirname, "../media/sample.apk"));
  await client.sendMessage(message.key.remoteJid, { document: file, fileName: "sample.apk" });
};

const apkmod = async (client, message) => {
  const apkModURL = "https://example.com/apkmod"; // Placeholder URL for APK Mod
  const file = fs.createReadStream(path.join(__dirname, "../media/samplemod.apk"));
  await client.sendMessage(message.key.remoteJid, { document: file, fileName: "samplemod.apk" });
};

// Fun Commands
const hentai = async (client, message) => {
  const hentaiURL = "https://example.com/hentai"; // Placeholder URL for hentai
  await client.sendMessage(message.key.remoteJid, { text: "Hentai content is not available right now!" });
};

// Information Commands
const info = async (client, message) => {
  const botInfo = `
    *Bot Info:*
    - Bot Name: ${client.user.name}
    - Uptime: ${process.uptime()} seconds
    - Group Chat: ${message.key.remoteJid}
  `;
  await client.sendMessage(message.key.remoteJid, { text: botInfo });
};

const ping = async (client, message) => {
  await client.sendMessage(message.key.remoteJid, { text: "Pong!" });
};

// Music Commands
const play = async (client, message, args) => {
  const songQuery = args.join(" ");
  const song = await playdl.search(songQuery, { limit: 1 });

  if (!song[0]) return client.sendMessage(message.key.remoteJid, { text: "No results found." });

  const audio = await playdl.stream(song[0].url);
  await client.sendMessage(message.key.remoteJid, {
    audio: audio.stream,
    mimetype: "audio/mp4",
    caption: song[0].title
  });
};

// Export all commands
module.exports = {
  menu,
  add,
  remove,
  youtube,
  tiktok,
  apk,
  apkmod,
  hentai,
  info,
  ping,
  play
};

