const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env (somente para desenvolvimento local)
dotenv.config();

// Caminho para o arquivo JS onde a chave da API será substituída
const filePath = path.resolve(__dirname, 'api.js');
const encoding = 'utf8';

// Leia o conteúdo do arquivo
fs.readFile(filePath, encoding, (err, data) => {
  if (err) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, err);
    process.exit(1);
  }

  // Substituir o placeholder pela variável de ambiente
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('A variável de ambiente API_KEY não está definida');
    process.exit(1);
  }
  const result = data.replace(/__API_KEY__/g, apiKey);

  // Escreva o arquivo novamente com a chave substituída
  fs.writeFile(filePath, result, encoding, (err) => {
    if (err) {
      console.error(`Erro ao escrever o arquivo ${filePath}:`, err);
      process.exit(1);
    }
    console.log(`Arquivo ${filePath} atualizado com a nova chave da API.`);
  });
});
