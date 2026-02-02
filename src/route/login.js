import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { listarAluno, admDb } from "../services/aluno.model.js";
import { formatEmail } from "../services/mail.model.js";
import { cifrar } from "../services/cipher.model.js";
import { mailLog } from "./sendmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * LOGIN ALUNO
 */
export async function login(req, res) {
  const { email, senha } = req.body;
  const hash = cifrar(senha);

  const alunos = await listarAluno();

  const alunoEncontrado = alunos.find(
    (aluno) => aluno.email === email && aluno.hash === hash
  );

  if (!alunoEncontrado) {
    return res.status(401).json({
      login: false,
      message: "Credenciais inválidas."
    });
  }

  const token = jwt.sign(
    { userId: alunoEncontrado._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
  maxAge: 1000 * 60 * 60 // 1 hora
});



  const mail = formatEmail(email);
  mailLog(mail);

  return res.json({ login: true });
}

/**
 * LOGIN ADMIN
 */
export async function loginAdmin(req, res) {
  const { email, senha } = req.body;
  const hash = cifrar(senha);

  const admins = await admDb();

  const adminEncontrado = admins.find(
    (admin) => admin.email === email && admin.hash === hash
  );

  if (!adminEncontrado) {
    return res.status(401).json({
      login: false,
      message: "Credenciais inválidas."
    });
  }

  const token = jwt.sign(
    { adminId: adminEncontrado._id.toString() },
    process.env.JWT_SECRET_ADMIN,
    { expiresIn: "1h" }
  );

res.cookie("tokenAdmin", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
  maxAge: 1000 * 60 * 60 // 1 hora
});



  const mail = formatEmail(email);
  mailLog(mail);

  return res.json({ login: true });
}

/**
 * LOGOUT (USER + ADMIN)
 */
export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,        // igual ao login
    sameSite: "None",    // igual ao login
    path: "/"            // igual ao login
  });

  res.clearCookie("tokenAdmin", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/"
  });

  return res.status(200).json({ message: "Logout realizado" });
}


/**
 * QUEM SOU EU (USER)
 */
export async function whoami(req, res) {
  const uid = req.userId;

  const nome = await listarAluno(
    { _id: new ObjectId(uid) },
    { projection: { nome: 1 } }
  );

  return res.json({ username: nome[0].nome });
}
