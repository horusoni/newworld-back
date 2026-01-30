import { listarAluno, inserirAluno, deletarAlunoDb } from "../services/aluno.model.js"
import { ObjectId } from "mongodb"
import { connectDB } from "../db/connect.js"
import { inserirCurso, listarCurso, deleteCursoDb, inserirAula, listarAula, deleteAulaDb, inserirInscricao, desvincularCursoDb } from "../services/curso.model.js"


export async function cursosAdmin(req,res) {    
    let cursos = await listarCurso()
    res.json({cursos:cursos})
}

export async function cadastrarCurso(req,res) {
    const {curso} = req.body
    inserirCurso(curso)
    console.log(curso)
    res.json({cad:true})  
    
}

export async function deletarCurso(req,res) {
    let delId = req.body.delId
    deleteCursoDb(delId)
    
    res.json({delete:true})
}


export async function cadastrarAula(req,res) {
    const aula = req.body  
    inserirAula(aula)

    res.json({cad:true})
}

export async function aulaAdmin(req,res){
    let cursoId = req.body.cursoId
    let aulas = await listarAula({cursoId: new ObjectId(cursoId)})
   
    res.json({aulas:aulas})
}


export async function deleteAula(req,res) {
    let id = req.body.delId 
    deleteAulaDb(id)

    res.json({deleteAula:true})
}
export async function buscarAlunosAdm(req,res) {
    const alunos = await listarAluno({}, { nome: 1, email: 1, _id: 0 })
    res.json({alunos:alunos})
}

export async function cadastrarAluno(req,res) {
  let aluno = req.body.dados
  
  let data = await inserirAluno(aluno)
  
  
  if(data.msg){
    return res.json({msg : data.msg})
  }
  res.json({receivd:true})
  
}


export async function deletarAluno(req,res) {
    let userId = req.body.userId
    deletarAlunoDb(userId)

    res.json({delete:true})
    
}



export async function meusCursosAdm(req, res) {
    const { userId } = req.body;

    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ erro: "userId inválido" });
    }

    try {
        const db = await connectDB();
        const uid = new ObjectId(userId);

        // 1️⃣ busca inscrições
        const inscricoes = await db
            .collection("inscricao")
            .find({ alunoId: uid })
            .toArray();

        if (!inscricoes.length) {
            return res.json([]);
        }

        // 2️⃣ busca cursos
        const cursoIds = inscricoes.map(i => i.cursoId);

        const cursos = await db
            .collection("cursos")
            .find({ _id: { $in: cursoIds } })
            .project({ titulo: 1, capa: 1, tutor: 1 })
            .toArray();

        // 3️⃣ cria mapa de cursos
        const cursosMap = new Map(
            cursos.map(c => [c._id.toString(), c])
        );

        // 4️⃣ junta tudo
        const resultado = inscricoes.map(inscricao => {
            const curso = cursosMap.get(
                inscricao.cursoId.toString()
            );

            return {
                inscricaoId: inscricao._id,
                cursoId: inscricao.cursoId,
                titulo: curso?.titulo,
                capa: curso?.capa,
                tutor: curso?.tutor,
                status: inscricao.status,
                pricePaid: inscricao.pricePaid,
                purchasedAt: inscricao.purchasedAt
            };
        });

        return res.json(resultado);

    } catch (err) {
        console.error("meusCursosAdm ERROR:", err);
        return res.status(500).json({ erro: err.message });
    }
}

export async function inserirVinculo(req,res) {
    let dados = req.body

    inserirInscricao(dados)

    res.json({vinculado:true})
    
}   


export async function desvincularCurso(req,res) {
    let {inscId} = req.body
    
    desvincularCursoDb(inscId)
    res.json({receivd:true})
}