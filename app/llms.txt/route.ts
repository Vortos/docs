export const revalidate = false;

const CONTENT = `# Vortos Framework

> PHP framework for CQRS + DDD + event-driven architecture. Purpose-built for strict layer separation — not a general-purpose framework.
> PHP 8.2+ | PostgreSQL (write store, Doctrine DBAL) | MongoDB (read store) | Kafka (broker) | Redis (cache, ext-redis)
> Full docs: https://vortos-docs.vercel.app/docs
> Complete LLM reference (all 170 docs pages): https://vortos-docs.vercel.app/llms-full.txt

## Non-Negotiable Architecture Rules

1. Zero runtime reflection — all handler/policy/route discovery happens at compile time via Symfony DI compiler passes
2. Connection is always shared — DBAL Connection must be setShared(true); multiple instances break transactions
3. CommandBus owns the transaction — handlers NEVER call beginTransaction/commit/rollBack directly
4. Return the aggregate from command handlers — bus calls pullDomainEvents() on the return value; void = events silently dropped
5. Always upsert in projection handlers — Kafka delivers at-least-once; insert throws on duplicate event
6. Store _id as string UUID in MongoDB — never ObjectId
7. cache->clear() uses SCAN not FLUSHDB — FLUSHDB destroys Kafka consumer offsets
8. CachePackage must be registered before MessagingPackage and CqrsPackage — both depend on CacheInterface
9. HttpPackage must be registered first overall — all packages add subscribers to its EventDispatcher
10. Always call cleanUp() after every request in worker mode — prevents identity/state leak between requests

## Modules

- **domain** — Base classes: AggregateRoot, DomainEvent, ValueObject, Command, Query, AggregateId
- **persistence** — UnitOfWorkInterface, WriteRepositoryInterface, ReadRepositoryInterface (abstractions)
- **persistence-dbal** — PostgreSQL write store via Doctrine DBAL
- **persistence-mongo** — MongoDB read store
- **cqrs** — CommandBus, QueryBus, ProjectionHandler. Handlers wired at compile time via #[AsCommandHandler], #[AsQueryHandler], #[AsProjectionHandler]
- **cache** — PSR-16 CacheInterface + TaggedCacheInterface. Drivers: Redis (prod), InMemory (dev/test)
- **messaging** — EventBus, Kafka producer/consumer, transactional outbox, dead letter queue, hooks, middleware
- **auth** — JWT authentication, password hashing, token storage, rate limiting, quotas, 2FA, API keys
- **authorization** — Policy engine, role hierarchy, scoped/temporal permissions, RBAC, ownership checks
- **http** — Routing, controllers, request/response, event subscribers, error handling
- **logger** — Monolog with named channels (app, http, cqrs, messaging), Sentry/Slack/Email alerting
- **tracing** — OpenTelemetry tracing with probabilistic sampling
- **foundation** — Health checks, service resetter (worker mode cleanup)
- **security** — HTTP headers (HSTS/CSP/etc), CORS, CSRF, IP filter, request signing, encryption, secrets, data masking
- **make** — Code generator: 16 vortos:make:* commands to scaffold DDD/CQRS artifacts
- **setup** — Project bootstrap wizard: vortos:setup writes .env, Docker files, config stubs

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Aggregate | PascalCase | User, Order |
| Aggregate ID | PascalCase + Id | UserId, OrderId |
| Domain Event | PascalCase + past tense + Event | UserRegisteredEvent |
| Command | PascalCase imperative, no suffix | RegisterUser, PlaceOrder |
| Command Handler | Command name + Handler | RegisterUserHandler |
| Query | GetXByY or ListXs | GetUserById, ListOrders |
| Write Repository | Entity + Repository | UserRepository |
| Read Repository | Entity + ReadRepository | UserReadRepository |
| Controller | Action + Controller | RegisterUserController |
| Policy | Entity + Policy | UserPolicy |
| Permission | resource.action.scope | athletes.update.own |
| Cache key | {entity}:{id}:{aspect} | user:123:profile |

## File/Directory Structure

\`\`\`
src/
  {Context}/
    Domain/
      {Aggregate}.php              ← AggregateRoot subclass
      {Aggregate}Id.php            ← extends AggregateId
      Event/
        {Aggregate}{Action}Event.php
      Exception/
        {Aggregate}NotFoundException.php
      Repository/
        {Aggregate}RepositoryInterface.php
    Application/
      Command/
        {Action}{Aggregate}/
          {Action}{Aggregate}.php          ← Command DTO
          {Action}{Aggregate}Handler.php   ← implements handler, returns aggregate
      Query/
        {GetX}/
          {GetX}.php
          {GetX}Handler.php
      Projection/
        {Aggregate}{Action}Projection.php  ← #[AsProjectionHandler]
    Infrastructure/
      Persistence/
        {Aggregate}Repository.php          ← write: DBAL
        {Aggregate}ReadRepository.php      ← read: MongoDB
      Messaging/
        {Aggregate}MessagingConfig.php     ← RegisterProducer, RegisterConsumer
    Representation/
      Controller/
        {Action}Controller.php
        {Action}Request.php
      Policy/
        {Aggregate}Policy.php
\`\`\`

## Common Mistakes to Avoid

| Wrong | Right |
|---|---|
| new Connection() | ConnectionFactory::fromDsn() |
| insert() in projection handlers | upsert() — Kafka is at-least-once |
| void return from command handler | return the aggregate |
| $unitOfWork->run() inside a handler | bus wraps it automatically |
| ObjectId in MongoDB | string UUID always |
| redis->flushDb() | $cache->clear() — SCAN with prefix |
| Both #[AsIdempotencyKey] AND overriding idempotencyKey() | use one only |
| Two policies for same resource | compile error — one policy per resource |

## Key Console Commands

\`\`\`
# Setup & config
vortos:setup                                 # project bootstrap wizard
vortos:config:publish                        # publish module config stubs to config/

# Code generation (vortos-make)
vortos:make:context --name=Orders            # scaffold bounded context directory tree
vortos:make:entity --name=Order --context=Orders
vortos:make:command --name=PlaceOrder --context=Orders
vortos:make:query --name=GetOrderById --context=Orders
vortos:make:controller --name=PlaceOrder --context=Orders
vortos:make:write-repository --name=Order --context=Orders
vortos:make:read-repository --name=Order --context=Orders
vortos:make:domain-event --name=OrderPlaced --context=Orders
vortos:make:projection-handler --name=OrderPlaced --context=Orders
vortos:make:consumer --name=OrderPlaced --context=Orders
vortos:make:policy --name=Order --context=Orders

# Migrations
vortos:migrate                               # run pending migrations
vortos:migrate:publish                       # convert module SQL stubs to Doctrine classes
vortos:migrate:status                        # show migration state

# Messaging
vortos:consume                               # start Kafka consumer worker
vortos:outbox:relay                          # start outbox relay worker
vortos:outbox:replay [--latest] [--limit=N] [--transport=X] [--event-class=X] [--id=X] [--dry-run]
vortos:dlq:replay    [--latest] [--limit=N] [--transport=X] [--event-class=X] [--id=X] [--dry-run]

# Authorization
vortos:auth:user-role:assign                 # assign runtime role to user
vortos:auth:can                              # check permission for user
vortos:auth:explain                          # explain authorization decision

# Cache
vortos:cache:clear [--tag=X]                # clear cache or tag subset
vortos:cache:warmup                         # run registered warmers

# Debug
vortos:debug:routes                          # list all registered routes
vortos:debug:container                       # list all registered services

# MCP
vortos:mcp:install --client=claude|cursor|windsurf|all
vortos:mcp:serve                             # start MCP server (stdio — AI clients auto-start this)
vortos:mcp:doctor                            # show MCP status and connected clients
\`\`\`

## Performance Practices

- Run under FrankenPHP worker mode — container and DI are built once per process, not per request
- All handler/policy/route discovery happens at container compile time — zero runtime overhead
- DBAL Connection is shared across the request — never instantiate a second connection
- Use Redis TaggedCacheInterface for invalidation instead of scanning keys manually
- Projection handlers must be idempotent (upsert) — Kafka redelivers on restart

## Security Practices

- Use VaultSecretsProvider or AwsSsmSecretsProvider for production secrets — not .env
- Enable SecurityHeadersMiddleware (HSTS, CSP, X-Frame-Options) in production config
- Enable CsrfMiddleware for all state-changing web routes
- Use RequestSignatureMiddleware for webhook endpoints
- Use DataMaskingProcessor to strip PII from logs before they reach your log backend
`;

export async function GET() {
  return new Response(CONTENT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
