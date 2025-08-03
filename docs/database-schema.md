# Database Schema Design
## Dashboard Workspace Application

**Version:** 1.0  
**Date:** August 2, 2025  
**Status:** Draft

---

## Schema Overview

The database schema is designed for a multi-tenant SaaS application built on Supabase PostgreSQL. It leverages Row Level Security (RLS) for data isolation and includes optimized indexes for performance.

## Core Tables

### Users & Authentication

#### `auth.users` (Supabase Built-in)
Supabase's built-in authentication table - not directly modified.

#### `public.user_profiles`
Extended user profile information and preferences.

```sql
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Data Connectors

#### `public.connectors`
Configuration and credentials for external data sources.

```sql
CREATE TABLE public.connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'twitter', 'linkedin', 'salesforce', 'hubspot', etc.
    description TEXT,
    config JSONB DEFAULT '{}',
    credentials_encrypted TEXT, -- Encrypted JSON string
    encryption_key_id TEXT, -- Reference to encryption key
    status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    sync_frequency INTEGER DEFAULT 3600, -- seconds
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, name)
);

-- Indexes
CREATE INDEX idx_connectors_user_id ON public.connectors(user_id);
CREATE INDEX idx_connectors_type ON public.connectors(type);
CREATE INDEX idx_connectors_status ON public.connectors(status);
CREATE INDEX idx_connectors_last_sync ON public.connectors(last_sync_at);

-- RLS Policies
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own connectors" ON public.connectors
    USING (auth.uid() = user_id);
```

#### `public.connector_schemas`
Schema definitions for different connector types.

```sql
CREATE TABLE public.connector_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_type TEXT UNIQUE NOT NULL,
    schema_version TEXT NOT NULL DEFAULT '1.0',
    config_schema JSONB NOT NULL, -- JSON Schema for configuration
    credential_schema JSONB NOT NULL, -- JSON Schema for credentials
    data_schema JSONB NOT NULL, -- Schema for returned data
    auth_type TEXT NOT NULL CHECK (auth_type IN ('oauth2', 'api_key', 'basic', 'bearer')),
    auth_config JSONB DEFAULT '{}',
    rate_limits JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- This table is managed by admins, no RLS needed for regular users
```

### Dashboards & Widgets

#### `public.dashboards`
User-created dashboards containing widgets and layouts.

```sql
CREATE TABLE public.dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    layout JSONB DEFAULT '{}', -- Grid layout configuration
    theme JSONB DEFAULT '{}', -- Color scheme, fonts, etc.
    config JSONB DEFAULT '{}', -- Dashboard-level settings
    is_public BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    template_category TEXT,
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dashboards_user_id ON public.dashboards(user_id);
CREATE INDEX idx_dashboards_is_public ON public.dashboards(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_dashboards_is_template ON public.dashboards(is_template) WHERE is_template = TRUE;
CREATE INDEX idx_dashboards_tags ON public.dashboards USING GIN(tags);

-- RLS Policies
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own dashboards" ON public.dashboards
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public dashboards" ON public.dashboards
    FOR SELECT USING (is_public = TRUE);
```

#### `public.widgets`
Individual dashboard components that display data.

```sql
CREATE TABLE public.widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE NOT NULL,
    connector_id UUID REFERENCES public.connectors(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'chart', 'table', 'metric', 'text', etc.
    config JSONB DEFAULT '{}', -- Widget-specific configuration
    data_query JSONB DEFAULT '{}', -- Query parameters for data fetching
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 4,
    min_width INTEGER DEFAULT 2,
    min_height INTEGER DEFAULT 2,
    is_resizable BOOLEAN DEFAULT TRUE,
    is_draggable BOOLEAN DEFAULT TRUE,
    refresh_interval INTEGER DEFAULT 300, -- seconds
    last_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_widgets_dashboard_id ON public.widgets(dashboard_id);
CREATE INDEX idx_widgets_connector_id ON public.widgets(connector_id);
CREATE INDEX idx_widgets_type ON public.widgets(type);

-- RLS Policies
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage widgets in own dashboards" ON public.widgets
    USING (
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = widgets.dashboard_id AND user_id = auth.uid()
        )
    );
```

### Workflows & Automation

#### `public.workflows`
Automated workflow definitions and configurations.

```sql
CREATE TABLE public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    trigger_config JSONB NOT NULL, -- Trigger conditions and settings
    steps JSONB NOT NULL, -- Array of workflow steps
    config JSONB DEFAULT '{}', -- Workflow-level settings
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    is_template BOOLEAN DEFAULT FALSE,
    template_category TEXT,
    tags TEXT[] DEFAULT '{}',
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX idx_workflows_status ON public.workflows(status);
CREATE INDEX idx_workflows_is_template ON public.workflows(is_template) WHERE is_template = TRUE;
CREATE INDEX idx_workflows_tags ON public.workflows USING GIN(tags);

-- RLS Policies
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workflows" ON public.workflows
    USING (auth.uid() = user_id);
```

#### `public.workflow_executions`
Individual workflow execution instances and their results.

```sql
CREATE TABLE public.workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
    trigger_data JSONB DEFAULT '{}', -- Data that triggered the execution
    execution_context JSONB DEFAULT '{}', -- Runtime context and variables
    current_step INTEGER DEFAULT 0,
    step_results JSONB DEFAULT '[]', -- Array of step execution results
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER, -- Execution duration in milliseconds
    
    -- Computed column for duration
    GENERATED ALWAYS AS (
        CASE 
            WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (completed_at - started_at)) * 1000
            ELSE NULL 
        END
    ) STORED
);

-- Indexes
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX idx_workflow_executions_started_at ON public.workflow_executions(started_at);

-- RLS Policies
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view executions of own workflows" ON public.workflow_executions
    USING (
        EXISTS (
            SELECT 1 FROM public.workflows 
            WHERE id = workflow_executions.workflow_id AND user_id = auth.uid()
        )
    );
```

### AI Chat & Artifacts

#### `public.chat_sessions`
AI chat sessions and conversation history.

```sql
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    messages JSONB DEFAULT '[]', -- Array of chat messages
    context JSONB DEFAULT '{}', -- Session context and metadata
    model_config JSONB DEFAULT '{}', -- AI model configuration
    is_archived BOOLEAN DEFAULT FALSE,
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_last_message ON public.chat_sessions(last_message_at);
CREATE INDEX idx_chat_sessions_archived ON public.chat_sessions(is_archived);

-- RLS Policies
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
    USING (auth.uid() = user_id);
```

#### `public.artifacts`
Generated artifacts from AI interactions (dashboards, reports, etc.).

```sql
CREATE TABLE public.artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.artifacts(id) ON DELETE SET NULL, -- For versioning
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'dashboard', 'report', 'workflow', 'widget', etc.
    description TEXT,
    data JSONB NOT NULL, -- Artifact content and configuration
    file_path TEXT, -- Path to stored file if applicable
    file_size INTEGER, -- File size in bytes
    mime_type TEXT,
    version INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_artifacts_user_id ON public.artifacts(user_id);
CREATE INDEX idx_artifacts_session_id ON public.artifacts(session_id);
CREATE INDEX idx_artifacts_type ON public.artifacts(type);
CREATE INDEX idx_artifacts_parent_id ON public.artifacts(parent_id);
CREATE INDEX idx_artifacts_tags ON public.artifacts USING GIN(tags);

-- RLS Policies
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own artifacts" ON public.artifacts
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public artifacts" ON public.artifacts
    FOR SELECT USING (is_public = TRUE);
```

### Data Caching & Performance

#### `public.data_cache`
Cached data from external connectors for performance optimization.

```sql
CREATE TABLE public.data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connector_id UUID REFERENCES public.connectors(id) ON DELETE CASCADE NOT NULL,
    cache_key TEXT NOT NULL, -- Unique identifier for cached data
    data JSONB NOT NULL, -- Cached data payload
    query_hash TEXT NOT NULL, -- Hash of the query parameters
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    size_bytes INTEGER, -- Size of cached data
    hit_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(connector_id, cache_key)
);

-- Indexes
CREATE INDEX idx_data_cache_connector_id ON public.data_cache(connector_id);
CREATE INDEX idx_data_cache_expires_at ON public.data_cache(expires_at);
CREATE INDEX idx_data_cache_query_hash ON public.data_cache(query_hash);

-- RLS Policies
ALTER TABLE public.data_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access cache for own connectors" ON public.data_cache
    USING (
        EXISTS (
            SELECT 1 FROM public.connectors 
            WHERE id = data_cache.connector_id AND user_id = auth.uid()
        )
    );
```

### Audit & Analytics

#### `public.audit_logs`
System audit trail for security and compliance.

```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
    resource_type TEXT NOT NULL, -- 'dashboard', 'connector', 'workflow', etc.
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- No RLS - this is admin-only data
```

#### `public.usage_analytics`
Application usage metrics and analytics.

```sql
CREATE TABLE public.usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'page_view', 'dashboard_create', 'widget_add', etc.
    event_data JSONB DEFAULT '{}',
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_usage_analytics_user_id ON public.usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_event_type ON public.usage_analytics(event_type);
CREATE INDEX idx_usage_analytics_created_at ON public.usage_analytics(created_at);

-- RLS Policies
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON public.usage_analytics
    FOR SELECT USING (auth.uid() = user_id);
```

## Database Functions & Triggers

### Automatic Timestamp Updates

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connectors_updated_at 
    BEFORE UPDATE ON public.connectors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at 
    BEFORE UPDATE ON public.dashboards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at 
    BEFORE UPDATE ON public.widgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at 
    BEFORE UPDATE ON public.workflows 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON public.chat_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artifacts_updated_at 
    BEFORE UPDATE ON public.artifacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Cache Cleanup Function

```sql
-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.data_cache 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-cache', '0 */6 * * *', 'SELECT cleanup_expired_cache();');
```

### User Profile Creation Trigger

```sql
-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on auth.users insert
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

## Views & Materialized Views

### Dashboard Summary View

```sql
CREATE VIEW dashboard_summary AS
SELECT 
    d.id,
    d.user_id,
    d.name,
    d.description,
    d.is_public,
    d.view_count,
    d.created_at,
    d.updated_at,
    COUNT(w.id) as widget_count,
    ARRAY_AGG(DISTINCT w.type) FILTER (WHERE w.type IS NOT NULL) as widget_types,
    COUNT(DISTINCT w.connector_id) as connector_count
FROM public.dashboards d
LEFT JOIN public.widgets w ON d.id = w.dashboard_id
GROUP BY d.id, d.user_id, d.name, d.description, d.is_public, d.view_count, d.created_at, d.updated_at;
```

### Connector Health View

```sql
CREATE VIEW connector_health AS
SELECT 
    c.id,
    c.user_id,
    c.name,
    c.type,
    c.status,
    c.last_sync_at,
    c.last_error,
    CASE 
        WHEN c.last_sync_at IS NULL THEN 'never_synced'
        WHEN c.last_sync_at < NOW() - INTERVAL '1 hour' THEN 'stale'
        WHEN c.status = 'error' THEN 'error'
        ELSE 'healthy'
    END as health_status,
    COUNT(w.id) as widget_count
FROM public.connectors c
LEFT JOIN public.widgets w ON c.id = w.connector_id
GROUP BY c.id, c.user_id, c.name, c.type, c.status, c.last_sync_at, c.last_error;
```

## Indexes & Performance Optimization

### Composite Indexes

```sql
-- Dashboard widgets lookup
CREATE INDEX idx_widgets_dashboard_position ON public.widgets(dashboard_id, position_x, position_y);

-- Workflow execution tracking
CREATE INDEX idx_workflow_executions_workflow_status ON public.workflow_executions(workflow_id, status);

-- Chat session messages
CREATE INDEX idx_chat_sessions_user_recent ON public.chat_sessions(user_id, last_message_at DESC);

-- Artifact search
CREATE INDEX idx_artifacts_user_type_created ON public.artifacts(user_id, type, created_at DESC);
```

### Partial Indexes

```sql
-- Active connectors only
CREATE INDEX idx_connectors_active ON public.connectors(user_id, type) WHERE status = 'active';

-- Public dashboards only
CREATE INDEX idx_dashboards_public_recent ON public.dashboards(created_at DESC) WHERE is_public = TRUE;

-- Running workflow executions
CREATE INDEX idx_workflow_executions_running ON public.workflow_executions(workflow_id, started_at) WHERE status = 'running';
```

## Data Migration Scripts

### Initial Data Setup

```sql
-- Insert default connector schemas
INSERT INTO public.connector_schemas (connector_type, config_schema, credential_schema, data_schema, auth_type) VALUES
('twitter', 
 '{"type": "object", "properties": {"search_terms": {"type": "array"}, "max_results": {"type": "number"}}}',
 '{"type": "object", "properties": {"api_key": {"type": "string"}, "api_secret": {"type": "string"}, "access_token": {"type": "string"}, "access_token_secret": {"type": "string"}}}',
 '{"type": "object", "properties": {"tweets": {"type": "array"}, "metrics": {"type": "object"}}}',
 'oauth2'),
('linkedin',
 '{"type": "object", "properties": {"company_id": {"type": "string"}, "metrics": {"type": "array"}}}',
 '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "access_token": {"type": "string"}}}',
 '{"type": "object", "properties": {"posts": {"type": "array"}, "analytics": {"type": "object"}}}',
 'oauth2'),
('salesforce',
 '{"type": "object", "properties": {"objects": {"type": "array"}, "fields": {"type": "array"}}}',
 '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}, "security_token": {"type": "string"}}}',
 '{"type": "object", "properties": {"records": {"type": "array"}, "metadata": {"type": "object"}}}',
 'oauth2'),
('hubspot',
 '{"type": "object", "properties": {"object_type": {"type": "string"}, "properties": {"type": "array"}}}',
 '{"type": "object", "properties": {"api_key": {"type": "string"}}}',
 '{"type": "object", "properties": {"results": {"type": "array"}, "paging": {"type": "object"}}}',
 'api_key');
```

## Backup & Recovery Strategy

### Backup Configuration
- **Full Backup:** Daily automated backups via Supabase
- **Point-in-Time Recovery:** 7-day retention period
- **Cross-Region Replication:** For disaster recovery
- **Encrypted Backups:** All backups encrypted at rest

### Recovery Procedures
- **Data Corruption:** Point-in-time recovery to last known good state
- **Accidental Deletion:** Row-level recovery from backup
- **System Failure:** Failover to backup region
- **Performance Issues:** Read replica promotion

This schema design provides a robust foundation for the Dashboard Workspace Application with proper security, performance optimization, and scalability considerations.