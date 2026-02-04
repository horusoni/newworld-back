import { receitaDB } from "../services/financeiro.model.js"

export async function financeiro(req,res) {
    let data = await receitaDB()

    res.json(data)

}