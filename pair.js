const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Gifted_Tech = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);

            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    await delay(5000);

                    // Read creds.json and send it as a file to the user
                    let credsFilePath = __dirname + `/temp/${id}/creds.json`;

                    if (fs.existsSync(credsFilePath)) {
                        let creds = fs.readFileSync(credsFilePath);

                        await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, {
                            document: creds,
                            fileName: 'creds.json',
                            mimetype: 'application/json'
                        });

                        let GIFTED_MD_TEXT = `
*_BUNNY_MD-Vo.1 Connected!_*
______________________________________
╔════════════════════════◇
║ *『 AMAZING YOU'VE CHOSEN BUNNY_MD-V1』*
║ _You Have Completed the First Step to Deploy a WhatsApp Bot._
╚════════════════════════╝
╔═════════════════════════◇
║  『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ CHANNEL 👉 https://whatsapp.com/channel/0029Vb5HhRAFi8xggoraw43G
║❒ GROUP 👉 https://chat.whatsapp.com/C1FYBUTABqe9J7fh3jp55r
║❒ CONTACT ME  +263771528985
║❒ REPO 👉 https://github.com/bunny00-bot/BUNNY-MD-V1-.git
╚══════════════════════════╝
_____________________________________

_Don't Forget To Give Star To My Repo😌_
                                        ®BUNNY`;

                        await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, {
                            text: GIFTED_MD_TEXT
                        });

                        // Close the connection after sending the creds.json and message
                        await delay(100);
                        await Pair_Code_By_Gifted_Tech.ws.close();
                        return await removeFile('./temp/' + id);
                    } else {
                        console.log("creds.json not found!");
                    }
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted due to error:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;
