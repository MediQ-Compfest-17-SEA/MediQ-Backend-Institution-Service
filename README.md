# MediQ Backend - Institution Service v3.0

## 🏢 Deskripsi

**Institution Service** adalah layanan dalam sistem MediQ yang mengelola **data fasilitas kesehatan (faskes) dan layanan medis** yang tersedia. Service ini menyediakan manajemen comprehensive untuk rumah sakit, klinik, puskesmas, dan layanan kesehatan yang mereka tawarkan seperti Poli Umum, Poli Gigi, Apotek, dll.

## ✨ Fitur Utama (v3.0)

### 🏥 Enhanced Institution Management
- **CRUD Operations**: Create, Read, Update, Delete untuk data faskes dengan validasi enhanced
- **Advanced Search**: Pencarian berdasarkan nama, lokasi, tipe, dan layanan dengan fuzzy matching
- **Institution Types**: Kategorisasi HOSPITAL, CLINIC, PUSKESMAS dengan metadata khusus
- **Capacity Management**: Monitoring kapasitas dan ketersediaan fasilitas
- **Rating System**: Sistem rating dan review untuk institusi
- **Relationship Management**: Relasi complex dengan services, users, dan queue system

### 🔧 Enhanced Service Management
- **Service Management**: Kelola layanan yang ditawarkan setiap faskes dengan status real-time
- **Location Tracking**: Informasi lokasi layanan detail (lantai, ruang, gedung)
- **Service Discovery**: API untuk menemukan layanan yang tersedia dengan filtering advanced
- **Availability Management**: Real-time tracking ketersediaan layanan
- **Queue Integration**: Full integration dengan Queue Service untuk monitoring real-time

### 🔍 Advanced Search & Filtering
- **Multi-criteria Search**: Pencarian berdasarkan multiple parameters
- **Geographic Search**: Pencarian berdasarkan lokasi dengan radius
- **Service-based Filtering**: Filter institusi berdasarkan layanan yang tersedia
- **Availability Filtering**: Filter berdasarkan ketersediaan dan status operasional
- **Performance Filtering**: Sort berdasarkan rating dan performa

### 🔄 Real-time Integration Features
- **WebSocket Integration**: Live updates untuk perubahan status institusi dan layanan
- **Queue System Monitoring**: Real-time monitoring antrian per institusi
- **Event-driven Architecture**: Publish events untuk perubahan data institusi
- **Live Notifications**: Push notifications untuk update penting
- **Dashboard Integration**: Real-time data untuk admin dashboard

### 🚀 Microservices Integration
- **RabbitMQ Communication**: Message patterns untuk cross-service communication
- **Database Independence**: MySQL database terpisah untuk institution data
- **API Gateway Integration**: Routing via API Gateway untuk external access
- **WebSocket Gateway**: Real-time communication channel
- **Circuit Breaker Pattern**: Resilient communication dengan external services

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

# WebSocket Configuration
WEBSOCKET_PORT=8607
WEBSOCKET_CORS_ORIGIN=*

# Redis Configuration (for caching and real-time features)
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# Logging Configuration
LOG_LEVEL=info

# Validation
INSTITUTION_NAME_MIN_LENGTH=3
INSTITUTION_NAME_MAX_LENGTH=100

# Search Configuration
SEARCH_MAX_RESULTS=100
SEARCH_MIN_SCORE=0.3

# Real-time Features
ENABLE_WEBSOCKETS=true
ENABLE_LIVE_UPDATES=true
NOTIFICATION_SERVICE_URL=http://notification-service:8610
```

## 📋 API Endpoints (v3.0)

### Base URL
**Development**: `http://localhost:8606`  
**Production**: `https://api.mediq.com/institutions`

### Enhanced Swagger Documentation
**Interactive API Docs**: `http://localhost:8606/api/docs`
- Complete OpenAPI 3.0 specification
- Interactive testing interface
- Real-time schema validation
- Example requests and responses
- Authentication testing support

### Core Endpoints

#### 🏢 Institution Management

**Create Fasilitas Kesehatan (Enhanced)**
```http
POST /institutions
Content-Type: application/json

{
  "name": "RS Harapan Bunda",
  "address": "Jl. Kesehatan No. 123, Jakarta Pusat",
  "phone": "021-555-1234",
  "type": "HOSPITAL",
  "capacity": 500,
  "coordinates": {
    "latitude": -6.2088,
    "longitude": 106.8456
  },
  "operatingHours": {
    "monday": "08:00-22:00",
    "tuesday": "08:00-22:00",
    "emergency": "24/7"
  }
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "name": "RS Harapan Bunda", 
  "address": "Jl. Kesehatan No. 123, Jakarta Pusat",
  "phone": "021-555-1234",
  "type": "HOSPITAL",
  "capacity": 500,
  "rating": 0,
  "coordinates": {
    "latitude": -6.2088,
    "longitude": 106.8456
  },
  "operatingHours": {
    "monday": "08:00-22:00",
    "tuesday": "08:00-22:00",
    "emergency": "24/7"
  },
  "status": "ACTIVE",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

**Get All Institutions (with Filters)**
```http
GET /institutions?type=HOSPITAL&status=ACTIVE&limit=20&offset=0&sortBy=rating&sortOrder=desc
```

**Get Institution by ID (with Relations)**
```http
GET /institutions/{institutionId}?include=services,statistics,ratings
```

**Update Institution**
```http
PATCH /institutions/{institutionId}
Content-Type: application/json

{
  "name": "RS Harapan Sejahtera",
  "phone": "021-555-9999",
  "capacity": 600
}
```

**Delete Institution**
```http
DELETE /institutions/{institutionId}
```

#### 🔍 Advanced Search & Filtering

**Multi-criteria Search**
```http
GET /institutions/search?q=harapan&type=HOSPITAL&city=Jakarta&radius=10&lat=-6.2088&lng=106.8456&minRating=4.0&available=true
```

**Geographic Search**
```http
GET /institutions/search/nearby?lat=-6.2088&lng=106.8456&radius=5&unit=km
```

**Service-based Search**
```http
GET /institutions/search/by-service?services=Poli%20Umum,Poli%20Gigi&available=true
```

**Advanced Filtering**
```http
GET /institutions/filter?type=HOSPITAL&capacity.min=100&capacity.max=1000&rating.min=4.0&status=ACTIVE
```

#### 🏥 Service Management (Enhanced)

**Get Institution Services (with Availability)**
```http
GET /institutions/{institutionId}/services?include=availability,queue_stats
```

**Response:**
```json
[
  {
    "id": "service-uuid-1",
    "name": "Poli Umum",
    "location": "Lantai 1, Ruang 101, Gedung A",
    "institutionId": "institution-uuid",
    "status": "AVAILABLE",
    "capacity": 50,
    "currentQueue": 12,
    "estimatedWaitTime": "30 minutes",
    "operatingHours": "08:00-16:00",
    "availability": {
      "today": true,
      "nextAvailable": "2024-01-20T08:00:00.000Z"
    }
  }
]
```

**Create New Service**
```http
POST /institutions/{institutionId}/services
Content-Type: application/json

{
  "name": "Poli Kardio",
  "location": "Lantai 3, Ruang 301, Gedung B",
  "capacity": 30,
  "operatingHours": "09:00-15:00"
}
```

**Update Service Availability**
```http
PATCH /institutions/{institutionId}/services/{serviceId}/availability
Content-Type: application/json

{
  "status": "AVAILABLE",
  "estimatedWaitTime": "45 minutes",
  "nextSlotAvailable": "2024-01-20T14:30:00.000Z"
}
```

#### 📊 Real-time & Statistics Endpoints

**Get Real-time Institution Status**
```http
GET /institutions/{institutionId}/status/realtime
```

**Response:**
```json
{
  "institutionId": "uuid-string",
  "status": "ACTIVE",
  "currentLoad": 75,
  "totalQueues": 8,
  "activeServices": 12,
  "availableCapacity": 125,
  "lastUpdated": "2024-01-20T10:00:00.000Z"
}
```

**Get Institution Statistics**
```http
GET /institutions/{institutionId}/statistics?period=today&metrics=queues,services,ratings
```

**WebSocket Events Subscription**
```http
GET /ws/institutions/{institutionId}/events
# WebSocket connection for real-time updates
```

**Bulk Operations**
```http
POST /institutions/bulk/update-status
Content-Type: application/json

{
  "institutionIds": ["uuid-1", "uuid-2"],
  "status": "ACTIVE",
  "reason": "Operational hours"
}
```

#### 🏥 Health Check

**Service Health (Enhanced)**
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
  "version": "3.0.0",
  "features": {
    "websockets": "enabled",
    "realtime": "enabled",
    "search": "enhanced",
    "caching": "enabled"
  },
  "dependencies": {
    "database": "connected",
    "rabbitmq": "connected",
    "redis": "connected",
    "websocket": "active"
  }
}
```

## 🧪 Testing (v3.0)

### Unit Testing
```bash
# Run all tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Test specific components
npm run test institution.service.spec.ts
npm run test institution.controller.spec.ts
npm run test search.service.spec.ts
npm run test websocket.gateway.spec.ts

# Test real-time features
npm run test realtime.service.spec.ts
npm run test notification.service.spec.ts
```

### Integration Testing
```bash
# Test database operations with enhanced features
npm run test:integration

# Test RabbitMQ communication patterns
npm run test:messaging

# Test WebSocket functionality
npm run test:websocket

# Test search and filtering
npm run test:search

# End-to-end testing with real-time features
npm run test:e2e

# Test external service integrations
npm run test:external
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

## 🏗️ Enhanced Database Schema (v3.0)

### Institution Model (Enhanced)
```sql
model Institution {
  id              String    @id @default(uuid())
  name            String                      // Nama faskes (RS, Klinik, Puskesmas)
  address         String?                     // Alamat lengkap faskes
  phone           String?                     // Nomor telepon faskes
  type            InstitutionType             // HOSPITAL, CLINIC, PUSKESMAS
  capacity        Int?                        // Kapasitas total faskes
  rating          Float     @default(0)       // Rating rata-rata (0-5)
  totalReviews    Int       @default(0)       // Total ulasan yang diterima
  status          InstitutionStatus @default(ACTIVE) // ACTIVE, INACTIVE, MAINTENANCE
  coordinates     Json?                       // Koordinat GPS {lat, lng}
  operatingHours  Json?                       // Jam operasional per hari
  contactEmail    String?                     // Email kontak faskes
  website         String?                     // Website faskes
  imageUrl        String?                     // Logo/gambar faskes
  description     String?                     // Deskripsi faskes
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  services        Service[]                   // Relasi: Satu institusi punya banyak layanan
  reviews         Review[]                    // Relasi: Satu institusi punya banyak review
  statistics      InstitutionStats?           // Relasi: Satu institusi punya stats
  
  @@index([type])
  @@index([status])
  @@index([rating])
  @@index([name])
}

enum InstitutionType {
  HOSPITAL
  CLINIC
  PUSKESMAS
  PHARMACY
  LAB
}

enum InstitutionStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  TEMPORARILY_CLOSED
}
```

### Enhanced Service Model
```sql
model Service {
  id              String      @id @default(uuid())
  name            String      // Nama layanan (e.g., "Poli Umum", "Apotek")
  location        String?     // Lokasi detail (e.g., "Lantai 2, Ruang 201, Gedung A")
  capacity        Int?        // Kapasitas layanan per hari
  status          ServiceStatus @default(AVAILABLE) // AVAILABLE, UNAVAILABLE, MAINTENANCE
  operatingHours  Json?       // Jam operasional layanan
  estimatedWaitTime Int?      // Estimasi waktu tunggu (menit)
  currentQueue    Int         @default(0) // Jumlah antrian saat ini
  isEmergency     Boolean     @default(false) // Layanan darurat 24/7
  description     String?     // Deskripsi layanan
  price           Decimal?    // Tarif layanan (opsional)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  institution     Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  institutionId   String
  
  @@index([status])
  @@index([institutionId])
  @@index([name])
}

enum ServiceStatus {
  AVAILABLE
  UNAVAILABLE
  MAINTENANCE
  FULL
}
```

### Review Model (New)
```sql
model Review {
  id            String      @id @default(uuid())
  rating        Int         // Rating 1-5
  comment       String?     // Komentar review
  reviewerName  String      // Nama reviewer
  reviewerEmail String?     // Email reviewer (opsional)
  isVerified    Boolean     @default(false) // Review terverifikasi
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  institutionId String
  
  @@index([institutionId])
  @@index([rating])
  @@index([isVerified])
}
```

### Institution Statistics Model (New)
```sql
model InstitutionStats {
  id                    String      @id @default(uuid())
  totalPatients         Int         @default(0)
  averageWaitTime       Int?        // Rata-rata waktu tunggu (menit)
  totalCompletedQueues  Int         @default(0)
  totalCancelledQueues  Int         @default(0)
  peakHours            Json?        // Jam sibuk dalam format JSON
  lastCalculated       DateTime     @default(now())
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  institution          Institution  @relation(fields: [institutionId], references: [id], onDelete: Cascade)
  institutionId        String       @unique
  
  @@index([institutionId])
}
```

### Enhanced Database Operations (v3.0)
```typescript
// Enhanced institution creation dengan comprehensive validation
async create(createInstitutionDto: CreateInstitutionDto) {
  return this.prisma.institution.create({
    data: {
      ...createInstitutionDto,
      statistics: {
        create: {
          totalPatients: 0,
          totalCompletedQueues: 0,
          totalCancelledQueues: 0,
        }
      }
    },
    include: {
      services: true,
      reviews: true,
      statistics: true,
    },
  });
}

// Advanced search dengan multiple criteria
async advancedSearch(searchParams: AdvancedSearchDto) {
  const { q, type, status, minRating, coordinates, radius, available } = searchParams;
  
  return this.prisma.institution.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } }
          ]
        } : {},
        type ? { type } : {},
        status ? { status } : {},
        minRating ? { rating: { gte: minRating } } : {},
        available ? { 
          services: { 
            some: { status: 'AVAILABLE' } 
          } 
        } : {}
      ]
    },
    include: {
      services: {
        where: available ? { status: 'AVAILABLE' } : {}
      },
      reviews: { take: 5, orderBy: { createdAt: 'desc' } },
      statistics: true,
    },
    orderBy: {
      rating: 'desc'
    }
  });
}

// Real-time status update dengan event publishing
async updateStatus(institutionId: string, status: InstitutionStatus) {
  const institution = await this.prisma.institution.update({
    where: { id: institutionId },
    data: { status, updatedAt: new Date() },
    include: { services: true }
  });

  // Publish real-time event
  await this.eventService.publishInstitutionStatusChange({
    institutionId,
    status,
    timestamp: new Date(),
    affectedServices: institution.services.length
  });

  return institution;
}

// Geographic search dengan haversine formula
async findNearby(lat: number, lng: number, radiusKm: number) {
  return this.prisma.$queryRaw`
    SELECT *, 
           (6371 * acos(cos(radians(${lat})) * cos(radians(JSON_EXTRACT(coordinates, '$.latitude'))) 
           * cos(radians(JSON_EXTRACT(coordinates, '$.longitude')) - radians(${lng})) 
           + sin(radians(${lat})) * sin(radians(JSON_EXTRACT(coordinates, '$.latitude'))))) AS distance
    FROM Institution 
    WHERE JSON_EXTRACT(coordinates, '$.latitude') IS NOT NULL 
    HAVING distance <= ${radiusKm}
    ORDER BY distance
  `;
}
```

## 🔄 Real-time Integration Features (v3.0)

### WebSocket Gateway
```typescript
@WebSocketGateway({
  port: 8607,
  cors: { origin: '*' },
  namespace: '/institutions'
})
export class InstitutionWebSocketGateway {
  
  // Subscribe to institution updates
  @SubscribeMessage('subscribe_institution')
  handleSubscribeInstitution(client: Socket, institutionId: string) {
    client.join(`institution_${institutionId}`);
    return { event: 'subscribed', data: institutionId };
  }

  // Broadcast institution status changes
  broadcastStatusChange(institutionId: string, statusData: any) {
    this.server.to(`institution_${institutionId}`).emit('status_changed', statusData);
  }

  // Broadcast service availability changes
  broadcastServiceUpdate(institutionId: string, serviceData: any) {
    this.server.to(`institution_${institutionId}`).emit('service_updated', serviceData);
  }

  // Broadcast queue statistics updates
  broadcastQueueUpdate(institutionId: string, queueData: any) {
    this.server.to(`institution_${institutionId}`).emit('queue_updated', queueData);
  }
}
```

### Event-Driven Architecture
```typescript
// Event patterns untuk real-time updates
export class InstitutionEventService {
  
  async publishInstitutionStatusChange(eventData: InstitutionStatusChangeEvent) {
    // Publish to RabbitMQ for other services
    await this.rabbitMQ.publish('institution.status.changed', eventData);
    
    // Broadcast via WebSocket for real-time clients
    this.websocketGateway.broadcastStatusChange(eventData.institutionId, eventData);
    
    // Cache update for fast retrieval
    await this.redis.set(
      `institution:status:${eventData.institutionId}`,
      JSON.stringify(eventData),
      'EX', 300 // 5 minutes TTL
    );
  }

  async publishServiceAvailabilityChange(eventData: ServiceAvailabilityEvent) {
    await this.rabbitMQ.publish('institution.service.availability.changed', eventData);
    this.websocketGateway.broadcastServiceUpdate(eventData.institutionId, eventData);
  }

  async publishQueueStatisticsUpdate(eventData: QueueStatisticsEvent) {
    await this.rabbitMQ.publish('institution.queue.statistics.updated', eventData);
    this.websocketGateway.broadcastQueueUpdate(eventData.institutionId, eventData);
  }
}
```

### Real-time Data Synchronization
```typescript
// Real-time service untuk monitoring institution data
export class RealTimeInstitutionService {
  
  // Get real-time institution status dari cache atau database
  async getRealTimeStatus(institutionId: string): Promise<InstitutionRealTimeStatus> {
    // Try from cache first
    const cached = await this.redis.get(`institution:realtime:${institutionId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fallback to database
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
      include: {
        services: { where: { status: 'AVAILABLE' } },
        statistics: true
      }
    });

    const realTimeStatus = {
      institutionId: institution.id,
      status: institution.status,
      activeServices: institution.services.length,
      totalCapacity: institution.capacity,
      currentLoad: institution.statistics?.totalPatients || 0,
      lastUpdated: new Date()
    };

    // Cache for 1 minute
    await this.redis.setex(
      `institution:realtime:${institutionId}`,
      60,
      JSON.stringify(realTimeStatus)
    );

    return realTimeStatus;
  }

  // Update real-time metrics from queue service
  async updateRealTimeMetrics(institutionId: string, metrics: QueueMetrics) {
    const currentStatus = await this.getRealTimeStatus(institutionId);
    
    const updatedStatus = {
      ...currentStatus,
      currentLoad: metrics.totalActiveQueues,
      estimatedWaitTime: metrics.averageWaitTime,
      lastUpdated: new Date()
    };

    await this.redis.setex(
      `institution:realtime:${institutionId}`,
      60,
      JSON.stringify(updatedStatus)
    );

    // Broadcast to subscribed clients
    this.eventService.publishQueueStatisticsUpdate({
      institutionId,
      metrics,
      timestamp: new Date()
    });
  }
}
```

### Client Integration Examples
```javascript
// Frontend WebSocket integration
const socket = io('ws://localhost:8607/institutions');

// Subscribe to specific institution updates
socket.emit('subscribe_institution', 'institution-uuid-123');

// Listen for real-time updates
socket.on('status_changed', (data) => {
  console.log('Institution status changed:', data);
  updateInstitutionUI(data);
});

socket.on('service_updated', (data) => {
  console.log('Service availability updated:', data);
  updateServiceList(data);
});

socket.on('queue_updated', (data) => {
  console.log('Queue statistics updated:', data);
  updateQueueDisplays(data);
});

// React Hook untuk real-time data
export function useInstitutionRealTime(institutionId) {
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    const socket = io('ws://localhost:8607/institutions');
    
    socket.emit('subscribe_institution', institutionId);
    
    socket.on('status_changed', setStatus);
    socket.on('service_updated', (data) => {
      setStatus(prev => ({ ...prev, services: data.services }));
    });
    
    return () => socket.disconnect();
  }, [institutionId]);
  
  return status;
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
