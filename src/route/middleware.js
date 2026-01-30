import jwt from "jsonwebtoken";

/**
 * Middleware de autenticação do aluno (USER)
 */
export function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // injeta no request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

/**
 * Middleware de autenticação do ADMIN
 */
export function authAdmin(req, res, next) {
  const token = req.cookies.tokenAdmin; // ✅ cookie correto

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.adminId = decoded.adminId; // injeta no request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
