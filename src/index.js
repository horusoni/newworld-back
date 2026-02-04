import express from "express";
import cors from "cors";
import { whoami, login, logout, loginAdmin } from "./route/login.js";

import { meusCursos, aulas, allCursos, editarCurso } from "./route/cursos.js";
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
    desvincularCurso,
    atualizarAluno
  } from "./route/admin.curso.js";
import handler from "./route/certificado.js";
import { financeiro } from "./route/admin.financeiro.js";


const app = express();
const PORT = 4444;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://newworldcursos.vercel.app",
  "http://192.168.100.12:5500",
  "https://ead.newworldcursos.com.br"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, SSR, etc

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));


app.get("/all-cursos", allCursos)
app.get("/financeiro", authAdmin, financeiro)

app.get('/teste',(req,res)=> res.send({ok:"true"}))

app.post("/login", (login));
app.post("/login-admin", loginAdmin)
app.post("/logout",logout)

app.post("/meus-cursos" ,auth, meusCursos);
app.post("/whoami", auth , whoami);

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



app.post("/editar-curso", editarCurso)

app.post("/edit-user",atualizarAluno)



app.post("/whoami-admin", authAdmin, (req, res) => {
  res.json({
    authenticated: true,
    userId: req.userId
  });
});






app.listen(PORT,()=>{
    console.log("[+]SERVER ON");

})
