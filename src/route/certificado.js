import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { buscarDadosCertificado, certificadoDb } from "../services/certificado.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  try {
    const dados = {
      userId: req.userId,
      cursoId: req.body.cursoId,
    };

    await certificadoDb(dados);
    const cert = await buscarDadosCertificado(dados.userId, dados.cursoId);

   // const pdfPath = path.resolve(__dirname, "../../../certificado.pdf");
    //https://newworldcertificado.netlify.app/certificado.pdf
  //  const pdfBaseBytes = fs.readFileSync(pdfPath);
    const response = await fetch("https://newworldcertificado.netlify.app/certificado.pdf"); 
    const pdfBaseBytes = await response.arrayBuffer();

    const finalPdfBytes = await gerarCertificado({
      pdfBaseBytes,
      nomeAluno: cert.nomeAluno,
      nomeCurso: cert.nomeCurso,
      materia: cert.materia,
      tutor: cert.tutor,
      dataInicio: cert.dataInicio,
      dataEmissao: cert.dataEmissao,
      certificadoId: cert.certificadoId,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=certificado.pdf");
    res.send(Buffer.from(finalPdfBytes));

  } catch (err) {
    console.error("❌ ERRO:", err);
    res.status(500).send(err.message);
  }
}

async function gerarCertificado({
  pdfBaseBytes,
  nomeAluno,
  nomeCurso,
  materia,
  tutor,
  dataInicio,
  dataEmissao,
  certificadoId,
}) {
  const pdfDoc = await PDFDocument.load(pdfBaseBytes);
  const page = pdfDoc.getPages()[0];

  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

  /* =====================================================
     FUNÇÃO CENTRALIZADA COM QUEBRA DE LINHA
  ===================================================== */
  function drawCenteredText(text, y, size, font) {
    if (!text) return;

    const maxWidth = width - 140; // margem lateral
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    const lineHeight = size + 6;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth && i > 0) {
        const lineWidth = font.widthOfTextAtSize(line, size);
        page.drawText(line, {
          x: (width - lineWidth) / 2,
          y: currentY,
          size,
          font,
          color: rgb(0, 0, 0),
        });

        line = words[i] + " ";
        currentY -= lineHeight;
      } else {
        line = testLine;
      }
    }

    const lastWidth = font.widthOfTextAtSize(line, size);
    page.drawText(line, {
      x: (width - lastWidth) / 2,
      y: currentY,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }

  /* =========================
     NOME DO ALUNO
  ========================== */
  page.drawText(nomeAluno.toUpperCase(), {
    x: 70 * 8,
    y: 60,
    size: 10,
    font: fontNormal,
    color: rgb(0, 0, 0),
  });

  /* =========================
     NOME DO CURSO
  ========================== */
  drawCenteredText(
    nomeCurso,
    height / 2 - 20,
    24,
    fontBold
  );

  /* =========================
     MATÉRIA (COM QUEBRA)
  ========================== */
  drawCenteredText(
    materia,
    height / 2 - 50,
    19,
    fontNormal
  );

  /* =========================
     DATAS
  ========================== */
  page.drawText(`Início: ${dataInicio}`, {
    x: 60,
    y: 95,
    size: 12,
    font: fontNormal,
    color: rgb(0, 0, 0),
  });

  const emissaoText = `Emissão: ${dataEmissao}`;
  const emissaoWidth = fontNormal.widthOfTextAtSize(emissaoText, 12);

  page.drawText(emissaoText, {
    x: width - emissaoWidth - 60,
    y: 95,
    size: 12,
    font: fontNormal,
    color: rgb(0, 0, 0),
  });

  /* =========================
     TUTOR / ORGANIZADOR
  ========================== */
  drawCenteredText(
    tutor?.toUpperCase(),
    60,
    11,
    fontNormal
  );

  page.drawText(`ORGANIZADO POR: MARCELO REIS`, {
    x: 60,
    y: 60,
    size: 10,
    font: fontNormal,
    color: rgb(0, 0, 0),
  });

  /* =========================
     ID
  ========================== */
  page.drawText(`ID: ${certificadoId}`, {
    x: 60,
    y: 20,
    size: 9,
    font: fontNormal,
    color: rgb(0.4, 0.4, 0.4),
  });

  return await pdfDoc.save();
}
