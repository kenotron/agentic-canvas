# API Specifications & Data Models
## Dashboard Workspace Application

**Version:** 1.0  
**Date:** August 2, 2025  
**Status:** Draft

---

## API Overview

The Dashboard Workspace Application exposes a RESTful API built on Supabase with additional custom Edge Functions for complex operations. All APIs use JWT-based authentication and follow OpenAPI 3.0 specifications.

### Base URLs
- **Development:** `http://localhost:54321`
- **Staging:** `https://staging-project.supabase.co`
- **Production:** `https://production-project.supabase.co`

### Authentication
All API requests require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Core Data Models

### User Profile Model

```typescript
interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  timezone: string;
  preferences: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: {
      email: boolean;
      push: boolean;
      workflow_completion: boolean;
    };
  };
  settings: {
    dashboard_auto_refresh?: boolean;
    default_dashboard_layout?: 'grid' | 'masonry';
    ai_suggestions_enabled?: boolean;
  };
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}
```

### Connector Model

```typescript
interface Connector {
  id: string;
  user_id: string;
  name: string;
  type: 'twitter' | 'linkedin' | 'salesforce' | 'hubspot' | 'google_analytics' | 'mixpanel';
  description?: string;
  config: {
    refresh_interval?: number;
    data_retention_days?: number;
    custom_fields?: Record<string, any>;
  };
  credentials_encrypted: string; // Encrypted JSON
  encryption_key_id: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  last_sync_at?: string;
  last_error?: string;
  sync_frequency: number; // seconds
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface ConnectorCredentials {
  // Twitter
  twitter?: {
    api_key: string;
    api_secret: string;
    access_token: string;
    access_token_secret: string;
  };
  // LinkedIn
  linkedin?: {
    client_id: string;
    client_secret: string;
    access_token: string;
    refresh_token?: string;
  };
  // Salesforce
  salesforce?: {
    client_id: string;
    client_secret: string;
    username: string;
    password: string;
    security_token: string;
    instance_url?: string;
  };
  // HubSpot
  hubspot?: {
    api_key?: string;
    access_token?: string;
    refresh_token?: string;
  };
}
```

### Dashboard Model

```typescript
interface Dashboard {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  layout: {
    type: 'grid' | 'masonry';
    columns: number;
    gap: number;
    auto_fit: boolean;
  };
  theme: {
    primary_color?: string;
    background_color?: string;
    text_color?: string;
    font_family?: string;
  };
  config: {
    auto_refresh: boolean;
    refresh_interval: number;
    show_timestamps: boolean;
    allow_public_access: boolean;
  };
  is_public: boolean;
  is_template: boolean;
  template_category?: string;
  tags: string[];
  view_count: number;
  last_viewed_at?: string;
  created_at: string;
  updated_at: string;
}
```

### Widget Model

```typescript
interface Widget {
  id: string;
  dashboard_id: string;
  connector_id?: string;
  name: string;
  type: 'chart' | 'table' | 'metric' | 'text' | 'image' | 'map' | 'gauge';
  config: {
    chart_type?: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
    color_scheme?: string[];
    show_legend?: boolean;
    show_grid?: boolean;
    animation_enabled?: boolean;
    custom_styling?: Record<string, any>;
  };
  data_query: {
    endpoint?: string;
    parameters?: Record<string, any>;
    filters?: Array<{
      field: string;
      operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
      value: any;
    }>;
    aggregation?: {
      type: 'sum' | 'avg' | 'count' | 'min' | 'max';
      field: string;
    };
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    limit?: number;
  };
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  min_width: number;
  min_height: number;
  is_resizable: boolean;
  is_draggable: boolean;
  refresh_interval: number;
  last_updated_at?: string;
  created_at: string;
  updated_at: string;
}
```

### Workflow Model

```typescript
interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger_config: {
    type: 'manual' | 'scheduled' | 'webhook' | 'data_change';
    schedule?: string; // Cron expression
    webhook_url?: string;
    data_conditions?: Array<{
      connector_id: string;
      field: string;
      operator: string;
      value: any;
    }>;
  };
  steps: Array<{
    id: string;
    type: 'data_fetch' | 'data_transform' | 'email_send' | 'api_call' | 'wait' | 'condition';
    name: string;
    config: Record<string, any>;
    next_step_id?: string;
    error_step_id?: string;
  }>;
  config: {
    timeout_minutes: number;
    retry_attempts: number;
    retry_delay_seconds: number;
    notification_on_completion: boolean;
    notification_on_error: boolean;
  };
  status: 'draft' | 'active' | 'paused' | 'archived';
  is_template: boolean;
  template_category?: string;
  tags: string[];
  execution_count: number;
  last_executed_at?: string;
  created_at: string;
  updated_at: string;
}

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  trigger_data: Record<string, any>;
  execution_context: Record<string, any>;
  current_step: number;
  step_results: Array<{
    step_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    result?: any;
    error?: string;
    started_at: string;
    completed_at?: string;
  }>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}
```

### Chat Session Model

```typescript
interface ChatSession {
  id: string;
  user_id: string;
  title?: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: {
      model?: string;
      tokens_used?: number;
      artifacts_generated?: string[];
    };
  }>;
  context: {
    current_dashboard_id?: string;
    active_connectors?: string[];
    user_preferences?: Record<string, any>;
  };
  model_config: {
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt?: string;
  };
  is_archived: boolean;
  message_count: number;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}
```

### Artifact Model

```typescript
interface Artifact {
  id: string;
  user_id: string;
  session_id?: string;
  parent_id?: string;
  name: string;
  type: 'dashboard' | 'report' | 'workflow' | 'widget' | 'document';
  description?: string;
  data: Record<string, any>;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  version: number;
  is_public: boolean;
  tags: string[];
  metadata: {
    generated_by?: 'ai' | 'user';
    source_prompt?: string;
    generation_model?: string;
    confidence_score?: number;
  };
  created_at: string;
  updated_at: string;
}
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/signup
Create a new user account.

```typescript
// Request
interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  provider?: 'google' | 'microsoft' | 'apple' | 'github' | 'linkedin';
}

// Response
interface SignupResponse {
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}
```

#### POST /auth/signin
Sign in an existing user.

```typescript
// Request
interface SigninRequest {
  email: string;
  password: string;
  provider?: 'google' | 'microsoft' | 'apple' | 'github' | 'linkedin';
}

// Response: Same as SignupResponse
```

#### POST /auth/signout
Sign out the current user.

#### POST /auth/refresh
Refresh the access token.

```typescript
// Request
interface RefreshRequest {
  refresh_token: string;
}

// Response
interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
```

### User Profile Endpoints

#### GET /api/profile
Get the current user's profile.

```typescript
// Response
interface ProfileResponse {
  profile: UserProfile;
}
```

#### PUT /api/profile
Update the current user's profile.

```typescript
// Request
interface UpdateProfileRequest {
  full_name?: string;
  avatar_url?: string;
  timezone?: string;
  preferences?: Partial<UserProfile['preferences']>;
  settings?: Partial<UserProfile['settings']>;
}

// Response: Same as ProfileResponse
```

### Connector Endpoints

#### GET /api/connectors
List all connectors for the current user.

```typescript
// Query Parameters
interface ConnectorsQuery {
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// Response
interface ConnectorsResponse {
  connectors: Connector[];
  total: number;
  has_more: boolean;
}
```

#### POST /api/connectors
Create a new connector.

```typescript
// Request
interface CreateConnectorRequest {
  name: string;
  type: string;
  description?: string;
  config?: Record<string, any>;
  credentials: ConnectorCredentials;
}

// Response
interface CreateConnectorResponse {
  connector: Connector;
}
```

#### GET /api/connectors/:id
Get a specific connector.

#### PUT /api/connectors/:id
Update a connector.

#### DELETE /api/connectors/:id
Delete a connector.

#### POST /api/connectors/:id/test
Test a connector's connection.

```typescript
// Response
interface TestConnectorResponse {
  success: boolean;
  message: string;
  data_sample?: any;
}
```

#### POST /api/connectors/:id/sync
Manually trigger a connector sync.

```typescript
// Response
interface SyncConnectorResponse {
  sync_id: string;
  status: 'started' | 'completed' | 'failed';
  message: string;
}
```

### Dashboard Endpoints

#### GET /api/dashboards
List dashboards for the current user.

```typescript
// Query Parameters
interface DashboardsQuery {
  is_public?: boolean;
  is_template?: boolean;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'created_at' | 'updated_at' | 'name' | 'view_count';
  order?: 'asc' | 'desc';
}

// Response
interface DashboardsResponse {
  dashboards: Dashboard[];
  total: number;
  has_more: boolean;
}
```

#### POST /api/dashboards
Create a new dashboard.

```typescript
// Request
interface CreateDashboardRequest {
  name: string;
  description?: string;
  layout?: Partial<Dashboard['layout']>;
  theme?: Partial<Dashboard['theme']>;
  config?: Partial<Dashboard['config']>;
  is_public?: boolean;
  tags?: string[];
}

// Response
interface CreateDashboardResponse {
  dashboard: Dashboard;
}
```

#### GET /api/dashboards/:id
Get a specific dashboard with widgets.

```typescript
// Response
interface DashboardResponse {
  dashboard: Dashboard;
  widgets: Widget[];
}
```

#### PUT /api/dashboards/:id
Update a dashboard.

#### DELETE /api/dashboards/:id
Delete a dashboard.

#### POST /api/dashboards/:id/duplicate
Duplicate a dashboard.

```typescript
// Request
interface DuplicateDashboardRequest {
  name: string;
  include_data?: boolean;
}

// Response: Same as CreateDashboardResponse
```

### Widget Endpoints

#### GET /api/dashboards/:dashboard_id/widgets
List widgets for a dashboard.

#### POST /api/dashboards/:dashboard_id/widgets
Create a new widget.

```typescript
// Request
interface CreateWidgetRequest {
  name: string;
  type: string;
  connector_id?: string;
  config?: Record<string, any>;
  data_query?: Record<string, any>;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
}

// Response
interface CreateWidgetResponse {
  widget: Widget;
}
```

#### GET /api/widgets/:id
Get a specific widget.

#### PUT /api/widgets/:id
Update a widget.

#### DELETE /api/widgets/:id
Delete a widget.

#### GET /api/widgets/:id/data
Get data for a widget.

```typescript
// Response
interface WidgetDataResponse {
  data: any;
  metadata: {
    last_updated: string;
    source: string;
    record_count: number;
  };
}
```

### Workflow Endpoints

#### GET /api/workflows
List workflows for the current user.

#### POST /api/workflows
Create a new workflow.

```typescript
// Request
interface CreateWorkflowRequest {
  name: string;
  description?: string;
  trigger_config: Workflow['trigger_config'];
  steps: Workflow['steps'];
  config?: Partial<Workflow['config']>;
  tags?: string[];
}

// Response
interface CreateWorkflowResponse {
  workflow: Workflow;
}
```

#### GET /api/workflows/:id
Get a specific workflow.

#### PUT /api/workflows/:id
Update a workflow.

#### DELETE /api/workflows/:id
Delete a workflow.

#### POST /api/workflows/:id/execute
Manually execute a workflow.

```typescript
// Request
interface ExecuteWorkflowRequest {
  trigger_data?: Record<string, any>;
}

// Response
interface ExecuteWorkflowResponse {
  execution: WorkflowExecution;
}
```

#### GET /api/workflows/:id/executions
List executions for a workflow.

```typescript
// Query Parameters
interface WorkflowExecutionsQuery {
  status?: string;
  limit?: number;
  offset?: number;
}

// Response
interface WorkflowExecutionsResponse {
  executions: WorkflowExecution[];
  total: number;
  has_more: boolean;
}
```

### Chat & AI Endpoints

#### GET /api/chat/sessions
List chat sessions for the current user.

#### POST /api/chat/sessions
Create a new chat session.

```typescript
// Request
interface CreateChatSessionRequest {
  title?: string;
  context?: Record<string, any>;
  model_config?: Partial<ChatSession['model_config']>;
}

// Response
interface CreateChatSessionResponse {
  session: ChatSession;
}
```

#### GET /api/chat/sessions/:id
Get a specific chat session.

#### POST /api/chat/sessions/:id/messages
Send a message to a chat session.

```typescript
// Request
interface SendMessageRequest {
  content: string;
  context?: Record<string, any>;
}

// Response
interface SendMessageResponse {
  message: ChatSession['messages'][0];
  artifacts?: Artifact[];
}
```

#### DELETE /api/chat/sessions/:id
Delete a chat session.

### Artifact Endpoints

#### GET /api/artifacts
List artifacts for the current user.

```typescript
// Query Parameters
interface ArtifactsQuery {
  type?: string;
  session_id?: string;
  is_public?: boolean;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

// Response
interface ArtifactsResponse {
  artifacts: Artifact[];
  total: number;
  has_more: boolean;
}
```

#### GET /api/artifacts/:id
Get a specific artifact.

#### PUT /api/artifacts/:id
Update an artifact.

#### DELETE /api/artifacts/:id
Delete an artifact.

#### POST /api/artifacts/:id/duplicate
Duplicate an artifact.

## WebSocket Events

### Real-time Updates

The application uses Supabase Realtime for live updates. Clients can subscribe to the following channels:

#### Dashboard Updates
```typescript
// Channel: `dashboard:${dashboard_id}`
interface DashboardUpdateEvent {
  type: 'dashboard_updated' | 'widget_added' | 'widget_updated' | 'widget_deleted';
  payload: Dashboard | Widget;
  timestamp: string;
}
```

#### Workflow Execution Updates
```typescript
// Channel: `workflow_execution:${execution_id}`
interface WorkflowExecutionEvent {
  type: 'execution_started' | 'step_completed' | 'execution_completed' | 'execution_failed';
  payload: WorkflowExecution;
  timestamp: string;
}
```

#### Connector Status Updates
```typescript
// Channel: `connector:${connector_id}`
interface ConnectorStatusEvent {
  type: 'sync_started' | 'sync_completed' | 'sync_failed' | 'status_changed';
  payload: {
    connector_id: string;
    status: string;
    last_sync_at?: string;
    error?: string;
  };
  timestamp: string;
}
```

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    request_id: string;
  };
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions for the requested resource |
| `NOT_FOUND` | 404 | Requested resource does not exist |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `CONNECTOR_ERROR` | 422 | External connector API error |
| `WORKFLOW_ERROR` | 422 | Workflow execution error |
| `RATE_LIMIT_EXCEEDED` | 429 | API rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Rate Limiting

### Rate Limits by Endpoint Type

| Endpoint Type | Rate Limit | Window |
|---------------|------------|---------|
| Authentication | 10 requests | 1 minute |
| Data Fetching | 100 requests | 1 minute |
| Dashboard Operations | 50 requests | 1 minute |
| Workflow Execution | 20 requests | 1 minute |
| AI Chat | 30 requests | 1 minute |
| File Upload | 10 requests | 1 minute |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 60
```

## Pagination

### Standard Pagination Parameters

```typescript
interface PaginationParams {
  limit?: number; // Default: 20, Max: 100
  offset?: number; // Default: 0
}

interface PaginationResponse<T> {
  data: T[];
  total: number;
  has_more: boolean;
  pagination: {
    limit: number;
    offset: number;
    next_offset?: number;
  };
}
```

## API Versioning

### Version Header
```
API-Version: 2025-08-02
```

### Supported Versions
- `2025-08-02` - Current version
- Future versions will be backward compatible for at least 12 months

This API specification provides a comprehensive foundation for building the Dashboard Workspace Application with proper data models, endpoints, and integration patterns.