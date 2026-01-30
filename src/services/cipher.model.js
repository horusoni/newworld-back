
import crypto from "crypto"

export function cifrar(pass){
    const hash = crypto.createHash("sha256").update(pass).digest("hex");
    return hash;
    
}

