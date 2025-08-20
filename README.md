# MediQ Institution Service

A microservice for managing healthcare institutions and their services within the MediQ ecosystem. Built with NestJS, this service provides comprehensive institution management with RabbitMQ integration for microservices communication.

## 🚀 Features

- **Institution Management**: Complete CRUD operations for healthcare institutions
- **Service Management**: Manage services offered by institutions
- **RabbitMQ Integration**: Microservices communication patterns
- **Swagger Documentation**: Comprehensive API documentation
- **Type Safety**: Full TypeScript support with validation
- **Health Checks**: Built-in health monitoring endpoints
- **Docker Support**: Production-ready containerization
- **Kubernetes Ready**: Complete K8s manifests included
- **CI/CD Pipeline**: GitHub Actions workflow
- **100% Test Coverage**: Unit, integration, and E2E tests

## 🏗️ Architecture

This service is part of the MediQ microservices architecture:

- **Port**: 8606
- **Queue**: `institution_service_queue`
- **Database**: PostgreSQL with Prisma ORM
- **Message Broker**: RabbitMQ
- **API Documentation**: Available at `/api/docs`

### Supported Institution Types
- `HOSPITAL` - General hospitals
- `CLINIC` - Medical clinics
- `PUSKESMAS` - Community health centers
- `PHARMACY` - Pharmacies
- `LABORATORY` - Medical laboratories

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- RabbitMQ 3.8+
- Docker & Docker Compose (optional)

## 🛠️ Installation

```bash
# Clone the repository
git clone [repository-url]
cd MediQ-Backend-Institution-Service

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your environment variables
# Edit .env file with your database and RabbitMQ settings

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Service port | `8606` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `RABBITMQ_URL` | RabbitMQ connection string | - |

See `.env.example` for complete configuration options.

## 🏃 Running the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Watch mode
npm run start
```

The service will be available at:
- **API**: http://localhost:8606
- **Swagger Docs**: http://localhost:8606/api/docs
- **Health Check**: http://localhost:8606/health

## 🐳 Docker Support

### Using Docker Compose (Recommended for Development)

```bash
# Start all services (PostgreSQL, RabbitMQ, Redis, Institution Service)
docker-compose up -d

# View logs
docker-compose logs -f institution-service

# Stop services
docker-compose down
```

### Building Docker Image

```bash
# Build image
npm run docker:build

# Push to registry
npm run docker:push
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run CI tests (coverage + E2E)
npm run ci:test
```

### Test Coverage Requirements
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## 📊 API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/institutions` | Get all institutions |
| `GET` | `/institutions/:id` | Get institution by ID |
| `POST` | `/institutions` | Create new institution |
| `PATCH` | `/institutions/:id` | Update institution |
| `DELETE` | `/institutions/:id` | Delete institution |
| `GET` | `/institutions/:id/services` | Get institution services |
| `GET` | `/health` | Health check |

### RabbitMQ Message Patterns

| Pattern | Description | Payload |
|---------|-------------|---------|
| `institution.create` | Create institution | `CreateInstitutionDto` |
| `institution.findAll` | Get all institutions | `{}` |
| `institution.findOne` | Get institution by ID | `{ id: string }` |
| `institution.update` | Update institution | `{ id: string, updateData: UpdateInstitutionDto }` |
| `institution.delete` | Delete institution | `{ id: string }` |
| `institution.getServices` | Get institution services | `{ id: string }` |
| `health.check` | Health check | `{}` |

### Sample API Usage

```bash
# Create institution
curl -X POST http://localhost:8606/institutions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "General Hospital",
    "code": "GH001",
    "type": "HOSPITAL",
    "address": "123 Main St",
    "phone": "021-555-1234",
    "email": "admin@gh.com"
  }'

# Get all institutions
curl http://localhost:8606/institutions

# Get institution by ID
curl http://localhost:8606/institutions/{id}
```

## 🚀 Deployment

### Kubernetes

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=mediq,service=institution-service

# View logs
kubectl logs -f deployment/institution-service
```

### Environment-Specific Deployments

```bash
# Deploy to staging
git push origin develop

# Deploy to production
git push origin main
```

## 🔍 Monitoring & Observability

### Health Checks
- **Liveness Probe**: `/health`
- **Readiness Probe**: `/health`

### Logging
- **Format**: JSON (production) / Pretty (development)
- **Levels**: error, warn, info, debug
- **Context**: HTTP requests, database operations, RabbitMQ messages

### Metrics
- Auto-scaling based on CPU (70%) and Memory (80%) usage
- Horizontal Pod Autoscaler: 2-10 replicas

## 🛡️ Security

- **Input Validation**: Class-validator decorators
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **CORS Configuration**: Configurable origins
- **Rate Limiting**: Configurable request limits
- **Container Security**: Non-root user, read-only filesystem

## 🤝 Integration with Other Services

### Patient Queue Service
- Uses `institution.findOne` to get institution details
- Validates institution existence during patient registration

### User Service
- Associates users with institutions
- Validates institution access permissions

### OCR Service
- Auto-populates institution data from KTP processing
- Creates institutions automatically when detected

## 🔧 Development

### Project Structure
```
src/
├── institution/          # Institution module
│   ├── dto/             # Data Transfer Objects
│   ├── institution.controller.ts
│   ├── institution.service.ts
│   └── institution.module.ts
├── prisma/              # Database module
├── app.module.ts        # Root module
└── main.ts              # Application entry point

k8s/                     # Kubernetes manifests
test/                    # Test files
```

### Code Style
- **Prettier**: Single quotes, trailing commas
- **ESLint**: TypeScript recommended rules
- **Import Style**: Absolute imports using `src/`
- **Naming**: camelCase for variables, PascalCase for classes

### Database Schema
```sql
-- Institution table
CREATE TABLE Institution (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  code        VARCHAR(20) UNIQUE NOT NULL,
  address     VARCHAR(500),
  phone       VARCHAR(20),
  email       VARCHAR(255),
  type        InstitutionType NOT NULL,
  status      InstitutionStatus DEFAULT 'ACTIVE',
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);

-- Service table
CREATE TABLE Service (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  institutionId UUID REFERENCES Institution(id) ON DELETE CASCADE,
  createdAt     TIMESTAMP DEFAULT NOW(),
  updatedAt     TIMESTAMP DEFAULT NOW()
);
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL is running
   docker-compose ps postgres
   
   # Check connection string
   echo $DATABASE_URL
   ```

2. **RabbitMQ Connection Issues**
   ```bash
   # Check RabbitMQ is running
   docker-compose ps rabbitmq
   
   # Access management UI
   http://localhost:15672 (guest/guest)
   ```

3. **Port Already in Use**
   ```bash
   # Find process using port 8606
   lsof -ti:8606
   
   # Kill the process
   kill -9 <PID>
   ```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and add tests
4. Ensure 100% test coverage (`npm run test:cov`)
5. Run linting (`npm run lint`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the MediQ development team
- Check the [troubleshooting section](#troubleshooting)

---

**MediQ Institution Service** - Part of the MediQ Healthcare Management System
