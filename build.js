const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Caminho para o arquivo JS onde a chave da API será substituída
const apiFilePath = path.resolve(__dirname, 'api.js');
const encoding = 'utf8';

// Diretório de saída
const outputDir = path.resolve(__dirname, 'public'); // Altere 'dist' para o nome desejado

// Certifique-se de que o diretório de saída exista, se não existir, crie-o
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Função para copiar um arquivo para o diretório de saída
function copyFileToOutputDir(filename) {
  fs.copyFileSync(path.resolve(__dirname, filename), path.resolve(outputDir, filename));
}

// Leia o conteúdo do arquivo API
fs.readFile(apiFilePath, encoding, (err, data) => {
  if (err) {
    console.error(`Erro ao ler o arquivo ${apiFilePath}:`, err);
    process.exit(1);
  }

  // Substituir o placeholder pela variável de ambiente
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('A variável de ambiente API_KEY não está definida');
    process.exit(1);
  }
  const apiResult = data.replace(/__API_KEY__/g, apiKey);

  // Escreva o arquivo atualizado no diretório de saída
  fs.writeFile(path.join(outputDir, 'api.js'), apiResult, encoding, (err) => {
    if (err) {
      console.error(`Erro ao escrever o arquivo ${apiFilePath}:`, err);
      process.exit(1);
    }
    console.log(`Arquivo ${apiFilePath} atualizado com a nova chave da API e movido para ${outputDir}.`);
  });
});

// Copie os outros arquivos necessários para o diretório de saída
const filesToCopy = ['index.html', 'script.js', 'style.css', 'api.js']; // Adicione outros arquivos conforme necessário
filesToCopy.forEach(filename => {
  copyFileToOutputDir(filename);
});

console.log('Concluído o processo de construção.');
