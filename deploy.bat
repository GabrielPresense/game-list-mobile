@echo off
echo 🚀 Iniciando deploy do Game List Mobile...

REM Verificar se está no diretório correto
if not exist "README.md" (
    echo ❌ Execute este script na pasta raiz do projeto
    pause
    exit /b 1
)

REM 1. Fazer commit das mudanças
echo 📝 Fazendo commit das mudanças...
git add .
git commit -m "Deploy: %date% %time%" || echo Nenhuma mudança para commitar

REM 2. Push para o repositório
echo 📤 Enviando para o repositório...
git push origin main || git push origin master

echo ✅ Deploy concluído!
echo 🌐 Acesse o Railway para ver o deploy em andamento
echo 📱 Use o EAS Build para gerar o APK do frontend
pause
