import { ObjectId } from "mongodb";
import { connectDB } from "../db/connect.js";
import { listarInscricaoDB } from "./curso.model.js";

/**
 * Cria certificado se:
 * - usuário estiver inscrito no curso
 * - certificado ainda não existir
 */
export async function certificadoDb(dados) {
  const db = await connectDB();

  // 1️⃣ Verifica se o usuário está inscrito no curso
  const inscricao = await listarInscricaoDB(
    dados.userId,
    dados.cursoId
  );

  if (!inscricao) {
    return {
      ok: false,
      message: "Usuário não possui este curso"
    };
  }

  // 2️⃣ Verifica se o certificado já existe
  const certificadoExistente = await db
    .collection("certificado")
    .findOne({
      userId: new ObjectId(dados.userId),
      cursoId: new ObjectId(dados.cursoId)
    });

  if (certificadoExistente) {
    return {
      ok: false,
      message: "Certificado já criado"
    };
  }

  // 3️⃣ Cria o certificado
  const certificadoId = await registerCertification(dados);

  return {
    ok: true,
    certificadoId
  };
}

/**
 * Insere o certificado no banco
 */
export async function registerCertification(payload) {
  const db = await connectDB();
  const now = new Date();

  const certificado = {
    userId: new ObjectId(payload.userId),
    cursoId: new ObjectId(payload.cursoId),

    dataFinalizacao: now, // 🏁 conclusão do curso
    issuedAt: now,        // 🧾 emissão do certificado

    status: "ativo"
  };

  const result = await db
    .collection("certificado")
    .insertOne(certificado);

  return result.insertedId.toString();
}


export async function buscarDadosCertificado(userId, cursoId) {
  const db = await connectDB();

  // 1️⃣ Certificado
  const certificado = await db.collection("certificado").findOne({
    userId: new ObjectId(userId),
    cursoId: new ObjectId(cursoId)
  });

  if (!certificado) return null;

  // 2️⃣ Aluno
  const aluno = await db.collection("aluno").findOne(
    { _id: certificado.userId },
    { projection: { nome: 1 } }
  );

  // 3️⃣ Curso
  const curso = await db.collection("cursos").findOne(
  { _id: certificado.cursoId },
  { projection: { titulo: 1, tutor: 1, carga_horaria: 1, materia: 1 } }
);


  // 4️⃣ Inscrição (INÍCIO)
  const inscricao = await db.collection("inscricao").findOne({
    alunoId: certificado.userId,
    cursoId: certificado.cursoId
  });

  return {
    certificadoId: certificado._id.toString(),

    nomeAluno: aluno?.nome || null,
    nomeCurso: curso?.titulo || null,
    tutor: curso?.tutor || null,
    carga_horaria: curso?.carga_horaria || null,
    materia:curso?.materia || null,
    dataInicio: inscricao?.purchasedAt
      ? formatarDataExtenso(inscricao.purchasedAt)
      : null,

    dataEmissao: certificado.issuedAt
      ? formatarDataExtenso(certificado.issuedAt)
      : formatarDataExtenso(certificado._id.getTimestamp()) // fallback
  };
}


function formatarDataExtenso(data) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}