// CasaClara — testes funcionais de fumo (smoke tests)
// Corre a app num Chromium real e valida os fluxos principais.
// Uso local:  BASE_URL=http://localhost:8123 node tests/smoke.test.mjs
// (com um servidor estático na pasta do projeto, ex.: python3 -m http.server 8123)

import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8123';
const results = [];
const ok = (name, pass) => { results.push({ name, pass }); console.log(`${pass ? '✅' : '❌'} ${name}`); };

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type === 'error') pageErrors.push('console: ' + m.text); });

try {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Onboarding
  ok('Onboarding visível', await page.isVisible('#onboarding'));
  await page.click('#onboarding .btn-primary');
  await page.waitForTimeout(300);
  ok('App visível após onboarding', await page.isVisible('#app'));
  ok('Onboarding escondido', !(await page.isVisible('#onboarding')));

  // 2. Dashboard
  ok('4 vitórias rápidas renderizadas', (await page.locator('.qw-card').count()) === 4);
  ok('Zona da semana renderizada', await page.isVisible('#zoneTodayCard .zone-badge'));

  // 3. Adicionar tarefa + tentativa de XSS
  await page.locator(".nav-btn[data-view='tasks']:visible").first().click();
  await page.waitForTimeout(300);
  await page.fill('#newTaskName', '<img src=x onerror="window.__xss=1">Tarefa teste');
  await page.click('#addTaskForm button[type="submit"], #addTaskForm .btn-primary');
  await page.waitForTimeout(300);
  ok('Tarefa adicionada', (await page.innerText('#taskList')).includes('Tarefa teste'));
  ok('XSS bloqueado (sem execução)', !(await page.evaluate('window.__xss === 1')));
  ok('XSS bloqueado (HTML escapado)', (await page.innerHTML('#taskList')).includes('&lt;img'));

  // 4. Concluir tarefa (regressão do bug dateKey)
  await page.locator('.task-item .task-check').first().click();
  await page.waitForTimeout(300);
  ok('Concluir tarefa funciona', (await page.locator('.task-item.done').count()) >= 1);

  // 5. Modo escuro
  const temaAntes = await page.getAttribute('html', 'data-theme');
  await page.evaluate('toggleTheme()');
  await page.waitForTimeout(200);
  const temaDepois = await page.getAttribute('html', 'data-theme');
  ok('Modo escuro alterna', temaAntes !== temaDepois);
  ok('Tema persistido', (await page.evaluate("localStorage.getItem('casaclara_theme')")) !== null);

  // 6. Modo cheer up
  await page.evaluate("switchView('cheer')");
  await page.waitForTimeout(200);
  ok('Cheer up: 6 itens de autocuidado', (await page.locator('.care-item').count()) === 6);
  await page.locator('.care-item').first().click();
  await page.waitForTimeout(200);
  ok('Cheer up: toggle de item', (await page.locator('.care-item.done').count()) === 1);

  // 7. Persistência após reload
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.locator(".nav-btn[data-view='tasks']:visible").first().click();
  await page.waitForTimeout(200);
  ok('Onboarding não volta após reload', !(await page.isVisible('#onboarding')));
  ok('Tarefas persistem após reload', (await page.innerText('#taskList')).includes('Tarefa teste'));
  ok('Tema persiste após reload', (await page.getAttribute('html', 'data-theme')) === temaDepois);

  // 8. Data local (regressão do bug UTC)
  const hojeLocal = await page.evaluate('todayKey()');
  const agora = new Date();
  const esperado = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
  ok('todayKey usa data local (não UTC)', hojeLocal === esperado);

  // 9. dateKey definida (regressão do bug crítico)
  ok('dateKey definida', await page.evaluate("typeof dateKey === 'function'"));

  // 10. Zero erros JS
  ok('Sem erros JavaScript', pageErrors.length === 0);
} catch (e) {
  console.error('💥 Falha durante os testes:', e.message);
  results.push({ name: 'execução completa', pass: false });
} finally {
  await browser.close();
}

const falhas = results.filter(r => !r.pass);
console.log(`\n${results.length - falhas.length}/${results.length} testes passaram`);
if (pageErrors.length) console.error('Erros de página:', pageErrors);
process.exit(falhas.length ? 1 : 0);
