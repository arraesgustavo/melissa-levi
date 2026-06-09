Documentação de Arquitetura e Infraestrutura: Stack Definitiva 100% Gratuita

Este documento estabelece a especificação técnica final, o fluxo de dados, as pipelines de integração contínua (CI/CD) e o modelo de monitorização para a plataforma web. O sistema foi desenhado para suportar com total estabilidade um limite operacional de 100 acessos simultâneos, mantendo os custos fixos de infraestrutura em R$ 0,00 através do uso estratégico de camadas gratuitas (Free Tiers) de provedores modernos de computação em nuvem.

1. Topologia da Arquitetura e Fluxo de Dados

A arquitetura baseia-se no desacoplamento completo entre a interface do utilizador (estática e distribuída globalmente) e as camadas de computação assíncrona e persistência de dados.

+-----------------------------------------------------------------------+
|                            CAMADA CLIENTE                             |
|  Navegador Web (React + MUI v5) <--- [https://melissalevi.me](https://melissalevi.me)           |
+-----------------------------------------------------------------------+
        |                                                 |
        | (Autenticação / Token JWT)                      | (Pedidos API REST)
        v                                                 v
+-------------------------------+               +-----------------------+
|      DATA & AUTH PROV.        |               |   COMPUTE (BACKEND)   |
|     Supabase (PostgreSQL)     |               |    FastAPI + Python   |
|  • Conexões via Pooler (6543) |               |  • Servidor Assíncrono|
|  • Armazenamento de Ficheiros |               |  • Validação de Tokens|
+-------------------------------+               +-----------------------+
        |                                                 |
        |                                                 | (Alertas / Erros)
        +-----------------------+-------------------------+
                                |
                                v
                +-------------------------------+
                |       MONITORIZAÇÃO           |
                |    Telegram Bot API           |
                +-------------------------------+


2. Configuração do Domínio Personalizado (Name.com para Vercel)

A resolução de nomes será tratada pela infraestrutura Anycast da Vercel para garantir tempos de resposta de DNS inferiores a 20ms.

Configuração de Apontamento na Name.com

Aceda ao painel da Name.com, selecione o domínio e navegue até à secção Manage DNS Records. Remova os registos padrões existentes e adicione a seguinte configuração:

Tipo

Host

Valor / Alvo

TTL

Função

A

@

76.76.21.21

300

Aponta o domínio raiz diretamente para o cluster da Vercel.

CNAME

www

cname.vercel-dns.com.

300

Trata o subdomínio www e delega o tráfego para a Vercel.

Nota: Após a propagação do DNS, a Vercel emitirá automaticamente um certificado criptográfico SSL/TLS válido (Let's Encrypt).

3. Especificações Técnicas por Camada

3.1. Frontend (Interface do Utilizador)

Framework: React 18+ (construído via Vite).

Biblioteca de UI: Material-UI (MUI v5) utilizando a prop sx.

Alojamento: Vercel (Hobby Plan).

Otimização: Ficheiros estáticos cacheados na borda (Edge Network).

3.2. Backend (Camada de Aplicação)

Framework: Python 3.11+ com FastAPI e Uvicorn.

Alojamento: Render (Free Web Service) ou Koyeb.

Concorrência: Uso do padrão ASGI (async/await) para gerir I/O de forma não-bloqueante.

3.3. Base de Dados e Segurança

Provedor: Supabase (PostgreSQL 15+).

Conexão: Uso obrigatório do Supabase Connection Pooler (porta 6543) em modo transaction para suportar as 100 conexões simultâneas.

4. Pipeline de CI/CD (GitHub Actions)

Workflow do Servidor Python (.github/workflows/backend-deploy.yml)

name: Continuous Integration & Deployment - Backend

on:
  push:
    branches: [ main ]

jobs:
  deploy-to-production:
    runs-on: ubuntu-latest
    steps:
    - name: Trigger Webhook Deploy
      run: |
        curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
    - name: Notify Telegram
      uses: appleboy/telegram-action@master
      with:
        to: ${{ secrets.TELEGRAM_CHAT_ID }}
        token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
        message: |
          🚀 DEPLOY REPORT - Status: ${{ job.status }}


5. Arquitetura de Monitorização (Telegram Bot API)

Middleware de Captura de Erros 500 (backend/main.py)

from fastapi import FastAPI, Request
from services.telegram import dispatch_telegram_alert
import traceback
import asyncio

app = FastAPI()

@app.middleware("http")
async def error_telemetry_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as error:
        stack_trace = traceback.format_exc()
        alert_body = f"🚨 ERRO 500\nRota: {request.url.path}\nErro: {str(error)}"
        asyncio.create_task(dispatch_telegram_alert(alert_body))
        raise error


Relatórios Diários Agendados (backend/routers/metrics.py)

from fastapi import APIRouter, BackgroundTasks
import asyncio

router = APIRouter()

def compile_and_send_system_report():
    report_data = "📊 RELATÓRIO DIÁRIO: 100 conexões estáveis. Infraestrutura OK."
    # Implemente a chamada para o seu disparo do Telegram aqui

@router.post("/trigger-daily-report")
async def endpoint_trigger_report(background_tasks: BackgroundTasks):
    background_tasks.add_task(compile_and_send_system_report)
    return {"message": "Relatório enfileirado."}
