# 🚀 Skills

## 🖥️ Frontend
**React.js** · **TypeScript** · **Tailwind CSS**  
**React Router** · **Axios**  
**React Hook Form** · **Yup**  
**Jest**

## ⚙️ Backend
**Node.js** · **TypeScript** · **Express**  
**REST APIs** · **WebSockets (Socket.IO)**  
**JWT Authentication**  
**MongoDB** · **Mongoose** · **Redis**  
**Jest** · **Supertest**  
**Swagger / OpenAPI**

## ☁️ DevOps & CI/CD
**Docker**  
**Azure Web Apps**  
**GitHub Actions**  
**SonarCloud**

## 🧰 Tools
**Git** · **GitHub**  
**Postman**  
**VS Code** · **IntelliJ IDEA** · **PyCharm**  
**ESLint** · **Pino (Logging)**

---

# 🧑‍💻 Featured Projects

## 🔹 TrivIAndo - Real-Time Trivia Platform (Full Stack Backend)

Designed and developed a full-stack backend for a real-time multiplayer trivia application with AI-powered content generation, emphasizing scalability, clean architecture, and modern development practices.

### **Technologies & Stack**
- **Backend**: Node.js 22, TypeScript, Express
- **Real-Time Communication**: Socket.IO with Redis adapter for horizontal scaling
- **Database**: MongoDB (Mongoose ODM)
- **Caching & Pub/Sub**: Redis (ioredis)
- **Authentication**: JWT-based security with bcrypt password hashing
- **AI Integration**: Google Generative AI (Gemini) for dynamic content generation
- **API Documentation**: Swagger/OpenAPI specification
- **Testing**: Jest with Supertest, 80%+ code coverage enforced
- **Code Quality**: ESLint, SonarCloud integration with strict quality gates
- **CI/CD**: GitHub Actions with automated testing and Azure deployment

### **Key Features Implemented**
✅ **Real-Time Game Management**
- WebSocket-based multiplayer rooms with join/create/reconnect capabilities
- Live chat system with message history
- Game state synchronization across all connected clients
- Timer-based question rounds with button press mechanics
- Real-time score tracking and leaderboard updates

✅ **Robust Architecture**
- Layered architecture: Controllers → Services → Models
- RESTful API design with comprehensive OpenAPI documentation
- Event-driven architecture for real-time game flow
- Redis adapter for Socket.IO enabling multi-instance deployments
- Centralized error handling and logging with Pino

✅ **Security & Authentication**
- JWT token generation and validation
- Password hashing with bcrypt
- Socket authentication middleware
- Environment-based configuration management
- Secure API endpoints with role-based access patterns

✅ **Game Logic & Features**
- Dynamic trivia question generation using AI
- Configurable game rooms (2-20 players, 5-20 questions)
- Button press race condition handling with Redis SETNX
- Answer validation and scoring system
- Tie-breaker mechanics for competitive gameplay
- Player blocking system for wrong answers

✅ **DevOps & Quality Assurance**
- Automated CI/CD pipeline with GitHub Actions
- Comprehensive test suite with unit and integration tests
- Code coverage reporting and enforcement (≥80%)
- SonarCloud integration for code quality metrics
- Automated deployment to Azure Web Apps
- Quality gates: Maintainability A, Reliability A, Security A

### **Technical Highlights**
- **Scalability**: Designed for horizontal scaling with Redis pub/sub and Socket.IO adapter
- **Performance**: Optimized with Redis caching and efficient database queries
- **Resilience**: Reconnection handling, state persistence, and graceful error recovery
- **Code Quality**: Enforced through ESLint rules and SonarCloud quality gates
- **Documentation**: Comprehensive README, OpenAPI specs, and inline code documentation
- **Testing**: High test coverage with automated regression testing in CI

### **Architecture Best Practices Applied**
- DTOs (Data Transfer Objects) for API contracts
- Service layer pattern for business logic encapsulation
- Repository pattern through Mongoose models
- Dependency injection for testability
- Environment-based configuration
- Separation of concerns (routes, controllers, services, models)
- Event-driven communication for real-time features

### **Challenges Solved**
- Race conditions in button press detection using Redis atomic operations
- Multi-instance timer coordination for distributed deployments
- WebSocket state synchronization across server restarts
- AI content generation integration with fallback strategies
- Concurrent player interactions in real-time game scenarios

---

### 📊 Project Stats
- **Test Coverage**: 80%+ (enforced in CI)
- **Quality Rating**: A on SonarCloud
- **Architecture**: Clean, layered, and testable
- **Deployment**: Automated via GitHub Actions to Azure
