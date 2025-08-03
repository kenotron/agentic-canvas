# Backend Architecture

## Supabase Services
- **Authentication:** Built-in auth with OAuth providers
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Real-time:** WebSocket connections for live updates
- **Storage:** File storage for artifacts and media
- **Edge Functions:** Serverless functions for custom logic

## Database Schema Design

```mermaid
erDiagram
    users {
        uuid id PK
        string email
        string full_name
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    user_profiles {
        uuid id PK
        uuid user_id FK
        jsonb preferences
        jsonb settings
        timestamp created_at
        timestamp updated_at
    }
    
    connectors {
        uuid id PK
        uuid user_id FK
        string name
        string type
        jsonb config
        jsonb credentials_encrypted
        string status
        timestamp last_sync
        timestamp created_at
        timestamp updated_at
    }
    
    dashboards {
        uuid id PK
        uuid user_id FK
        string name
        string description
        jsonb layout
        jsonb config
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }
    
    widgets {
        uuid id PK
        uuid dashboard_id FK
        uuid connector_id FK
        string type
        jsonb config
        jsonb data_query
        integer position_x
        integer position_y
        integer width
        integer height
        timestamp created_at
        timestamp updated_at
    }
    
    workflows {
        uuid id PK
        uuid user_id FK
        string name
        string description
        jsonb steps
        jsonb config
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    workflow_executions {
        uuid id PK
        uuid workflow_id FK
        jsonb execution_data
        string status
        jsonb results
        timestamp started_at
        timestamp completed_at
    }
    
    chat_sessions {
        uuid id PK
        uuid user_id FK
        string title
        jsonb messages
        jsonb context
        timestamp created_at
        timestamp updated_at
    }
    
    artifacts {
        uuid id PK
        uuid user_id FK
        uuid session_id FK
        string type
        string name
        jsonb data
        string file_path
        timestamp created_at
    }
    
    users ||--|| user_profiles : has
    users ||--o{ connectors : owns
    users ||--o{ dashboards : creates
    users ||--o{ workflows : creates
    users ||--o{ chat_sessions : has
    users ||--o{ artifacts : generates
    dashboards ||--o{ widgets : contains
    connectors ||--o{ widgets : feeds
    workflows ||--o{ workflow_executions : executes
    chat_sessions ||--o{ artifacts : generates
```

## Key Design Principles
### Supabase-First Approach
- Leveraging Supabase's built-in features for authentication, database, and storage
- Using Edge Functions for serverless AI processing
- Real-time capabilities through Supabase Realtime
- Serverless architecture for cost-effective scaling

### Data Security
- **Encryption at Rest:** AES-256 encryption for sensitive data
- **Encryption in Transit:** TLS 1.3 for all communications
- **Credential Storage:** Encrypted JSON fields with user-specific keys
- **Row Level Security:** Database-level access control
- **API Security:** JWT-based authentication with refresh tokens

### Scalability Considerations
#### Horizontal Scaling
- Stateless Architecture: No server-side session storage
- Database Scaling: Read replicas and connection pooling
- Cache Scaling: Redis cluster configuration
- CDN Scaling: Global content distribution

#### Vertical Scaling
- Resource Optimization: Memory and CPU optimization
- Query Optimization: Database query performance
- Bundle Optimization: Frontend asset optimization
- API Optimization: Response time improvements