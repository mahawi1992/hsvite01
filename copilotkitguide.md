## Demo Applications

### 1. Presentation Demo (demo-presentation)

#### Project Structure

```typescript
// app/types.ts
interface Slide {
  id: string;
  content: string;
  type: 'text' | 'image' | 'code';
  metadata?: {
    title?: string;
    notes?: string;
    animations?: string[];
  };
}

interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  settings: PresentationSettings;
}

// components/PresentationEditor.tsx
import { useCopilotContext } from "@copilotkit/react-core";
import { CopilotTextarea } from "@copilotkit/react-textarea";

export function PresentationEditor() {
  const {
    presentation,
    updateSlide,
    addSlide,
    removeSlide
  } = useCopilotContext<Presentation>();

  return (
    <div className="presentation-editor">
      <div className="slides-container">
        {presentation.slides.map((slide, index) => (
          <SlideEditor
            key={slide.id}
            slide={slide}
            index={index}
            onUpdate={updateSlide}
            onDelete={() => removeSlide(slide.id)}
          />
        ))}
        <AddSlideButton onAdd={addSlide} />
      </div>
      <PresentationControls />
    </div>
  );
}

// components/SlideEditor.tsx
export function SlideEditor({
  slide,
  index,
  onUpdate
}: SlideEditorProps) {
  return (
    <div className="slide-editor">
      <div className="slide-header">
        <h3>Slide {index + 1}</h3>
        <SlideTypeSelector
          value={slide.type}
          onChange={(type) => onUpdate(slide.id, { type })}
        />
      </div>
      <CopilotTextarea
        value={slide.content}
        onChange={(content) => onUpdate(slide.id, { content })}
        suggestions={{
          enabled: true,
          trigger: "/",
          customSuggestions: [
            {
              id: "template",
              label: "Insert Template",
              action: () => {/* Template insertion */}
            },
            {
              id: "image",
              label: "Add Image",
              action: () => {/* Image handling */}
            }
          ]
        }}
      />
      <SlideMetadataEditor
        metadata={slide.metadata}
        onUpdate={(metadata) => onUpdate(slide.id, { metadata })}
      />
    </div>
  );
}

// components/PresentationView.tsx
export function PresentationView() {
  const {
    presentation,
    currentSlideIndex,
    navigate
  } = useCopilotContext<Presentation>();

  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div className="presentation-view">
      <SlideRenderer slide={currentSlide} />
      <NavigationControls
        onPrevious={() => navigate('previous')}
        onNext={() => navigate('next')}
        totalSlides={presentation.slides.length}
        currentIndex={currentSlideIndex}
      />
    </div>
  );
}
```

#### Backend Integration

```typescript
// app/api/presentation/route.ts
import { CopilotBackend } from '@copilotkit/backend';

export const runtime = 'edge';

const backend = new CopilotBackend({
  actions: {
    generateSlideContent: async ({
      topic,
      type,
    }: {
      topic: string;
      type: 'text' | 'image' | 'code';
    }) => {
      // Content generation logic
      return generatedContent;
    },

    suggestImprovements: async ({ slideContent }: { slideContent: string }) => {
      // Improvement suggestions logic
      return suggestions;
    },

    analyzePresentation: async ({ presentation }: { presentation: Presentation }) => {
      // Analysis logic
      return analysis;
    },
  },
});

export async function POST(req: Request) {
  return backend.handle(req);
}

// utils/presentationHelpers.ts
export async function enhancePresentation(presentation: Presentation) {
  const enhancedSlides = await Promise.all(
    presentation.slides.map(async (slide) => {
      const enhanced = await generateEnhancedContent(slide);
      return {
        ...slide,
        content: enhanced.content,
        metadata: {
          ...slide.metadata,
          suggestions: enhanced.suggestions,
        },
      };
    })
  );

  return {
    ...presentation,
    slides: enhancedSlides,
  };
}

// hooks/usePresentationAI.ts
export function usePresentationAI() {
  const copilot = useCopilot();

  const enhanceSlide = async (slide: Slide) => {
    const enhanced = await copilot.actions.generateSlideContent({
      topic: slide.content,
      type: slide.type,
    });
    return enhanced;
  };

  const getImprovements = async (slide: Slide) => {
    const suggestions = await copilot.actions.suggestImprovements({
      slideContent: slide.content,
    });
    return suggestions;
  };

  const analyzeFlow = async (presentation: Presentation) => {
    const analysis = await copilot.actions.analyzePresentation({
      presentation,
    });
    return analysis;
  };

  return {
    enhanceSlide,
    getImprovements,
    analyzeFlow,
  };
}
```

### 2. Todo Application

#### Project Setup

```typescript
// app/types.ts
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  assignee?: string;
}

// components/TaskList.tsx
import { useCopilotContext } from "@copilotkit/react-core";
import { CopilotTextarea } from "@copilotkit/react-textarea";

export function TaskList() {
  const {
    tasks,
    addTask,
    updateTask,
    removeTask
  } = useCopilotContext<{ tasks: Task[] }>();

  return (
    <div className="task-list">
      <div className="task-filters">
        <TaskStatusFilter />
        <TaskPriorityFilter />
        <TaskSearch />
      </div>

      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={updateTask}
            onDelete={() => removeTask(task.id)}
          />
        ))}
      </div>

      <AddTaskForm onAdd={addTask} />
    </div>
  );
}

// components/TaskItem.tsx
export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const { suggestions } = useTaskSuggestions(task);

  return (
    <div className="task-item">
      <div className="task-header">
        <CopilotTextarea
          value={task.title}
          onChange={(title) => onUpdate(task.id, { title })}
          suggestions={{
            enabled: true,
            customSuggestions: suggestions,
          }}
        />
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <div className="task-description">
        <CopilotTextarea
          value={task.description}
          onChange={(description) => onUpdate(task.id, { description })}
        />
      </div>

      <div className="task-metadata">
        <TaskDueDate
          date={task.dueDate}
          onChange={(date) => onUpdate(task.id, { dueDate: date })}
        />
        <TaskAssignee
          assignee={task.assignee}
          onChange={(assignee) => onUpdate(task.id, { assignee })}
        />
        <TaskTags
          tags={task.tags}
          onChange={(tags) => onUpdate(task.id, { tags })}
        />
      </div>

      <TaskActions
        task={task}
        onDelete={onDelete}
        onStatusChange={(status) => onUpdate(task.id, { status })}
      />
    </div>
  );
}
```

#### Task AI Integration

```typescript
// hooks/useTaskAI.ts
import { useCopilot } from "@copilotkit/react-core";

export function useTaskAI() {
  const copilot = useCopilot();

  const generateTaskSuggestions = async (context: string) => {
    const suggestions = await copilot.actions.generateTasks({
      context,
      count: 5,
    });
    return suggestions;
  };

  const analyzeTaskPriority = async (task: Task) => {
    const priority = await copilot.actions.analyzePriority({
      title: task.title,
      description: task.description,
    });
    return priority;
  };

  const suggestDueDate = async (task: Task) => {
    const dueDate = await copilot.actions.suggestDueDate({
      task,
      existingTasks: tasks,
    });
    return dueDate;
  };

  return {
    generateTaskSuggestions,
    analyzeTaskPriority,
    suggestDueDate,
  };
}

// components/AITaskAssistant.tsx
export function AITaskAssistant() {
  const {
    generateTaskSuggestions,
    analyzeTaskPriority,
    suggestDueDate
  } = useTaskAI();

  return (
    <div className="ai-assistant">
      <button
        onClick={() => generateTaskSuggestions(currentContext)}
        className="suggestion-button"
      >
        Generate Related Tasks
      </button>

      <button
        onClick={() => analyzeTaskPriority(selectedTask)}
        className="analysis-button"
      >
        Analyze Priority
      </button>

      <button
        onClick={() => suggestDueDate(selectedTask)}
        className="date-button"
      >
        Suggest Due Date
      </button>
    </div>
  );
}
```

### 3. Spreadsheet Integration

#### Core Components

```typescript
// app/types.ts
interface Cell {
  id: string;
  value: string | number;
  formula?: string;
  format?: CellFormat;
  metadata?: CellMetadata;
}

interface Sheet {
  id: string;
  name: string;
  cells: { [key: string]: Cell };
  columns: Column[];
  rows: Row[];
}

// components/Spreadsheet.tsx
import { useCopilotContext } from "@copilotkit/react-core";
import { CopilotCell } from "@copilotkit/react-ui";

export function Spreadsheet() {
  const {
    sheet,
    updateCell,
    addRow,
    addColumn
  } = useCopilotContext<Sheet>();

  return (
    <div className="spreadsheet">
      <SpreadsheetToolbar
        onAddRow={addRow}
        onAddColumn={addColumn}
      />

      <div className="grid">
        {sheet.rows.map((row) => (
          <div key={row.id} className="row">
            {sheet.columns.map((col) => (
              <CopilotCell
                key={`${row.id}-${col.id}`}
                value={sheet.cells[`${row.id}-${col.id}`]?.value}
                onChange={(value) => updateCell(row.id, col.id, value)}
                suggestions={{
                  enabled: true,
                  trigger: "=",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <FormulaBar />
    </div>
  );
}

// components/FormulaBar.tsx
export function FormulaBar() {
  const { selectedCell, updateFormula } = useSpreadsheetContext();

  return (
    <div className="formula-bar">
      <CopilotTextarea
        value={selectedCell?.formula || ""}
        onChange={(formula) => updateFormula(selectedCell.id, formula)}
        suggestions={{
          enabled: true,
          customSuggestions: [
            {
              id: "sum",
              label: "SUM",
              description: "Add up numbers in a range",
              action: () => insertFunction("SUM"),
            },
            {
              id: "average",
              label: "AVERAGE",
              description: "Calculate average of numbers",
              action: () => insertFunction("AVERAGE"),
            },
            // More function suggestions...
          ],
        }}
      />
    </div>
  );
}
```

#### Spreadsheet AI Features

```typescript
// hooks/useSpreadsheetAI.ts
export function useSpreadsheetAI() {
  const copilot = useCopilot();

  const analyzeData = async (range: string) => {
    const analysis = await copilot.actions.analyzeRange({
      range,
      type: "statistical",
    });
    return analysis;
  };

  const suggestVisualization = async (range: string) => {
    const suggestion = await copilot.actions.suggestChart({
      range,
      data: getRangeData(range),
    });
    return suggestion;
  };

  const generateFormula = async (description: string) => {
    const formula = await copilot.actions.generateFormula({
      description,
      context: getCurrentContext(),
    });
    return formula;
  };

  return {
    analyzeData,
    suggestVisualization,
    generateFormula,
  };
}

// components/AISpreadsheetAssistant.tsx
export function AISpreadsheetAssistant() {
  const {
    analyzeData,
    suggestVisualization,
    generateFormula
  } = useSpreadsheetAI();

  return (
    <div className="ai-assistant">
      <button
        onClick={() => analyzeData(selectedRange)}
        className="analysis-button"
      >
        Analyze Selection
      </button>

      <button
        onClick={() => suggestVisualization(selectedRange)}
        className="chart-button"
      >
        Suggest Chart
      </button>

      <button
        onClick={() => generateFormula(formulaDescription)}
        className="formula-button"
      >
        Generate Formula
      </button>
    </div>
  );
}
```

### 4. Banking Application

#### Core Banking Components

```typescript
// app/types.ts
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  category?: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

interface Account {
  id: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  transactions: Transaction[];
}

// components/Banking.tsx
import { useCopilotContext } from "@copilotkit/react-core";

export function BankingDashboard() {
  const {
    accounts,
    transactions,
    executeTransaction
  } = useCopilotContext<{
    accounts: Account[];
    transactions: Transaction[];
  }>();

  return (
    <div className="banking-dashboard">
      <AccountsOverview accounts={accounts} />
      <TransactionHistory transactions={transactions} />
      <TransactionForm onExecute={executeTransaction} />
      <BankingAssistant />
    </div>
  );
}

// components/AccountsOverview.tsx
export function AccountsOverview({ accounts }: { accounts: Account[] }) {
  return (
    <div className="accounts-overview">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onSelect={() => selectAccount(account.id)}
        />
      ))}
      <AccountAnalytics accounts={accounts} />
    </div>
  );
}

// components/TransactionHistory.tsx
export function TransactionHistory({
  transactions
}: {
  transactions: Transaction[]
}) {
  const { filterTransactions, sortTransactions } = useTransactionFilters();

  return (
    <div className="transaction-history">
      <TransactionFilters
        onFilter={filterTransactions}
        onSort={sortTransactions}
      />
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onCategoryChange={(category) => updateCategory(transaction.id, category)}
        />
      ))}
      <TransactionAnalytics transactions={transactions} />
    </div>
  );
}

// hooks/useBankingAI.ts
export function useBankingAI() {
  const copilot = useCopilot();

  const analyzeBudget = async () => {
    const analysis = await copilot.actions.analyzeBudget({
      transactions: getRecentTransactions(),
      timeframe: "monthly",
    });
    return analysis;
  };

  const predictExpenses = async () => {
    const predictions = await copilot.actions.predictExpenses({
      historicalData: getHistoricalData(),
      horizon: "3months",
    });
    return predictions;
  };

  const categorizeTransaction = async (transaction: Transaction) => {
    const category = await copilot.actions.categorizeTransaction({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
    });
    return category;
  };

  return {
    analyzeBudget,
    predictExpenses,
    categorizeTransaction,
  };
}

// components/BankingAssistant.tsx
export function BankingAssistant() {
  const {
    analyzeBudget,
    predictExpenses,
    categorizeTransaction
  } = useBankingAI();

  return (
    <div className="banking-assistant">
      <AssetAllocationAdvice />
      <SpendingPatternAnalysis />
      <SavingsRecommendations />
      <InvestmentSuggestions />
    </div>
  );
}

// Security Implementation
// utils/bankingSecurity.ts
export class BankingSecurityManager {
  private validateTransaction(transaction: Transaction): boolean {
    // Implement transaction validation logic
    return true;
  }

  private encryptSensitiveData(data: any): string {
    // Implement encryption logic
    return encryptedData;
  }

  async processSecureTransaction(transaction: Transaction) {
    if (!this.validateTransaction(transaction)) {
      throw new Error("Invalid transaction");
    }

    const encryptedTransaction = this.encryptSensitiveData(transaction);
    return await this.submitTransaction(encryptedTransaction);
  }
}
```

### 5. Perplexity Clone

```typescript
// app/types.ts
interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  relevance: number;
  timestamp: Date;
}

interface ResearchQuery {
  query: string;
  filters?: {
    date?: DateRange;
    source?: string[];
    type?: string[];
  };
  context?: string;
}

// components/ResearchInterface.tsx
import { useCopilotContext } from "@copilotkit/react-core";

export function ResearchInterface() {
  const {
    executeSearch,
    results,
    searchHistory
  } = useCopilotContext<{
    results: SearchResult[];
    searchHistory: ResearchQuery[];
  }>();

  return (
    <div className="research-interface">
      <SearchBar onSearch={executeSearch} />
      <SearchFilters />
      <SearchResults results={results} />
      <ResearchAssistant />
    </div>
  );
}

// components/SearchResults.tsx
export function SearchResults({ results }: { results: SearchResult[] }) {
  return (
    <div className="search-results">
      {results.map((result) => (
        <ResultCard
          key={result.id}
          result={result}
          onSave={() => saveResult(result)}
          onShare={() => shareResult(result)}
        />
      ))}
      <ResultsAnalytics results={results} />
    </div>
  );
}

// hooks/useResearchAI.ts
export function useResearchAI() {
  const copilot = useCopilot();

  const enhanceQuery = async (query: string) => {
    const enhanced = await copilot.actions.enhanceQuery({
      query,
      context: getCurrentContext(),
    });
    return enhanced;
  };

  const analyzeResults = async (results: SearchResult[]) => {
    const analysis = await copilot.actions.analyzeResults({
      results,
      criteria: ["relevance", "credibility", "recency"],
    });
    return analysis;
  };

  const generateInsights = async (results: SearchResult[]) => {
    const insights = await copilot.actions.generateInsights({
      results,
      type: "comprehensive",
    });
    return insights;
  };

  return {
    enhanceQuery,
    analyzeResults,
    generateInsights,
  };
}

// components/ResearchAssistant.tsx
export function ResearchAssistant() {
  const {
    enhanceQuery,
    analyzeResults,
    generateInsights
  } = useResearchAI();

  return (
    <div className="research-assistant">
      <QueryEnhancement onEnhance={enhanceQuery} />
      <ResultsAnalysis onAnalyze={analyzeResults} />
      <InsightGenerator onGenerate={generateInsights} />
    </div>
  );
}
```

### 6. Research Canvas

```typescript
// app/types.ts
interface CanvasNode {
  id: string;
  type: 'text' | 'image' | 'link' | 'note';
  content: string;
  position: { x: number; y: number };
  connections: string[];
}

interface Canvas {
  id: string;
  nodes: CanvasNode[];
  connections: Connection[];
  metadata: CanvasMetadata;
}

// components/ResearchCanvas.tsx
import { useCopilotContext } from "@copilotkit/react-core";

export function ResearchCanvas() {
  const {
    canvas,
    addNode,
    updateNode,
    connectNodes,
    removeNode
  } = useCopilotContext<Canvas>();

  return (
    <div className="research-canvas">
      <CanvasToolbar />
      <CanvasView
        nodes={canvas.nodes}
        connections={canvas.connections}
        onNodeAdd={addNode}
        onNodeUpdate={updateNode}
        onConnect={connectNodes}
        onNodeRemove={removeNode}
      />
      <CanvasAssistant />
    </div>
  );
}

// hooks/useCanvasAI.ts
export function useCanvasAI() {
  const copilot = useCopilot();

  const suggestConnections = async (nodeId: string) => {
    const suggestions = await copilot.actions.suggestConnections({
      nodeId,
      canvasContext: getCurrentCanvas(),
    });
    return suggestions;
  };

  const generateNode = async (context: string) => {
    const node = await copilot.actions.generateNode({
      context,
      type: "auto",
    });
    return node;
  };

  const analyzeCanvas = async () => {
    const analysis = await copilot.actions.analyzeCanvas({
      canvas: getCurrentCanvas(),
      analysisType: "comprehensive",
    });
    return analysis;
  };

  return {
    suggestConnections,
    generateNode,
    analyzeCanvas,
  };
}

// components/CanvasAssistant.tsx
export function CanvasAssistant() {
  const {
    suggestConnections,
    generateNode,
    analyzeCanvas
  } = useCanvasAI();

  return (
    <div className="canvas-assistant">
      <ConnectionSuggestions onSuggest={suggestConnections} />
      <NodeGenerator onGenerate={generateNode} />
      <CanvasAnalyzer onAnalyze={analyzeCanvas} />
    </div>
  );
}
```

## Data Connection

### Document Connection Implementation

```typescript
// config/documentConfig.ts
import { CopilotKit } from "@copilotkit/react-core";

interface DocumentConfig {
  name: string;
  source: () => Promise<string>;
  metadata?: {
    type: string;
    tags: string[];
    lastUpdated: Date;
  };
}

const documentConfigs: DocumentConfig[] = [
  {
    name: "company_policies",
    source: async () => {
      const response = await fetch('/api/policies');
      return response.text();
    },
    metadata: {
      type: "policy",
      tags: ["hr", "compliance"],
      lastUpdated: new Date(),
    }
  },
  {
    name: "product_documentation",
    source: async () => {
      const response = await fetch('/api/docs');
      return response.text();
    },
    metadata: {
      type: "documentation",
      tags: ["product", "technical"],
      lastUpdated: new Date(),
    }
  }
];

// components/DocumentProvider.tsx
export function DocumentProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit
      documents={documentConfigs}
      onDocumentLoad={(doc) => {
        console.log(`Loaded document: ${doc.name}`);
      }}
      onDocumentError={(error) => {
        console.error("Document loading error:", error);
      }}
    >
      {children}
    </CopilotKit>
  );
}

// hooks/useDocuments.ts
export function useDocuments() {
  const { documents, loadDocument } = useCopilotContext();

  const searchDocuments = async (query: string) => {
    const results = await Promise.all(
      documents.map(async (doc) => {
        const content = await loadDocument(doc.name);
        if (content.toLowerCase().includes(query.toLowerCase())) {
          return {
            name: doc.name,
            content,
            metadata: doc.metadata,
          };
        }
        return null;
      })
    );

    return results.filter(Boolean);
  };

  return {
    documents,
    loadDocument,
    searchDocuments,
  };
}
```

### Database Integration

```typescript
// config/databaseConfig.ts
interface DatabaseConfig {
  connections: {
    [key: string]: {
      type: 'postgresql' | 'mysql' | 'mongodb';
      config: any;
      query: (sql: string) => Promise<any>;
    };
  };
  pooling: {
    max: number;
    idleTimeoutMillis: number;
  };
}

const databaseConfig: DatabaseConfig = {
  connections: {
    main: {
      type: 'postgresql',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
      query: async (sql: string) => {
        // Database query implementation
        return results;
      },
    },
  },
  pooling: {
    max: 20,
    idleTimeoutMillis: 30000,
  },
};

// utils/database.ts
export class DatabaseManager {
  private connections: Map<string, any>;

  constructor(config: DatabaseConfig) {
    this.connections = new Map();
    this.initializeConnections(config);
  }

  private async initializeConnections(config: DatabaseConfig) {
    for (const [name, conn] of Object.entries(config.connections)) {
      this.connections.set(name, await this.createConnection(conn));
    }
  }

  private async createConnection(config: any) {
    // Connection creation logic
    return connection;
  }

  async query(connectionName: string, query: string, params?: any[]) {
    const connection = this.connections.get(connectionName);
    if (!connection) {
      throw new Error(`Connection ${connectionName} not found`);
    }

    try {
      return await connection.query(query, params);
    } catch (error) {
      console.error(`Database error:`, error);
      throw error;
    }
  }
}

// hooks/useDatabase.ts
export function useDatabase() {
  const dbManager = new DatabaseManager(databaseConfig);

  const executeQuery = async (query: string, params?: any[]) => {
    return await dbManager.query('main', query, params);
  };

  return {
    executeQuery,
  };
}
```

### API Integration

```typescript
// config/apiConfig.ts
interface APIConfig {
  endpoints: {
    [key: string]: string;
  };
  headers: {
    [key: string]: string;
  };
  timeout: number;
  retryConfig?: {
    attempts: number;
    backoff: 'linear' | 'exponential';
    initialDelay: number;
  };
}

const apiConfig: APIConfig = {
  endpoints: {
    data: '/api/data',
    auth: '/api/auth',
    webhook: '/api/webhook',
  },
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  retryConfig: {
    attempts: 3,
    backoff: 'exponential',
    initialDelay: 1000,
  },
};

// utils/api.ts
export class APIManager {
  constructor(private config: APIConfig) {}

  private async makeRequest(endpoint: string, method: string, body?: any) {
    const url = this.config.endpoints[endpoint];
    if (!url) {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    const response = await fetch(url, {
      method,
      headers: this.config.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async get(endpoint: string) {
    return this.makeRequest(endpoint, 'GET');
  }

  async post(endpoint: string, data: any) {
    return this.makeRequest(endpoint, 'POST', data);
  }

  async put(endpoint: string, data: any) {
    return this.makeRequest(endpoint, 'PUT', data);
  }

  async delete(endpoint: string) {
    return this.makeRequest(endpoint, 'DELETE');
  }
}

// hooks/useAPI.ts
export function useAPI() {
  const apiManager = new APIManager(apiConfig);

  const fetchData = async (endpoint: string) => {
    return await apiManager.get(endpoint);
  };

  const postData = async (endpoint: string, data: any) => {
    return await apiManager.post(endpoint, data);
  };

  return {
    fetchData,
    postData,
  };
}
```

## Advanced Features

### Security Implementation

```typescript
// utils/security.ts
interface SecurityConfig {
  encryption: {
    algorithm: string;
    key: string;
    iv: string;
  };
  authentication: {
    type: 'jwt' | 'oauth2';
    config: any;
  };
  authorization: {
    roles: string[];
    permissions: { [key: string]: string[] };
  };
}

export class SecurityManager {
  constructor(private config: SecurityConfig) {}

  async encrypt(data: any): Promise<string> {
    // Encryption implementation
    return encryptedData;
  }

  async decrypt(encryptedData: string): Promise<any> {
    // Decryption implementation
    return decryptedData;
  }

  validateToken(token: string): boolean {
    // Token validation logic
    return isValid;
  }

  checkPermission(user: any, action: string): boolean {
    // Permission checking logic
    return hasPermission;
  }
}

// components/SecureComponent.tsx
export function SecureComponent({
  requiredRole,
  children
}: {
  requiredRole: string;
  children: React.ReactNode;
}) {
  const { user, security } = useCopilotContext();

  if (!security.checkPermission(user, requiredRole)) {
    return <UnauthorizedView />;
  }

  return <>{children}</>;
}
```

### Error Handling

```typescript
// utils/errorHandling.ts
interface ErrorConfig {
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    destination: 'console' | 'file' | 'service';
  };
  retry: {
    enabled: boolean;
    maxAttempts: number;
    backoff: 'linear' | 'exponential';
  };
  fallback: {
    enabled: boolean;
    defaults: { [key: string]: any };
  };
}

export class ErrorHandler {
  constructor(private config: ErrorConfig) {}

  async handleError(error: Error, context?: any) {
    this.logError(error, context);

    if (this.config.retry.enabled) {
      return await this.retryOperation(
        () => this.executeOperation(context),
        this.config.retry.maxAttempts
      );
    }

    if (this.config.fallback.enabled) {
      return this.getFallback(context);
    }

    throw error;
  }

  private logError(error: Error, context?: any) {
    // Error logging implementation
  }

  private async retryOperation(operation: () => Promise<any>, attempts: number) {
    // Retry logic implementation
  }

  private getFallback(context: any) {
    // Fallback logic implementation
  }
}

// hooks/useErrorHandling.ts
export function useErrorHandling() {
  const errorHandler = new ErrorHandler(errorConfig);

  const handleError = async (error: Error, context?: any) => {
    return await errorHandler.handleError(error, context);
  };

  return {
    handleError,
  };
}
```

### State Management

```typescript
// utils/stateManagement.ts
interface StateConfig {
  persistence: {
    enabled: boolean;
    storage: 'local' | 'session' | 'memory';
  };
  sync: {
    enabled: boolean;
    interval: number;
  };
}

export class StateManager {
  private state: Map<string, any>;

  constructor(private config: StateConfig) {
    this.state = new Map();
    this.initialize();
  }

  private initialize() {
    if (this.config.persistence.enabled) {
      this.loadPersistedState();
    }

    if (this.config.sync.enabled) {
      this.startSync();
    }
  }

  private loadPersistedState() {
    // Load persisted state implementation
  }

  private startSync() {
    // State synchronization implementation
  }

  get(key: string): any {
    return this.state.get(key);
  }

  set(key: string, value: any) {
    this.state.set(key, value);
    this.persist();
  }

  private persist() {
    // State persistence implementation
  }
}

// hooks/useState.ts
export function useCopilotState() {
  const stateManager = new StateManager(stateConfig);

  const getValue = (key: string) => {
    return stateManager.get(key);
  };

  const setValue = (key: string, value: any) => {
    stateManager.set(key, value);
  };

  return {
    getValue,
    setValue,
  };
}
```

### Custom Hooks

````typescript
// hooks/useCopilotFeatures.ts
export function useCopilotFeatures() {
  const { documents } = useDocuments();
  const { executeQuery } = useDatabase();
  const { fetchData, postData } = useAPI();
  const { handleError } = useErrorHandling();
  const { getValue, setValue } = useCopilotState();

  const executeWithContext = async (action: string, params: any) => {
    try {
      // Execute action with combined context
      return await executeAction(action, {
        ...params,
        documents,
        state: getValue('actionContext'),
      });
    } catch (error) {
      return await handleError(error, { action, params });
    }
  };

  return {
    executeWithContext,
  };
}

// hooks/useCopilotAnalytics.ts
export function useCopilotAnalytics() {
  const trackEvent = (event: string, data?: any) => {
    // Analytics tracking implementation
  };

  const measurePerformance = (action: string) => {
    // Performance measurement implementation
  };

  return {
    trackEvent,
    measurePerformance,
  };
}
```# CopilotKit Comprehensive Guide

## Table of Contents

1. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Basic Setup](#basic-setup)
   - [Environment Configuration](#environment-configuration)
2. [Core Features](#core-features)
   - [CopilotTextarea](#copilottextarea)
   - [Chat Interface](#chat-interface)
   - [Sidebar](#sidebar)
   - [Context Components](#context-components)
3. [Backend Integration](#backend-integration)
   - [TypeScript Backend Actions](#typescript-backend-actions)
   - [LangChain.js Integration](#langchainjs-integration)
   - [LangServe Integration](#langserve-integration)
   - [Remote Backend](#remote-backend)
4. [Demo Applications](#demo-applications)
   - [Presentation Demo](#presentation-demo)
   - [Todo Application](#todo-application)
   - [Spreadsheet Integration](#spreadsheet-integration)
   - [Banking Application](#banking-application)
   - [Perplexity Clone](#perplexity-clone)
   - [Research Canvas](#research-canvas)
5. [Data Connection](#data-connection)
   - [Document Connection](#document-connection)
   - [API Integration](#api-integration)
   - [Database Integration](#database-integration)
6. [Generative UI](#generative-ui)
7. [Frontend Actions](#frontend-actions)
8. [Advanced Features](#advanced-features)
   - [Security](#security)
   - [Error Handling](#error-handling)
   - [State Management](#state-management)
   - [Custom Hooks](#custom-hooks)

## Getting Started

### Installation

1. Basic Installation:
```bash
# Core packages
npm install @copilotkit/react-core @copilotkit/react-ui

# Additional packages for specific features
npm install @copilotkit/react-textarea    # For enhanced textarea
npm install @copilotkit/backend           # For backend functionality
npm install @copilotkit/shared            # For shared utilities
````

2. Development Dependencies:

```bash
# Required peer dependencies
npm install react react-dom
npm install langchain
```

### Environment Configuration

1. Environment Variables

```env
# Required
OPENAI_API_KEY=your_api_key_here

# Optional
COPILOTKIT_API_KEY=your_copilotkit_api_key
BACKEND_URL=your_backend_url
```

2. Next.js Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### Basic Setup

1. Root Layout Setup

```tsx
// app/layout.tsx
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebarUIProvider } from '@copilotkit/react-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit
          apiKey={process.env.OPENAI_API_KEY}
          customModels={{
            'gpt-4': {
              model: 'gpt-4',
              temperature: 0.7,
              maxTokens: 2000,
            },
          }}
        >
          <CopilotSidebarUIProvider>{children}</CopilotSidebarUIProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
```

2. API Route Setup

```typescript
// app/api/copilot/route.ts
import { CopilotBackend } from '@copilotkit/backend';
import { headers } from 'next/headers';

export const runtime = 'edge';

const backend = new CopilotBackend({
  actions: {
    // Your actions here
  },
  auth: {
    validateRequest: async (req) => {
      // Your auth logic here
      return true;
    },
  },
});

export async function POST(req: Request) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    return await backend.handle(req);
  } catch (error) {
    console.error('Backend error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

## Core Features

### CopilotTextarea

1. Basic Implementation

```tsx
import { CopilotTextarea } from '@copilotkit/react-textarea';

export default function TextareaExample() {
  return (
    <CopilotTextarea
      className="w-full h-32 p-2 border rounded"
      placeholder="Start typing..."
      suggestions={{
        enabled: true,
        trigger: '/',
        maxSuggestions: 5,
      }}
      contextCategories={['documentation', 'code', 'general']}
      onSuggestionSelect={(suggestion) => {
        console.log('Selected suggestion:', suggestion);
      }}
    />
  );
}
```

2. Advanced Features

```tsx
// components/EnhancedTextarea.tsx
import { CopilotTextarea, TextareaSuggestion } from '@copilotkit/react-textarea';
import { useCopilotContext } from '@copilotkit/react-core';

export function EnhancedTextarea() {
  const { context } = useCopilotContext();

  const customSuggestions: TextareaSuggestion[] = [
    {
      id: '1',
      label: 'Insert Template',
      description: 'Insert a predefined template',
      action: () => {
        // Template insertion logic
      },
    },
    // More suggestions...
  ];

  return (
    <div className="enhanced-textarea">
      <CopilotTextarea
        className="w-full min-h-[200px] p-4"
        suggestions={{
          enabled: true,
          trigger: '/',
          customSuggestions,
          filter: (query, suggestions) => {
            // Custom filtering logic
            return suggestions.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));
          },
        }}
        contextCategories={['documentation', 'code']}
        features={{
          autocompletion: true,
          formatting: true,
          fileAttachment: true,
        }}
        onContentChange={(content) => {
          // Handle content changes
        }}
        onAttachment={(file) => {
          // Handle file attachments
        }}
      />
    </div>
  );
}
```

### Chat Interface

1. Basic Chat Implementation

```tsx
import { CopilotChat } from '@copilotkit/react-ui';
import { useCopilotChat } from '@copilotkit/react-core';

export default function ChatExample() {
  const { messages, addMessage, clearMessages, isLoading } = useCopilotChat();

  return (
    <div className="h-[600px] flex flex-col">
      <CopilotChat
        initialMessage="How can I help you today?"
        suggestions={['Help me with coding', 'Explain this concept', 'Generate documentation']}
        className="flex-1 overflow-y-auto"
        messages={messages}
        onSend={async (message) => {
          await addMessage({
            role: 'user',
            content: message,
          });
        }}
        isLoading={isLoading}
        features={{
          codeHighlighting: true,
          markdownSupport: true,
          fileAttachment: true,
        }}
      />
      <div className="chat-controls mt-4">
        <button onClick={clearMessages} className="px-4 py-2 bg-gray-200 rounded">
          Clear Chat
        </button>
      </div>
    </div>
  );
}
```

2. Advanced Chat Features

```tsx
// components/AdvancedChat.tsx
import { CopilotChat, ChatMessage } from '@copilotkit/react-ui';
import { useCopilotContext } from '@copilotkit/react-core';

export function AdvancedChat() {
  const { context, updateContext } = useCopilotContext();

  const customMessageRenderer = (message: ChatMessage) => {
    // Custom message rendering logic
    return <div className={`message ${message.role}`}>{/* Custom message UI */}</div>;
  };

  return (
    <CopilotChat
      contextCategories={['code', 'documents', 'history']}
      features={{
        codeHighlighting: {
          theme: 'github',
          languages: ['typescript', 'python', 'javascript'],
        },
        markdownSupport: {
          sanitize: true,
          allowedTags: ['p', 'strong', 'em', 'code'],
        },
        fileAttachment: {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/*', 'application/pdf'],
        },
      }}
      customComponents={{
        MessageRenderer: customMessageRenderer,
        LoadingIndicator: CustomLoadingSpinner,
        SuggestionButton: CustomSuggestionButton,
      }}
      onError={(error) => {
        console.error('Chat error:', error);
        // Error handling logic
      }}
    />
  );
}
```

### Sidebar

1. Basic Sidebar Implementation

```tsx
import { CopilotSidebar } from '@copilotkit/react-ui';

export function SidebarExample() {
  return (
    <div className="flex h-screen">
      <CopilotSidebar defaultOpen={true} className="w-64" position="right">
        <div className="p-4">{/* Sidebar content */}</div>
      </CopilotSidebar>
      <main className="flex-1">{/* Main content */}</main>
    </div>
  );
}
```

2. Advanced Sidebar Configuration

```tsx
// components/EnhancedSidebar.tsx
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotContext } from '@copilotkit/react-core';

export function EnhancedSidebar() {
  const { context } = useCopilotContext();

  return (
    <CopilotSidebar
      defaultOpen={true}
      position="right"
      breakpoint="md"
      onOpenChange={(isOpen) => {
        // Handle open state change
      }}
      features={{
        draggable: true,
        resizable: true,
        collapsible: true,
      }}
      customComponents={{
        Header: CustomHeader,
        Footer: CustomFooter,
        Content: CustomContent,
      }}
    >
      {/* Sidebar content implementation */}
    </CopilotSidebar>
  );
}
```

## Getting Started

### Installation

1. Basic Installation:

```bash
npm install @copilotkit/react-core @copilotkit/react-ui
```

2. Backend Support:

```bash
npm install @copilotkit/backend @copilotkit/shared
```

### Basic Setup

```tsx
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebarUIProvider } from '@copilotkit/react-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit>
          <CopilotSidebarUIProvider>{children}</CopilotSidebarUIProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
```

## Core Features

### 1. CopilotTextarea

```tsx
import { CopilotTextarea } from '@copilotkit/react-textarea';

export default function TextareaExample() {
  return (
    <CopilotTextarea
      className="w-full h-32"
      placeholder="Start typing..."
      suggestions={true}
      contextCategories={['documentation', 'code']}
    />
  );
}
```

### 2. Copilot Chat Interface

```tsx
import { CopilotChat } from '@copilotkit/react-ui';

export default function ChatExample() {
  return (
    <div className="h-[500px]">
      <CopilotChat
        initialMessage="How can I help you?"
        suggestions={['Help me with...', 'Show me how to...']}
      />
    </div>
  );
}
```

## Backend Integration

### TypeScript Backend Actions

```typescript
// app/api/copilot/route.ts
import { CopilotBackend } from '@copilotkit/backend';

export const runtime = 'edge';

const backend = new CopilotBackend({
  actions: {
    getTasks: async () => {
      // Implementation
      return tasks;
    },
    createTask: async (params: { title: string; description: string }) => {
      // Implementation
      return newTask;
    },
  },
});

export async function POST(req: Request) {
  return backend.handle(req);
}
```

### LangChain.js Integration

```typescript
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LangChainStream, StreamingTextResponse } from 'ai';
import { AIMessage, HumanMessage } from 'langchain/schema';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { stream, handlers } = LangChainStream();

  const llm = new ChatOpenAI({
    streaming: true,
    modelName: 'gpt-4',
  });

  llm.call(
    messages.map((m: any) =>
      m.role == 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    {},
    [handlers]
  );

  return new StreamingTextResponse(stream);
}
```

### LangServe Integration

```typescript
import { CopilotBackend } from '@copilotkit/backend';
import { LangServeAdapter } from '@copilotkit/langserve';

const langserveConfig = {
  baseUrl: 'your-langserve-endpoint',
  routes: {
    chat: '/chat',
    completion: '/completion',
  },
};

const backend = new CopilotBackend({
  adapter: new LangServeAdapter(langserveConfig),
});
```

### Remote Backend

```typescript
// Remote Backend Configuration
const remoteConfig = {
  endpoint: "https://your-api-endpoint.com",
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
};

export default function App() {
  return (
    <CopilotKit backend={remoteConfig}>
      <YourApp />
    </CopilotKit>
  );
}
```

## Demo Applications

### Presentation Demo

Key features from demo-presentation:

```tsx
// components/PresentationEditor.tsx
import { useCopilotContext } from '@copilotkit/react-core';
import { CopilotTextarea } from '@copilotkit/react-textarea';

export function PresentationEditor() {
  const { slides, updateSlide } = useCopilotContext();

  return (
    <div className="presentation-editor">
      {slides.map((slide, index) => (
        <div key={index} className="slide">
          <CopilotTextarea
            value={slide.content}
            onChange={(content) => updateSlide(index, content)}
            context={{
              slideNumber: index + 1,
              totalSlides: slides.length,
            }}
          />
        </div>
      ))}
    </div>
  );
}
```

### Todo Application

Features from GitHubToDo:

```tsx
// components/TaskList.tsx
import { useCopilotKit } from '@copilotkit/react-core';

export function TaskList() {
  const { tasks, addTask, updateTask } = useCopilotKit();

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={updateTask} />
      ))}
      <AddTaskButton onAdd={addTask} />
    </div>
  );
}
```

### Spreadsheet Integration

Features from GitHubSpreadsheet:

```tsx
// components/Spreadsheet.tsx
import { useCopilotContext } from '@copilotkit/react-core';

export function Spreadsheet() {
  const { data, updateCell } = useCopilotContext();

  return (
    <div className="spreadsheet">
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onChange={(value) => updateCell(rowIndex, colIndex, value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Banking Application

Security features from demo-banking:

```tsx
// components/SecureTransaction.tsx
import { useCopilotSecurity } from '@copilotkit/react-core';

export function SecureTransaction() {
  const { validateTransaction, executeTransaction } = useCopilotSecurity();

  const handleTransaction = async (data) => {
    const isValid = await validateTransaction(data);
    if (isValid) {
      await executeTransaction(data);
    }
  };

  return <div className="transaction-form">{/* Transaction form implementation */}</div>;
}
```

### Perplexity Clone

Features from coagents-perplexity-clone:

```tsx
// components/SearchInterface.tsx
import { CopilotKit, useCopilotSearch } from '@copilotkit/react-core';

export function SearchInterface() {
  const { search, results } = useCopilotSearch();

  return (
    <div className="search-interface">
      <SearchBar onSearch={search} />
      <SearchResults results={results} />
    </div>
  );
}
```

### Research Canvas

Features from coagents-research-canvas:

```tsx
// components/ResearchCanvas.tsx
import { useCopilotCanvas } from '@copilotkit/react-core';

export function ResearchCanvas() {
  const { nodes, edges, addNode, connectNodes } = useCopilotCanvas();

  return (
    <div className="research-canvas">
      <CanvasView nodes={nodes} edges={edges} onNodeAdd={addNode} onConnect={connectNodes} />
    </div>
  );
}
```

## Data Connection

### Document Connection

```typescript
// config/documents.ts
const documentConfig = {
  documents: [
    {
      name: "docs",
      source: async () => {
        const response = await fetch('/api/docs');
        return response.text();
      }
    }
  ]
};

export default function App() {
  return (
    <CopilotKit config={documentConfig}>
      <YourApp />
    </CopilotKit>
  );
}
```

### API Integration

```typescript
const apiConfig = {
  endpoints: {
    data: "/api/data",
    auth: "/api/auth",
  },
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
};

function DataConnectedApp() {
  return (
    <CopilotKit
      apiConfig={apiConfig}
      onError={(error) => {
        console.error("API Error:", error);
      }}
    >
      <YourApp />
    </CopilotKit>
  );
}
```

## Generative UI

```tsx
import { CopilotUIProvider, GenerativeUI } from '@copilotkit/react-ui';

export function GenerativeComponent() {
  return (
    <CopilotUIProvider>
      <GenerativeUI
        prompt="Create a contact form"
        components={{
          Form: CustomForm,
          Input: CustomInput,
          Button: CustomButton,
        }}
      />
    </CopilotUIProvider>
  );
}
```

## Frontend Actions

### Making Elements Actionable

```tsx
import { useMakeCopilotActionable } from '@copilotkit/react-core';

export function ActionableButton() {
  const { ref, copilotAction } = useMakeCopilotActionable({
    name: 'submitForm',
    description: 'Submits the form with the current data',
  });

  return (
    <button ref={ref} onClick={() => copilotAction()}>
      Submit Form
    </button>
  );
}
```

### Custom Action Hooks

```tsx
import { useCopilotAction } from '@copilotkit/react-core';

export function CustomAction() {
  const performAction = useCopilotAction('customAction');

  return (
    <button
      onClick={() =>
        performAction({
          /* params */
        })
      }
    >
      Perform Action
    </button>
  );
}
```

## Supported Environments

- Next.js
- React applications
- Edge Runtime for backend functionality

## Additional Resources

- Official Documentation: https://docs.copilotkit.ai
- Demo Applications Repository: https://github.com/CopilotKit
- Backend Integration Guides: https://docs.copilotkit.ai/guides/backend-actions
