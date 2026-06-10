# 🌐 Production Validation Guide

Depois que o código for para `main`, siga este guia para validar o deploy em produção.

## 📊 Monitorar GitHub Actions

### Passo 1: Ver Workflows em Execução

1. Vá para seu repositório no GitHub
2. Clique em **Actions**
3. Veja os workflows em execução:
   - ✅ "Deploy Frontend to Vercel" 
   - ✅ "Continuous Integration & Deployment - Backend"
   - ✅ "Test Telegram Integration" (se modificou telegram.py)

### Passo 2: Verificar Logs

Para cada workflow:
1. Clique no workflow
2. Veja os jobs (test, deploy)
3. Clique em cada job para ver os logs
4. Procure por ✅ ou ❌

**Jobs esperados:**
- ✅ `test` job deve passar antes de deploy
- ✅ `deploy` job depende do `test` job
- ✅ Notificações Telegram devem ser enviadas

---

## 📱 Notificações Telegram

Você receberá notificações no Telegram sobre:

### ✅ Sucesso
- "✅ Backend tests passed! Ready to deploy."
- "✅ Frontend tests passed! Ready to deploy."
- "🚀 Backend deployment started"
- "✅ Backend deployed successfully!"
- "🎨 Frontend deployed successfully! 🌐 https://melissalevi.me"

### ❌ Falha
- "❌ Backend tests failed! Check GitHub Actions."
- "❌ Frontend build failed! Check GitHub Actions."
- "❌ Backend deployment failed!"
- "❌ Frontend deployment failed"

---

## 🔍 Validação Manual em Produção

### 1. Frontend - Acesse o site

```bash
# Abra em seu browser
https://melissalevi.me
```

Verifique:
- [ ] Site carrega (sem erros 404)
- [ ] Navbar está visível
- [ ] Footer está visível
- [ ] Todas as páginas carregam:
  - [ ] Home
  - [ ] When & Where
  - [ ] RSVP
- [ ] Não há erros no Console (F12 → Console)
- [ ] Imagens carregam corretamente
- [ ] CSS está sendo aplicado
- [ ] Layout responsivo (teste em mobile)

### 2. RSVP API - Teste o formulário

1. Vá para página de RSVP: https://melissalevi.me/rsvp
2. Preencha o formulário:
   ```
   Nome: Test Deploy
   Email: test@example.com
   Presença: Sim
   ```
3. Clique em "Enviar"
4. Verifique:
   - [ ] Formulário foi submetido (sem erro)
   - [ ] Página mostra "Obrigado!" ou similar
   - [ ] Notificação chegou no Telegram ✅

**Notificação esperada no Telegram:**
```
💌 Novo RSVP!
👤 Nome: Test Deploy
✉️ Email: test@example.com
🎉 Comparece: ✅ Sim
```

### 3. Verificar Performance

Abra DevTools (F12):

**Network Tab:**
- [ ] Tempo de carregamento < 3s
- [ ] Imagens carregam
- [ ] JS e CSS carregam corretamente
- [ ] API calls para backend são bem-sucedidas

**Console Tab:**
- [ ] Sem erros vermelhos
- [ ] Sem warnings críticos
- [ ] Sem CORS errors

**Lighthouse (Chrome):**
1. F12 → Lighthouse
2. Clique em "Analyze page load"
3. Verifique scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

### 4. Verificar HTTPS/Segurança

- [ ] URL começa com `https://` (não http)
- [ ] Cadeado verde no navegador
- [ ] Certificate válido

### 5. Teste em Diferentes Browsers

- [ ] Chrome
- [ ] Firefox
- [ ] Safari (se possível)
- [ ] Edge

### 6. Teste Mobile

Use Developer Tools (F12) para simular:
- [ ] iPhone 12/13
- [ ] Android (Galaxy S21)
- [ ] iPad
- [ ] Tablet grande

---

## 🔄 Verify Environment Variables

### Backend (Render)

Verifique que as variáveis foram propagadas:

1. Render Dashboard → Project
2. Settings → Environment
3. Confirme:
   - [ ] `TELEGRAM_BOT_TOKEN` = `8868771795:...`
   - [ ] `TELEGRAM_CHAT_ID` = `6644256527`
   - [ ] `SUPABASE_URL` = `https://coopmbirr...`
   - [ ] `SUPABASE_ANON_KEY` = `eyJhbGci...`
   - [ ] `FRONTEND_URL` = `https://melissalevi.me`

### Frontend (Vercel)

Verifique que as variáveis foram propagadas:

1. Vercel Dashboard → Project
2. Settings → Environment Variables
3. Confirme todas as variáveis listadas

---

## 📈 Monitorar Logs em Produção

### Vercel Logs (Frontend)

1. Vercel Dashboard → Project
2. Deployments → Latest Deployment
3. Veja logs (clique em "Logs" ou "Runtime Logs")
4. Procure por erros ou warnings

### Render Logs (Backend)

1. Render Dashboard → Project
2. Logs → Recent Logs
3. Procure por erros (linhas vermelhas)
4. Procure por notificações de startup

---

## ⚠️ Troubleshooting - Problemas Comuns

### Problema: Site não carrega
**Causa provável:** Frontend deploy falhou  
**Solução:**
1. Verifique GitHub Actions logs
2. Verifique Vercel deployment logs
3. Tente `npm run build` localmente

### Problema: RSVP falha ao enviar
**Causa provável:** Backend não está respondendo  
**Solução:**
1. Verifique se Render está healthy
2. Verifique Render logs
3. Confirme que backend foi deployado
4. Teste API com curl:
   ```bash
   curl -X GET https://api.render.com/health
   ```

### Problema: Telegram não recebe notificações
**Causa provável:** Bot token inválido ou chat ID errado  
**Solução:**
1. Teste localmente: `python backend/test_telegram.py`
2. Verifique secrets no GitHub
3. Confirme TELEGRAM_BOT_TOKEN em Vercel/Render

### Problema: CSS/Images não carregam
**Causa provável:** Caminho incorreto ou cors issue  
**Solução:**
1. Verifique console (F12)
2. Veja Network tab para erro 404
3. Confirme que assets foram built corretamente

---

## ✅ Checklist Final

Depois de fazer push e validar, marque:

- [ ] GitHub Actions executou com sucesso
- [ ] Todos os testes passaram
- [ ] Deploy completou sem erros
- [ ] Notificações chegaram no Telegram
- [ ] Site carrega em produção
- [ ] RSVP funciona end-to-end
- [ ] Telegram recebe notificação de RSVP
- [ ] Performance está aceitável
- [ ] Nenhum erro no Console
- [ ] Funciona em mobile

---

## 🎉 Sucesso!

Se todos os checkboxes acima estão marcados, seu deploy foi **100% bem-sucedido!**

Próximos passos:
1. Monitore por erros nos próximos dias
2. Testar adicionar RSVPs reais
3. Monitorar traffic e performance
4. Fazer updates/bugfixes conforme necessário

---

**Status:** 🟢 Pronto para validação em produção
