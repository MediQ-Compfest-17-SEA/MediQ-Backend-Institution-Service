# MediQ Backend - Institution Service

## 🏢 Deskripsi

**Institution Service** adalah layanan dalam sistem MediQ yang mengelola **data fasilitas kesehatan (faskes) dan layanan medis** yang tersedia. Service ini menyediakan manajemen comprehensive untuk rumah sakit, klinik, puskesmas, dan layanan kesehatan yang mereka tawarkan seperti Poli Umum, Poli Gigi, Apotek, dll.

## ✨ Fitur Utama

### 🏥 Manajemen Fasilitas Kesehatan
- **CRUD Operations**: Create, Read, Update, Delete untuk data faskes
- **Institution Search**: Pencarian berdasarkan nama dengan fuzzy matching
- **Data Validation**: Validasi comprehensive untuk data faskes
- **Relationship Management**: Relasi one-to-many dengan services/layanan

### 🔧 Manajemen Layanan Medis
- **Service Management**: Kelola layanan yang ditawarkan setiap faskes
- **Location Tracking**: Informasi lokasi layanan (lantai, ruang)
- **Service Discovery**: API untuk menemukan layanan yang tersedia
- **Integration Ready**: Siap integrasi dengan Queue Service untuk antrian per layanan

### 🔄 Microservices Integration
- **RabbitMQ Communication**: Message patterns untuk cross-service communication
- **Database Independence**: MySQL database terpisah untuk institution data
- **API Gateway Integration**: Routing via API Gateway untuk external access
- **Real-time Updates**: Event-driven updates untuk perubahan institution data

## 🚀 Quick Start

### Persyaratan
- **Node.js** 18+
- **MySQL** 8.0+
- **RabbitMQ** 3.9+
- **Prisma CLI** untuk database management

### Instalasi

```bash
# Clone repository
git clone https://github.com/MediQ-Compfest-17-SEA/MediQ-Backend-Institution-Service.git
cd MediQ-Backend-Institution-Service

# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Setup environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi environment Anda

# Start development server
npm run start:dev
```

### Environment Variables

```env
# Server Configuration
PORT=8606
NODE_ENV=development

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/mediq_institutions"

# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672

# Logging Configuration
LOG_LEVEL=info

# Validation
INSTITUTION_NAME_MIN_LENGTH=3
INSTITUTION_NAME_MAX_LENGTH=100
```

## 📋 API Endpoints

### Base URL
**Development**: `http://localhost:8606`  
**Production**: `https://api.mediq.com/institutions`

### Swagger Documentation
**Interactive API Docs**: `http://localhost:8606/api/docs`

### Core Endpoints

#### 🏢 Institution Management

**Create Fasilitas Kesehatan**
```http
POST /institutions
Content-Type: application/json

{
  "name": "RS Harapan Bunda",
  "address": "Jl. Kesehatan No. 123, Jakarta Pusat",
  "phone": "021-555-1234"
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "name": "RS Harapan Bunda", 
  "address": "Jl. Kesehatan No. 123, Jakarta Pusat",
  "phone": "021-555-1234",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

**Get All Institutions**
```http
GET /institutions
```

**Get Institution by ID**
```http
GET /institutions/{institutionId}
```

**Update Institution**
```http
PATCH /institutions/{institutionId}
Content-Type: application/json

{
  "name": "RS Harapan Sejahtera",
  "phone": "021-555-9999"
}
```

**Delete Institution**
```http
DELETE /institutions/{institutionId}
```

#### 🔍 Search & Discovery

**Search by Name**
```http
GET /institutions/search/{searchName}

# Example:
GET /institutions/search/harapan
```

**Get Institution Services**
```http
GET /institutions/{institutionId}/services
```

**Response:**
```json
[
  {
    "id": "service-uuid-1",
    "name": "Poli Umum",
    "location": "Lantai 1, Ruang 101",
    "institutionId": "institution-uuid"
  },
  {
    "id": "service-uuid-2", 
    "name": "Poli Gigi",
    "location": "Lantai 2, Ruang 201",
    "institutionId": "institution-uuid"
  }
]
```

#### 🏥 Health Check

**Service Health**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "institution-service",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "uptime": 123456,
  "version": "1.0.0"
}
```

## 🧪 Testing

### Unit Testing
```bash
# Run all tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Test specific service
npm run test institution.service.spec.ts
npm run test institution.controller.spec.ts
```

### Integration Testing
```bash
# Test database operations
npm run test:integration

# Test RabbitMQ communication
npm run test:messaging

# End-to-end testing
npm run test:e2e
```

### Coverage Requirements
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100% 
- **Lines**: 100%

### Test Data Examples
```typescript
// Sample test data
const mockInstitution = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'RS Harapan Bunda',
  address: 'Jl. Kesehatan No. 123, Jakarta',
  phone: '021-555-1234',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockServices = [
  {
    id: 'service-uuid-1',
    name: 'Poli Umum',
    location: 'Lantai 1',
    institutionId: '123e4567-e89b-12d3-a456-426614174000',
  }
];
```

## 🏗️ Database Schema

### Institution Model
```sql
model Institution {
  id        String    @id @default(uuid())
  name      String                      // Nama faskes (RS, Klinik, Puskesmas)
  address   String?                     // Alamat lengkap faskes
  phone     String?                     // Nomor telepon faskes
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  services Service[] // Relasi: Satu institusi punya banyak layanan
}
```

### Service Model
```sql
model Service {
  id            String      @id @default(uuid())
  name          String      // Nama layanan (e.g., "Poli Umum", "Apotek")
  location      String?     // Lokasi layanan (e.g., "Lantai 2, Ruang 201")

  institution   Institution @relation(fields: [institutionId], references: [id])
  institutionId String
}
```

### Database Operations
```typescript
// Institution creation dengan validation
async create(createInstitutionDto: CreateInstitutionDto) {
  return this.prisma.institution.create({
    data: createInstitutionDto,
    include: {
      services: true, // Include related services
    },
  });
}

// Search institutions dengan case-insensitive
async findByName(searchName: string) {
  return this.prisma.institution.findMany({
    where: {
      name: {
        contains: searchName,
        mode: 'insensitive',
      },
    },
    include: {
      services: true,
    },
  });
}
```

## 📦 Production Deployment

### Docker
```bash
# Build production image
docker build -t mediq/institution-service:latest .

# Run container
docker run -p 8606:8606 \
  -e DATABASE_URL="mysql://user:pass@mysql:3306/mediq_institutions" \
  -e RABBITMQ_URL="amqp://rabbitmq:5672" \
  mediq/institution-service:latest
```

### Kubernetes
```bash
# Deploy to cluster
kubectl apply -f k8s/

# Run database migrations  
kubectl exec -it institution-service-pod -- npx prisma migrate deploy

# Check service status
kubectl get pods -l app=institution-service

# View logs
kubectl logs -f deployment/institution-service
```

### Database Migration
```bash
# Create new migration
npx prisma migrate dev --name add-institution-type

# Deploy to production
npx prisma migrate deploy

# View migration status
npx prisma migrate status
```

## 🔧 Development

### Project Structure
```
src/
├── institution/
│   ├── dto/                        # Data Transfer Objects
│   ├── institution.controller.ts   # HTTP endpoints & message patterns
│   ├── institution.service.ts      # Business logic
│   └── institution.module.ts       # Module configuration
├── prisma/
│   ├── prisma.service.ts           # Database service
│   └── prisma.module.ts            # Database module
├── app.module.ts                   # Main application module
└── main.ts                         # Application bootstrap
```

### Message Pattern Handlers
```typescript
// RabbitMQ message handlers untuk inter-service communication
@MessagePattern('institution.create')
async createInstitutionFromMessage(@Payload() data: CreateInstitutionDto) {
  return this.institutionService.create(data);
}

@MessagePattern('institution.findAll')
async findAllInstitutions() {
  return this.institutionService.findAll();
}

@MessagePattern('institution.findOne')
async findOneInstitution(@Payload() data: { id: string }) {
  return this.institutionService.findOne(data.id);
}

@MessagePattern('institution.getServices')
async getInstitutionServices(@Payload() data: { institutionId: string }) {
  return this.institutionService.getInstitutionServices(data.institutionId);
}
```

### Integration Points
```typescript
// Integration dengan Patient Queue Service
// Queue Service dapat query institution info
const institutionInfo = await this.messagingService.send(
  'institution.findOne', 
  { id: queueData.institutionId }
);

// Integration dengan User Service 
// Associate users dengan institutions
const userInstitution = await this.messagingService.send(
  'institution.findOne',
  { id: user.institutionId }
);
```

## 🚨 Monitoring & Troubleshooting

### Health Monitoring
```bash
# Service health check
curl http://localhost:8606/health

# Database connectivity
curl http://localhost:8606/institutions

# RabbitMQ connectivity  
curl http://localhost:8606/status
```

### Common Issues

**Database Connection Error**:
```bash
# Test MySQL connection
mysql -h localhost -u username -p

# Verify DATABASE_URL format
DATABASE_URL="mysql://username:password@host:port/database"

# Check database exists
mysql -e "SHOW DATABASES LIKE 'mediq_institutions';"
```

**Prisma Migration Issues**:
```bash
# Reset database (development only)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate deploy

# Generate client after schema changes
npx prisma generate
```

**RabbitMQ Communication Issues**:
```bash
# Check RabbitMQ status
rabbitmqctl status

# List queues
rabbitmqctl list_queues name messages

# Test message sending
curl -X POST http://localhost:8606/institutions \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Hospital"}'
```

### Performance Monitoring
```typescript
// Database query performance
const startTime = Date.now();
const institutions = await this.prisma.institution.findMany();
const queryTime = Date.now() - startTime;

logger.info('Database query performance', {
  operation: 'findAll',
  queryTime: `${queryTime}ms`,
  resultCount: institutions.length
});
```

## 🔒 Security Considerations

### Data Validation
```typescript
// Comprehensive input validation
@IsString()
@IsNotEmpty()
@MinLength(3)
@MaxLength(100)
name: string;

@IsOptional()
@IsString()
@MaxLength(255)
address?: string;

@IsOptional()
@IsString()
@Matches(/^[0-9\-\+\(\)\s]+$/, {
  message: 'Phone number contains invalid characters'
})
phone?: string;
```

### Database Security
- **Prepared Statements**: Prisma ORM prevents SQL injection
- **Input Sanitization**: Validate semua user inputs
- **Access Control**: Database user dengan minimal privileges
- **Audit Logging**: Track semua institution operations

### API Security
- **Authentication**: Integration dengan User Service untuk JWT validation
- **Authorization**: Role-based access (hanya ADMIN_FASKES yang bisa CRUD)
- **Rate Limiting**: Prevent abuse dengan appropriate limits
- **Error Handling**: Tidak expose sensitive system information

## 🎯 Use Cases

### Scenario 1: Setup Faskes Baru
1. **Admin register** faskes baru via API
2. **Institution Service** validate dan store data
3. **Service setup** untuk layanan yang ditawarkan
4. **Integration** dengan Queue Service untuk antrian per layanan

### Scenario 2: Patient Registration Integration  
1. **OCR Service** process KTP pasien
2. **Auto-detect** atau **user select** faskes
3. **Institution Service** provide faskes info
4. **Queue Service** add pasien ke antrian faskes yang dipilih

### Scenario 3: Admin Dashboard
1. **Admin dashboard** query semua faskes
2. **Institution Service** return data dengan statistics
3. **Service management** untuk enable/disable layanan
4. **Reporting** untuk management oversight

## 🔧 Development Guidelines

### Code Style
- **ESLint**: TypeScript recommended dengan Prettier
- **Formatting**: Single quotes, trailing commas
- **Imports**: Absolute imports dengan `src/` path mapping
- **Validation**: class-validator untuk DTOs
- **Error Handling**: Consistent exception handling

### Development Commands
```bash
# Development dengan hot reload
npm run start:dev

# Build production
npm run build

# Database operations
npx prisma studio          # Database GUI
npx prisma migrate dev      # Create migration
npx prisma generate        # Generate client

# Linting dan formatting
npm run lint
npm run format

# Testing
npm run test              # Unit tests
npm run test:cov         # With coverage  
npm run test:integration # Integration tests
```

### Adding New Features
```typescript
// 1. Update Prisma schema
model Institution {
  // Add new fields
  type        String?    // HOSPITAL, CLINIC, PUSKESMAS
  capacity    Int?       // Kapasitas faskes
  rating      Float?     // Rating faskes
}

// 2. Generate migration
// npx prisma migrate dev --name add-institution-type

// 3. Update DTOs
export class CreateInstitutionDto {
  @IsOptional()
  @IsEnum(['HOSPITAL', 'CLINIC', 'PUSKESMAS'])
  type?: string;
  
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}

// 4. Update service logic
async findByType(type: string) {
  return this.prisma.institution.findMany({
    where: { type },
    include: { services: true }
  });
}

// 5. Add tests
it('should filter institutions by type', async () => {
  // Test implementation
});
```

## 📊 Analytics & Reporting

### Institution Statistics
```typescript
// Get institution statistics
async getInstitutionStats() {
  const stats = await this.prisma.institution.aggregate({
    _count: true,
    _avg: { rating: true },
  });
  
  const serviceStats = await this.prisma.service.groupBy({
    by: ['institutionId'],
    _count: { _all: true },
  });

  return {
    totalInstitutions: stats._count,
    averageRating: stats._avg.rating,
    averageServicesPerInstitution: serviceStats.length > 0 
      ? serviceStats.reduce((sum, item) => sum + item._count._all, 0) / serviceStats.length 
      : 0,
  };
}
```

### Usage Tracking
```typescript
// Track institution usage
async trackInstitutionUsage(institutionId: string, action: string) {
  logger.info('Institution usage tracked', {
    institutionId,
    action,
    timestamp: new Date().toISOString(),
  });
  
  // Could store usage statistics untuk reporting
}
```

## 🤝 Contributing

1. **Fork** repository
2. **Create feature branch** (`git checkout -b feature/institution-rating`)
3. **Write comprehensive tests** dengan 100% coverage
4. **Update database schema** jika diperlukan
5. **Add migration files** untuk schema changes
6. **Update documentation** untuk new endpoints
7. **Commit changes** (`git commit -m 'Add institution rating system'`)
8. **Push branch** (`git push origin feature/institution-rating`)
9. **Create Pull Request**

### Code Review Checklist
- ✅ Unit tests dengan 100% coverage
- ✅ Integration tests untuk database operations
- ✅ Swagger documentation updated
- ✅ Database migration files included
- ✅ Error handling implemented
- ✅ Message patterns documented
- ✅ Performance considerations addressed

## 📄 License

**Dual License**: Apache-2.0 + Commercial License (Royalty)

**Copyright (c) 2025 Alif Nurhidayat (KillerKing93)**

### **Open Source License**
Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

### **Commercial License**  
For commercial use, proprietary modifications, or usage in closed-source projects,  
a commercial license is required.  
**Contact**: alifnurhidayatwork@gmail.com

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.

---

**💡 Tips Development**:
- Gunakan `npx prisma studio` untuk visual database management
- Test message patterns dengan RabbitMQ management console
- Monitor database performance dengan `EXPLAIN` queries
- Use database indexes untuk frequently queried fields
- Implement soft delete untuk audit trail requirements

**🔗 Service Integrations**:
- **Queue Service**: Institution info untuk queue management
- **User Service**: User-institution association  
- **OCR Service**: Auto-populate institution data dari KTP
- **API Gateway**: Centralized routing dan authentication
- **Monitoring Stack**: Prometheus metrics dan Grafana dashboards
