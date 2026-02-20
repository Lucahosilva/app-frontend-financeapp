# Front-end para Control of Moedinhas API

Pequeno front-end em React (Vite + TypeScript) que consome a API via `/api` em desenvolvimento (proxy do Vite para `http://localhost:8000`).

Instruções rápidas:

Instalar dependências:

```bash
cd app-frontend-financeapp
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Páginas incluídas: Cost Centers, Users, Transactions — exemplos mínimos de listagem e criação.


Configuração opcional de API (produção/outros ambientes):

```bash
VITE_API_BASE_URL=https://sua-api.exemplo.com npm run build
```

Se `VITE_API_BASE_URL` não for definido, o front usa `/api` por padrão.
