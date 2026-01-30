import dotenv from "dotenv";
dotenv.config()
import nodemailer from "nodemailer"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import path from "path";
import { fileURLToPath } from "url";

//sendLog()

export function formatEmail(email) {
  if (typeof email !== "string") {
    throw new Error("O parâmetro deve ser uma string.");
  }
  let formatted = email.trim();
  formatted = formatted.replace(/^\[|\]$/g, "");
  formatted = formatted.toLowerCase();

  // Validação básica de email
 /* const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(formatted)) {
    throw new Error("Email inválido.");
  }*/
  
  return formatted;
}
export function sendLog(email,infoIp){
    

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
    },
    });

    // Send an email using async/await
    (async () => {

      const info = await transporter.sendMail({
        from: '"New World Suporte" <newworld.com.br>',
        to: email,
        subject: "ALERTA DE LOGIN",
        html: `   
                  <div style="text-aligin:center;">
                    <p>IP: ${infoIp.ip}</p>
                    <p>DATA: ${new Date()}</p>
                    <p>CIDADE: ${infoIp.city}</p>
                    <p>REGIÃO: ${infoIp.region}</p>
                    <p>ORG: ${infoIp.org}
                    <br>
                    <p>Se foi você ignore esta mensagem.</p>
                  </div>
                `, // HTML version of the message
    });

    console.log("Message sent:", info.messageId);
    })();

}
