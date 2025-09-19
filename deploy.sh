#!/bin/bash

# Script de Deploy Automático - Game List Mobile
echo "🚀 Iniciando deploy do Game List Mobile..."

# Verificar se está no diretório correto
if [ ! -f "README.md" ]; then
    echo "❌ Execute este script na pasta raiz do projeto"
    exit 1
fi

# 1. Fazer commit das mudanças
echo "📝 Fazendo commit das mudanças..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nenhuma mudança para commitar"

# 2. Push para o repositório
echo "📤 Enviando para o repositório..."
git push origin main || git push origin master

echo "✅ Deploy concluído!"
echo "🌐 Acesse o Railway para ver o deploy em andamento"
echo "📱 Use o EAS Build para gerar o APK do frontend"
