# Resumo Executivo — Bug ativo no RSVP (melissalevi.page)

## Objetivo
Formulário de RSVP em `https://melissalevi.page/rsvp` deve: salvar no Supabase (tabela `rsvps`) e disparar notificação no Telegram com todos os campos.

## Status: 3 bugs de produção já corrigidos e confirmados. 1 bug ativo, ainda não diagnosticado.

---

## ✅ Já corrigido e confirmado (não mexer de novo sem motivo)

1. **`VITE_API_URL` ausente no Vercel** → frontend em prod fazia `fetch('/api/rsvp')` relativo, caía no rewrite de SPA da Vercel (retornava `index.html` com HTTP 200), e a tela mostrava "Obrigado" mesmo sem salvar nada.
   - Corrigido: env var `VITE_API_URL=https://melissa-levi-backend.onrender.com` adicionada no Vercel (Production).
   - Também corrigido em código: `frontend/src/pages/RSVP.jsx` agora valida `data?.status === 'ok'` do JSON de resposta, não só `response.ok` (linha ~140), pra não repetir esse falso-positivo no futuro.

2. **`SUPABASE_URL`/`SUPABASE_ANON_KEY` ausentes no Render** → backend em prod retornava `500 {"detail":"supabase_url is required"}` em qualquer POST `/api/rsvp`.
   - Corrigido: variáveis adicionadas no dashboard do Render (serviço `melissa-levi-backend`).

3. **CORS/domínio errado** → `FRONTEND_URL` no Render estava `https://melissalevi.me`, mas o domínio real (o único configurado no projeto Vercel, confirmado via `vercel domains ls`) é `https://melissalevi.page`. `melissalevi.me` **não resolve em DNS, não existe de fato**. Isso causava `Disallowed CORS origin` pra qualquer requisição vinda do site real.
   - Corrigido: `FRONTEND_URL` atualizado no Render dashboard para `https://melissalevi.page`. Arquivo `backend/render.yaml` também atualizado (mas ele só é lido em provisionamento inicial via Blueprint — quem manda no serviço já rodando é o valor manual no dashboard).

4. **Bônus, `.github/workflows/frontend-deploy.yml` quebrado**: a action `amondnet/vercel-action@v25` instala `vercel@25.1.0`, versão travada e antiga demais — a API da Vercel agora exige CLI ≥47.2.2, então o deploy via GitHub Actions falhava (`Error! Your Vercel CLI version is outdated`). Também tinha erro de path resolution (`vercel.json should be inside of the provided root directory`) por causa da configuração remota "Root Directory = frontend" no projeto Vercel.
   - Corrigido: workflow reescrito pra usar `vercel pull` → `vercel build` → `vercel deploy --prebuilt`, com CLI instalado via `npm install --global vercel@latest`, rodando a partir da raiz do repo (não de `./frontend`) pra resolver o Root Directory certo.

**Confirmação end-to-end via curl direto na API de produção (bypassando o navegador):**
```bash
curl -X POST https://melissa-levi-backend.onrender.com/api/rsvp \
  -H "Content-Type: application/json" -H "Origin: https://melissalevi.page" \
  -d '{"name":"...","email":"...","attending":"yes","guests":1,"meal":"Teste"}'
# → HTTP 201 {"status":"ok"}, linha aparece em GET /api/rsvps
```
CORS preflight (`OPTIONS` com `Origin: https://melissalevi.page`) também retorna 200 com `access-control-allow-origin: https://melissalevi.page` correto.

Todos esses 4 fixes já estão **commitados e no `main`** (commits `b51e608`, `5e86a15`, `309072c`). `git status` limpo.

---

## 🔴 Bug ativo, ainda não resolvido

**Sintoma relatado pelo usuário**: acessando `https://melissalevi.page/rsvp` no navegador de verdade, preenchendo o formulário manualmente e clicando em "Enviar Confirmação" — **não funciona**. Não aparece a tela de "Obrigado". Sem mais detalhes ainda (não sabemos se dá erro visível, trava no loading, ou nada acontece).

**Por que isso é estranho**: o backend funciona perfeitamente via curl direto (ver acima), incluindo com o header `Origin: https://melissalevi.page` simulando o navegador. O bundle JS publicado (`index-Dt2oLvTD.js` no momento da última checagem) contém a string `melissa-levi-backend.onrender.com`, confirmando que o `VITE_API_URL` está corretamente embutido no build atual. Ou seja: a chamada de API isolada funciona, mas o fluxo real do navegador não. O bug provavelmente está em algo client-side que o curl não reproduz.

**Hipóteses a investigar (nenhuma confirmada ainda):**
1. Erro de JS no console do navegador antes mesmo do fetch ser disparado (ex: algo quebrando no `validate()` ou em algum handler).
2. Cache do navegador do usuário servindo um bundle antigo (menos provável — pedimos hard refresh, mas não confirmado se foi feito).
3. Algum campo do formulário não está setando o state corretamente (MUI `Select` controlado, campo "Preferência de Prato" é obrigatório quando `attending === 'yes'` — ver `validate()` em `frontend/src/pages/RSVP.jsx` linha ~99-108) e a validação client-side está bloqueando o submit silenciosamente sem o usuário perceber o motivo.
4. Extensão de navegador, adblocker, ou alguma política de rede do lado do usuário bloqueando a chamada pro domínio `onrender.com`.

**O que NÃO foi possível fazer ainda**: reproduzir isso via automação de navegador. Tentamos usar a skill/tool `claude-in-chrome`, mas as ferramentas MCP correspondentes não carregaram nesta sessão (ToolSearch não encontrou nenhuma ferramenta `mcp__claude-in-chrome__*` mesmo após o usuário confirmar que a extensão estava conectada do lado dele). Ficou pendente pedir pro usuário abrir o DevTools (F12 → Console + Network) manualmente, preencher e enviar o formulário, e reportar:
   - erros no Console (em vermelho)
   - se aparece uma requisição pra `/api/rsvp` na aba Network, e qual o status/response dela
   - se **nenhuma** requisição aparece, o problema é 100% client-side antes do fetch (provavelmente validação ou erro de JS)

**Próximo passo recomendado**: conseguir essa informação do DevTools (do usuário ou via automação de navegador funcional) antes de tentar qualquer fix — sem saber se o fetch é sequer disparado, qualquer correção seria chute.

---

## Arquivos relevantes
- `frontend/src/pages/RSVP.jsx` — formulário, `validate()` (~linha 99), `submit()` (~linha 111-155)
- `backend/routers/rsvp.py` — endpoint `POST /api/rsvp`
- `backend/main.py` — CORS middleware
- Credenciais reais em `backend/.env` (não commitado, mas **`AGORA_FAÇA_ISTO.md` está commitado no git com o token do Telegram em texto puro — isso é uma exposição de secret real em repo público, ainda não resolvida, recomendo rotacionar o token e sanitizar/remover esse arquivo**)

## Regras do projeto
- Branch local `master`, remoto `main`: `git push origin master:main`
- Domínio de produção real é `https://melissalevi.page` (não `.me` — esse não existe/não resolve)
- Backend: Render, serviço `melissa-levi-backend` (URL real, não é `melissa-levi-api` como o nome sugeriria)
- Frontend: Vercel, projeto `melissa-levi`, Root Directory = `frontend`
- Nunca commitar `.env`, `.env.vercel`, ou tokens em texto puro
