# Health Tracker DSS

Personal Health Tracker with Decision Support System

## Overview

A comprehensive health tracking application built with Spring Boot (backend) and React (frontend), featuring MongoDB for data storage and Redis for caching. The application provides health metrics tracking, symptom analysis, and decision support capabilities.

## Technology Stack

**Backend:**
- Java 21
- Spring Boot 3.5.7
- MongoDB (Database)
- Redis (Caching)
- Spring Security + JWT
- Maven

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Recharts (Data visualization)
- React Router

## Prerequisites

### Option 1: Docker (Recommended)
- Docker 20.10+
- Docker Compose 2.0+

### Option 2: Local Development
- Java 21 or higher
- Node.js 20 or higher
- Maven 3.9+
- MongoDB 7.0+
- Redis 7.2+

## Getting Started

### Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-tracker-dss
   ```

2. **Configure environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure the following variables:
   ```env
   # MongoDB Configuration
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=your-secure-password

   # Redis Configuration
   REDIS_PASSWORD=your-redis-password

   # JWT Configuration (generate a secure 256-bit key)
   JWT_SECRET=your-secret-key-here-minimum-256-bits-long-for-security
   JWT_EXPIRATION=86400000

   # Spring Security
   SPRING_SECURITY_USER_NAME=admin
   SPRING_SECURITY_USER_PASSWORD=your-admin-password

   # Server Configuration
   SERVER_PORT=8080
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB on port 27017
   - Redis on port 6379
   - Backend API on port 8080

4. **Check service health**
   ```bash
   docker-compose ps
   ```

   All services should show "healthy" status.

5. **View logs**
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f mongodb
   docker-compose logs -f redis
   ```

6. **Access the application**
   - Frontend: http://localhost:8080
   - API: http://localhost:8080/api
   - API Documentation: http://localhost:8080/swagger-ui.html
   - Health Check: http://localhost:8080/actuator/health

7. **Stop services**
   ```bash
   docker-compose down
   ```

   To also remove volumes (⚠️ this will delete all data):
   ```bash
   docker-compose down -v
   ```

### Local Development Setup

1. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
     mongo:7.0
   ```

2. **Start Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 --name redis \
     redis:7.2-alpine redis-server --requirepass redis123
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root (see `.env.example` for reference).

4. **Build and run backend**
   ```bash
   # Build
   ./mvnw clean package

   # Run
   ./mvnw spring-boot:run
   ```

5. **Build and run frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

## Docker Commands Reference

### Building and Running

```bash
# Build and start services
docker-compose up -d --build

# Start services (without rebuilding)
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

### Monitoring

```bash
# Check status of services
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Execute commands in container
docker-compose exec backend sh
docker-compose exec mongodb mongosh
docker-compose exec redis redis-cli
```

### Maintenance

```bash
# Restart a service
docker-compose restart backend

# Rebuild a specific service
docker-compose up -d --build backend

# Remove stopped containers
docker-compose rm

# View resource usage
docker stats
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | Generated from other vars | Yes |
| `MONGO_ROOT_USERNAME` | MongoDB root username | admin | Yes |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | - | Yes |
| `REDIS_HOST` | Redis host | redis | No |
| `REDIS_PORT` | Redis port | 6379 | No |
| `REDIS_PASSWORD` | Redis password | - | Yes |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | - | Yes |
| `JWT_EXPIRATION` | JWT token expiration (ms) | 86400000 | No |
| `SPRING_SECURITY_USER_NAME` | Default admin username | admin | No |
| `SPRING_SECURITY_USER_PASSWORD` | Default admin password | - | Yes |
| `SERVER_PORT` | Backend server port | 8080 | No |

## API Documentation

Once the application is running, access the interactive API documentation at:

**Swagger UI:** http://localhost:8080/swagger-ui.html

## Health Checks

The application includes health check endpoints:

```bash
# Overall health
curl http://localhost:8080/actuator/health

# Detailed health (includes MongoDB, Redis status)
curl http://localhost:8080/actuator/health/readiness
```

## Volumes

Docker Compose creates the following volumes for data persistence:

- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `redis_data` - Redis persistence

## Troubleshooting

### Services won't start

1. Check if ports are already in use:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   netstat -ano | findstr :27017
   netstat -ano | findstr :6379

   # Linux/Mac
   lsof -i :8080
   lsof -i :27017
   lsof -i :6379
   ```

2. Check service logs:
   ```bash
   docker-compose logs backend
   ```

### MongoDB connection issues

1. Verify MongoDB is healthy:
   ```bash
   docker-compose ps mongodb
   docker-compose logs mongodb
   ```

2. Test connection:
   ```bash
   docker-compose exec mongodb mongosh -u admin -p admin123
   ```

### Redis connection issues

1. Verify Redis is healthy:
   ```bash
   docker-compose ps redis
   docker-compose logs redis
   ```

2. Test connection:
   ```bash
   docker-compose exec redis redis-cli -a redis123 ping
   ```

### Backend won't start

1. Check environment variables are set correctly in `.env`
2. Ensure MongoDB and Redis are healthy before backend starts
3. Check backend logs for specific errors:
   ```bash
   docker-compose logs -f backend
   ```

### Reset everything

If you need to start fresh:

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Development

### Hot Reload

For local development with hot reload:

1. Start MongoDB and Redis with Docker:
   ```bash
   docker-compose up -d mongodb redis
   ```

2. Run backend in development mode:
   ```bash
   ./mvnw spring-boot:run
   ```

3. Run frontend in development mode:
   ```bash
   cd frontend
   npm run dev
   ```

### Running Tests

```bash
# Backend tests
./mvnw test

# Backend integration tests
./mvnw verify

# Frontend tests
cd frontend
npm test
```

### Code Coverage

```bash
# Generate backend coverage report
./mvnw test jacoco:report

# View report
open target/site/jacoco/index.html
```

## Security Notes

1. **Change default passwords** in production
2. **Use strong JWT secrets** (minimum 256 bits)
3. **Enable HTTPS** in production
4. **Configure firewall rules** to restrict database access
5. **Keep dependencies updated** regularly

## License

[Add your license information here]

## Contributing

[Add contributing guidelines here]

## Support

For issues and questions, please open an issue on the repository.
