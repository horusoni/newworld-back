import { ObjectId } from "mongodb"
import { connectDB } from "../db/connect.js"
import { allCursosDB, editarCursoDB, listarAula, listarInscricaoDB } from "../services/curso.model.js"
export async function meusCursos(req, res) {

  try {
    const db = await connectDB()

    // 1️⃣ alunoId vem do JWT (middleware)
    const uid = req.userId
    // console.log(uid,"User Id aqui")
    // 2️⃣ busca inscrições
    const inscricoes = await db.collection("inscricao")
      .find({ alunoId: new ObjectId(uid) })
      .toArray()

    if (inscricoes.length === 0) {
      return res.json([])
    }

    // 3️⃣ extrai os cursoIds
    const cursoIds = inscricoes.map(i => i.cursoId)

    // 4️⃣ busca os cursos
    const cursos = await db.collection("cursos")
      .find({ _id: { $in: cursoIds } })
      .project({ titulo: 1, capa: 1, tutor: 1 })
      .toArray()

    // 5️⃣ responde pro front
    return res.json(cursos)

  } catch (err) {
    return res.status(500).json({ erro: "Erro ao buscar cursos" })
  }
}

export async function aulas(req, res) {
  try {
    const { cursoId } = req.body
    const userId = req.userId

    // validação básica dos IDs
    if (!ObjectId.isValid(cursoId) || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "IDs inválidos" })
    }

    // verifica se o usuário está inscrito nesse curso
    const inscricao = await listarInscricaoDB(userId, cursoId)

    if (!inscricao || inscricao.length === 0) {
      return res.status(403).json({ message: "Usuário não possui acesso a este curso" })
    }

    // se passou na verificação, busca as aulas
    const aula = await listarAula({ cursoId: new ObjectId(cursoId) })

    res.json({ aula })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

export async function allCursos(req,res) {
  
  let cursos = await allCursosDB()
  if(!cursos || cursos.length ===0){
    return res.status(400).json({message:"Nenhum curso encontrado."})
  }

  res.status(200).json(cursos)
}

export async function editarCurso(req,res) {
  let curso = req.body.curso
  editarCursoDB(curso)
  res.json({message:"Atualizado com sucesso!"})
}