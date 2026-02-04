import { connectDB } from "../db/connect.js"
import { ObjectId } from "mongodb"
import { cifrar } from "./cipher.model.js"
const uid = "65a6f9a1c2d4e8b9f0017777" 

export async function listarAluno(filter) {
    const db = await connectDB()
    return db.collection("aluno").find(filter).toArray()
}

export async function listarAlunoAdmin(filter,project) {
    const db = await connectDB()
    return db.collection("aluno").find(filter).filter(project).toArray()
}



// dados que vem do front

/*let hash = cifrar("123")


let aluno = {
    nome:"Gilberto002 costa",
    email:"cipherfound@gmail.com",
    hash:hash,
    valor_pago:197.00
}*/

//inserirAluno(aluno)
//funcao dedicada ao admin ou automacao para cadastrar o aluno
export async function inserirAluno(dados) {
    const db = await connectDB()
    let hash = cifrar(dados.senha)

    let emailExistente = await db.collection("aluno")
        .find({ email: dados.email })
        .project({ email: 1, _id: 0 })
        .toArray()  

    if (emailExistente.length > 0) {
        return { msg: "Email já existente." }
    }

    
    let aluno = {
        nome: dados.nome,
        email: dados.email,
        hash: hash,
        createdAt: new Date()
    }
    // console.log("cadastradasso")
    return db.collection("aluno").insertOne(aluno)
}
export async function deletarAlunoDb(alunoId) {
    const db = await connectDB()
    
    return db.collection("aluno").deleteOne({_id: new ObjectId(alunoId)})

    
}

//let admin = await admDb()
//console.log(admin)

export async function admDb(){
    const db = await connectDB()

    try{
        return db.collection("admin").find().toArray()
    }
    catch(err){
        console.log(err)
    }
}


let adminData = {
    nome:"Gilberto",
    email:"g7junio@gmail.com",
    senha:"redbackx",
}

//cadastrarAdmin(adminData)

async function cadastrarAdmin(data) {
    const db = await connectDB()
    

    try{
        let hash = cifrar(data.senha)
        return db.collection("admin").insertOne({
            nome:data.nome,
            email:data.email,
            hash:hash,
            data: new Date(),

        })
        
    }
    catch(err){
        console.log(err)
    }
}


export async function editarAlunoDB(dados) {
  const db = await connectDB()
  const userId = dados.userId
  let hash = cifrar(dados.senha)

  let data = {
    nome: dados.nome,
    email: dados.email,
    hash: hash,
  }

  return db.collection("aluno").updateOne(
    { _id: new ObjectId(userId) }, // filtro pelo _id
    { $set: data }                  // atualiza os campos diretamente
  )
}