# TR Fácil

Aplicação standalone para criação, revisão e acompanhamento de Termos de Referência do Sistema FIEPE.

## Visão geral

Este repositório concentra apenas o produto `TR Fácil`, sem autenticação externa e sem módulos herdados do template original que não participam do fluxo de TR. A base atual está preparada para uso local, validação interna e deploy contínuo na Vercel.

## Stack principal

- React 19 + TypeScript
- Vite
- TanStack Router
- TanStack Query
- Zustand
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Recharts

## Estrutura do projeto

```text
src/
  app/          bootstrap, router, providers e contexts globais
  features/tr/  domínio do produto: dashboard, listagem, wizard, review e view
  routes/       definição das rotas do app
  shared/       layout, componentes reutilizáveis, ui, hooks e utilitários
```

### Organização adotada

- `src/app`: inicialização do app, providers e infraestrutura global.
- `src/shared`: tudo o que é reutilizável entre telas, incluindo shell, primitives e utilitários.
- `src/features/tr`: núcleo funcional do produto.

## Fluxos incluídos

- Dashboard do TR Fácil
- Listagem de TRs
- Wizard de criação de TR
- Visualização consolidada de TR
- Fila de aprovações e revisão

## Como rodar localmente

```bash
npm install
npm run dev
```

Por padrão, o Vite sobe em ambiente local e a aplicação abre no dashboard do TR Fácil.

## Scripts disponíveis

- `npm run dev`: sobe o ambiente local
- `npm run build`: gera o build de produção
- `npm run typecheck`: valida a tipagem TypeScript
- `npm run lint`: roda o ESLint
- `npm run format:check`: valida formatação com Prettier
- `npm run format`: formata o código
- `npm run knip`: encontra arquivos e dependências não usados
- `npm run check`: roda a sequência principal de checks do repositório

## Deploy na Vercel

O projeto está preparado para deploy na Vercel como plataforma principal.

Fluxo recomendado:

```bash
npm install
npm run build
npx vercel
```

Para produção:

```bash
npx vercel --prod
```

O diretório `.vercel` está ignorado no Git para manter a configuração local fora do versionamento.

## Premissas desta base

- app standalone
- sem Clerk e sem autenticação nesta rodada
- frontend-first com dados mockados
- home principal no dashboard do TR Fácil

## Status atual

- build de produção ativo
- deploy validado na Vercel
- estrutura preparada para continuidade por time interno
