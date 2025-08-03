========================
CODE SNIPPETS
========================
TITLE: Testing: Setup and Run Database Tests
DESCRIPTION: Instructions for setting up a local database environment using Docker and running tests. This involves starting a PostgreSQL container, applying migrations, and executing the test suite.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_24

LANGUAGE: sh
CODE:
```
# Runs the database in a docker container
docker-compose -f docker-compose-dev.yml up postgres

# Applies the migrations to the database (requires soda cli)
make migrate_test

# Executes the tests
make test
```

----------------------------------------

TITLE: Start Auth Executable
DESCRIPTION: Starts the Auth service by running the compiled executable. This command will re-run migrations if necessary and then start the API.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_18

LANGUAGE: zsh
CODE:
```
./auth
```

----------------------------------------

TITLE: Run Supabase Auth in Docker Development
DESCRIPTION: Starts the Supabase Auth service and its dependencies, such as PostgreSQL, using Docker Compose for a local development environment. This command simplifies setup and allows verification via a health check endpoint.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
make dev
```

----------------------------------------

TITLE: Start Supabase Auth Dev Containers (make dev)
DESCRIPTION: Starts the development containers for Supabase Auth in an attached state, providing live log output. This command is essential for local development and testing.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_0

LANGUAGE: bash
CODE:
```
make dev
```

----------------------------------------

TITLE: Start PostgreSQL Container
DESCRIPTION: Starts the PostgreSQL container using a specific docker-compose file. This is a prerequisite for running the Auth service.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_11

LANGUAGE: docker-compose
CODE:
```
docker-compose -f docker-compose-dev.yml up postgres
```

----------------------------------------

TITLE: Install Go 1.22 on macOS (brew)
DESCRIPTION: Installs Go version 1.22 using Homebrew on macOS. This is a prerequisite for developing the Supabase Auth project, which is written in Go.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_4

LANGUAGE: bash
CODE:
```
# Via Homebrew on macOS
brew install go@1.22
```

----------------------------------------

TITLE: Database Migrations: Run migrate_test
DESCRIPTION: Executes database migrations using a make command. This process typically requires the 'soda' CLI to be installed and configured.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_23

LANGUAGE: zsh
CODE:
```
make migrate_test
```

----------------------------------------

TITLE: Auth Migrations Applied Successfully Log
DESCRIPTION: Example log output indicating that Auth migrations were applied successfully to the database.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_16

LANGUAGE: terminal
CODE:
```
INFO[0000] Auth migrations applied successfully
DEBU[0000] after status
[POP] 2021/12/15 10:44:36 sql - SELECT EXISTS (SELECT schema_migrations.* FROM schema_migrations AS schema_migrations WHERE version = $1) | ["20210710035447"]
[POP] 2021/12/15 10:44:36 sql - SELECT EXISTS (SELECT schema_migrations.* FROM schema_migrations AS schema_migrations WHERE version = $1) | ["20210722035447"]
[POP] 2021/12/15 10:44:36 sql - SELECT EXISTS (SELECT schema_migrations.* FROM schema_migrations AS schema_migrations WHERE version = $1) | ["20210730183235"]
[POP] 2021/12/15 10:44:36 sql - SELECT EXISTS (SELECT schema_migrations.* FROM schema_migrations AS schema_migrations WHERE version = $1) | ["20210909172000"]
[POP] 2021/12/15 10:44:36 sql - SELECT EXISTS (SELECT schema_migrations.* FROM schema_migrations AS schema_migrations WHERE version = $1) | ["20211122151130"]
Version          Name                         Status
20210710035447   alter_users                  Applied
20210722035447   adds_confirmed_at            Applied
20210730183235   add_email_change_confirmed   Applied
20210909172000   create_identities_table      Applied
20211122151130   create_user_id_idx           Applied
```

----------------------------------------

TITLE: Auth Service Started Log
DESCRIPTION: Log output indicating that the Auth service has successfully started and is listening on a specific port.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_19

LANGUAGE: terminal
CODE:
```
INFO[0000] Auth API started on: localhost:9999
```

----------------------------------------

TITLE: Install Soda CLI on macOS (brew)
DESCRIPTION: Installs the Soda CLI, a database toolbox for managing schema and migrations, using Homebrew on macOS. Soda is used by Supabase Auth for database operations.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_7

LANGUAGE: bash
CODE:
```
# Via Homebrew on macOS
brew install gobuffalo/tap/pop
```

----------------------------------------

TITLE: Supabase Auth Go HTTPS Server Setup
DESCRIPTION: A Go code snippet demonstrating how to configure the HTTP server to serve HTTPS traffic locally, necessary for certain authentication flows like Apple OAuth.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_13

LANGUAGE: go
CODE:
```
func (a *API) ListenAndServe(hostAndPort string) {
  log := logrus.WithField("component", "api")
  path, err := os.Getwd()
  if err != nil {
    log.Println(err)
  }
  server := &http.Server{
    Addr:    hostAndPort,
    Handler: a.handler,
  }
  done := make(chan struct{})
  defer close(done)
  go func() {
    waitForTermination(log, done)
    ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
    defer cancel()
    server.Shutdown(ctx)
  }()
  if err := server.ListenAndServeTLS("PATH_TO_CRT_FILE", "PATH_TO_KEY_FILE"); err != http.ErrServerClosed {
    log.WithError(err).Fatal("http server listen failed")
  }
}
```

----------------------------------------

TITLE: Install Docker on macOS (brew)
DESCRIPTION: Installs Docker on macOS using Homebrew. Docker is a core dependency for the Supabase Auth development environment, enabling containerized workflows.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_6

LANGUAGE: bash
CODE:
```
# Via Homebrew on macOS
brew install docker
```

----------------------------------------

TITLE: Run Supabase Auth Tests in Docker (make docker-test)
DESCRIPTION: Starts the Supabase Auth containers with a fresh database and executes the project's test suite. This ensures code changes do not break existing functionality.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_1

LANGUAGE: bash
CODE:
```
make docker-test
```

----------------------------------------

TITLE: Supabase Auth SMTP Configuration Example
DESCRIPTION: Provides an example of how to configure SMTP settings for email delivery in Supabase Auth using a properties file format. These settings are crucial for features like password recovery and user confirmation.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_14

LANGUAGE: properties
CODE:
```
GOTRUE_SMTP_HOST=smtp.mandrillapp.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=smtp-delivery@example.com
GOTRUE_SMTP_PASS=correcthorsebatterystaple
GOTRUE_SMTP_ADMIN_EMAIL=support@example.com
GOTRUE_MAILER_SUBJECTS_CONFIRMATION="Please confirm"
```

----------------------------------------

TITLE: Configure Database Connection String
DESCRIPTION: Sets the DATABASE_URL environment variable to connect Auth to the PostgreSQL database running in Docker. Ensure the credentials and port match your setup.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_17

LANGUAGE: env
CODE:
```
DATABASE_URL="postgres://supabase_auth_admin:root@localhost:5432/postgres"
```

----------------------------------------

TITLE: Build Supabase Auth Binary
DESCRIPTION: Builds the Supabase Auth binary using Go. It embeds the current Git commit hash as the version information using ldflags. This command requires a Go toolchain to be installed.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
go build -ldflags "-X github.com/supabase/auth/cmd.Version=`git rev-parse HEAD`"
```

----------------------------------------

TITLE: Build Soda CLI from Source
DESCRIPTION: Builds the Soda CLI from its source code, typically used as a workaround for installation issues on specific macOS versions. This command compiles the Soda binary and places it in the system's bin directory.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_8

LANGUAGE: bash
CODE:
```
go build -o /bin/soda github.com/gobuffalo/pop/soda
```

----------------------------------------

TITLE: GET /settings API Endpoint
DESCRIPTION: Retrieves publicly available settings for the Supabase Auth instance, including enabled external providers and signup configurations.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_20

LANGUAGE: APIDOC
CODE:
```
GET /settings
  Description: Returns publicly available settings for the auth instance.
  Returns:
    object: An object containing settings such as:
      external: object
        Description: Indicates which external authentication providers are enabled (e.g., apple, azure, google).
      disable_signup: boolean
        Description: Flag indicating if new signups are disabled.
      autoconfirm: boolean
        Description: Flag indicating if phone confirmation is automatically confirmed.
```

----------------------------------------

TITLE: POST /verify & GET /verify - Verification
DESCRIPTION: Verifies user registrations, password recoveries, or invitations using tokens. Supports both POST requests with JSON bodies and GET requests with query parameters, including email/phone verification via SMS.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_26

LANGUAGE: APIDOC
CODE:
```
POST /verify

Verifies a registration, password recovery, or invite using a token.

Request Body (Email/Invite):
```json
{
  "type": "signup",
  "token": "confirmation-code-delivered-in-email"
}
```

Note: `password` is required for signup verification if no existing password exists.

Success Response (Email/Invite):
```json
{
  "access_token": "jwt-token-representing-the-user",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "a-refresh-token",
  "type": "signup | recovery | invite"
}
```

Request Body (Phone SMS):
```json
{
  "type": "sms",
  "token": "confirmation-otp-delivered-in-sms",
  "redirect_to": "https://supabase.io",
  "phone": "phone-number-sms-otp-was-delivered-to"
}
```

Success Response (Phone SMS):
```json
{
  "access_token": "jwt-token-representing-the-user",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "a-refresh-token"
}
```

GET /verify

Verifies registration, recovery, magiclink, or invite via query parameters.

Query Parameters:
```json
{
  "type": "signup",
  "token": "confirmation-code-delivered-in-email",
  "redirect_to": "https://supabase.io"
}
```

User will be logged in and redirected to:
```
SITE_URL/#access_token=jwt-token-representing-the-user&token_type=bearer&expires_in=3600&refresh_token=a-refresh-token&type=invite
```

Notes:
- The `type` parameter helps determine the user flow post-verification (e.g., password setup for 'invite'/'recovery', welcome message for 'signup').
- The client-side SDK automatically handles the redirect parameters.
```

----------------------------------------

TITLE: GET /user - Get Logged-in User
DESCRIPTION: Retrieves the JSON object for the currently logged-in user. This endpoint requires authentication.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_31

LANGUAGE: APIDOC
CODE:
```
GET /user

Description:
  Get the JSON object for the logged in user.
  Requires authentication.

Response Body:
  Content-Type: application/json
  {
    "id": "11111111-2222-3333-4444-5555555555555",
    "email": "email@example.com",
    "confirmation_sent_at": "2016-05-15T20:49:40.882805774-07:00",
    "created_at": "2016-05-15T19:53:12.368652374-07:00",
    "updated_at": "2016-05-15T19:53:12.368652374-07:00"
  }
```

LANGUAGE: JSON
CODE:
```
{
  "id": "11111111-2222-3333-4444-5555555555555",
  "email": "email@example.com",
  "confirmation_sent_at": "2016-05-15T20:49:40.882805774-07:00",
  "created_at": "2016-05-15T19:53:12.368652374-07:00",
  "updated_at": "2016-05-15T19:53:12.368652374-07:00"
}
```

----------------------------------------

TITLE: GET /callback - OAuth2 Callback Handler
DESCRIPTION: Handles the redirect from external OAuth providers after user authorization. It processes the returned tokens and redirects the user to the site URL with authentication details.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_36

LANGUAGE: APIDOC
CODE:
```
GET /callback

Description:
  External provider should redirect to here.

Redirect Behavior:
  Redirects to `<GOTRUE_SITE_URL>#access_token=<access_token>&refresh_token=<refresh_token>&provider_token=<provider_oauth_token>&expires_in=3600&provider=<provider_name>`.
  If additional scopes were requested, `provider_token` will be populated, which can be used to fetch additional data from the provider or interact with their services.
```

----------------------------------------

TITLE: Stop Local PostgreSQL Service
DESCRIPTION: Stops a local PostgreSQL process if it conflicts with the Docker container, typically installed via Homebrew on macOS.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_12

LANGUAGE: zsh
CODE:
```
brew services stop postgresql
```

----------------------------------------

TITLE: GET /authorize - OAuth2 Provider Authorization
DESCRIPTION: Initiates the OAuth2 authorization flow with external providers. It redirects the user to the selected provider and then back to the `/callback` endpoint. Additional scopes can be requested.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_35

LANGUAGE: APIDOC
CODE:
```
GET /authorize

Description:
  Get access_token from external oauth provider.

Query Parameters:
  provider=<provider_name>
    (e.g., apple, azure, bitbucket, discord, facebook, figma, github, gitlab, google, keycloak, linkedin, notion, slack, snapchat, spotify, twitch, twitter, workos)
  scopes=<optional_scopes>
    Optional additional scopes depending on the provider. Email and name are requested by default.

Flow:
  Redirects to provider and then to `/callback`.

Provider Specific Setup:
  For Apple specific setup see: <https://github.com/supabase/auth#apple-oauth>
```

----------------------------------------

TITLE: Supabase Auth Admin API Endpoints
DESCRIPTION: Provides details on interacting with Supabase Auth's administrative API for user management. Requires a signed JWT with the 'supabase_admin' role. Endpoints include creating users via POST and listing users via GET.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_22

LANGUAGE: APIDOC
CODE:
```
Admin API:

Authentication:
  Requires a JWT with the 'supabase_admin' role, signed using the GOTRUE_JWT_SECRET.
  The JWT is passed as a Bearer token in the Authorization header.

Create User (Sign Up a User):
  Method: POST
  Endpoint: /admin/users
  Description: Creates a new user in the Supabase Auth system.
  Request Body:
    Content-Type: application/json
    Payload:
      {
        "email": "user@example.com",
        "password": "12345678"
      }
  Response:
    Status: 200 OK
    Body:
      {
        "id": "e78c512d-68e4-482b-901b-75003e89acae",
        "aud": "authenticated",
        "role": "authenticated",
        "email": "user@example.com",
        "phone": "",
        "app_metadata": {
          "provider": "email",
          "providers": ["email"]
        },
        "user_metadata": {},
        "identities": null,
        "created_at": "2021-12-15T12:40:03.507551-05:00",
        "updated_at": "2021-12-15T12:40:03.512067-05:00"
      }

List/Find Users:
  Method: GET
  Endpoint: /admin/users
  Description: Retrieves a list of all users.
  Request Headers:
    Authorization: Bearer <YOUR_SIGNED_JWT>
  Response:
    Status: 200 OK
    Body:
      {
        "aud": "authenticated",
        "users": [
          {
            "id": "b7fd0253-6e16-4d4e-b61b-5943cb1b2102",
            "aud": "authenticated",
            "role": "authenticated",
            "email": "user+4@example.com",
            "phone": "",
            "app_metadata": {
              "provider": "email",
              "providers": ["email"]
            },
            "user_metadata": {},
            "identities": null,
            "created_at": "2021-12-15T12:43:58.12207-05:00",
            "updated_at": "2021-12-15T12:43:58.122073-05:00"
          },
          ...
        ]
      }
```

----------------------------------------

TITLE: GET /reauthenticate - Send Reauthentication Nonce
DESCRIPTION: Sends a nonce to the user's email or phone number for reauthentication. This endpoint requires the user to be logged in and must have an email or phone number associated with their account.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_33

LANGUAGE: APIDOC
CODE:
```
GET /reauthenticate

Description:
  Sends a nonce to the user's email (preferred) or phone. This endpoint requires the user to be logged in / authenticated first. The user needs to have either an email or phone number for the nonce to be sent successfully.

Headers:
  Authorization: Bearer eyJhbGciOiJI...M3A90LCkxxtX9oNP9KZO
```

LANGUAGE: JS
CODE:
```
headers: {
  "Authorization" : "Bearer eyJhbGciOiJI...M3A90LCkxxtX9oNP9KZO"
}
```

----------------------------------------

TITLE: Configure PostgreSQL Port
DESCRIPTION: Guides users on how to change the default PostgreSQL port (5432) to a custom port (e.g., 7432) across multiple configuration files for the Supabase Auth project. This involves updating Docker Compose, database configuration, environment variables, and migration scripts.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_25

LANGUAGE: yaml
CODE:
```
// file: docker-compose-dev.yml
ports:
  - 7432:5432 \ ← set the first value to your external facing port
```

LANGUAGE: yaml
CODE:
```
// file: database.yaml
test:
  dialect: "postgres"
  database: "postgres"
  host: {{ envOr "POSTGRES_HOST" "127.0.0.1" }}
  port: {{ envOr "POSTGRES_PORT" "7432" }} ← set to your port
```

----------------------------------------

TITLE: Run Database Migrations
DESCRIPTION: Sets up the database schema by applying migrations using Soda. This command ensures the database is ready for the Auth service.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_15

LANGUAGE: zsh
CODE:
```
make migrate_test
```

----------------------------------------

TITLE: Execute Supabase Auth Binary
DESCRIPTION: Executes the compiled Supabase Auth binary. This command assumes the binary has been successfully built and is present in the current directory with execute permissions.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
./auth
```

----------------------------------------

TITLE: Database Configuration and Migrations
DESCRIPTION: Sets up the connection details for the Supabase Auth database, including the driver, connection string, and connection pooling. It also outlines methods for applying database migrations.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
Database Configuration:

```properties
GOTRUE_DB_DRIVER=postgres
DATABASE_URL=root@localhost/auth
```

- `DB_DRIVER` - `string` **required**
  Chooses what dialect of database you want. Must be `postgres`.

- `DATABASE_URL` (no prefix) / `DB_DATABASE_URL` - `string` **required**
  Connection string for the database.

- `GOTRUE_DB_MAX_POOL_SIZE` - `int`
  Sets the maximum number of open connections to the database. Defaults to 0 which is equivalent to an "unlimited" number of connections.

- `DB_NAMESPACE` - `string`
  Adds a prefix to all table names.

Migrations:

Migrations are applied automatically when you run `./auth`.

To rerun migrations:
- If built locally: `./auth migrate`
- Using Docker: `docker run --rm auth gotrue migrate`
```

----------------------------------------

TITLE: Build Auth Binary
DESCRIPTION: Compiles the Auth binary using the make build command. This step is performed after fetching necessary Git tags.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_14

LANGUAGE: zsh
CODE:
```
make build
```

----------------------------------------

TITLE: Configure Go 1.22 PATH in Zsh
DESCRIPTION: Sets the Go 1.22 binary directory to the system's PATH environment variable within the Zsh shell configuration. This allows Go commands to be executed from any directory.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_5

LANGUAGE: zsh
CODE:
```
# Set the environment variable in the ~/.zshrc file
 echo 'export PATH="/opt/homebrew/opt/go@1.22/bin:$PATH"' >> ~/.zshrc
```

----------------------------------------

TITLE: Build Supabase Auth Binary for ARM64
DESCRIPTION: Builds the Supabase Auth binary specifically for Linux ARM64 architecture. It cross-compiles the Go code and embeds the Git commit hash as the version. This requires a Go toolchain with cross-compilation capabilities.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
GOOS=linux GOARCH=arm64 go build -ldflags "-X github.com/supabase/auth/cmd.Version=`git rev-parse HEAD`" -o gotrue-arm64
```

----------------------------------------

TITLE: Supabase Auth Configuration Parameters
DESCRIPTION: Details the environment variables and configuration options for Supabase Auth, covering site URL, URI allow list, security settings, rate limiting, and password policies.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_4

LANGUAGE: APIDOC
CODE:
```
Supabase Auth Configuration:

Configuration can be managed via a `.env` file or environment variables. Environment variables prefixed with `GOTRUE_` take precedence.

Top-Level Configuration:

```properties
GOTRUE_SITE_URL=https://example.netlify.com/
```

- **SITE_URL** (`string`, required):
  The base URL of your site. Used for constructing email URLs and validating `redirect_to` parameters. URIs sharing a host with `SITE_URL` are permitted for `redirect_to`.

- **URI_ALLOW_LIST** (`string`):
  A comma-separated list of URIs permitted as `redirect_to` destinations. Supports wildcard matching (globbing) for subdomains and paths (e.g., `"https://foo.example.com,https://*.foo.example.com,https://bar.example.com"`). Defaults to `[]`.

- **OPERATOR_TOKEN** (`string`, _Multi-instance mode only_):
  A shared secret used to verify requests proxied through an operator (like Netlify), ensuring payload values are trusted.

- **DISABLE_SIGNUP** (`bool`):
  If `true`, new users can only be created via invites. Defaults to `false` (all signups enabled).

- **GOTRUE_EXTERNAL_EMAIL_ENABLED** (`bool`):
  If `false`, email signups are disabled. Users can still sign up/in via external OAuth providers. Defaults to `true`.

- **GOTRUE_EXTERNAL_PHONE_ENABLED** (`bool`):
  If `false`, phone signups are disabled. Users can still sign up/in via external OAuth providers. Defaults to `true`.

- **GOTRUE_RATE_LIMIT_HEADER** (`string`):
  The header used for rate limiting the `/token` endpoint.

- **GOTRUE_RATE_LIMIT_EMAIL_SENT** (`string`):
  Defines the rate limit for emails sent on endpoints like `/signup`, `/invite`, `/magiclink`, `/recover`, `/otp`, and `/user` (e.g., '100/h').

- **GOTRUE_PASSWORD_MIN_LENGTH** (`int`):
  The minimum required length for user passwords. Defaults to `6`.

- **GOTRUE_PASSWORD_REQUIRED_CHARACTERS** (`string`):
  A string of character sets separated by `:`. Passwords must contain at least one character from each specified set. The `:` character can be escaped with `\`.

- **GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED** (`bool`):
  Enables detection of malicious refresh token reuse. If detected, all tokens descended from the offending token are revoked. Defaults to `false`.

- **GOTRUE_SECURITY_REFRESH_TOKEN_REUSE_INTERVAL** (`string`):
  Applicable only if `GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED` is `true`. Defines an interval during which a refresh token can be exchanged multiple times without triggering malicious reuse detection. This supports concurrency or offline scenarios. Only the immediately preceding revoked token can be reused within this interval.
```

----------------------------------------

TITLE: POST /signup - User Registration
DESCRIPTION: Registers a new user with either an email and password or a phone number and password. Handles duplicate signups and provides specific responses based on AUTOCONFIRM settings.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_23

LANGUAGE: APIDOC
CODE:
```
POST /signup

Registers a new user with an email and password.

Request Body:
```json
{
  "email": "email@example.com",
  "password": "secret"
}
```

Success Response:
```js
{
  "id": "11111111-2222-3333-4444-5555555555555",
  "email": "email@example.com",
  "confirmation_sent_at": "2016-05-15T20:49:40.882805774-07:00",
  "created_at": "2016-05-15T19:53:12.368652374-07:00",
  "updated_at": "2016-05-15T19:53:12.368652374-07:00"
}
```

Registers a new user with a phone number and password.

Request Body:
```js
{
  "phone": "12345678", // follows the E.164 format
  "password": "secret"
}
```

Success Response:
```js
{
  "id": "11111111-2222-3333-4444-5555555555555", // if duplicate sign up, this ID will be faux
  "phone": "12345678",
  "confirmation_sent_at": "2016-05-15T20:49:40.882805774-07:00",
  "created_at": "2016-05-15T19:53:12.368652374-07:00",
  "updated_at": "2016-05-15T19:53:12.368652374-07:00"
}
```

Error Response (if AUTOCONFIRM is enabled and signup is a duplicate):
```json
{
  "code":400,
  "msg":"User already registered"
}
```

Notes:
- If a signup is a duplicate, faux data is returned to avoid leaking information about existing accounts.
```

----------------------------------------

TITLE: Update Package Dependencies
DESCRIPTION: Details the commands required to update project dependencies. It includes fetching new dependencies and tidying up the Go module cache if necessary.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_28

LANGUAGE: sh
CODE:
```
make deps
```

LANGUAGE: sh
CODE:
```
go mod tidy if necessary
```

----------------------------------------

TITLE: Build Supabase Auth PostgreSQL Docker Image
DESCRIPTION: Builds the PostgreSQL Docker image required for the Supabase Auth development environment using Docker Compose. This command ensures the database container is ready.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_10

LANGUAGE: bash
CODE:
```
docker-compose -f docker-compose-dev.yml build postgres
```

----------------------------------------

TITLE: Manage Supabase Auth PostgreSQL Container
DESCRIPTION: Provides essential Docker commands for managing the PostgreSQL container used by Supabase Auth. This includes executing commands inside the container, removing the container, and removing associated volumes.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_27

LANGUAGE: zsh
CODE:
```
# file: docker-compose-dev.yml
container_name: auth_postgres
```

LANGUAGE: zsh
CODE:
```
# Command line into bash on the PostgreSQL container
docker exec -it auth_postgres bash
```

LANGUAGE: zsh
CODE:
```
# Removes Container
docker container rm -f auth_postgres
```

LANGUAGE: zsh
CODE:
```
# Removes volume
docker volume rm postgres_data
```

----------------------------------------

TITLE: Fetch and Push Git Tags
DESCRIPTION: Fetches tags from the upstream repository and pushes them to your fork to ensure the correct tag is set before building the binary.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_13

LANGUAGE: zsh
CODE:
```
# Fetch the tags from the upstream repository
git fetch upstream --tags

# Push the tags to your fork
git push origin --tags
```

----------------------------------------

TITLE: Observability: Custom Resource Attributes and Debugging
DESCRIPTION: Details how to add custom resource attributes to telemetry data and enable debug logging for OpenTelemetry SDK issues in Supabase Auth.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_10

LANGUAGE: APIDOC
CODE:
```
Custom Resource Attributes and Debugging:

Custom Resource Attributes:
Define custom resource attributes using the standard `OTEL_RESOURCE_ATTRIBUTES` environment variable.
Example: `OTEL_RESOURCE_ATTRIBUTES=service.instance.id=auth-instance-1,cloud.region=us-east-1`
A default attribute `auth.version` is provided containing the build version.
```

LANGUAGE: APIDOC
CODE:
```
Debugging:

To debug issues with traces or metrics not being pushed, set `DEBUG=true` to get more insights from the OpenTelemetry SDK.
```

----------------------------------------

TITLE: Clone Supabase Auth Repository
DESCRIPTION: Clones the Supabase Auth project repository from GitHub. This is the first step to obtaining the source code for local development and contribution.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_9

LANGUAGE: bash
CODE:
```
git clone https://github.com/supabase/auth
```

----------------------------------------

TITLE: Auth Settings Endpoint
DESCRIPTION: Queries the /settings endpoint to view the current configuration of the Auth service, including enabled external providers and signup settings.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_21

LANGUAGE: APIDOC
CODE:
```
GET http://localhost:9999/settings

Response:
{
  "external": {
    "apple": false,
    "azure": false,
    "bitbucket": false,
    "discord": false,
    "github": false,
    "gitlab": false,
    "google": false,
    "facebook": false,
    "snapchat": false,
    "spotify": false,
    "slack": false,
    "slack_oidc": false,
    "twitch": true,
    "twitter": false,
    "email": true,
    "phone": false,
    "saml": false
  },
  "external_labels": {
    "saml": "auth0"
  },
  "disable_signup": false,
  "mailer_autoconfirm": false,
  "phone_autoconfirm": false,
  "sms_provider": "twilio"
}
```

----------------------------------------

TITLE: Observability: Metrics Configuration
DESCRIPTION: Enables and configures OpenTelemetry metrics for Supabase Auth. Supports exporting metrics to collectors like Prometheus or OpenTelemetry, providing insights into application performance.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_9

LANGUAGE: APIDOC
CODE:
```
Metrics Configuration:

To enable metrics configure these variables:

- `GOTRUE_METRICS_ENABLED` - `boolean`

- `GOTRUE_METRICS_EXPORTER` - `string` (only `opentelemetry` and `prometheus` supported)

Prometheus Exporter Configuration:
Configure server host and port using standard OpenTelemetry variables:

- `OTEL_EXPORTER_PROMETHEUS_HOST` - IP address, default `0.0.0.0`
- `OTEL_EXPORTER_PROMETHEUS_PORT` - port number, default `9100`

Metrics are exported on the `/` path.

OpenTelemetry Exporter Configuration (e.g., for Honeycomb.io):

```
OTEL_SERVICE_NAME=auth
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io:443
OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=<API-KEY>,x-honeycomb-dataset=auth"
```

Note: Honeycomb.io requires a paid plan for metrics ingestion.
```

----------------------------------------

TITLE: Supabase Auth Email Configuration Parameters
DESCRIPTION: Lists and describes the various configuration parameters for customizing email behavior in Supabase Auth. This includes settings for SMTP, sender details, confirmation links, and email subjects.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_15

LANGUAGE: APIDOC
CODE:
```
SMTP_ADMIN_EMAIL: string (required)
  The 'From' email address for all emails sent by Supabase Auth.

SMTP_HOST: string (required)
  The mail server hostname to send emails through.

SMTP_PORT: number (required)
  The port number to connect to the mail server on.

SMTP_USER: string
  The username required for authentication with the mail server.

SMTP_PASS: string
  The password required for authentication with the mail server.

SMTP_MAX_FREQUENCY: number
  Minimum time in seconds between sending confirmation or password reset emails. Defaults to 900 (15 minutes).

SMTP_SENDER_NAME: string
  Sets the display name of the sender. Defaults to the SMTP_ADMIN_EMAIL if not specified.

MAILER_AUTOCONFIRM: bool
  If set to true, email confirmation is not required for new signups. Defaults to false.

MAILER_OTP_EXP: number
  Duration in seconds for which an email link or OTP (One-Time Password) remains valid.

MAILER_URLPATHS_INVITE: string
  URL path appended to SiteURL for user invite emails. Defaults to '/verify'.

MAILER_URLPATHS_CONFIRMATION: string
  URL path appended to SiteURL for signup confirmation emails. Defaults to '/verify'.

MAILER_URLPATHS_RECOVERY: string
  URL path appended to SiteURL for password reset emails. Defaults to '/verify'.

MAILER_URLPATHS_EMAIL_CHANGE: string
  URL path appended to SiteURL for email change confirmation emails. Defaults to '/verify'.

MAILER_SUBJECTS_INVITE: string
  Email subject for user invite emails. Defaults to 'You have been invited'.

MAILER_SUBJECTS_CONFIRMATION: string
  Email subject for signup confirmation emails. Defaults to 'Confirm Your Signup'.

MAILER_SUBJECTS_RECOVERY: string
  Email subject for password reset emails. Defaults to 'Reset Your Password'.

MAILER_SUBJECTS_MAGIC_LINK: string
  Email subject for magic link emails. Defaults to 'Your Magic Link'.

MAILER_SUBJECTS_EMAIL_CHANGE: string
  Email subject for email change confirmation emails. Defaults to 'Confirm Email Change'.

MAILER_TEMPLATES_INVITE: string
  URL path to a custom HTML template for user invite emails. Variables like SiteURL, Email, and ConfirmationURL are available. If not provided, a default template is used.

MAILER_TEMPLATES_CONFIRMATION: string
  URL path to a custom HTML template for signup confirmation emails. Variables like SiteURL, Email, and ConfirmationURL are available. If not provided, a default template is used.

MAILER_TEMPLATES_RECOVERY: string
  URL path to a custom HTML template for password reset emails. Variables like SiteURL, Email, and ConfirmationURL are available. If not provided, a default template is used.

MAILER_TEMPLATES_MAGIC_LINK: string
  URL path to a custom HTML template for magic link emails. Variables like SiteURL, Email, and ConfirmationURL are available. If not provided, a default template is used.

MAILER_TEMPLATES_EMAIL_CHANGE: string
  URL path to a custom HTML template for email change confirmation emails. Variables like SiteURL, Email, NewEmail, and ConfirmationURL are available. If not provided, a default template is used.
```

----------------------------------------

TITLE: Supabase Auth External Authentication Providers Configuration
DESCRIPTION: Configuration options for enabling and setting up external authentication providers like GitHub, Apple, and Google. Requires specific OAuth credentials for each provider.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_12

LANGUAGE: APIDOC
CODE:
```
Supported Providers: apple, azure, bitbucket, discord, facebook, figma, github, gitlab, google, keycloak, linkedin, notion, snapchat, spotify, slack, twitch, twitter, workos.

EXTERNAL_X_ENABLED: bool
  Whether this external provider is enabled or not.

EXTERNAL_X_CLIENT_ID: string (required)
  The OAuth2 Client ID registered with the external provider.

EXTERNAL_X_SECRET: string (required)
  The OAuth2 Client Secret provided by the external provider when you registered.

EXTERNAL_X_REDIRECT_URI: string (required)
  The URI a OAuth2 provider will redirect to with the `code` and `state` values.

EXTERNAL_X_URL: string
  The base URL used for constructing the URLs to request authorization and access tokens. Used by `gitlab` and `keycloak`. For `gitlab` it defaults to `https://gitlab.com`. For `keycloak` you need to set this to your instance, for example: `https://keycloak.example.com/realms/myrealm`.
```

----------------------------------------

TITLE: Logging Configuration
DESCRIPTION: Configures the logging behavior of Supabase Auth, allowing control over the log level and the destination for log output, such as a file.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_7

LANGUAGE: APIDOC
CODE:
```
Logging Configuration:

```properties
LOG_LEVEL=debug # available without GOTRUE prefix (exception)
GOTRUE_LOG_FILE=/var/log/go/auth.log
```

- `LOG_LEVEL` - `string`
  Controls what log levels are output. Choose from `panic`, `fatal`, `error`, `warn`, `info`, or `debug`. Defaults to `info`.

- `LOG_FILE` - `string`
  If you wish logs to be written to a file, set `log_file` to a valid file path.
```

----------------------------------------

TITLE: Observability: Tracing Configuration
DESCRIPTION: Enables and configures OpenTelemetry tracing for Supabase Auth. This allows exporting trace data to a collector for monitoring and debugging distributed systems.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_8

LANGUAGE: APIDOC
CODE:
```
Tracing Configuration:

To enable tracing configure these variables:

- `GOTRUE_TRACING_ENABLED` - `boolean`

- `GOTRUE_TRACING_EXPORTER` - `string` (only `opentelemetry` supported)

Configure your OpenTelemetry Exporter (e.g., for Honeycomb.io):

```
OTEL_SERVICE_NAME=auth
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io:443
OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=<API-KEY>,x-honeycomb-dataset=auth"
```

HTTP Route Tracing:
All HTTP calls are traced using parametrized routes. Route parameters are exposed as `http.route.params.<route-key>` span attributes.

Example:
Request: `GET /admin/users/4acde936-82dc-4552-b851-831fb8ce0927/`
Traced as:
```
http.method = GET
http.route = /admin/users/{user_id}
http.route.params.user_id = 4acde936-82dc-4552-b851-831fb8ce0927
```
```

----------------------------------------

TITLE: API Configuration Variables
DESCRIPTION: Configures the network settings for the Supabase Auth API, including hostnames, ports, and external access URLs. These variables control how the API listens for requests and how it's exposed externally.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
API Configuration:

```properties
GOTRUE_API_HOST=localhost
PORT=9999
API_EXTERNAL_URL=http://localhost:9999
```

- `API_HOST` - `string`
  Hostname to listen on.

- `PORT` (no prefix) / `API_PORT` - `number`
  Port number to listen on. Defaults to `8081`.

- `API_ENDPOINT` - `string` _Multi-instance mode only_
  Controls what endpoint Netlify can access this API on.

- `API_EXTERNAL_URL` - `string` **required**
  The URL on which Gotrue might be accessed at.

- `REQUEST_ID_HEADER` - `string`
  If you wish to inherit a request ID from the incoming request, specify the name in this value.
```

----------------------------------------

TITLE: POST /otp - OTP Delivery
DESCRIPTION: Delivers a One-Time-Password (OTP) via magiclink (email) or SMS. Optionally creates a user if they do not exist.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_27

LANGUAGE: APIDOC
CODE:
```
POST /otp

Delivers an OTP via email (magiclink) or SMS.

Request Body (Phone SMS):
```js
{
  "phone": "12345678" // follows the E.164 format
  "create_user": true
}
```

Request Body (Email Magiclink):
```js
{
  "email": "email@example.com"
  "create_user": true
}
```

Success Response:
```json
{}
```

Notes:
- If `create_user` is set to `true`, the user will not be automatically signed up if they do not already exist.
- The endpoint determines delivery method (email or SMS) based on the presence of 'email' or 'phone' in the request body.
```

----------------------------------------

TITLE: POST /invite - Invite User
DESCRIPTION: Invites a new user to the system via email. This endpoint requires authentication with a service_role or supabase_admin JWT.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_25

LANGUAGE: APIDOC
CODE:
```
POST /invite

Invites a new user by email.

Requires Authorization header with 'service_role' or 'supabase_admin' JWT.
Example Header:
```js
headers: {
  "Authorization" : "Bearer eyJhbGciOiJI...M3A90LCkxxtX9oNP9KZO"
}
```

Request Body:
```json
{
  "email": "email@example.com"
}
```

Success Response:
```json
{
  "id": "11111111-2222-3333-4444-5555555555555",
  "email": "email@example.com",
  "confirmation_sent_at": "2016-05-15T20:49:40.882805774-07:00",
  "created_at": "2016-05-15T19:53:12.368652374-07:00",
  "updated_at": "2016-05-15T19:53:12.368652374-07:00",
  "invited_at": "2016-05-15T19:53:12.368652374-07:00"
}
```
```

----------------------------------------

TITLE: Rebuild Supabase Auth Docker Images (make docker-build)
DESCRIPTION: Performs a full rebuild of the Supabase Auth Docker containers, bypassing any cached layers. This is useful for ensuring the latest image configurations are used.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_3

LANGUAGE: bash
CODE:
```
make docker-build
```

----------------------------------------

TITLE: Update Database URL with Custom Port
DESCRIPTION: Demonstrates how to update the DATABASE_URL in environment files and shell scripts to reflect the custom PostgreSQL port. This ensures that applications and migration tools connect to the database on the specified port.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_26

LANGUAGE: env
CODE:
```
// file: test.env
DATABASE_URL="postgres://supabase_auth_admin:root@localhost:7432/postgres" ← set to your port
```

LANGUAGE: sh
CODE:
```
// file: migrate.sh
export GOTRUE_DB_DATABASE_URL="postgres://supabase_auth_admin:root@localhost:7432/$DB_ENV"
```

----------------------------------------

TITLE: Auth Health Endpoint
DESCRIPTION: Queries the /health endpoint to verify that the Auth service is available and responsive. A successful response confirms the service is running.

SOURCE: https://github.com/supabase/auth/blob/master/CONTRIBUTING.md#_snippet_20

LANGUAGE: APIDOC
CODE:
```
GET http://localhost:9999/health

Response:
{
  "description": "Auth is a user registration and authentication API",
  "name": "Auth",
  "version": ""
}
```

----------------------------------------

TITLE: POST /admin/generate_link API Endpoint
DESCRIPTION: Generates an email action link (e.g., for signup, magiclink, recovery, invite) based on the provided type and email. Returns the link and associated details.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_22

LANGUAGE: APIDOC
CODE:
```
POST /admin/generate_link
  Description: Generates an email action link based on the specified type.
  Headers:
    Authorization: Bearer <token>
      Description: Requires an admin role claim.
  Request Body:
    object:
      type: string ('signup', 'magiclink', 'recovery', 'invite')
        Description: The type of email action to generate.
      email: string
        Description: The email address for which to generate the link.
      password: string (only if type = signup)
        Description: The user's password.
      data: object (only if type = signup)
        Description: Additional data for signup actions.
      redirect_to: string
        Description: URL to redirect the user to after the action. Defaults to SITE_URL.
  Returns:
    object:
      action_link: string
        Description: The generated email action link.
      email_otp: string
        Description: The email OTP generated for the action.
      hashed_token: string
        Description: The hashed token associated with the action link.
      verification_type: string
        Description: The type of verification performed.
      redirect_to: string
        Description: The redirect URL used.
```

----------------------------------------

TITLE: POST /magiclink - Send Magic Link
DESCRIPTION: Sends a magic link to a user's email address for authentication. This endpoint is recommended to use /otp instead. Magic links can only be sent once every 60 seconds by default.

SOURCE: https://github.com/supabase/auth/blob/master/README.md#_snippet_28

LANGUAGE: APIDOC
CODE:
```
POST /magiclink

Description:
  Sends a magic link to the user based on email address, which they can use to redeem an access_token.

Rate Limiting:
  By default, Magic Links can only be sent once every 60 seconds.

Request Body:
  Content-Type: application/json
  {
    "email": "email@example.com"
  }

Response Body:
  Content-Type: application/json
  {}

Redirect Behavior:
  When clicked, the magic link will redirect the user to `<SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=magiclink`.
```

LANGUAGE: JSON
CODE:
```
{
  "email": "email@example.com"
}
```

========================
CODE SNIPPETS
========================
TITLE: Supabase Studio Local Development Quickstart
DESCRIPTION: Provides a quick guide for developers to set up and run Supabase Studio locally. It details the necessary Node.js version, dependency installation, internal secret pulling, starting the development server, and running tests.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/studio/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
# You'll need to be on Node v20
# in /studio

npm i # install dependencies
npm run dev:secrets:pull # Supabase internal use: if you are working on the platform version of the Studio
npm run dev # start dev server
npm run test # run tests
npm run -- --watch # run tests in watch mode
```

----------------------------------------

TITLE: Install Laravel Breeze authentication starter kit
DESCRIPTION: Install Laravel Breeze, a simple implementation of Laravel's authentication features, using Composer and then run the Artisan command to publish its assets and configurations.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-22-laravel-postgres.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
composer require laravel/breeze --dev
php artisan breeze:install
```

----------------------------------------

TITLE: Supabase SvelteKit User Management Setup Workflow
DESCRIPTION: This section details the sequential steps required to set up a Supabase project for user management and integrate it with a SvelteKit application. It covers project creation, database quickstart execution, API key retrieval, environment variable configuration, and the final application launch.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/user-management/sveltekit-user-management/README.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Supabase Project Setup & Application Execution:

1. Project Creation:
   - Endpoint: https://supabase.com/dashboard
   - Method: Manual UI interaction
   - Description: Sign up and create a new Supabase project.
   - Pre-requisite: Wait for database initialization.

2. Database Quickstart Execution:
   - Location: Supabase Project SQL Editor
   - Action: Run "User Management Starter" quickstart query.
   - Outcome: Creation of 'profiles' table with initial schema.

3. API Key Retrieval:
   - Location: Project Settings (cog icon) -> API tab
   - Keys:
     - API URL: Your project's API endpoint.
     - `anon` key: Client-side API key for anonymous access; switches to user's token post-login.
     - `service_role` key: Full access, server-side only; must be kept secret.

4. Environment Variable Configuration:
   - File: `.env.local` (created from `.env.example`)
   - Variables: Populate with retrieved API URL and `anon` key.

5. Application Launch:
   - Command: `npm run dev`
   - Access: `https://localhost:5173/`
```

----------------------------------------

TITLE: Setup Python Environment and Dependencies
DESCRIPTION: Instructions for installing the Poetry package manager, activating the virtual environment, and installing application dependencies required to run the image search example. This prepares the local development environment.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/ai/image_search/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
pip install poetry
poetry shell
poetry install
```

----------------------------------------

TITLE: Start Next.js Development Server
DESCRIPTION: This snippet provides commands to launch the Next.js development server using various package managers (npm, yarn, pnpm, bun). Running one of these commands will start the application locally, typically accessible via http://localhost:3000, and enable hot-reloading for development purposes.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/clerk/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Install Dependencies and Run Development Server with Bun
DESCRIPTION: This snippet provides the essential command-line instructions for a Bun-based project. It first installs all required project dependencies and then starts the local development server, making the application accessible via a web browser.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/oauth-app-authorization-flow/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
bun install
bun run dev
```

----------------------------------------

TITLE: Start Local Supabase Docs Development Server
DESCRIPTION: Command to navigate to the Supabase docs application directory and start the Next.js development server, making the local site accessible in a web browser.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/DEVELOPERS.md#_snippet_1

LANGUAGE: Shell
CODE:
```
cd /apps/docs
npm run dev
```

----------------------------------------

TITLE: Displaying Supabase Web App Demos with JSX
DESCRIPTION: This JSX code defines an array of web application tutorial demos, covering frameworks like Next.js, React, Vue 3, and Angular. It dynamically renders these tutorials as GlassPanel components, providing users with links to full-fledged examples demonstrating Supabase's database, authentication, and storage functionalities.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/getting-started.mdx#_snippet_3

LANGUAGE: JSX
CODE:
```
{
  [
    {
      title: 'Next.js',
      href: '/guides/getting-started/tutorials/with-nextjs',
      description:
        'Learn how to build a user management app with Next.js and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/nextjs-icon',
      hasLightIcon: true
    },
    {
      title: 'React',
      href: '/guides/getting-started/tutorials/with-react',
      description:
        'Learn how to build a user management app with React and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/react-icon'
    },
    {
      title: 'Vue 3',
      href: '/guides/getting-started/tutorials/with-vue-3',
      description:
        'Learn how to build a user management app with Vue 3 and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/vuejs-icon'
    },
    {
      title: 'Nuxt 3',
      href: '/guides/getting-started/tutorials/with-nuxt-3',
      description:
        'Learn how to build a user management app with Nuxt 3 and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/nuxt-icon'
    },
    {
      title: 'Angular',
      href: '/guides/getting-started/tutorials/with-angular',
      description:
        'Learn how to build a user management app with Angular and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/angular-icon'
    },
    {
      title: 'RedwoodJS',
      href: '/guides/getting-started/tutorials/with-redwoodjs',
      description:
        'Learn how to build a user management app with RedwoodJS and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/redwood-icon'
    },
    {
      title: 'Svelte',
      href: '/guides/getting-started/tutorials/with-svelte',
      description:
        'Learn how to build a user management app with Svelte and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/svelte-icon'
    },
    {
      title: 'SvelteKit',
      href: '/guides/getting-started/tutorials/with-sveltekit',
      description:
        'Learn how to build a user management app with SvelteKit and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/svelte-icon'
    },
    {
      title: 'refine',
      href: '/guides/getting-started/tutorials/with-refine',
      description:
        'Learn how to build a user management app with refine and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/refine-icon'
    }
]
.map((item) => {
    return (
      <Link href={`${item.href}`} key={item.title} passHref className={'col-span-4'}>
        <GlassPanel
          title={item.title}
          span="col-span-6"
          background={false}
          icon={item.icon}
          hasLightIcon={item.hasLightIcon}
        >
          {item.description}
        </GlassPanel>
      </Link>
    )

})}
```

----------------------------------------

TITLE: Install and Run Supabase with Docker (General Setup)
DESCRIPTION: This script clones the Supabase Docker repository, creates a project directory, copies necessary files, sets up environment variables, pulls Docker images, and starts the Supabase services in detached mode. This is the recommended general setup for quick deployment.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/self-hosting/docker.mdx#_snippet_0

LANGUAGE: sh
CODE:
```
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Make your new supabase project directory
mkdir supabase-project

# Tree should look like this
# .
# ├── supabase
# └── supabase-project

# Copy the compose files over to your project
cp -rf supabase/docker/* supabase-project

# Copy the fake env vars
cp supabase/docker/.env.example supabase-project/.env

# Switch to your project directory
cd supabase-project

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

----------------------------------------

TITLE: Start Next.js Development Server
DESCRIPTION: This snippet provides commands to launch the Next.js development server, which enables hot-reloading and makes the application accessible locally, typically at `http://localhost:3000`. Choose the command corresponding to your preferred package manager (npm, yarn, pnpm, or bun).

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
```

LANGUAGE: bash
CODE:
```
yarn dev
```

LANGUAGE: bash
CODE:
```
pnpm dev
```

LANGUAGE: bash
CODE:
```
bun dev
```

----------------------------------------

TITLE: Supabase local development credentials output
DESCRIPTION: Example output displayed after successfully starting the Supabase local development setup. It provides the URLs and keys for various local Supabase services, including the API, Database, Studio, Mailpit, and the anonymous and service role keys.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/local-development/cli/getting-started.mdx#_snippet_5

LANGUAGE: console
CODE:
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
     Mailpit URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

----------------------------------------

TITLE: Create Expo app from example
DESCRIPTION: Command to quickly scaffold a new Expo project pre-configured with the `with-legend-state-supabase` example, providing a ready-to-run starting point for the tutorial.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-09-23-local-first-expo-legend-state.mdx#_snippet_0

LANGUAGE: Bash
CODE:
```
npx create-expo-app --example with-legend-state-supabase
```

----------------------------------------

TITLE: Installing Prisma Client and Generating Models - bun
DESCRIPTION: These commands install the Prisma client library as a dependency and then generate the Prisma client code based on your 'schema.prisma', allowing your application to interact with the database.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/prisma.mdx#_snippet_19

LANGUAGE: sh
CODE:
```
bun install @prisma/client
bunx prisma generate
```

----------------------------------------

TITLE: Install Select Component via shadcn-ui CLI
DESCRIPTION: Installs the `Select` component into your project using the shadcn-ui command-line interface, automating the setup process.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/select.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add select
```

----------------------------------------

TITLE: Start Laravel development server
DESCRIPTION: Launch the Laravel development server, making the application accessible locally via a web browser for testing and development purposes.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-22-laravel-postgres.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
php artisan serve
```

----------------------------------------

TITLE: Installing Prisma Client and Generating Models - npm
DESCRIPTION: These commands install the Prisma client library as a dependency and then generate the Prisma client code based on your 'schema.prisma', allowing your application to interact with the database.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/prisma.mdx#_snippet_16

LANGUAGE: sh
CODE:
```
npm install @prisma/client
npx prisma generate
```

----------------------------------------

TITLE: Install and Run Supabase with Docker (Advanced Setup)
DESCRIPTION: This script uses Git sparse checkout for a more advanced setup, cloning only the necessary Docker files from the Supabase repository. It then proceeds to create a project directory, copy files, set environment variables, pull Docker images, and start Supabase services in detached mode.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/self-hosting/docker.mdx#_snippet_1

LANGUAGE: sh
CODE:
```
# Get the code using git sparse checkout
git clone --filter=blob:none --no-checkout https://github.com/supabase/supabase
cd supabase
git sparse-checkout set --cone docker && git checkout master
cd ..

# Make your new supabase project directory
mkdir supabase-project

# Tree should look like this
# .
# ├── supabase
# └── supabase-project

# Copy the compose files over to your project
cp -rf supabase/docker/* supabase-project

# Copy the fake env vars
cp supabase/docker/.env.example supabase-project/.env

# Switch to your project directory
cd supabase-project

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

----------------------------------------

TITLE: Start Next.js Development Server
DESCRIPTION: This snippet provides commands to launch the Next.js development server, which enables hot-reloading and makes the application accessible locally, typically at `http://localhost:3000`. Choose the command corresponding to your preferred package manager (npm, yarn, pnpm, or bun).

SOURCE: https://github.com/supabase/supabase/blob/master/examples/caching/with-react-query-nextjs-14/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
```

LANGUAGE: bash
CODE:
```
yarn dev
```

LANGUAGE: bash
CODE:
```
pnpm dev
```

LANGUAGE: bash
CODE:
```
bun dev
```

----------------------------------------

TITLE: Installing Prisma Client and Generating Models - pnpm
DESCRIPTION: These commands install the Prisma client library as a dependency and then generate the Prisma client code based on your 'schema.prisma', allowing your application to interact with the database.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/prisma.mdx#_snippet_17

LANGUAGE: sh
CODE:
```
pnpm install @prisma/client
pnpx prisma generate
```

----------------------------------------

TITLE: Setup Supabase Environment Variables
DESCRIPTION: This command copies the example environment file (`.env.local.example`) to `.env.local`. This is a crucial first step for configuring local development settings, including API keys and other sensitive information required by the Supabase functions.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/openai/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
cp supabase/.env.local.example supabase/.env.local
```

----------------------------------------

TITLE: Install Resizable component using shadcn-ui CLI
DESCRIPTION: Installs the Resizable component and its dependencies into your project using the shadcn-ui command-line interface, simplifying the setup process.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/resizable.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add resizable
```

----------------------------------------

TITLE: Supabase Bootstrap Command Variations
DESCRIPTION: Different methods to invoke the `supabase bootstrap` command, allowing users to start a new Supabase project setup directly via the Supabase CLI, or through npm and bun package managers, without needing a global CLI installation.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-04-15-supabase-bootstrap.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
supabase bootstrap
```

LANGUAGE: bash
CODE:
```
npx supabase@latest bootstrap
```

LANGUAGE: bash
CODE:
```
bunx supabase@latest bootstrap
```

----------------------------------------

TITLE: Installing Prisma Client and Generating Models - yarn
DESCRIPTION: These commands install the Prisma client library as a dependency and then generate the Prisma client code based on your 'schema.prisma', allowing your application to interact with the database.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/prisma.mdx#_snippet_18

LANGUAGE: sh
CODE:
```
yarn add @prisma/client
npx prisma generate
```

----------------------------------------

TITLE: Payload CMS Local Development Setup
DESCRIPTION: Provides step-by-step instructions to set up and run the Payload CMS application locally. This involves starting a local Supabase project, configuring environment variables, installing project dependencies, and launching the development server. Ensure Supabase CLI and pnpm are installed.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/cms/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
cd apps/cms && supabase start
cp .env.example .env
pnpm install && pnpm generate:importmap
pnpm dev
pnpm dev:cms
```

----------------------------------------

TITLE: Install Dependencies and Run Supabase Studio
DESCRIPTION: Commands to install Node.js dependencies and start the Supabase Studio dashboard after configuring the essential environment variables in the `.env` file.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/studio/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
npm install
npm run dev
```

----------------------------------------

TITLE: Get Homebrew PostgreSQL Path Information on macOS
DESCRIPTION: This command provides detailed information about the Homebrew installation of PostgreSQL, including its installation path. This information is useful for manually adding PostgreSQL binaries to the system's PATH variable if they are not automatically detected.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/_partials/postgres_installation.mdx#_snippet_2

LANGUAGE: sh
CODE:
```
brew info postgresql@17
```

----------------------------------------

TITLE: Verify psql Client Installation
DESCRIPTION: This command verifies that the `psql` (PostgreSQL client) is correctly installed and accessible from the system's PATH. It outputs the version of the `psql` client, which is a crucial step after installing PostgreSQL on both Windows and macOS.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/_partials/postgres_installation.mdx#_snippet_1

LANGUAGE: sh
CODE:
```
psql --version
```

----------------------------------------

TITLE: Start local Supabase services and serve Edge Function
DESCRIPTION: Starts all local Supabase services, including the database and storage, and then serves the specified Edge Function ('hello-world') for local testing. This command enables hot reloading for function code changes.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/quickstart.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
supabase start  # Start all Supabase services
supabase functions serve hello-world
```

----------------------------------------

TITLE: Install vecs Python client
DESCRIPTION: Installs the `vecs` Python client library using pip. This client is used for interacting with PostgreSQL databases equipped with the `pgvector` extension. Requires Python 3.7+.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/ai/vector_hello_world.ipynb#_snippet_0

LANGUAGE: Python
CODE:
```
pip install vecs
```

----------------------------------------

TITLE: Start Rails development server
DESCRIPTION: Start the Rails development server, making the application accessible via a web browser, typically at http://127.0.0.1:3000.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-29-ruby-on-rails-postgres.mdx#_snippet_5

LANGUAGE: Bash
CODE:
```
bin/rails server
```

----------------------------------------

TITLE: Install Sidebar component using CLI
DESCRIPTION: Run this command to automatically install the `sidebar.tsx` component and its dependencies using the shadcn/ui CLI. This is the recommended method for quick setup.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/sidebar.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add sidebar
```

----------------------------------------

TITLE: Install Textarea Component via CLI
DESCRIPTION: This command installs the Textarea component using the shadcn-ui CLI. It's the recommended method for quick setup.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/textarea.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add textarea
```

----------------------------------------

TITLE: Install Card component via shadcn-ui CLI
DESCRIPTION: Installs the Card UI component into your project using the shadcn-ui command-line interface, simplifying the setup process.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/card.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add card
```

----------------------------------------

TITLE: Install Dropdown Menu Component via CLI
DESCRIPTION: Installs the `dropdown-menu` component using the `shadcn-ui` CLI tool, simplifying the setup process by adding the component and its dependencies to your project.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/dropdown-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add dropdown-menu
```

----------------------------------------

TITLE: Initialize existing Supabase project
DESCRIPTION: Navigates to an existing project directory and initializes Supabase if it hasn't been configured yet. This command ensures the project has the necessary `supabase` folder and `config.toml` for local development.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/quickstart.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
cd your-existing-project
supabase init # Initialize Supabase, if you haven't already
```

----------------------------------------

TITLE: Start Rails console
DESCRIPTION: Launch the Rails console, an interactive Ruby environment for interacting with the Rails application, including its models and database.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-29-ruby-on-rails-postgres.mdx#_snippet_3

LANGUAGE: Bash
CODE:
```
bin/rails console
```

----------------------------------------

TITLE: Install Supabase CLI
DESCRIPTION: Provides various methods to install the Supabase CLI on different operating systems and environments, including macOS, Windows, Linux, and Node.js-based setups.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/local-development/cli/getting-started.mdx#_snippet_0

LANGUAGE: sh
CODE:
```
brew install supabase/tap/supabase
```

LANGUAGE: powershell
CODE:
```
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

LANGUAGE: sh
CODE:
```
sudo apk add --allow-untrusted <...>.apk
sudo dpkg -i <...>.deb
sudo rpm -i <...>.rpm
```

LANGUAGE: sh
CODE:
```
npx supabase --help
```

LANGUAGE: sh
CODE:
```
npm install supabase --save-dev
```

----------------------------------------

TITLE: Supabase CLI: Project Authentication and Linking
DESCRIPTION: These commands facilitate the initial setup for interacting with Supabase projects via the command-line interface. They allow users to authenticate their CLI session, list available Supabase projects to identify their project ID, and then link their local development environment to a specific remote Supabase project.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/quickstart.mdx#_snippet_7

LANGUAGE: bash
CODE:
```
supabase login

```

LANGUAGE: bash
CODE:
```
supabase projects list

```

LANGUAGE: bash
CODE:
```
supabase link --project-ref [YOUR_PROJECT_ID]

```

----------------------------------------

TITLE: Downloading a File with Dart
DESCRIPTION: This Dart snippet initializes a Supabase client and then uses its storage API to asynchronously download a file named 'example.txt' from the 'public' bucket. The downloaded content is returned in the `storageResponse`, allowing for subsequent processing or display within the application.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/storage/quickstart.mdx#_snippet_8

LANGUAGE: Dart
CODE:
```
void main() async {
  final supabase = SupabaseClient('supabaseUrl', 'supabaseKey');

  final storageResponse = await supabase
      .storage
      .from('public')
      .download('example.txt');
}
```

----------------------------------------

TITLE: Install Python Dependencies for LlamaIndex
DESCRIPTION: Installs the necessary Python packages including 'vecs', 'datasets', 'llama_index', and 'html2text'. These libraries are essential for running the LlamaIndex and Supabase integration example.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/ai/llamaindex/llamaindex.ipynb#_snippet_0

LANGUAGE: python
CODE:
```
!pip install -qU vecs datasets llama_index html2text
```

----------------------------------------

TITLE: Install Alert Dialog via CLI
DESCRIPTION: Installs the Alert Dialog component using the shadcn-ui CLI tool, simplifying the setup process.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/alert-dialog.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add alert-dialog
```

----------------------------------------

TITLE: Install Switch component via shadcn-ui CLI
DESCRIPTION: Installs the Switch component and its dependencies into your project using the shadcn-ui command-line interface. This is the recommended method for quick setup.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/switch.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add switch
```

----------------------------------------

TITLE: Install dependencies for encrypted Supabase sessions in Expo
DESCRIPTION: Installs required npm packages for an Expo project to enable encrypted Supabase user sessions. This includes `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `aes-js`, `react-native-get-random-values`, and `expo-secure-store`.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2023-11-16-react-native-authentication.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
npm install @supabase/supabase-js
npm install @rneui/themed @react-native-async-storage/async-storage react-native-url-polyfill
npm install aes-js react-native-get-random-values
npx expo install expo-secure-store
```

----------------------------------------

TITLE: Install Tooltip component using Shadcn UI CLI
DESCRIPTION: This command installs the Tooltip component into your project using the Shadcn UI command-line interface, simplifying the setup process.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/tooltip.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add tooltip
```

----------------------------------------

TITLE: Create Next.js Supabase Quickstart Application
DESCRIPTION: This command initializes a new Next.js project pre-configured with Supabase integration. It downloads a quickstart application that can be used as a reference or starting point for implementing Supabase authentication with server-side rendering.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/troubleshooting/how-do-you-troubleshoot-nextjs---supabase-auth-issues-riMCZV.mdx#_snippet_0

LANGUAGE: Shell
CODE:
```
npx create-next-app -e with-supabase
```

----------------------------------------

TITLE: Install Radix UI Select Dependencies Manually
DESCRIPTION: Installs the core `@radix-ui/react-select` dependency, which is required for manual setup of the `Select` component in your project.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/select.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-select
```

----------------------------------------

TITLE: Set up Next.js and Supabase project locally
DESCRIPTION: This snippet provides the essential bash commands and environment variable configuration to clone and run the Next.js and Supabase starter kit on a local development machine. It assumes a Supabase project has already been created via the Supabase dashboard, and the necessary API URL and Anon Key are available from the project's settings.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/auth/nextjs/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-next-app -e with-supabase
```

LANGUAGE: bash
CODE:
```
cd name-of-new-app
```

LANGUAGE: bash
CODE:
```
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
```

LANGUAGE: bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Install Supabase JS and React Native Dependencies
DESCRIPTION: This `bash` command installs the core `supabase-js` library along with `@react-native-async-storage/async-storage` for persistent session storage and `react-native-url-polyfill` for URL compatibility in React Native Expo projects. These packages are essential for integrating Supabase authentication.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2023-11-16-react-native-authentication.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

----------------------------------------

TITLE: Start RedwoodJS Development Server
DESCRIPTION: This command starts the RedwoodJS development server, allowing you to preview and test your application locally. It compiles the project and serves it on the configured port, typically opening a browser window automatically.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/getting-started/tutorials/with-redwoodjs.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
yarn rw dev
```

----------------------------------------

TITLE: Create a new Laravel project
DESCRIPTION: Use Composer to scaffold a new Laravel application, creating the basic project structure in a specified directory.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-22-laravel-postgres.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
composer create-project laravel/laravel example-app
```

----------------------------------------

TITLE: Deploy Application to Fly.io
DESCRIPTION: Deploys the current application to Fly.io. This command initiates the deployment process, which includes uploading the application, building a machine image, deploying the images, and monitoring for successful startup.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-29-ruby-on-rails-postgres.mdx#_snippet_8

LANGUAGE: bash
CODE:
```
fly deploy
```

----------------------------------------

TITLE: PostgreSQL: Create User Examples
DESCRIPTION: Demonstrates SQL commands for creating new database users with specified passwords in PostgreSQL. These examples show how to set up different user accounts, like 'postgres' and 'some_new_user', for database access.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/troubleshooting/supavisor-faq-YyP5tI.mdx#_snippet_4

LANGUAGE: SQL
CODE:
```
CREATE USER postgres WITH PASSWORD 'super-secret-password;
CREATE USER some_new_user WITH PASSWORD 'password';
```

----------------------------------------

TITLE: Create new Flutter application
DESCRIPTION: Initializes a new Flutter project named 'myauthapp'. This command sets up the basic directory structure and necessary files for a Flutter application.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2023-07-18-flutter-authentication.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
flutter create myauthapp
```

----------------------------------------

TITLE: Initialize new Supabase project directory
DESCRIPTION: Initializes a new Supabase project in the current directory, creating a dedicated project folder and navigating into it. This sets up the basic `supabase` directory structure for configuration and functions.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/quickstart.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
supabase init my-edge-functions-project
cd my-edge-functions-project
```

----------------------------------------

TITLE: Initialize Supabase Project and Start Postgres
DESCRIPTION: This Bash script initializes a new Supabase project and starts a local PostgreSQL instance. It requires the Supabase CLI to be installed and Docker to be running. This sets up the local environment for using the `vecs` client.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/ai/vecs-python-client.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
# Initialize your project
supabase init

# Start Postgres
supabase start
```

----------------------------------------

TITLE: Run Next.js Development Server
DESCRIPTION: This snippet provides commands to start the Next.js development server using various package managers. It allows developers to run the application locally for testing and development purposes, typically accessible via `http://localhost:3000`.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/ui-library/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Angular Project Initialization and Component Generation
DESCRIPTION: These bash commands demonstrate the initial setup for an Angular project using the Angular CLI. It starts by creating a new project named 'trelloBoard' with routing and SCSS styling, then navigates into the project directory. Subsequently, it generates several Angular components (login, workspace, board) and services (auth, data) to structure the application.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2022-08-24-building-a-realtime-trello-board-with-supabase-and-angular.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
ng new trelloBoard --routing --style=scss
cd ./trelloBoard

# Generate components and services
ng generate component components/login
ng generate component components/inside/workspace
ng generate component components/inside/board

ng generate service services/auth
ng generate service services/data
```

----------------------------------------

TITLE: Run React Development Server with npm
DESCRIPTION: Starts the React application in development mode, making it accessible via a web browser at http://localhost:3000. The page automatically reloads upon code changes, and any lint errors are displayed directly in the console.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/edge-functions/app/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
npm start
```

----------------------------------------

TITLE: Install React Native Elements Themed UI Library
DESCRIPTION: This `npm` command installs the `@rneui/themed` package, a popular UI library for React Native. It provides pre-built, cross-platform components such as `Button` and `Input` that simplify the development of user interfaces, particularly for forms like the authentication form presented.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2023-11-16-react-native-authentication.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
npm install @rneui/themed
```

----------------------------------------

TITLE: Configure Jackson Serialization for Supabase-kt
DESCRIPTION: This snippet provides build file configurations for integrating Jackson with Supabase-kt. It includes an example for Gradle Kotlin DSL (build.gradle.kts) to add the `serializer-jackson` dependency.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/docs/ref/kotlin/v1/installing.mdx#_snippet_5

LANGUAGE: kotlin
CODE:
```
implementation("io.github.jan-tennert.supabase:serializer-jackson:VERSION")
```

----------------------------------------

TITLE: Build React Application for Production with npm
DESCRIPTION: Compiles the React application into the `build` folder, optimizing it for production deployment. This command bundles React in production mode, minifies the code, and includes hashes in filenames for caching, preparing the application for deployment.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/edge-functions/app/README.md#_snippet_2

LANGUAGE: shell
CODE:
```
npm run build
```

----------------------------------------

TITLE: Initialize React App and Install Supabase JS
DESCRIPTION: These commands guide the user through setting up a new React project using Vite and then installing the official Supabase JavaScript client library. This is the foundational step for integrating Supabase services into the React application.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/getting-started/tutorials/with-react.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm create vite@latest supabase-react -- --template react
cd supabase-react
```

LANGUAGE: bash
CODE:
```
npm install @supabase/supabase-js
```

----------------------------------------

TITLE: Create a new Rails project with PostgreSQL
DESCRIPTION: Scaffold a new Ruby on Rails project, specifying PostgreSQL as the database adapter. This command initializes the project directory and sets up the necessary configuration for a PostgreSQL database.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2024-01-29-ruby-on-rails-postgres.mdx#_snippet_0

LANGUAGE: Bash
CODE:
```
rails new blog -d=postgresql
```

----------------------------------------

TITLE: Install Toggle component via shadcn-ui CLI
DESCRIPTION: Installs the Toggle component into your project using the shadcn-ui command-line interface. This method automates the setup and integration of the component.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/toggle.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add toggle
```

----------------------------------------

TITLE: Starting Development Server with Bun
DESCRIPTION: This command initiates the development server for the Supabase OAuth application using Bun. Once started, the application will typically be accessible via a web browser at http://localhost:3000.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/oauth-app-authorization-flow/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
bun run dev
```

----------------------------------------

TITLE: Run Hono Development Server
DESCRIPTION: Command to start the development server for the Hono application using Vite. This enables live reloading and local testing during development, facilitating rapid iteration.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/auth/hono/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Install Alert Component via CLI
DESCRIPTION: Installs the Alert UI component using the shadcn-ui CLI tool. This command automatically adds the necessary component files and dependencies to your project, streamlining the setup process.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/design-system/content/docs/components/alert copy.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn-ui@latest add alert
```

----------------------------------------

TITLE: Install Dependencies and Run React Native Project
DESCRIPTION: These commands are used to set up and run the React Native application. `npm install` installs all necessary project dependencies, `npm run prebuild` prepares the project for specific functionalities like file pickers, and `npm start` launches the application in development mode.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/user-management/expo-user-management/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm install
```

LANGUAGE: bash
CODE:
```
npm run prebuild
```

LANGUAGE: bash
CODE:
```
npm start
```

----------------------------------------

TITLE: Configure Jackson Serialization for Supabase-kt
DESCRIPTION: This snippet provides build file configurations for integrating Jackson with Supabase-kt. It includes an example for Gradle Kotlin DSL (build.gradle.kts) to add the `serializer-jackson` dependency.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/docs/ref/kotlin/v2/installing.mdx#_snippet_5

LANGUAGE: kotlin
CODE:
```
implementation("io.github.jan-tennert.supabase:serializer-jackson:VERSION")
```

----------------------------------------

TITLE: Uploading a File with Dart
DESCRIPTION: This Dart snippet shows how to create a local file (`example.txt`) and then upload it to a Supabase storage bucket. It initializes a Supabase client, writes content to the file, and uploads it to the 'public' bucket using the `from()` and `upload()` methods, demonstrating file preparation before upload.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/storage/quickstart.mdx#_snippet_6

LANGUAGE: Dart
CODE:
```
void main() async {
  final supabase = SupabaseClient('supabaseUrl', 'supabaseKey');

  // Create file `example.txt` and upload it in `public` bucket
  final file = File('example.txt');
  file.writeAsStringSync('File content');
  final storageResponse = await supabase
      .storage
      .from('public')
      .upload('example.txt', file);
}
```

----------------------------------------

TITLE: Invoke Supabase Edge Function from Client Applications
DESCRIPTION: Examples demonstrating how to invoke a deployed Supabase Edge Function from a client-side application using either the Supabase JavaScript client library or the standard Fetch API.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/quickstart.mdx#_snippet_11

LANGUAGE: jsx
CODE:
```
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://[YOUR_PROJECT_ID].supabase.co', 'YOUR_ANON_KEY')

const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'JavaScript' },
})

console.log(data) // { message: "Hello JavaScript!" }
```

LANGUAGE: jsx
CODE:
```
const response = await fetch('https://[YOUR_PROJECT_ID].supabase.co/functions/v1/hello-world', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer YOUR_ANON_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Fetch' }),
})

const data = await response.json()
console.log(data)
```

----------------------------------------

TITLE: SQL Schema and Data Setup for Supabase Explain Example
DESCRIPTION: SQL script to create an `instruments` table with `id` and `name` columns, and then insert sample data. This provides a foundational dataset for illustrating the functionality of the `explain()` method in Supabase. It's a prerequisite for testing query plans.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/debugging-performance.mdx#_snippet_2

LANGUAGE: SQL
CODE:
```
create table instruments (
  id int8 primary key,
  name text
);

insert into books
  (id, name)
values
  (1, 'violin'),
  (2, 'viola'),
  (3, 'cello');
```

----------------------------------------

TITLE: Install and Start Roboflow Inference Server
DESCRIPTION: This command installs the necessary Python packages for Roboflow Inference and starts the local inference server. Ensure Docker is installed and running on your machine before executing this command, as Roboflow Inference relies on Docker for deployment.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/ai/integrations/roboflow.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
pip install inference inference-cli inference-sdk && inference server start
```

----------------------------------------

TITLE: Copy Example Environment File
DESCRIPTION: Copies the provided example environment configuration file (`.env.example`) to a new file named `.env`. This new file will store local environment variables required for the Docker setup.

SOURCE: https://github.com/supabase/supabase/blob/master/DEVELOPERS.md#_snippet_7

LANGUAGE: sh
CODE:
```
cp .env.example .env
```

----------------------------------------

TITLE: Expo Project Setup and Development Commands
DESCRIPTION: Commands to install project dependencies, initialize Expo Application Services (EAS) for build management, and start the Expo development server for a dev client on a physical device.

SOURCE: https://github.com/supabase/supabase/blob/master/examples/user-management/expo-push-notifications/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
npm i
npm install --global eas-cli && eas init --id your-expo-project-id
npx expo start --dev-client
```

----------------------------------------

TITLE: Rendering Supabase Mobile Tutorial Links with React
DESCRIPTION: This JavaScript/JSX snippet defines an array of objects, each representing a mobile tutorial with Supabase. It then uses the `map` function to iterate over this array, dynamically generating `Link` and `GlassPanel` components for each tutorial. This structure helps in presenting a grid of clickable tutorial cards, linking to specific guides for Flutter, Expo React Native, Android Kotlin, iOS Swift, and various Ionic frameworks.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/getting-started.mdx#_snippet_4

LANGUAGE: JSX
CODE:
```
{[
    {
      title: 'Flutter',
      href: '/guides/getting-started/tutorials/with-flutter',
      description:
        'Learn how to build a user management app with Flutter and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/flutter-icon'
    },
    {
      title: 'Expo React Native',
      href: '/guides/getting-started/tutorials/with-expo-react-native',
      description:
        'Learn how to build a user management app with Expo React Native and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/expo-icon',
      hasLightIcon: true
    },
    {
      title: 'Android Kotlin',
      href: '/guides/getting-started/tutorials/with-kotlin',
      description:
        'Learn how to build a product management app with Android and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/kotlin-icon'
    },
    {
      title: 'iOS Swift',
      href: '/guides/getting-started/tutorials/with-swift',
      description:
        'Learn how to build a user management app with iOS and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/swift-icon'
    },
    {
      title: 'Ionic React',
      href: '/guides/getting-started/tutorials/with-ionic-react',
      description:
        'Learn how to build a user management app with Ionic React and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/ionic-icon'
    },
    {
      title: 'Ionic Vue',
      href: '/guides/getting-started/tutorials/with-ionic-vue',
      description:
        'Learn how to build a user management app with Ionic Vue and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/ionic-icon'
    },
    {
      title: 'Ionic Angular',
      href: '/guides/getting-started/tutorials/with-ionic-angular',
      description:
        'Learn how to build a user management app with Ionic Angular and Supabase Database, Auth, and Storage functionality.',
      icon: '/docs/img/icons/ionic-icon'
    }
  ].map((item) => {
    return (
      <Link href={`${item.href}`} key={item.title} passHref className={'col-span-4'}>
        <GlassPanel
          title={item.title}
          span="col-span-6"
          background={false}
          icon={item.icon}
          hasLightIcon={item.hasLightIcon}
        >
          {item.description}
        </GlassPanel>
      </Link>
    )
})}
```

----------------------------------------

TITLE: Initialize SolidJS App and Install Supabase Client
DESCRIPTION: This snippet demonstrates how to set up a new SolidJS project using `degit` and then install the `@supabase/supabase-js` library, which is required to interact with Supabase services.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/getting-started/tutorials/with-solidjs.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx degit solidjs/templates/ts supabase-solid
cd supabase-solid
npm install @supabase/supabase-js
```

----------------------------------------

TITLE: Install PostgreSQL on macOS with Homebrew
DESCRIPTION: This command installs PostgreSQL version 17 using Homebrew on macOS. Homebrew is a popular package manager that simplifies software installation on macOS systems.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/_partials/postgres_installation.mdx#_snippet_0

LANGUAGE: sh
CODE:
```
brew install postgresql@17
```

----------------------------------------

TITLE: Run SvelteKit Development Server
DESCRIPTION: This command initiates the SvelteKit development server, allowing you to preview and interact with the application locally. After running this command, the application will typically be accessible in your web browser at `http://localhost:5173`.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/getting-started/tutorials/with-sveltekit.mdx#_snippet_17

LANGUAGE: bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Install and Use olirice-index_advisor for PostgreSQL Index Recommendations
DESCRIPTION: This SQL example provides the steps to install the `olirice-index_advisor` and `hypopg` extensions, then demonstrates how to use the `index_advisor()` function. It shows how to create a dummy table and query `index_advisor` with a sample SQL query to receive recommendations for optimizing query performance by suggesting appropriate indexes.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/www/_blog/2023-04-14-dbdev.mdx#_snippet_5

LANGUAGE: SQL
CODE:
```
select dbdev.install('olirice-index_advisor');
create extension if not exists hypopg;
create extension "olirice-index_advisor";

-- Create a dummy table
create table account(
	id int primary key,
	name text
);

-- Search for indexes to optimize "select id from account where name = 'adsf'"
select
	*
from
	index_advisor($$select id from account where name = 'Foo'$$)
```

----------------------------------------

TITLE: Invoke Supabase Edge Function from Application
DESCRIPTION: These code examples illustrate how to invoke a deployed Supabase Edge Function from a client-side application. They provide two common methods: using the official Supabase JavaScript client library for simplified interaction, and using the standard Fetch API for direct HTTP requests. Both examples demonstrate sending a JSON body and handling the function's response.

SOURCE: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/quickstart.mdx#_snippet_10

LANGUAGE: jsx
CODE:
```
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://[YOUR_PROJECT_ID].supabase.co', 'YOUR_ANON_KEY')

const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'JavaScript' },
})

console.log(data) // { message: "Hello JavaScript!" }

```

LANGUAGE: jsx
CODE:
```
const response = await fetch('https://[YOUR_PROJECT_ID].supabase.co/functions/v1/hello-world', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer YOUR_ANON_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Fetch' }),
})

const data = await response.json()
console.log(data)

```