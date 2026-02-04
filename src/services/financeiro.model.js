import { ObjectId } from "mongodb";
import { connectDB } from "../db/connect.js";


export async function receitaDB() {
  const db = await connectDB();

  const receita = await db.collection("inscricao").find().toArray();

  const receitaValida = receita.filter(r => r.alunoId && r.cursoId);

  const alunoIds = receitaValida.map(r => new ObjectId(r.alunoId));
  const cursoIds = receitaValida.map(r => new ObjectId(r.cursoId));

  const alunos = await db
    .collection("aluno")
    .find(
      { _id: { $in: alunoIds } },
      { projection: { nome: 1, email: 1 } }
    )
    .toArray();

  const cursos = await db
    .collection("cursos")
    .find(
      { _id: { $in: cursoIds } },
      { projection: { titulo: 1 } }
    )
    .toArray();

  const alunosMap = {};
  const cursosMap = {};

  alunos.forEach(a => {
    alunosMap[a._id.toString()] = {
      nome: a.nome,
      email: a.email
    };
  });

  cursos.forEach(c => {
    cursosMap[c._id.toString()] = c.titulo;
  });

  const resultado = receitaValida.map(r => ({
    aluno: alunosMap[r.alunoId.toString()]?.nome || "Excluído",
    email: alunosMap[r.alunoId.toString()]?.email || "Não disponível",
    curso: cursosMap[r.cursoId.toString()] || "Não assinado",
    valorPago: r.valorPago,
    data: r.data || r.purchasedAt || null
  }));

  return resultado;
}

const res = await receitaDB();
console.log(res);
