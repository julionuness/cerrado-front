# AgroLEG — Detector de Pragas

Aplicação mobile-first em Angular para detecção de doenças em lavouras de café. O usuário fotografa as folhas, envia para análise via modelo YOLO no backend, e recebe um diagnóstico com nível de confiança, severidade e recomendação de tratamento.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Instalação e execução](#instalação-e-execução)
- [Arquitetura](#arquitetura)
- [Fluxo da aplicação](#fluxo-da-aplicação)
- [Modo mock (sem backend)](#modo-mock-sem-backend)
- [Migrando para o backend real](#migrando-para-o-backend-real)
- [Migrando para autenticação por usuário](#migrando-para-autenticação-por-usuário)
- [Doenças suportadas](#doenças-suportadas)
- [Variáveis e tokens de design](#variáveis-e-tokens-de-design)

---

## Tecnologias

- **Angular 17+** com componentes standalone
- **Signals** (`signal`, `computed`) para estado reativo
- **SCSS** com BEM para estilização
- Sem bibliotecas de UI externas

---

## Estrutura de pastas

```
src/
├── app/
│   ├── core/
│   │   ├── model/
|   |   |   ├── models.ts                        # Interfaces globais (Resultado, AnaliseResponse, HistoricoItem…)
│   │   └── services/
│   │       ├── camera-upload.ts             # Envio de imagens ao backend (ou mock)
│   │       ├── historico-repository.ts      # Interface + implementação localStorage
│   │       └── historico.service.ts         # Regras de negócio do histórico
│   │
│   ├── features/
│   │   ├── upload/
│   │   │   ├── pages/upload-page/           # Tela principal: captura e envio de imagens
│   │   │   └── components/upload-preview/   # Grid de preview com remoção de arquivos
│   │   │
│   │   ├── result/
│   │   │   ├── pages/result-page/           # Tela de resultado da análise
│   │   │   └── components/result.helpers.ts            # Funções puras: doença, confiança, severidade
│   │   │
│   │   └── historico/
│   │       └── pages/historico-page/        # Tela de histórico de análises
│   │
│   ├── shared/
│   │   ├── header/                          # Cabeçalho global com navegação
│   │   └── footer/                          # Rodapé global
│   │
│   ├── app.config.ts                        # Providers globais (roteamento, repositório)
│   └── app.routes.ts                        # Definição de rotas
│
└── assets/
    └── logo.jpg
```

---

## Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
ng serve

# Build de produção
ng build
```

A aplicação sobe em `http://localhost:4200` por padrão.

---

## Arquitetura

### Modelo de dados (`core/models.ts`)

Todos os tipos compartilhados ficam em um único arquivo para evitar duplicação entre features.

```
Resultado          → dados de uma imagem analisada
AnaliseResponse    → resposta completa do backend { session_id, resultados[] }
HistoricoItem      → entrada persistida no histórico
StatusEnvio        → union type dos estados do formulário de upload
```

### Camada de persistência

O histórico usa o padrão **Repository** com injeção de dependência via `InjectionToken`. Isso desacopla completamente os componentes da forma como os dados são armazenados.

```
HistoricoRepository (interface)
    ├── LocalStorageHistoricoRepository   ← ativo agora
    └── ApiHistoricoRepository            ← implementar quando o backend estiver pronto
```

O provider é registrado em `app.config.ts`. Para trocar de implementação, apenas uma linha muda — nenhum componente é afetado.

### Funções puras de apresentação (`result.helpers.ts`)

Lógica de UI isolada em funções sem dependências Angular: `getDoencaInfo`, `getConfiancaConfig`, `getSeveridadeConfig`. Fáceis de testar unitariamente e reutilizáveis em qualquer componente.

---

## Fluxo da aplicação

```
[Upload Page]
    │  Usuário seleciona imagens (câmera ou galeria)
    │  Clica em "Analisar"
    ↓
[CameraUpload.uploadBatch()]
    │  Envia multipart/form-data para o backend
    │  (ou retorna mock se USE_MOCK = true)
    ↓
[HistoricoService.registrar()]
    │  Persiste a análise no repositório ativo
    ↓
[Result Page]
    │  Recebe AnaliseResponse via router state
    │  Exibe diagnóstico, confiança, severidade e recomendação
    │  Suporta paginação quando há múltiplas imagens
    ↓
[Historico Page]
    │  Lista todas as análises salvas
    │  Cards expansíveis com detalhes por imagem
    │  Permite remover itens ou limpar tudo
    └  "Ver detalhes completos" reabre a Result Page com os dados históricos
```

---

## Modo mock (sem backend)

Enquanto o backend não estiver disponível, o serviço de upload simula respostas localmente.

**Arquivo:** `core/services/camera-upload.ts`

```typescript
private readonly USE_MOCK = true; // ← true = mock ativo
```

Com `USE_MOCK = true`, cada arquivo enviado gera um resultado aleatório com doença, confiança e severidade variadas, com delay de 1,5 s para simular latência de rede. O histórico é salvo normalmente no localStorage.

Para ativar o backend real:

```typescript
private readonly USE_MOCK = false;
private readonly API_URL  = 'https://seu-backend.com/api/detect';
```

---

## Migrando para o backend real

### 1. Desligar o mock

```typescript
// camera-upload.ts
private readonly USE_MOCK = false;
private readonly API_URL  = 'https://seu-backend.com/api/detect';
```

### 2. Trocar o repositório do histórico

Crie a implementação HTTP em `historico.repository.ts` (o esqueleto já está comentado no arquivo) e registre em `app.config.ts`:

```typescript
// app.config.ts — troque:
{ provide: HISTORICO_REPO, useValue: new LocalStorageHistoricoRepository() }

// Por:
{ provide: HISTORICO_REPO, useClass: ApiHistoricoRepository }
```

### 3. CORS no backend (FastAPI)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seu-dominio.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Contrato esperado da API

**POST** `/api/detect` — `multipart/form-data`, campo `files[]`

```json
{
  "session_id": "f76d833d-ef97-461d-9da5-b761e6f5f9ed",
  "resultados": [
    {
      "filename":        "foto.jpg",
      "doenca":          "cercospora",
      "confianca":       0.88,
      "nivel_confianca": "boa",
      "area_percentual": 12.88,
      "severidade":      "moderada"
    }
  ]
}
```

---

## Migrando para autenticação por usuário

A estrutura já está preparada. Os passos são:

**1.** Descomentar o campo `userId` em `core/models.ts`:
```typescript
export interface HistoricoItem {
  // ...
  userId?: string;
}
```

**2.** Injetar o `AuthService` em `historico.service.ts` e popular o campo ao registrar:
```typescript
const item: HistoricoItem = {
  ...
  userId: this.auth.currentUser?.id,
};
```

**3.** A `ApiHistoricoRepository` passa o token JWT no header — o backend filtra por usuário automaticamente:
```typescript
private http = inject(HttpClient);

listar() {
  return firstValueFrom(this.http.get<HistoricoItem[]>('/api/historico'));
  // HttpClient já inclui o Authorization header via interceptor de auth
}
```

**4.** No localStorage (desenvolvimento), filtrar por userId na listagem para simular isolamento de sessão.

---

## Doenças suportadas

Descrições e recomendações estão em `features/result/result.helpers.ts`. Para adicionar uma nova doença, basta incluir uma entrada no objeto `DOENCAS`:

```typescript
const DOENCAS = {
  // ...
  phoma: {
    nome:         'Phoma do Cafeeiro',
    descricao:    '...',
    recomendacao: '...',
  },
};
```

Doenças não mapeadas exibem um texto genérico sem quebrar a aplicação.

---

## Variáveis e tokens de design

| Token | Valor | Uso |
|---|---|---|
| Fundo da página | `#F5F0E8` | Background geral |
| Marrom escuro | `#7B3300` | Header |
| Terracota principal | `#C1540A` | Botões primários, destaques |
| Terracota escuro | `#9E4108` | Hover/active |
| Verde confirmação | `#2E7D32` | Botão enviar, confiança alta |
| Texto principal | `#2C1A0E` | Títulos |
| Texto secundário | `#5C4A3A` | Corpo de texto |
| Texto suave | `#8C7B6B` | Labels, metadados |
| Borda/divisor | `#EDE7DE` | Separadores, chips neutros |
| Erro | `#B71C1C` | Alertas, severidade grave |
