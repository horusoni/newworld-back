/*import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// força carregar o .env da pasta /back
dotenv.config({ path: path.resolve(__dirname, "../.env") })

const uri = process.env.MONGO_URI
const dbName = process.env.DB_NAME

if (!uri) {
  throw new Error("MONGO_URI não foi definida no .env")
}

const client = new MongoClient(uri)
let db

export async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
    console.log("✅ MongoDB conectado")
  }
  return db
}*/
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";   // <-- faltou importar
import { MongoClient } from "mongodb"; // <-- certifique-se de importar

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// força carregar o .env da pasta /back
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.MONGO_URI_ATLAS;
const dbName = process.env.DB_NAME_ATLAS;

if (!uri) {
  throw new Error("MONGO_URI não foi definida no .env");
}

const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ MongoDB conectado");
  }
  return db;
}


