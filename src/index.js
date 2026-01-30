import express from "express";
import cors from "cors";
import { whoami, login, logout, loginAdmin } from "./route/login.js";

import { meusCursos, aulas, allCursos } from "./route/cursos.js";
import { auth, authAdmin } from "./route/middleware.js";
import cookieParser from "cookie-parser";
import { 
    cadastrarCurso,
    cursosAdmin,
    deletarCurso,
    cadastrarAula,
    aulaAdmin,
    deleteAula,
    buscarAlunosAdm,
    cadastrarAluno,
    deletarAluno,
    meusCursosAdm,
    inserirVinculo,
    desvincularCurso
  } from "./route/admin.curso.js";
import handler from "./route/certificado.js";


const app = express();
const PORT = 4444;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://fundamentals-production-publishing-jets.trycloudflare.com/", // 🔴 origem EXATA do front
  credentials: true               // 🔴 obrigatório para cookies
}));

app.get("/all-cursos", allCursos)

app.post("/meus-cursos" ,auth, meusCursos);
app.post("/whoami", auth , whoami);
app.post("/login", (login));
app.post("/aulas", auth, aulas);
app.post("/certificado", auth, handler)


app.post("/admin-curso", authAdmin, cursosAdmin);
app.post("/cadastrar-curso", authAdmin, cadastrarCurso);
app.post("/delete-curso",authAdmin, deletarCurso);

app.post("/cadastrar-aula",authAdmin, cadastrarAula)
app.post("/admin-aulas",authAdmin, aulaAdmin)

app.post("/delete-aula",authAdmin, deleteAula)
app.post("/buscar-alunos-adm", authAdmin,buscarAlunosAdm)

app.post("/cadastrar-aluno",authAdmin, cadastrarAluno)

app.post("/deletar-aluno",authAdmin, deletarAluno)

app.post("/cursos-do-aluno",authAdmin, meusCursosAdm)

app.post("/vincular-curso",authAdmin, inserirVinculo)
app.post("/desvincular-curso",authAdmin, desvincularCurso)

app.post("/login-admin", loginAdmin)


app.get('/teste',(req,res)=> res.send({ok:"true"}))

app.post("/whoami-admin", authAdmin, (req, res) => {
  res.json({
    authenticated: true,
    userId: req.userId
  });
});


app.post("/logout",logout)



app.listen(PORT,()=>{
    console.log("[+]SERVER ON");

})
