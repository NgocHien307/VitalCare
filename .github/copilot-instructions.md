# GitHub Copilot Instructions for Health Tracker DSS

## Project Overview

Healthcare tracking application with Decision Support System (DSS). **Spring Boot 3.5.7 + Java 21** backend with **MongoDB** and **Redis** caching. **React 18 + Vite + Tailwind CSS** frontend. JWT authentication with BCrypt hashing.

## Architecture & Key Patterns

### Layered Backend Architecture

```
controller/ → service/ → repository/ → MongoDB
     ↓           ↓
    DTO     Business Logic
```

- **CRITICAL**: Controllers MUST verify user ownership via `@AuthenticationPrincipal UserDetails userDetails` to prevent IDOR attacks
- **Always** check `if (!entity.getUserId().equals(userId))` before returning data (see `HealthMetricService.java:50-60`)
- Service layer contains business logic; repositories are thin data access wrappers

### DSS (Decision Support System) Core

**Location**: `src/main/java/com/healthtracker/dss/` and `service/dss/`

**SymptomAnalysisService** (`service/dss/SymptomAnalysisService.java`) is the CORE DSS algorithm:

1. **Performance-critical pattern**: Pre-index symptoms in `Set<String>` for O(1) lookup (line 82) - NEVER use `stream().anyMatch()` in loops
2. **Targeted queries**: Query only relevant disease mappings by symptom names (line 67) - NOT `findAll()`
3. **Redis caching**: Disease mappings cached for 1 hour (see `SymptomDiseaseMappingService` and `CacheConfig.java`)
4. Match score calculation: weighted symptom patterns with critical symptom bonuses (line 113-150)
5. Urgency scoring: multi-factor (severity, critical disease, duration) capped at 100 (line 158-199)

**Rule Engine Pattern**: `dss/engine/RuleEngine.java` evaluates health rules

- Rules implement `Rule<T>` interface with `evaluate()`, `getRecommendation()`, `getSeverity()`
- See `dss/rules/BloodPressureRule.java` for example: checks last 3 readings for persistent hypertension

## Development Workflows

### Backend Development

```powershell
# Build & Run
.\mvnw clean install
.\mvnw spring-boot:run

# Run tests
.\mvnw test
.\mvnw test -Dtest=SymptomAnalysisServiceTest

# Access Swagger docs
# http://localhost:8080/swagger-ui.html
```

**Environment Setup**: `.env` file required (NEVER commit to Git):

```properties
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
JWT_SECRET=your-secure-256-bit-secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend Development

```powershell
cd frontend
npm install
npm run dev  # Vite dev server on http://localhost:5173
```

**API Integration Pattern** (`frontend/src/utils/api.js`):

- JWT token stored in `localStorage` as `authToken`
- Automatic 401 handling: clears token and redirects to `/login`
- All API calls use `/api` prefix (proxied by Vite in dev)

### Testing Strategy

**Backend**: JUnit 5 with Mockito (see `SymptomAnalysisServiceTest.java`)

- Mock repositories with `@Mock`, inject with `@InjectMocks`
- Test DSS algorithm edge cases: missing critical symptoms, urgency calculation
- **Pattern**: Always test IDOR prevention in service methods

**Frontend**: Currently NO tests - needs Vitest setup

## Critical Code Conventions

### Security Patterns

**IDOR Prevention** (Insecure Direct Object Reference):

```java
// ✅ ALWAYS verify ownership
public HealthMetric getMetricById(String id, String userId) {
    HealthMetric metric = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(...));

    if (!metric.getUserId().equals(userId)) {
        throw new BadRequestException("Access denied");
    }
    return metric;
}
```

**Never expose entities directly**:

```java
// ❌ WRONG - Exposes internal structure
@GetMapping
public ResponseEntity<List<HealthMetric>> getAllMetrics() {
    return ResponseEntity.ok(metricService.getAll());
}

// ✅ CORRECT - Use DTOs (pattern needs implementation)
@GetMapping
public ResponseEntity<List<HealthMetricDTO>> getAllMetrics() {
    List<HealthMetric> metrics = metricService.getAll();
    return ResponseEntity.ok(metrics.stream()
        .map(this::toDTO).toList());
}
```

### Performance Patterns

**MongoDB Aggregations** for statistics:

```java
// ✅ Calculate in DB, not Java
@Aggregation(pipeline = {
    "{ $match: { userId: ?0, metricType: 'BLOOD_PRESSURE', measuredAt: { $gte: ?1 } } }",
    "{ $group: { _id: null, avgSystolic: { $avg: '$systolic' }, count: { $sum: 1 } } }"
})
BloodPressureStats getAverageBloodPressure(String userId, LocalDateTime since);
```

**Set-based lookups in DSS**:

```java
// ✅ O(1) lookup - CRITICAL for performance
Set<String> userSymptomNames = symptoms.stream()
    .map(s -> s.getSymptomName().toLowerCase().trim())
    .collect(Collectors.toSet());

for (SymptomPattern pattern : patterns) {
    boolean matched = userSymptomNames.contains(pattern.getSymptomName().toLowerCase());
    // NOT: symptoms.stream().anyMatch(...) - this is O(m) in loop!
}
```

### Frontend Patterns

**Protected Routes**:

```jsx
// ProtectedRoute.jsx - wraps authenticated pages
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardLayout />
  </ProtectedRoute>
}>
```

**API Error Handling**:

```jsx
try {
  const data = await healthMetricsAPI.getAll();
  setMetrics(data);
} catch (error) {
  console.error("Failed:", error.message);
  // error.status, error.errors available
}
```

## Known Issues & Anti-Patterns

### DTO Layer Missing (CRITICAL)

Controllers return entities directly → security risk, tight coupling. When adding endpoints:

1. Create corresponding DTO in `dto/response/`
2. Add mapper method (manually or MapStruct)
3. Return DTO, not entity

### Hardcoded Vietnamese Strings

Business logic contains Vietnamese text (e.g., `HealthMetricService.java:138-160`, `SymptomAnalysisService.java:201-246`). For new features:

- Extract to constants or `messages.properties`
- Use `MessageSource` for i18n support
- Keep business logic language-agnostic

### Frontend-Backend Mismatch

Frontend uses mock data and wrong endpoints (`api.js:196-229`). Backend endpoints:

```
GET  /api/metrics                 (not /health-metrics)
GET  /api/metrics/type/{type}     (not /search)
POST /api/dss/analyze-symptoms    (requires userId in path)
```

### UserId Confusion

`userDetails.getUsername()` returns email, but entities use MongoDB ObjectId as `userId`. Always map email → userId via `UserService` before calling services.

## File Navigation

**Key Backend Files**:

- `SymptomAnalysisService.java` - Core DSS algorithm
- `SecurityConfig.java` - JWT + CORS configuration
- `GlobalExceptionHandler.java` - Never exposes stack traces
- `application.properties` - Environment variable mappings

**Key Frontend Files**:

- `utils/api.js` - API client with auth
- `components/ProtectedRoute.jsx` - Auth wrapper
- `pages/Dashboard.jsx` - Main UI (currently mock data)
- `layouts/DashboardLayout.jsx` - Sidebar navigation

**Documentation**:

- `markdown/HEALTH_TRACKER_PROJECT_SPECIFICATION.md` - Complete schema, API endpoints
- `markdown/UI_UX_DESIGN_SYSTEM.md` - Design tokens, accessibility
- `markdown/work_need_be_done.md` - Technical debt analysis

## Quick Reference

**Build Commands**:

```powershell
# Backend
.\mvnw clean package -DskipTests
.\mvnw spring-boot:run

# Frontend
cd frontend; npm run build
```

**Database Collections** (MongoDB): `users`, `health_profiles`, `health_metrics`, `symptoms`, `medicines`, `appointments`, `health_insights`, `health_predictions`, `symptom_disease_mapping`

**Redis Usage**: Disease mapping cache (key: symptom names, TTL: 1 hour)

**Default Ports**: Backend `:8080`, Frontend `:5173`, MongoDB `:27017`, Redis `:6379`
