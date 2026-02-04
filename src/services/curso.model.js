import { ObjectId } from "mongodb";
import {connectDB} from "../db/connect.js"

//const alunoId = "6973ea2daaf88f68518fe3d2" 
//const cursoId = "6973f0b73a8a75c646c18f35"


/*let dados = {
        titulo:"Web Hacking",
        desc:"aprenda do zero",
        tutor:"Samuel hacker",
        capa:"https://img.freepik.com/fotos-gratis/dispositivo-de-sustentacao-de-homem-de-tiro-medio_23-2149192120.jpg",
    }*/

   // inserirCurso(dados)

export async function inserirCurso(data) {
    console.log(data)
    const db = await connectDB()
    const cursos = {
        titulo:data.titulo,
        desc:data.desc,
        materia:data.materia,
        tutor:data.tutor,
        capa:data.capa,
        preco: data.preco,
        carga_horaria:data.carga_horaria,
        data: new Date()
    }
    return db.collection("cursos").insertOne(cursos)
}

export async function listarCurso() {
    const db = await connectDB()
    return db.collection("cursos").find().toArray()
    
}

export async function deleteCursoDb(id) { 
    const db = await connectDB() 
    deleteAulaById(id)
    return db.collection("cursos").deleteOne({ _id: new ObjectId(id) 
    })
}

//deleto uma aula
export async function deleteAulaDb(id) { 
    const db = await connectDB() 
    return db.collection("aula").deleteOne({ _id: new ObjectId(id) 
    })
}
//deleto todas as aulas

export async function deleteAulaById(cursoId) {
    const db = await connectDB();
    const cid = new ObjectId(cursoId);

    // deleta todas as aulas do curso
    await db.collection("aula").deleteMany({
        cursoId: cid
    });

    // deleta todas as inscrições desse curso
    await db.collection("inscricao").deleteMany({
        cursoId: cid
    });

    return { deleted: true };
}
    
export async function inserirAula(data){
    const db = await connectDB();

    let dados = {
        title: data.titulo,
        cursoId:new ObjectId(data.cursoId),
        desc:data.desc,
        thumbnail:data.thumbnail,
        videoUrl:data.videoUrl,
    }
    return db.collection("aula").insertOne(dados);

}

export async function listarAula(curseId){
    const db = await connectDB();
    return db.collection("aula").find(curseId).toArray();
}

//const aula = await listarAula({cursoId: new ObjectId('696a4f573532989b5681e5d0')})
//console.log(aula)


export async function inserirInscricao(dados){
    const db = await connectDB()

    let inscricao = {
        alunoId:new ObjectId(dados.dados.userId),
        cursoId:new ObjectId(dados.dados.cursoId),
        valorPago: dados.dados.valorPago,          // valor final pago
        //currency: "",         // opcional
       // paymentMethod: "",    // opcional
       // paymentId: "",  // id do gateway

        purchasedAt: new Date(),
        status: "ativo"
    }

    return db.collection("inscricao").insertOne(inscricao)
}

export async function listarInscricaoDB(userId, cursoId) {
    let db = await connectDB()

    return db.collection("inscricao")
             .find({ 
                alunoId: new ObjectId(userId), 
                cursoId: new ObjectId(cursoId) 
             })
             .toArray()
}

export async function allCursosDB() {
    const db = await connectDB()

    return db.collection("cursos")
        .find({}, { projection: { _id: 0 } })
        .toArray()
}

export async function desvincularCursoDb(inscId) {
    const db = await connectDB()

    return db.collection("inscricao").deleteOne({_id: new ObjectId(inscId)})
}

export async function editarCursoDB(dados) {
  const db = await connectDB()
  const cursoId = dados.cursoId

  let data = {
    titulo: dados.titulo,
    desc: dados.desc,
    materia: dados.materia,
    tutor: dados.tutor,
    capa: dados.capa,
    preco: dados.preco,
    carga_horaria: dados.carga_horaria
  }

  return db.collection("cursos").updateOne(
    { _id: new ObjectId(cursoId) }, // filtro pelo _id
    { $set: data }                  // atualiza os campos diretamente
  )
}

