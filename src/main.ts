// main.ts
import app from "./app";
// import https from 'https';
// import fs from 'fs';
// import path from 'path';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// const sslOptions = {
//     key: fs.readFileSync(path.join ('certs', 'key.pem')),
//     cert: fs.readFileSync(path.join( 'certs', 'cert.pem'))
// };

// // Certifique-se de que 'app.app' é a instância correta do Express
// https.createServer(sslOptions, app.app.getExpressApp()).listen(3000, () => {
//   console.log('Servidor HTTPS rodando na porta 3000');
// });

app.start(3050);
