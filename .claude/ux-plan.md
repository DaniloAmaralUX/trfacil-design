# Plano de UX — Fluxo TR (trfacil-design)

## Contexto

Auditoria completa do fluxo TR (`/dashboard`, `/trs`, `/novo-tr`, `/tr/$trId`, `/aprovacoes` + shell autenticado) com 4 eixos:

1. **Hierarquia & densidade** — reduzir poluição, eliminar duplicação, priorizar leitura.
2. **Acessibilidade (WCAG 2.1 AA)** — contraste, foco, teclado, screen readers, alvos de toque.
3. **Microcopy & estados** — empty/loading/error/success, confirmações reversíveis, labels claros.
4. **Fluxo & navegação** — breadcrumbs, recuperação, autosave, atalhos.

Todas as soluções resolvidas com primitivos do **shadcn/ui** (já instalados) + **shadcn MCP** (acabou de ser configurado, ativa após reiniciar sessão) para puxar blocks/exemplos oficiais.

## Skills disponíveis e mapeamento

| Skill | Função no plano |
|-------|-----------------|
| `design:design-critique` | Auditoria estruturada por tela (hierarquia, consistência, usabilidade) |
| `design:accessibility-review` | Auditoria WCAG AA por tela (contraste, foco, ARIA, teclado) |
| `design:ux-copy` | Revisão de microcopy, empty states, mensagens de erro, CTAs |
| `design:design-system` | Detectar inconsistências e hardcoded values; documentar variantes |
| `design:design-handoff` | Specs para implementação após decisões |
| `web-design-guidelines` (Vercel) | Diretrizes de design web modernas — referência transversal |
| `react-best-practices` (Vercel) | Padrões React/TypeScript aplicáveis à refatoração |
| `shadcn MCP` | Catálogo oficial de componentes, blocks e exemplos |

> Skills `web-design-guidelines` e `react-best-practices` só ficam ativas após reiniciar a sessão do Claude Code (foram instaladas via cópia, ainda não carregadas).

## Heurísticas guia

- **Sempre antes de criar**: consultar o catálogo shadcn (MCP) — provavelmente já existe um block ou primitivo.
- **Densidade**: no máx. 3 níveis de hierarquia visual por tela. Texto > 16ch sem quebra → `truncate` + `Tooltip`.
- **A11y mínimo**: foco visível em qualquer elemento interativo, contraste ≥ 4.5:1 em texto, alvo de toque ≥ 44px, navegação por teclado completa.
- **Estados**: toda lista/grid tem **empty**, **loading** (Skeleton), **error** (Alert destructive) e **success** (Sonner toast).
- **Confirmações destrutivas**: AlertDialog + Sonner com `action: { label: 'Desfazer', onClick: undo }` para reversibilidade.
- **Navegação**: breadcrumb global em todas as telas internas; CTA primário sempre visível (sticky se necessário).

## Tela por tela

### 1. `/dashboard` — `src/features/tr/dashboard/index.tsx`

| # | Issue | Severidade | Solução shadcn | Eixo |
|---|-------|-----------|----------------|------|
| 1.1 | KPIs sem loading state — risco de "flash" de zeros | P1 | `Skeleton` nos `Card` enquanto `isLoading` | Estados |
| 1.2 | Status badges na tabela duplicam o gráfico de status | P2 | Tornar gráfico clicável (filtra a tabela) — usa shadcn `Chart` + `useState` | Hierarquia |
| 1.3 | Coluna "Título" trunca em 320px sem affordance | P1 | `TableCell` com `truncate` + `Tooltip` exibindo título completo | Hierarquia + A11y |
| 1.4 | Sem `aria-label` no gráfico — invisível pra screen reader | P0 | Adicionar `role="img" aria-label` + tabela alternativa sr-only | A11y |
| 1.5 | Hero do dashboard provavelmente repete padrão verboso visto no wizard | P1 | Aplicar padrão "barra fina" já usado no `/novo-tr` | Hierarquia |

**Auditoria**: rodar `design:design-critique` + `design:accessibility-review` neste arquivo.

---

### 2. `/trs` — `src/features/tr/list/index.tsx`

| # | Issue | Severidade | Solução shadcn | Eixo |
|---|-------|-----------|----------------|------|
| 2.1 | Sortable sem indicador visual de direção | P0 | `DataTableColumnHeader` com setinhas `ArrowUp`/`ArrowDown`/`ChevronsUpDown` | A11y + Hierarquia |
| 2.2 | Filtros aplicados não têm contagem visível | P1 | `Badge` com contagem ao lado de "Filtros" + `Button variant=ghost` "Limpar filtros" | Fluxo |
| 2.3 | `min-w-[1100px]` força scroll horizontal em tablet | P1 | Em `<lg`: usar `Card` por linha (mobile pattern); em `>=lg`: tabela com colunas opcionais | Hierarquia |
| 2.4 | Bulk actions sem texto de plural ("3 selecionados") | P2 | `Toolbar` shadcn block com contador dinâmico | Microcopy |
| 2.5 | Empty state genérico — sem CTA "Criar novo TR" | P1 | Card empty com `Plus` icon, descrição curta e Button primário | Microcopy |

**Auditoria**: rodar `design:design-critique` + `design:ux-copy`.

---

### 3. `/novo-tr` — `src/features/tr/wizard/index.tsx` (já parcialmente trabalhado)

| # | Issue | Severidade | Solução shadcn | Eixo |
|---|-------|-----------|----------------|------|
| 3.1 | TRStepper não mostra "Etapa N de M" em telas pequenas | P1 | Em `<md`: substituir grid de cards por `Progress` + texto "Etapa 2 de 9 · {currentSection.title}" | Hierarquia |
| 3.2 | Erros podem ficar fora da viewport (ScrollArea) | P0 | `focusField` + `scrollIntoView({ block: 'center' })` no primeiro erro; `Alert` destructive sticky topo | Fluxo + A11y |
| 3.3 | Remover lote/item sem undo | P1 | `Sonner toast` com `action: { label: 'Desfazer' }` após remoção; `AlertDialog` só para ação irreversível | Microcopy + Fluxo |
| 3.4 | Sem autosave visível — só "Salvar rascunho" manual | P1 | `useEffect` com debounce 800ms → `saveDraft()` + badge "Salvo às HH:mm" usando `Badge variant=secondary` | Fluxo |
| 3.5 | Tabela de lotes tem 7 colunas — overflow inevitável | P1 | Componente "matrix card" por item (mobile) ou colapsar colunas secundárias em `Popover` | Hierarquia |
| 3.6 | Confirmação de troca de modelo perde os dados — sem diff | P2 | `AlertDialog` com lista dos campos que serão limpos (usar `List` simples) | Microcopy |
| 3.7 | Falta breadcrumb (TRs > Novo TR) | P1 | Componente `Breadcrumb` shadcn no Header | Fluxo |

**Auditoria**: rodar `design:design-critique` + `design:ux-copy` + `design:accessibility-review`.

---

### 4. `/tr/$trId` — `src/features/tr/view/index.tsx`

| # | Issue | Severidade | Solução shadcn | Eixo |
|---|-------|-----------|----------------|------|
| 4.1 | Modo "somente leitura" sinalizado por badge pequena | P0 | `Alert` informativo no topo: "Visualização — esse TR está em revisão. [Botão: Solicitar edição]" | Microcopy |
| 4.2 | Metadata sidebar não é sticky em docs longos | P1 | `aside` com `sticky top-20` + `ScrollArea` para conteúdo do sidebar | Fluxo |
| 4.3 | Sem TOC para seções do documento | P1 | `Sheet` lateral (mobile) ou coluna fixa com lista de seções (desktop) usando `ScrollArea` + `IntersectionObserver` | Fluxo |
| 4.4 | Layout muda quando entra painel de revisão (shift) | P1 | Reservar slot do painel via `grid-cols-[1fr_360px]` mesmo quando vazio, ou animar com `Collapsible` | Hierarquia |
| 4.5 | Falta breadcrumb (TRs > {referenceCode}) | P1 | `Breadcrumb` no Header | Fluxo |
| 4.6 | Cópia de link / exportar PDF não visível | P2 | `DropdownMenu` com ações secundárias no header da página | Fluxo |

**Auditoria**: rodar `design:design-critique` + `design:accessibility-review`.

---

### 5. `/aprovacoes` — `src/features/tr/review/index.tsx`

| # | Issue | Severidade | Solução shadcn | Eixo |
|---|-------|-----------|----------------|------|
| 5.1 | Status cards estáticos — não filtram a grid | P1 | `ToggleGroup` shadcn por status; estado em URL params | Fluxo |
| 5.2 | Cards sem indicador de complexidade (comentários, idade) | P1 | Mini-stack de `Badge` no rodapé do card: "💬 3 comentários · 2d em aberto" | Hierarquia + Microcopy |
| 5.3 | Summary text sem `line-clamp` consistente | P1 | `p` com `line-clamp-3` + `Tooltip` ou modal pra ver completo | Hierarquia |
| 5.4 | "Open to review" não diz o que acontece (consequência) | P2 | Renomear pra "Revisar TR" + tooltip explicando | Microcopy |
| 5.5 | Sem filtro por unidade/responsável | P1 | `Popover` com checkbox group filtros (mesmo padrão da DataTableToolbar) | Fluxo |
| 5.6 | Empty state usa só ícone — sem ação | P1 | Empty card com CTA "Ver TRs em andamento" → `/trs?status=in_progress` | Microcopy |

**Auditoria**: rodar `design:design-critique` + `design:ux-copy`.

---

### 6. Shell — `src/shared/layout/`

| # | Issue | Severidade | Solução shadcn | Eixo |
|---|-------|-----------|----------------|------|
| 6.1 | Sem `Breadcrumb` global | P0 | Adicionar componente `Breadcrumb` shadcn no `Header`, populado por rota via TanStack Router | Fluxo |
| 6.2 | `SkipToMain` existe mas só pula pro `<main>` — falta pular pra navegação | P2 | Adicionar segundo skip link "Pular para navegação" | A11y |
| 6.3 | Header shadow só após 10px scroll — transição abrupta | P2 | Sombra com `transition-shadow duration-200` baseada em `useScroll() > 0` | Hierarquia |
| 6.4 | Sidebar collapse sem indicador de keyboard shortcut | P2 | `Tooltip` no `SidebarTrigger` mostrando "Ctrl+B" | A11y |
| 6.5 | Cookie de sidebar state, mas sem `prefers-reduced-motion` no transition | P1 | Animação respeitando `motion-reduce` | A11y |
| 6.6 | Tema (light/dark) sem persistência visível no UI | P2 | Já existe `theme-switch` — verificar se está no header | Fluxo |

**Auditoria**: rodar `design:accessibility-review` no shell inteiro.

---

## Roadmap em 3 ondas

### Onda 1 — Quick wins (1 sessão, ~6-8 arquivos)
Mudanças isoladas, alto impacto, baixo risco. **P0 + P1 mais leves.**

- [6.1] **Breadcrumb global** no Header — base pra todas as outras telas
- [2.1] **Indicador de sort** na tabela de TRs
- [1.4] **`aria-label` em todos os charts** (dashboard)
- [3.7] **Breadcrumb no wizard** + título dinâmico
- [3.2] **Auto-scroll para primeiro erro** no wizard
- [1.3] **Tooltip em truncate** (dashboard table)
- [4.1] **Alert informativo de modo read-only** no /tr/$trId
- [5.4] **Renomear "Open to review" → "Revisar TR"** + tooltip

### Onda 2 — Estrutural (2-3 sessões)
Mudanças que tocam padrões/arquitetura.

- [Todos] **Padrão de empty state** (criar `<EmptyState>` reusável em `shared/components/`)
- [Todos] **Skeletons** consistentes para listas/cards
- [3.4] **Autosave** do wizard com badge de status
- [3.5] **Componente `LotMatrix`** responsivo (substituir tabela 7-col)
- [4.2 + 4.3] **TOC + sticky sidebar** no document view
- [5.1] **Filtros conectados** nos /aprovacoes via ToggleGroup
- [6.5] **`prefers-reduced-motion`** global

### Onda 3 — Polimento (1-2 sessões)
Detalhes finais, microcopy completa, handoff.

- [Todos] Revisão completa de microcopy via `design:ux-copy`
- [Todos] Audit final de A11y via `design:accessibility-review`
- [3.6] Diff visual no AlertDialog de troca de modelo
- [4.6] Menu de ações secundárias (copiar link, exportar)
- [6.3] Transição suave do header shadow
- [6.4] Tooltips com atalhos de teclado

---

## Próximos passos sugeridos

1. **Reiniciar a sessão do Claude Code** para carregar as 24 skills novas e o MCP do shadcn (configurado em `trfacil-design/.mcp.json`).
2. **Rodar `design:design-critique`** no `/dashboard` como primeira auditoria — é a tela de entrada, define o tom.
3. **Aprovar a Onda 1** e começar a implementação (todos os itens são P0/P1 isolados).
4. **Skill `design:design-system`** ao fim da Onda 2 para garantir consistência de tokens entre telas.

## Arquivos críticos (referência rápida)

- Dashboard: `src/features/tr/dashboard/index.tsx`, `dashboard/components/tr-{kpi-cards,recent-table,status-chart,units-chart}.tsx`
- Lista: `src/features/tr/list/index.tsx`, `list/components/trs-{table,columns,empty-state,primary-buttons,row-actions}.tsx`
- Wizard: `src/features/tr/wizard/index.tsx`, `wizard/components/tr-stepper.tsx`
- View: `src/features/tr/view/index.tsx`, `view/components/tr-document-view.tsx`
- Review: `src/features/tr/review/index.tsx`, `review/components/tr-review-{actions,comments}.tsx`
- Shell: `src/shared/layout/{authenticated-layout,header,header-actions,app-sidebar,nav-group}.tsx`
- Data-table reutilizável: `src/shared/data-table/{toolbar,column-header,faceted-filter,pagination,view-options,bulk-actions}.tsx`

## Componentes shadcn que faltam instalar

Pelo `package.json` atual, faltam (instalar via CLI shadcn quando precisar):
- `Breadcrumb` — usado em 5 lugares no plano (P0)
- `Skeleton` — loading states (P1)
- `Tooltip` — já existe (`@radix-ui/react-tooltip`), só falta criar o wrapper se não houver
- `Progress` — não está no package.json; usar div manual ou instalar `@radix-ui/react-progress`
- `ToggleGroup` — pra filtros (P1)
- `Sheet` — pra TOC mobile (P1)
- `Sonner` — já existe

Verificar quais já existem em `src/shared/ui/` antes de instalar.
