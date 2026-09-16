# CasaClara ⌂

App web de organização da casa para pessoas com **PHDA (TDAH)** — desenhada com os princípios de uma Senior Organizer e de uma Senior Interior Designer: moderna, simplista, intuitiva e sem culpa.

> Uma casa organizada, uma decisão de cada vez.

## ✨ Funcionalidades

| Ecrã | O que faz |
|---|---|
| **Hoje** | Dashboard diário: zona da semana, 4 vitórias rápidas (≤15 min), "a minha única coisa de hoje", rotinas de manhã/noite, anel de progresso e streak 🔥 |
| **Zonas da Casa** | 7 zonas (Cozinha, Sala, Quarto, Casa de Banho, Escritório, Lavandaria, Entrada) com micro-tarefas; a *zona da semana* roda automaticamente |
| **Tarefas** | Lista global com zonas, duração, filtros (hoje / ≤15 min / concluídas) |
| **Modo Foco** | Pomodoro 15/25/45 min ligado a uma tarefa, com alerta sonoro — "podes parar sem culpa" |
| **Desapego** | Decisões binárias FICA ✓ / DÚVIDA 📦 / SAI ⇢, com a regra da caixa de 90 dias |

## 🧠 Princípios PHDA

- **Vitórias rápidas** — tarefas de 5–15 min para dopamina imediata
- **Uma coisa de cada vez** — uma única prioridade diária em destaque
- **Decisões binárias** — desapego com 3 botões grandes, sem análise paralisante
- **Recompensa imediata** — confetti + toast em cada conclusão
- **Sem culpa** — recomeçar é normal; o app nunca acumula dívidas visuais
- **Estímulo reduzido** — paleta calmante, tipografia grande, alvos de toque generosos

## 🚀 Como usar

É uma app 100% estática — basta servir os ficheiros:

```bash
cd app
python3 -m http.server 8080
# abre http://localhost:8080
```

Ou faz deploy de `/mnt/agents/output/app` em qualquer hosting estático (Netlify, Vercel, GitHub Pages…).

Os dados guardam-se localmente no navegador (`localStorage`, chave `casaclara_v1`). Sem contas, sem servidores, sem tracking.

## 🛠 Técnica

- HTML + CSS + JavaScript puros — zero dependências, zero build step
- Google Fonts (Sora + Inter)
- Responsivo: sidebar em desktop, bottom-nav em mobile
- Emojis como ícones — zero assets de imagem

## 📄 Licença

MIT — vê [LICENSE](LICENSE).
