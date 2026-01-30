import { formatEmail, sendLog } from "../services/mail.model.js";
import fetch from "node-fetch";

// Arquivo: index.mjs (usar extensão .mjs ou "type": "module" no package.json)

export async function mailLog(email){
    let ip = await getIp()
   
    let info = await getIpInfo(ip)
    sendLog(email,info)

}

async function getIp() {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip
    

}

async function getIpInfo(ip) {
  const url = `https://ipinfo.io/${ip}/json`; // endpoint correto
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}




