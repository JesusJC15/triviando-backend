# 🎮 TrivIAndo — Backend

<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pokesaurios_triviando-backend&metric=alert_status&token=88e1d8129af6360bb8859bc4ca300010cb528328)](https://sonarcloud.io/summary/new_code?id=Pokesaurios_triviando-backend)
[![Build, Test TrivIAndo app to Azure Web App - triviando-backend](https://github.com/Pokesaurios/triviando-backend/actions/workflows/test_triviando-backend.yml/badge.svg?branch=main)](https://github.com/Pokesaurios/triviando-backend/actions/workflows/test_triviando-backend.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Backend del servidor de TrivIAndo**: una aplicación moderna en TypeScript que expone una API REST y WebSockets (Socket.IO) para jugar trivias multijugador en tiempo real, con almacenamiento de resultados y generación automática de contenido mediante Inteligencia Artificial.

[Características](#-características-principales) •
[Instalación](#-instalación-y-configuración) •
[API Docs](#-documentación-de-la-api) •
[Arquitectura](#-arquitectura-del-sistema) •
[Contribuir](#-cómo-contribuir)

</div>

---

## 👥 Equipo de Desarrollo

- **Natalia Espitia Espinel** - Desarrollo Full Stack
- **Mayerlly Suárez Correa** - Desarrollo Backend & DevOps
- **Jesús Alberto Jauregui Conde** - Arquitectura & Integración IA

> 📄 **¿Buscas un resumen del perfil de GitHub?** Consulta [PROFILE.md](./PROFILE.md) para ver un portafolio completo de habilidades y características del proyecto.

## 📋 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Características Principales](#-características-principales)
3. [Tecnologías y Stack](#-tecnologías-y-stack)
4. [Arquitectura del Sistema](#-arquitectura-del-sistema)
5. [Requisitos Previos](#-requisitos-previos)
6. [Instalación y Configuración](#-instalación-y-configuración)
7. [Variables de Entorno](#-variables-de-entorno)
8. [Scripts Disponibles](#-scripts-disponibles)
9. [Documentación de la API](#-documentación-de-la-api)
10. [Eventos de WebSocket](#-eventos-de-websocket)
11. [Estructura del Proyecto](#-estructura-del-proyecto)
12. [Tests y Cobertura](#-tests-y-cobertura)
13. [Despliegue](#-despliegue)
14. [Escalado y Consideraciones de Producción](#-escalado-y-consideraciones-de-producción)
15. [Solución de Problemas](#-solución-de-problemas)
16. [Cómo Contribuir](#-cómo-contribuir)
17. [Licencia](#-licencia)

---

## 🎯 Visión General

**TrivIAndo Backend** es un servidor robusto y escalable diseñado para soportar juegos de trivia multijugador en tiempo real. El sistema gestiona de manera eficiente:

- 🎲 **Salas de juego multijugador** con capacidad configurable (2-20 jugadores)
- ❓ **Preguntas y respuestas** con sistema de puntuación dinámica
- 🏆 **Resultados y estadísticas** almacenados de forma persistente
- 🤖 **Generación automática de contenido** mediante IA (Google Gemini)
- 💬 **Chat en tiempo real** dentro de las salas de juego
- ⏱️ **Sistema de temporizadores** para controlar el flujo del juego

El backend utiliza **Socket.IO** para comunicación bidireccional en tiempo real entre clientes y servidor, **MongoDB** para persistencia de datos, y **Redis** para caché, pub/sub y coordinación distribuida en entornos escalados.

### 🎮 ¿Cómo Funciona?

1. Los jugadores se registran y autentican usando JWT
2. El host crea una sala especificando tema y número de preguntas
3. Los jugadores se unen usando un código único de 6 dígitos
4. El sistema genera preguntas automáticamente usando IA
5. Los jugadores compiten presionando un botón virtual para responder primero
6. El sistema calcula puntuaciones en tiempo real
7. Al finalizar, se almacenan los resultados y se declara un ganador

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Sistema de registro e inicio de sesión con JWT
- Contraseñas hasheadas con bcrypt
- Middleware de autenticación para REST y WebSocket
- Validación de datos con Zod schemas

### 🎲 Sistema de Juego en Tiempo Real
- Creación y gestión de salas multijugador
- Códigos de sala únicos de 6 dígitos
- Sistema de temporizadores sincronizados
- Botón de respuesta rápida con detección del primer jugador
- Sistema de desempate automático
- Bloqueo de jugadores tras respuestas incorrectas

### 🤖 Integración con Inteligencia Artificial
- Generación automática de trivias usando Google Gemini
- Preguntas personalizadas según tema
- Opciones de respuesta generadas por IA
- Sistema escalable de generación de contenido

### 💬 Comunicación en Tiempo Real
- Chat integrado en las salas de juego
- Eventos de Socket.IO para sincronización de estado
- Reconexión automática con recuperación de estado
- Broadcast de eventos a todos los jugadores

### 📊 Persistencia y Análisis
- Almacenamiento de resultados históricos
- Estadísticas por jugador y partida
- Historial de chat persistente
- Modelos de datos estructurados con Mongoose

### 🔄 Escalabilidad
- Soporte para múltiples instancias con Redis Adapter
- Sistema de workers distribuidos para temporizadores (BullMQ)
- Caché de sesiones en Redis
- Health checks para Kubernetes/Azure

---

## 🛠️ Tecnologías y Stack

### Backend Core
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | 22.x | Runtime de JavaScript |
| **TypeScript** | 5.9+ | Tipado estático y mejor DX |
| **Express** | 5.2+ | Framework para API REST |
| **Socket.IO** | 4.8+ | Comunicación en tiempo real |

### Bases de Datos y Caché
| Tecnología | Propósito |
|-----------|-----------|
| **MongoDB** | Base de datos principal (usuarios, salas, trivias, resultados) |
| **Mongoose** | ODM para MongoDB con schemas tipados |
| **Redis** | Caché, pub/sub, y coordinación distribuida |
| **ioredis** | Cliente de Redis para Node.js |

### Autenticación y Seguridad
| Tecnología | Propósito |
|-----------|-----------|
| **JWT (jsonwebtoken)** | Tokens de autenticación |
| **bcryptjs** | Hashing de contraseñas |
| **Zod** | Validación de esquemas en runtime |
| **CORS** | Control de acceso entre orígenes |

### Inteligencia Artificial
| Tecnología | Propósito |
|-----------|-----------|
| **@google/generative-ai** | Generación de trivias con Gemini |

### Testing y Calidad de Código
| Tecnología | Propósito |
|-----------|-----------|
| **Jest** | Framework de testing |
| **Supertest** | Testing de APIs HTTP |
| **MongoDB Memory Server** | MongoDB en memoria para tests |
| **ESLint** | Linter para TypeScript |
| **SonarCloud** | Análisis de calidad de código |

### Documentación
| Tecnología | Propósito |
|-----------|-----------|
| **Swagger UI Express** | Documentación interactiva de API |
| **OpenAPI 3.1** | Especificación de API REST |
| **YAML.js** | Parser para OpenAPI specs |

### DevOps y Monitoreo
| Tecnología | Propósito |
|-----------|-----------|
| **Pino** | Logger estructurado de alto rendimiento |
| **GitHub Actions** | CI/CD pipeline |
| **Azure Web Apps** | Hosting y despliegue |
| **BullMQ** | Colas de trabajos distribuidas |

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTES                             │
│  (Navegadores, Apps Móviles, Postman)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │   Load Balancer  │ (Azure)
        └────────┬─────────┘
                 │
    ┌────────────▼────────────┐
    │  Express + Socket.IO    │
    │  (Puerto 4000)          │
    │  ┌──────────────────┐   │
    │  │  REST API        │   │
    │  │  /api/v1/*       │   │
    │  └──────────────────┘   │
    │  ┌──────────────────┐   │
    │  │  WebSocket       │   │
    │  │  Socket.IO       │   │
    │  └──────────────────┘   │
    │  ┌──────────────────┐   │
    │  │  Swagger Docs    │   │
    │  │  /api-docs       │   │
    │  └──────────────────┘   │
    └─────┬──────────┬─────────┘
          │          │
    ┌─────▼──────┐   │   ┌──────────────┐
    │  MongoDB   │   └───►  Redis        │
    │  (Mongoose)│       │  (ioredis)    │
    │            │       │               │
    │  • Users   │       │  • Cache      │
    │  • Rooms   │       │  • Pub/Sub    │
    │  • Trivias │       │  • Sessions   │
    │  • Results │       │  • BullMQ     │
    └────────────┘       └───────────────┘
                             │
                    ┌────────▼────────┐
                    │  BullMQ Worker  │
                    │  (Timers)       │
                    └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Google Gemini  │
                    │  API (IA)       │
                    └─────────────────┘
```

### Flujo de Datos

#### 1. Autenticación (REST)
```
Cliente → POST /api/v1/auth/register → Validación (Zod)
       → Hash password (bcrypt) → MongoDB → JWT → Cliente
```

#### 2. Crear Sala (WebSocket)
```
Cliente → room:create → Validación → Generar código único
       → Crear trivia con IA (Gemini) → MongoDB
       → Redis (cache) → Broadcast room:update → Clientes
```

#### 3. Iniciar Juego (WebSocket)
```
Host → game:start → Validar sala → Programar timer (BullMQ)
    → Worker procesa → Emitir game:started
    → Timer: round:showQuestion → round:openButton
    → Jugador: round:buttonPress (Redis SETNX)
    → round:playerWonButton → round:answerRequest
    → Jugador: round:answer → Validar respuesta
    → round:result → Actualizar scores → game:update
```

### Capas de la Aplicación

1. **Capa de Entrada (Entry Layer)**
   - `server.ts`: Punto de entrada, inicialización de servidores
   - `app.ts`: Configuración de Express, middleware global

2. **Capa de Rutas (Routes Layer)**
   - `routes/`: Definición de endpoints REST
   - Validación inicial con middleware

3. **Capa de Controladores (Controllers Layer)**
   - `controllers/`: Lógica de negocio para endpoints REST
   - Orquestación de servicios

4. **Capa de Servicios (Services Layer)**
   - `services/`: Lógica de negocio compleja
   - Interacción con modelos y APIs externas

5. **Capa de Socket (Socket Layer)**
   - `socket/`: Handlers de eventos WebSocket
   - Gestión de conexiones en tiempo real

6. **Capa de Datos (Data Layer)**
   - `models/`: Esquemas Mongoose
   - Abstracción de base de datos

7. **Capa de Infraestructura (Infrastructure Layer)**
   - `config/`: Configuración de servicios externos
   - `utils/`: Utilidades compartidas
   - `middleware/`: Middleware personalizado

---

## 📋 Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

### Obligatorios
- **Node.js** >= 18.x (recomendado: 22.x LTS)
  - Verifica: `node --version`
- **npm** >= 9.x o **yarn** >= 1.22
  - Verifica: `npm --version`
- **MongoDB** >= 6.0
  - Local: [Guía de instalación](https://docs.mongodb.com/manual/installation/)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
- **Redis** >= 7.0
  - Local: [Guía de instalación](https://redis.io/docs/getting-started/)
  - Cloud: [Redis Cloud](https://redis.com/try-free/) (gratis)

### Opcionales (Recomendados)
- **Docker** y **Docker Compose** (para desarrollo local simplificado)
- **Git** para control de versiones
- **Postman** o **Thunder Client** para probar la API
- Cliente de MongoDB como **MongoDB Compass** o **Studio 3T**
- Cliente de Redis como **RedisInsight**

### Servicios de Terceros
- **Google Cloud Account** con acceso a Gemini API
  - Obtén tu API key: [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## 🚀 Instalación y Configuración

### Método 1: Instalación Local (Recomendado para Desarrollo)

#### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/JesusJC15/triviando-backend.git
cd triviando-backend
```

#### Paso 2: Instalar Dependencias

```bash
npm install
```

O si prefieres yarn:

```bash
yarn install
```

#### Paso 3: Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus credenciales:

```bash
cp .env.example .env
```

Luego edita el archivo `.env` con tu editor favorito (ver sección [Variables de Entorno](#-variables-de-entorno) para detalles).

#### Paso 4: Iniciar Servicios de Base de Datos

**Opción A: Usando Docker (Recomendado)**

Si no quieres instalar MongoDB y Redis localmente:

```bash
# MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Redis
docker run -d -p 6379:6379 --name redis redis:latest
```

**Opción B: Servicios Locales**

Inicia MongoDB y Redis según tu sistema operativo.

#### Paso 5: Ejecutar la Aplicación

**Modo Desarrollo (con hot-reload):**

```bash
npm run dev
```

**Modo Producción:**

```bash
npm run build
npm start
```

El servidor estará disponible en `http://localhost:4000`

#### Paso 6: Verificar Instalación

Abre tu navegador o usa curl:

```bash
# Health check básico
curl http://localhost:4000/

# Health check detallado
curl http://localhost:4000/healthz

# Verificar servicios
curl http://localhost:4000/readyz

# Documentación Swagger
# Abre en tu navegador: http://localhost:4000/api-docs
```

### Método 2: Usando Docker Compose (Próximamente)

> **Nota:** Este proyecto actualmente no incluye Docker Compose, pero puedes contribuir agregando `Dockerfile` y `docker-compose.yml`

### Método 3: Despliegue en Azure

Consulta la sección [Despliegue](#-despliegue) para instrucciones detalladas.

---

## 🔧 Variables de Entorno

El archivo `.env` contiene toda la configuración sensible del servidor. A continuación se detallan todas las variables disponibles:

### Configuración del Servidor

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `PORT` | number | `4000` | Puerto en el que corre el servidor HTTP |
| `NODE_ENV` | string | `development` | Entorno de ejecución: `development`, `test`, `production` |
| `CORS_ORIGIN` | string | `*` | Orígenes permitidos para CORS (separados por coma) |

### Base de Datos

| Variable | Tipo | Requerido | Descripción |
|----------|------|-----------|-------------|
| `MONGODB_URI` | string | ✅ Sí | URI de conexión a MongoDB |

**Ejemplos:**
```bash
# MongoDB local
MONGODB_URI=mongodb://localhost:27017/triviando

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/triviando

# MongoDB con autenticación
MONGODB_URI=mongodb://admin:password@localhost:27017/triviando?authSource=admin
```

### Caché y Mensajería

| Variable | Tipo | Requerido | Descripción |
|----------|------|-----------|-------------|
| `REDIS_URL` | string | ⚠️ Recomendado | URL de conexión a Redis |

**Ejemplos:**
```bash
# Redis local
REDIS_URL=redis://localhost:6379

# Redis Cloud (TLS)
REDIS_URL=rediss://default:password@host.redis.cloud:12345

# Redis con autenticación
REDIS_URL=redis://:password@localhost:6379
```

> **Nota:** Redis es **opcional** en desarrollo de una sola instancia, pero **obligatorio** para producción con múltiples instancias.

### Autenticación

| Variable | Tipo | Requerido | Descripción |
|----------|------|-----------|-------------|
| `JWT_SECRET` | string | ✅ Sí | Clave secreta para firmar tokens JWT (mínimo 32 caracteres) |
| `JWT_EXPIRES` | string | `3h` | Tiempo de expiración de tokens JWT |

**Ejemplos:**
```bash
JWT_SECRET=super-secret-key-change-this-in-production-min-32-chars
JWT_EXPIRES=3h          # 3 horas
JWT_EXPIRES=24h         # 24 horas
JWT_EXPIRES=7d          # 7 días
```

> **Seguridad:** Genera un JWT_SECRET seguro:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Inteligencia Artificial

| Variable | Tipo | Requerido | Descripción |
|----------|------|-----------|-------------|
| `GEMINI_API_KEY` | string | ✅ Sí | API Key de Google Gemini para generación de trivias |

**Cómo obtener tu API Key:**
1. Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la key y pégala en tu `.env`

### Ejemplo Completo de `.env`

```bash
# ==========================================
# CONFIGURACIÓN DEL SERVIDOR
# ==========================================
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# ==========================================
# BASE DE DATOS
# ==========================================
MONGODB_URI=mongodb://localhost:27017/triviando

# ==========================================
# REDIS (CACHÉ Y PUB/SUB)
# ==========================================
REDIS_URL=redis://localhost:6379

# ==========================================
# AUTENTICACIÓN JWT
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES=3h

# ==========================================
# INTELIGENCIA ARTIFICIAL
# ==========================================
GEMINI_API_KEY=your_gemini_api_key_here
```

### Variables para Producción (Azure)

Cuando despliegues en Azure, configura estas variables adicionales como **Application Settings**:

```bash
# Azure específico
WEBSITE_NODE_DEFAULT_VERSION=22-lts

# Optimizaciones de producción
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096

# URLs de producción
CORS_ORIGIN=https://tu-frontend.azurewebsites.net,https://tu-dominio.com
```

---

## 📜 Scripts Disponibles

Todos los scripts están definidos en `package.json` y se ejecutan con `npm run <script>`:

### Desarrollo

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Inicia el servidor en modo desarrollo con **hot-reload**. Los cambios se aplican automáticamente sin reiniciar el servidor. |

**Ejemplo:**
```bash
npm run dev
# Server running on http://localhost:4000
# Watching for file changes...
```

### Build y Producción

| Script | Comando | Descripción |
|--------|---------|-------------|
| `build` | `npm run build` | Compila TypeScript a JavaScript en el directorio `dist/` y copia archivos de documentación. |
| `start` | `npm start` | Ejecuta el servidor desde el código compilado en `dist/`. **Requiere haber ejecutado `build` primero**. |

**Ejemplo:**
```bash
npm run build
# ✓ TypeScript compiled successfully
# ✓ Documentation files copied

npm start
# Server running on http://localhost:4000
```

### Testing

| Script | Comando | Descripción |
|--------|---------|-------------|
| `test` | `npm test` | Ejecuta todos los tests con Jest y genera reporte de cobertura en `coverage/`. |
| `check:coverage` | `npm run check:coverage` | Verifica que la cobertura de líneas sea ≥ 80%. Usado en CI/CD. |

**Ejemplo:**
```bash
npm test
# PASS tests/auth.test.ts
# PASS tests/room.handlers.test.ts
# PASS tests/game.service.test.ts
# ...
# Test Suites: 25 passed, 25 total
# Tests:       150 passed, 150 total
# Coverage:    87.34%
```

### Linting y Calidad de Código

| Script | Comando | Descripción |
|--------|---------|-------------|
| `lint` | `npm run lint` | Ejecuta ESLint para detectar problemas de código sin corregirlos. |
| `lint:fix` | `npm run lint:fix` | Ejecuta ESLint y **corrige automáticamente** los problemas que se puedan arreglar. |

**Ejemplo:**
```bash
npm run lint
# src/services/game.service.ts
#   45:12  warning  'unusedVar' is assigned but never used  @typescript-eslint/no-unused-vars

npm run lint:fix
# ✓ All fixable errors have been corrected
```

### Utilidades

| Script | Comando | Descripción |
|--------|---------|-------------|
| `enqueue:timer` | `npm run enqueue:timer` | Script auxiliar para encolar timers manualmente (desarrollo/debug). |

### Flujo de Trabajo Típico

#### Desarrollo Local
```bash
# Terminal 1: Iniciar servicios
docker start mongodb redis

# Terminal 2: Servidor de desarrollo
npm run dev

# Terminal 3: Ejecutar tests
npm test -- --watch
```

#### Pre-commit
```bash
npm run lint:fix  # Corregir estilo
npm test          # Ejecutar tests
```

#### Deploy a Producción
```bash
npm run lint      # Verificar código
npm test          # Verificar tests
npm run build     # Compilar
npm start         # Probar build
# Luego push a main para deploy automático
```

### Scripts Combinados (npm-run-all)

Puedes crear scripts personalizados en `package.json`:

```json
{
  "scripts": {
    "check": "npm run lint && npm test",
    "clean": "rm -rf dist coverage node_modules",
    "reset": "npm run clean && npm install"
  }
}
```

---

## 📚 Documentación de la API

### Swagger UI Interactiva

La API REST está completamente documentada usando **OpenAPI 3.1** y se puede explorar de forma interactiva a través de Swagger UI.

**Acceso:**
- **Desarrollo:** `http://localhost:4000/api-docs`
- **Producción:** `https://tu-servidor.azurewebsites.net/api-docs`

La especificación completa está en: `src/docs/openapi.yaml`

### Endpoints Principales

#### 🔐 Autenticación (`/api/v1/auth`)

##### Registro de Usuario
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "671e8a12c49dba0012d87aa4",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Inicio de Sesión
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "671e8a12c49dba0012d87aa4",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 🎲 Salas (`/api/v1/rooms`)

##### Obtener Información de Sala
```http
GET /api/v1/rooms/:code
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "code": "ABC123",
  "host": "671e8a12c49dba0012d87aa4",
  "maxPlayers": 10,
  "players": [
    {
      "userId": "671e8a12c49dba0012d87aa4",
      "name": "Juan Pérez",
      "joinedAt": "2024-12-18T20:00:00.000Z"
    }
  ],
  "triviaId": "671e8b45c49dba0012d87bb5",
  "gameState": null,
  "chatHistory": []
}
```

#### ❓ Trivias (`/api/v1/trivia`)

##### Crear Trivia con IA
```http
POST /api/v1/trivia
Authorization: Bearer {token}
Content-Type: application/json

{
  "topic": "Historia de México",
  "quantity": 10
}
```

**Respuesta (201):**
```json
{
  "id": "671e8b45c49dba0012d87bb5",
  "topic": "Historia de México",
  "questions": [
    {
      "questionText": "¿En qué año se consumó la Independencia de México?",
      "options": ["1810", "1821", "1824", "1836"],
      "correctAnswerIndex": 1
    }
    // ... más preguntas
  ]
}
```

#### 🏆 Resultados (`/api/v1/game-results`)

##### Obtener Resultados de un Jugador
```http
GET /api/v1/game-results/user/:userId
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "results": [
    {
      "id": "671e8c90c49dba0012d87cc6",
      "roomCode": "ABC123",
      "userId": "671e8a12c49dba0012d87aa4",
      "score": 45,
      "rank": 1,
      "totalPlayers": 5,
      "createdAt": "2024-12-18T20:30:00.000Z"
    }
  ]
}
```

### Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200` | OK | Solicitud exitosa (GET, PUT) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Datos inválidos o faltantes |
| `401` | Unauthorized | Token JWT inválido o expirado |
| `403` | Forbidden | Sin permisos para la acción |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto (ej: email duplicado) |
| `500` | Internal Server Error | Error del servidor |
| `503` | Service Unavailable | Servidor en mantenimiento |

### Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Obtener el token:**
1. Registrarse o iniciar sesión
2. Copiar el `token` de la respuesta
3. Incluirlo en el header `Authorization` con prefijo `Bearer `

### Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "error": "Nombre del error",
  "message": "Descripción legible del error",
  "statusCode": 400,
  "timestamp": "2024-12-18T20:00:00.000Z",
  "path": "/api/v1/auth/register"
}
```

### Rate Limiting

> **Nota:** Actualmente no hay rate limiting implementado. Se recomienda agregar en producción usando `express-rate-limit`.

### Paginación

Los endpoints que devuelven listas soportan paginación (próximamente):

```http
GET /api/v1/game-results?page=1&limit=20
```

---

## 🔌 Eventos de WebSocket

El sistema de tiempo real utiliza **Socket.IO** para comunicación bidireccional entre clientes y servidor. A continuación se documentan todos los eventos disponibles.

### Conexión y Autenticación

Los clientes deben autenticarse al conectar enviando el token JWT:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

### Eventos del Cliente al Servidor

#### 🏠 Gestión de Salas

##### `room:create` - Crear una Sala
**Envía:**
```javascript
socket.emit('room:create', {
  topic: 'Historia de México',
  maxPlayers: 10,      // Opcional: 2-20, default 10
  quantity: 15         // Opcional: 5-20, default 10
}, (response) => {
  console.log(response);
});
```

**Respuesta (acknowledgement):**
```javascript
{
  ok: true,
  room: {
    code: "ABC123",         // Código único de 6 dígitos
    roomId: "671e...",
    triviaId: "671e...",
    maxPlayers: 10,
    host: "671e8a12...",    // userId del host
    players: [
      {
        userId: "671e8a12...",
        name: "Juan Pérez",
        joinedAt: "2024-12-18T20:00:00.000Z"
      }
    ],
    chatHistory: []
  }
}
```

**También emite a todos:** `room:update`

##### `room:join` - Unirse a una Sala
**Envía:**
```javascript
socket.emit('room:join', {
  code: 'ABC123'
}, (response) => {
  console.log(response);
});
```

**Respuesta exitosa:**
```javascript
{
  ok: true,
  room: {
    code: "ABC123",
    players: [...],
    chatHistory: [...]
  }
}
```

**Respuesta de error:**
```javascript
{
  ok: false,
  message: "Room not found" // o "Room full or not found"
}
```

**También emite a todos en la sala:** `room:update`

##### `room:reconnect` - Reconectar a una Sala
Útil cuando el cliente pierde conexión y quiere recuperar el estado:

```javascript
socket.emit('room:reconnect', {
  code: 'ABC123'
}, (response) => {
  console.log(response);
  // Incluye gameState si hay partida en curso
});
```

#### 💬 Chat

##### `room:chat` - Enviar Mensaje
**Envía:**
```javascript
socket.emit('room:chat', {
  code: 'ABC123',
  message: 'Hola a todos!'  // Máximo 400 caracteres
});
```

**Todos en la sala reciben:** `room:chat:new`
```javascript
socket.on('room:chat:new', (data) => {
  // data: {
  //   userId: "671e8a12...",
  //   user: "Juan Pérez",
  //   message: "Hola a todos!",
  //   timestamp: "2024-12-18T20:00:00.000Z"
  // }
});
```

#### 🎮 Control del Juego

##### `game:start` - Iniciar Partida (Solo Host)
**Envía:**
```javascript
socket.emit('game:start', {
  code: 'ABC123'
});
```

**Todos en la sala reciben:** `game:started`
```javascript
socket.on('game:started', (data) => {
  // data: {
  //   ok: true,
  //   totalQuestions: 9  // Reserva 1 para desempate
  // }
});
```

##### `round:buttonPress` - Presionar Botón
El jugador intenta ser el primero en responder:

```javascript
socket.emit('round:buttonPress', {
  code: 'ABC123',
  roundSequence: 1,
  eventId: 'unique-id-123'  // Opcional: para deduplicación
}, (response) => {
  if (response.ok) {
    console.log('¡Fuiste el primero!');
  } else {
    console.log(response.message);
  }
});
```

**Respuestas posibles:**
```javascript
// Éxito
{ ok: true, message: "You pressed first" }

// Otro jugador fue más rápido
{ ok: false, message: "Otro jugador ganó el botón" }

// Jugador bloqueado
{ ok: false, message: "Estás bloqueado para esta pregunta" }

// Ronda incorrecta
{ ok: false, message: "Stale round" }
```

##### `round:answer` - Responder Pregunta
Solo el ganador del botón puede responder:

```javascript
socket.emit('round:answer', {
  code: 'ABC123',
  roundSequence: 1,
  selectedIndex: 2,         // Índice de la opción seleccionada (0-3)
  eventId: 'unique-id-456'  // Opcional
}, (response) => {
  console.log(response);
});
```

**Respuesta:**
```javascript
// Correcta
{ ok: true, correct: true }

// Incorrecta
{ ok: true, correct: false }
```

### Eventos del Servidor al Cliente

#### 📢 Actualizaciones de Sala

##### `room:update` - Cambios en la Sala
Emitido cuando hay cambios en la sala (jugador se une, se va, etc.):

```javascript
socket.on('room:update', (data) => {
  // data: {
  //   event: "roomCreated" | "playerJoined" | "playerLeft",
  //   code: "ABC123",
  //   roomId: "671e...",
  //   players: [...],  // Array actualizado
  //   player: { ... }  // Solo en playerJoined/playerLeft
  // }
});
```

#### 🎯 Flujo del Juego

##### `game:update` - Estado del Juego
Emitido frecuentemente con el estado completo:

```javascript
socket.on('game:update', (gameState) => {
  // gameState: {
  //   roomCode: "ABC123",
  //   triviaId: "671e...",
  //   status: "waiting" | "in-game" | "finished" | "open" | "result" | "reading" | "answering",
  //   currentQuestionIndex: 0,
  //   roundSequence: 1,
  //   scores: {
  //     "userId1": 10,
  //     "userId2": 5
  //   },
  //   blocked: {
  //     "userId3": true  // Bloqueado esta ronda
  //   },
  //   players: [
  //     { userId: "...", name: "..." }
  //   ],
  //   questionReadEndsAt: 1702929600000,    // Timestamp UNIX ms
  //   answerWindowEndsAt: 1702929610000,    // Timestamp UNIX ms
  //   tieBreakerPlayed: false
  // }
});
```

##### `round:showQuestion` - Mostrar Pregunta
```javascript
socket.on('round:showQuestion', (data) => {
  // data: {
  //   roundSequence: 1,
  //   questionText: "¿En qué año...?",
  //   readMs: 10000  // Tiempo de lectura en ms
  // }
});
```

##### `round:openButton` - Habilitar Botón
```javascript
socket.on('round:openButton', (data) => {
  // data: {
  //   roundSequence: 1,
  //   pressWindowMs: 15000  // Tiempo para presionar
  // }
});
```

##### `round:playerWonButton` - Alguien Presionó Primero
```javascript
socket.on('round:playerWonButton', (data) => {
  // data: {
  //   roundSequence: 1,
  //   playerId: "671e8a12...",
  //   name: "Juan Pérez"
  // }
});
```

##### `round:answerRequest` - Solicitud de Respuesta
Solo el ganador del botón recibe este evento:

```javascript
socket.on('round:answerRequest', (data) => {
  // data: {
  //   roundSequence: 1,
  //   options: [
  //     "1810",
  //     "1821",
  //     "1824",
  //     "1836"
  //   ],
  //   answerTimeoutMs: 10000,
  //   endsAt: 1702929620000  // Timestamp UNIX ms
  // }
});
```

##### `round:result` - Resultado de la Ronda
```javascript
socket.on('round:result', (data) => {
  // Respuesta correcta:
  // {
  //   roundSequence: 1,
  //   playerId: "671e8a12...",
  //   correct: true,
  //   correctAnswer: "1821",
  //   scores: { "userId1": 15, "userId2": 5 }
  // }
  
  // Respuesta incorrecta:
  // {
  //   roundSequence: 1,
  //   playerId: "671e8a12...",
  //   correct: false,
  //   message: "Respuesta incorrecta",
  //   correctAnswer: "1821",
  //   scores: { ... }
  // }
  
  // Timeout:
  // {
  //   roundSequence: 1,
  //   correct: null,
  //   message: "Tiempo agotado",
  //   correctAnswer: "1821",
  //   scores: { ... }
  // }
});
```

##### `game:ended` - Fin del Juego
```javascript
socket.on('game:ended', (data) => {
  // data: {
  //   scores: {
  //     "userId1": 45,
  //     "userId2": 30,
  //     "userId3": 15
  //   },
  //   winner: {
  //     userId: "userId1",
  //     name: "Juan Pérez",
  //     score: 45
  //   }
  // }
});
```

### Manejo de Desconexiones

Socket.IO maneja automáticamente reconexiones, pero puedes escuchar estos eventos:

```javascript
socket.on('connect', () => {
  console.log('Conectado al servidor');
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
  // Intentar reconectar con room:reconnect
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
});
```

### Ejemplo Completo de Cliente

```javascript
import { io } from 'socket.io-client';

const token = localStorage.getItem('jwt_token');
const socket = io('http://localhost:4000', {
  auth: { token }
});

// Conectar
socket.on('connect', () => {
  console.log('✅ Conectado');
  
  // Crear sala
  socket.emit('room:create', {
    topic: 'Historia',
    maxPlayers: 5,
    quantity: 10
  }, (response) => {
    if (response.ok) {
      console.log('Sala creada:', response.room.code);
    }
  });
});

// Escuchar actualizaciones de sala
socket.on('room:update', (data) => {
  console.log('Actualización de sala:', data);
});

// Escuchar chat
socket.on('room:chat:new', (message) => {
  console.log(`${message.user}: ${message.message}`);
});

// Flujo del juego
socket.on('game:started', () => {
  console.log('🎮 ¡Juego iniciado!');
});

socket.on('round:showQuestion', (data) => {
  console.log('❓', data.questionText);
});

socket.on('round:openButton', () => {
  console.log('🔴 ¡Botón disponible!');
  // Permitir al usuario presionar
});

socket.on('round:answerRequest', (data) => {
  console.log('📝 Opciones:', data.options);
  // Mostrar opciones al usuario
});

socket.on('game:ended', (data) => {
  console.log('🏆 Ganador:', data.winner.name);
  console.log('📊 Puntajes finales:', data.scores);
});
```

---

## 📁 Estructura del Proyecto

```
triviando-backend/
│
├── src/                          # Código fuente principal
│   ├── server.ts                 # Punto de entrada del servidor
│   ├── app.ts                    # Configuración de Express
│   │
│   ├── config/                   # Configuración de servicios
│   │   ├── db.ts                 # Conexión a MongoDB
│   │   ├── redis.ts              # Conexión a Redis
│   │   ├── swagger.ts            # Configuración de Swagger
│   │   └── draining.ts           # Manejo de graceful shutdown
│   │
│   ├── routes/                   # Definición de rutas REST
│   │   ├── auth.routes.ts        # Autenticación
│   │   ├── trivia.routes.ts      # Trivias
│   │   ├── room.routes.ts        # Salas
│   │   └── gameResult.routes.ts  # Resultados
│   │
│   ├── controllers/              # Controladores REST
│   │   ├── auth.controller.ts    # Registro y login
│   │   ├── trivia.controller.ts  # CRUD de trivias
│   │   ├── room.controller.ts    # Gestión de salas
│   │   └── gameResult.controller.ts # Consulta de resultados
│   │
│   ├── services/                 # Lógica de negocio
│   │   ├── aiGenerator.service.ts    # Generación con IA
│   │   ├── game.service.ts       # Lógica del juego
│   │   ├── joinRoom.service.ts   # Unirse a salas
│   │   └── timers.handlers.ts    # Manejo de temporizadores
│   │
│   ├── socket/                   # Lógica de WebSockets
│   │   ├── index.ts              # Inicialización de Socket.IO
│   │   ├── room.handlers.ts      # Handlers de salas
│   │   ├── game.handlers.ts      # Handlers de juego
│   │   ├── validateSocket.ts     # Validación de eventos
│   │   └── ioRef.ts              # Referencia global a IO
│   │
│   ├── models/                   # Esquemas de Mongoose
│   │   ├── user.model.ts         # Usuario
│   │   ├── trivia.model.ts       # Trivia
│   │   ├── room.model.ts         # Sala
│   │   └── gameResult.model.ts   # Resultado de partida
│   │
│   ├── middleware/               # Middleware personalizado
│   │   ├── auth.middleware.ts    # Autenticación JWT (REST)
│   │   ├── socketAuth.middleware.ts # Autenticación (WebSocket)
│   │   ├── errorHandler.ts       # Manejo global de errores
│   │   └── validate.middleware.ts # Validación con Zod
│   │
│   ├── schemas/                  # Esquemas de validación Zod
│   │   ├── auth.schemas.ts       # Validación de auth
│   │   ├── trivia.schemas.ts     # Validación de trivias
│   │   └── room.schemas.ts       # Validación de salas
│   │
│   ├── queues/                   # Colas de trabajos (BullMQ)
│   │   ├── timers.queue.ts       # Cola de temporizadores
│   │   └── timers.worker.ts      # Worker de temporizadores
│   │
│   ├── utils/                    # Utilidades compartidas
│   │   ├── logger.ts             # Logger con Pino
│   │   ├── token.ts              # Generación de códigos
│   │   ├── passwordUtils.ts      # Hashing de contraseñas
│   │   └── redisHelpers.ts       # Helpers de Redis
│   │
│   ├── types/                    # Tipos TypeScript personalizados
│   │   └── express.d.ts          # Extensiones de Express
│   │
│   └── docs/                     # Documentación
│       └── openapi.yaml          # Especificación OpenAPI
│
├── tests/                        # Tests unitarios e integración
│   ├── auth.test.ts              # Tests de autenticación
│   ├── room.handlers.test.ts     # Tests de salas
│   ├── game.handlers.test.ts     # Tests de juego
│   ├── room.model.methods.test.ts # Tests de modelos
│   └── ...                       # Más tests
│
├── types/                        # Tipos globales
│   └── frontend-socket.d.ts      # Tipos para frontend
│
├── coverage/                     # Reportes de cobertura (generado)
│   ├── lcov-report/              # Reporte HTML
│   └── coverage-summary.json     # Resumen JSON
│
├── dist/                         # Código compilado (generado)
│   ├── server.js
│   ├── app.js
│   └── ...
│
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── test_triviando-backend.yml # CI/CD pipeline
│
├── .vscode/                      # Configuración de VS Code
│   └── settings.json
│
├── .env                          # Variables de entorno (NO commitear)
├── .env.example                  # Ejemplo de variables
├── .gitignore                    # Archivos ignorados por Git
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── jest.config.js                # Configuración de Jest
├── eslint.config.cjs             # Configuración de ESLint
├── sonar-project.properties      # Configuración de SonarCloud
├── README.md                     # Este archivo
└── PROFILE.md                    # Portafolio del proyecto
```

### Convenciones de Código

#### Nomenclatura
- **Archivos:** `camelCase.extension` (ej: `auth.controller.ts`)
- **Clases:** `PascalCase` (ej: `UserModel`)
- **Funciones:** `camelCase` (ej: `createRoom`)
- **Constantes:** `UPPER_SNAKE_CASE` (ej: `MAX_PLAYERS`)
- **Interfaces/Types:** `PascalCase` (ej: `GameState`)

#### Organización
- Un archivo por entidad/concepto
- Exports nombrados preferidos sobre default
- Imports ordenados: externos → internos → tipos

#### Testing
- Archivos de test junto a código fuente en carpeta `tests/`
- Nomenclatura: `[feature].test.ts`
- Mínimo 80% de cobertura requerido

---

## 🧪 Tests y Cobertura

El proyecto utiliza **Jest** como framework de testing con **Supertest** para tests de integración HTTP y **MongoDB Memory Server** para tests de base de datos.

### Ejecutar Tests

```bash
# Ejecutar todos los tests con reporte de cobertura
npm test

# Ejecutar tests en modo watch (desarrollo)
npm test -- --watch

# Ejecutar solo tests que coincidan con un patrón
npm test -- --testNamePattern="auth"

# Ejecutar tests de un archivo específico
npm test -- tests/auth.test.ts

# Ejecutar tests con mayor verbosidad
npm test -- --verbose
```

### Estructura de Tests

El proyecto cuenta con **más de 150 tests** organizados en estas categorías:

#### Tests Unitarios
- `auth.test.ts` - Autenticación y JWT
- `passwordUtils.test.ts` - Utilidades de contraseñas
- `validate.middleware.test.ts` - Validación con Zod
- `logger.*.test.ts` - Sistema de logging

#### Tests de Integración REST
- `validation.rest.test.ts` - Validación de endpoints
- `gameResult.routes.test.ts` - Endpoints de resultados

#### Tests de WebSocket
- `socketServer.test.ts` - Inicialización de Socket.IO
- `socketAuthMiddleware.test.ts` - Autenticación Socket.IO
- `validation.socket.test.ts` - Validación de eventos

#### Tests de Servicios
- `game.service.test.ts` - Lógica del juego
- `game.service.distributed.test.ts` - Sistema distribuido
- `joinRoom.service.test.ts` - Unirse a salas
- `aiGenerator.service.test.ts` - Generación con IA (próximamente)

#### Tests de Handlers
- `room.handlers.test.ts` - Handlers de salas
- `game.handlers.test.ts` - Handlers de juego
- `game.handlers.errors.test.ts` - Manejo de errores
- `game.handlers.endgame.test.ts` - Fin de partida

#### Tests de Modelos
- `room.model.methods.test.ts` - Métodos de modelo Room
- `room.test.ts` - CRUD de salas

#### Tests de Colas
- `queues.timers.queue.test.ts` - Sistema de colas BullMQ

### Reporte de Cobertura

Después de ejecutar `npm test`, se genera un reporte de cobertura completo:

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   87.34 |    82.15 |   85.67 |   87.89 |
 src/                     |     100 |      100 |     100 |     100 |
  app.ts                  |     100 |      100 |     100 |     100 |
  server.ts               |     100 |      100 |     100 |     100 |
 src/controllers/         |   92.45 |    88.23 |   91.11 |   93.12 |
  auth.controller.ts      |   95.12 |    90.00 |   94.44 |   96.00 |
  ...                     |     ... |      ... |     ... |     ... |
--------------------------|---------|----------|---------|---------|
```

**Ubicación de reportes:**
- **Terminal:** Resumen al finalizar tests
- **HTML:** `coverage/lcov-report/index.html` (abre en navegador)
- **JSON:** `coverage/coverage-summary.json` (para CI/CD)
- **LCOV:** `coverage/lcov.info` (para SonarCloud)

### Ver Reporte HTML

```bash
# MacOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Umbrales de Cobertura

El proyecto requiere **mínimo 80% de cobertura** en líneas de código:

```json
// package.json
"jest": {
  "coverageThreshold": {
    "global": {
      "lines": 80,
      "statements": 80,
      "branches": 75,
      "functions": 80
    }
  }
}
```

### Escribir Nuevos Tests

Ejemplo de test básico:

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!'
        });

      expect(response.status).toBe(400);
    });
  });
});
```

### Mocking

El proyecto usa mocks para servicios externos:

```typescript
// Mockear Gemini AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => '{"questions": [...]}' }
      })
    })
  }))
}));

// Mockear Redis
jest.mock('../src/config/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn()
}));
```

### Debugging Tests

```bash
# Ejecutar con debugging de Node.js
node --inspect-brk node_modules/.bin/jest --runInBand

# Luego conectar con Chrome DevTools en chrome://inspect
```

---

## 🚀 Despliegue

### Azure Web Apps (Configuración Actual)

El proyecto está configurado para despliegue automático en **Azure Web Apps** mediante GitHub Actions.

#### Flujo de CI/CD

```
Push a main → GitHub Actions → Build & Test → Deploy a Azure
```

El pipeline (`.github/workflows/test_triviando-backend.yml`) realiza:

1. ✅ Checkout del código
2. ✅ Setup de Node.js 22.x
3. ✅ Instalación de dependencias (`npm ci`)
4. ✅ Compilación (`npm run build`)
5. ✅ Ejecución de tests con cobertura
6. ✅ Verificación de cobertura ≥ 80%
7. ✅ Despliegue a Azure (cuando todos los pasos anteriores pasan)

#### Configurar Secrets en GitHub

Ve a `Settings > Secrets and variables > Actions` y agrega:

```
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/triviando
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES=3h
GEMINI_API_KEY=your-gemini-api-key
REDIS_URL=rediss://default:pass@host.redis.cloud:12345
NODE_ENV=production
```

#### Configurar Azure Web App

1. **Crear Web App:**
   ```bash
   az webapp create \
     --resource-group triviando-rg \
     --plan triviando-plan \
     --name triviando-backend \
     --runtime "NODE:22-lts"
   ```

2. **Configurar Application Settings:**
   ```bash
   az webapp config appsettings set \
     --resource-group triviando-rg \
     --name triviando-backend \
     --settings \
       PORT=4000 \
       MONGODB_URI="mongodb+srv://..." \
       REDIS_URL="rediss://..." \
       JWT_SECRET="..." \
       JWT_EXPIRES="3h" \
       GEMINI_API_KEY="..." \
       NODE_ENV="production"
   ```

3. **Habilitar WebSockets:**
   ```bash
   az webapp config set \
     --resource-group triviando-rg \
     --name triviando-backend \
     --web-sockets-enabled true
   ```

4. **Configurar Health Check:**
   ```bash
   az webapp config set \
     --resource-group triviando-rg \
     --name triviando-backend \
     --generic-configurations '{"healthCheckPath": "/healthz"}'
   ```

### Otras Plataformas

#### Heroku

```bash
# Instalar Heroku CLI
heroku login

# Crear app
heroku create triviando-backend

# Agregar add-ons
heroku addons:create mongolab:sandbox
heroku addons:create heroku-redis:hobby-dev

# Configurar variables
heroku config:set JWT_SECRET=your-secret
heroku config:set GEMINI_API_KEY=your-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Deploy
railway up
```

#### DigitalOcean App Platform

1. Conecta tu repositorio de GitHub
2. Selecciona la rama `main`
3. Configura build command: `npm run build`
4. Configura run command: `npm start`
5. Agrega variables de entorno
6. Deploy automático en cada push

#### Docker (Próximamente)

El proyecto no incluye `Dockerfile` actualmente. Contribución bienvenida:

```dockerfile
# Ejemplo de Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 4000

CMD ["node", "dist/server.js"]
```

---

## ⚡ Escalado y Consideraciones de Producción

### Sistema de Temporizadores

El juego utiliza temporizadores para coordinar el flujo de preguntas. El sistema actual usa **BullMQ** con Redis para coordinación distribuida.

#### Arquitectura de Timers

```
Evento de Juego → Encolar Job en BullMQ → Worker Procesa
                                         ↓
                           Redis pub/sub → Todas las instancias
                                         ↓
                           Emit Socket.IO a clientes
```

#### Configuración para Múltiples Instancias

**1. Redis Adapter para Socket.IO** (Ya implementado)

```typescript
// src/socket/index.ts
import { createAdapter } from '@socket.io/redis-adapter';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

**2. Worker de Timers Distribuido** (Ya implementado)

```typescript
// src/queues/timers.worker.ts
import { Worker } from 'bullmq';

const worker = new Worker('timers', async (job) => {
  // Procesar timer
}, { connection: redisConnection });
```

#### Estrategias de Escalado

##### Escalado Horizontal (Recomendado)

```
         Load Balancer
              ↓
    ┌─────────┴─────────┐
    ↓         ↓         ↓
Instance 1  Instance 2  Instance 3
    ↓         ↓         ↓
    └─────────┬─────────┘
              ↓
         Redis Cluster
```

**Requisitos:**
- ✅ Redis (ya implementado)
- ✅ Redis Adapter para Socket.IO (ya implementado)
- ✅ BullMQ para workers (ya implementado)
- ⚠️ Session Affinity/Sticky Sessions (configurar en load balancer)

**Azure Web App Scale Out:**
```bash
az appservice plan update \
  --name triviando-plan \
  --resource-group triviando-rg \
  --sku P1V2 \
  --number-of-workers 3
```

##### Escalado Vertical

Aumentar recursos de una sola instancia:

```bash
# Azure
az appservice plan update \
  --name triviando-plan \
  --resource-group triviando-rg \
  --sku P3V2  # 8 cores, 14 GB RAM
```

### Optimizaciones de Rendimiento

#### 1. Caché con Redis

```typescript
// Cachear trivias generadas
const cachedTrivia = await redis.get(`trivia:${topic}`);
if (cachedTrivia) return JSON.parse(cachedTrivia);

const newTrivia = await generateWithAI(topic);
await redis.set(`trivia:${topic}`, JSON.stringify(newTrivia), 'EX', 3600);
```

#### 2. Connection Pooling

```typescript
// MongoDB
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 10
});

// Redis
const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true
});
```

#### 3. Compresión HTTP

```typescript
// app.ts
import compression from 'compression';
app.use(compression());
```

#### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

### Monitoreo y Observabilidad

#### Application Insights (Azure)

```bash
npm install applicationinsights

# En server.ts
import * as appInsights from 'applicationinsights';
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .start();
```

#### Logs Estructurados

Ya implementado con **Pino**:

```typescript
import logger from './utils/logger';

logger.info({ userId, roomCode }, 'User joined room');
logger.error({ err, userId }, 'Failed to create room');
```

#### Health Checks

Ya implementados en `app.ts`:

- `/healthz` - Básico (HTTP 200)
- `/readyz` - Verifica MongoDB y Redis
- Uso en Kubernetes/Azure:

```yaml
# k8s
livenessProbe:
  httpGet:
    path: /healthz
    port: 4000
readinessProbe:
  httpGet:
    path: /readyz
    port: 4000
```

### Seguridad en Producción

#### 1. Helmet (Recomendado)

```bash
npm install helmet

# app.ts
import helmet from 'helmet';
app.use(helmet());
```

#### 2. HTTPS Obligatorio

```typescript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});
```

#### 3. Secrets en Key Vault

```bash
# Azure Key Vault
az keyvault create --name triviando-vault --resource-group triviando-rg
az keyvault secret set --vault-name triviando-vault --name JwtSecret --value "..."

# Referenciar en Web App
az webapp config appsettings set \
  --settings JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://triviando-vault.vault.azure.net/secrets/JwtSecret/)"
```

---

## 🔧 Solución de Problemas

### Problemas Comunes

#### 1. Error: "Cannot connect to MongoDB"

**Síntoma:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Soluciones:**
- ✅ Verifica que MongoDB esté corriendo: `systemctl status mongod` (Linux) o MongoDB Compass
- ✅ Revisa `MONGODB_URI` en `.env`
- ✅ Verifica conectividad de red si usas Atlas (whitelist IP)
- ✅ Prueba conexión: `mongosh "mongodb://localhost:27017/triviando"`

#### 2. Error: "Redis connection failed"

**Síntoma:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Soluciones:**
- ✅ Verifica que Redis esté corriendo: `redis-cli ping` → debe responder `PONG`
- ✅ Revisa `REDIS_URL` en `.env`
- ✅ Para Redis Cloud, verifica que uses `rediss://` (con doble 's' para TLS)
- ⚠️ Redis es opcional en desarrollo de una sola instancia

#### 3. WebSocket no conecta en producción

**Síntoma:**
```
WebSocket connection failed: Error during WebSocket handshake
```

**Soluciones:**
- ✅ Habilita WebSockets en Azure: `az webapp config set --web-sockets-enabled true`
- ✅ Verifica CORS: debe incluir origen del frontend
- ✅ Usa `wss://` (WebSocket Secure) en producción, no `ws://`
- ✅ Verifica que el load balancer soporte WebSockets

#### 4. Tests fallan: "Port already in use"

**Síntoma:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Soluciones:**
```bash
# Encontrar proceso usando el puerto
lsof -i :4000  # Mac/Linux
netstat -ano | findstr :4000  # Windows

# Matar proceso
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# O usa un puerto diferente en tests
PORT=4001 npm test
```

#### 5. Error: "Invalid JWT token"

**Síntoma:**
```
401 Unauthorized: Invalid token
```

**Soluciones:**
- ✅ Verifica que JWT_SECRET sea el mismo en cliente y servidor
- ✅ El token no debe tener espacios extra
- ✅ Formato correcto: `Authorization: Bearer <token>`
- ✅ Verifica expiración: decodifica en [jwt.io](https://jwt.io)

#### 6. Gemini API Error: "API_KEY_INVALID"

**Síntoma:**
```
Error: Invalid API key for Gemini
```

**Soluciones:**
- ✅ Verifica `GEMINI_API_KEY` en `.env`
- ✅ Genera nueva key en [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ Verifica que la API esté habilitada en tu proyecto de Google Cloud
- ✅ Revisa límites de uso (quota)

#### 7. Cobertura de tests < 80%

**Síntoma:**
```
ERROR: Coverage threshold not met: lines: 75%
```

**Soluciones:**
```bash
# Ver qué archivos tienen baja cobertura
npm test -- --coverage --verbose

# Abrir reporte HTML para identificar líneas sin cubrir
open coverage/lcov-report/index.html

# Agregar tests para las líneas faltantes
```

### Debugging Avanzado

#### Modo Debug en VS Code

Crea `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/server.ts"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

#### Ver Logs en Tiempo Real (Producción)

```bash
# Azure
az webapp log tail --name triviando-backend --resource-group triviando-rg

# Heroku
heroku logs --tail --app triviando-backend
```

#### Inspeccionar Redis

```bash
# Conectar a Redis
redis-cli -h your-host -p 12345 -a your-password

# Ver todas las keys
KEYS *

# Ver valor de una key
GET trivia:Historia

# Ver info del servidor
INFO

# Monitorear comandos en tiempo real
MONITOR
```

### Logs de Errores Comunes

Busca estos patrones en logs para diagnosticar:

```bash
# MongoDB errors
grep "MongoError" logs/*.log

# Redis errors
grep "ReplyError" logs/*.log

# JWT errors
grep "JsonWebTokenError" logs/*.log

# Socket.IO errors
grep "socket error" logs/*.log
```

### Contacto de Soporte

Si encuentras un bug:

1. 🔍 Busca en [Issues existentes](https://github.com/JesusJC15/triviando-backend/issues)
2. 📝 Abre un [Nuevo Issue](https://github.com/JesusJC15/triviando-backend/issues/new) con:
   - Descripción del problema
   - Steps to reproduce
   - Logs relevantes
   - Versiones (Node, npm, OS)
   - Variables de entorno (sin valores sensibles)

---

## 🤝 Cómo Contribuir

¡Las contribuciones son bienvenidas! Este proyecto sigue las mejores prácticas de desarrollo colaborativo.

### Proceso de Contribución

1. **Fork el repositorio**
   ```bash
   # Click en "Fork" en GitHub
   git clone https://github.com/TU_USUARIO/triviando-backend.git
   cd triviando-backend
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # o
   git checkout -b fix/corregir-bug
   ```

3. **Realiza tus cambios**
   - Escribe código limpio y bien documentado
   - Sigue las convenciones del proyecto
   - Agrega tests para nuevas funcionalidades

4. **Ejecuta validaciones**
   ```bash
   npm run lint:fix    # Corregir estilo
   npm test            # Ejecutar tests
   npm run build       # Verificar compilación
   ```

5. **Commit con mensajes descriptivos**
   ```bash
   git add .
   git commit -m "feat: agregar endpoint para estadísticas de usuario"
   # o
   git commit -m "fix: corregir bug en sistema de puntuación"
   ```

   **Convención de commits:**
   - `feat:` Nueva funcionalidad
   - `fix:` Corrección de bug
   - `docs:` Cambios en documentación
   - `style:` Formato de código (no afecta lógica)
   - `refactor:` Refactorización de código
   - `test:` Agregar o modificar tests
   - `chore:` Tareas de mantenimiento

6. **Push a tu fork**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

7. **Abre un Pull Request**
   - Ve a GitHub y abre un PR desde tu rama
   - Describe claramente los cambios
   - Referencia issues relacionados (#123)
   - Espera revisión del equipo

### Guías de Estilo

#### TypeScript/JavaScript
- Usa TypeScript para todo nuevo código
- Prefiere `const` sobre `let`, nunca `var`
- Usa async/await sobre promises con `.then()`
- Tipado estricto: evita `any`
- Documenta funciones públicas con JSDoc

```typescript
/**
 * Crea una nueva sala de juego
 * @param userId - ID del usuario host
 * @param topic - Tema de la trivia
 * @param maxPlayers - Número máximo de jugadores (2-20)
 * @returns Código de sala generado
 */
export async function createRoom(
  userId: string,
  topic: string,
  maxPlayers: number = 10
): Promise<string> {
  // Implementación
}
```

#### Tests
- Un describe por archivo/feature
- Tests descriptivos: `it('should ... when ...')`
- Arrange-Act-Assert pattern
- Mock servicios externos
- Mínimo 80% de cobertura

```typescript
describe('createRoom', () => {
  it('should create room with valid parameters', async () => {
    // Arrange
    const userId = 'user123';
    const topic = 'Historia';
    
    // Act
    const roomCode = await createRoom(userId, topic);
    
    // Assert
    expect(roomCode).toHaveLength(6);
    expect(roomCode).toMatch(/^[A-Z0-9]{6}$/);
  });
});
```

### Áreas que Necesitan Contribución

#### 🚀 Alta Prioridad
- [ ] Docker y Docker Compose setup
- [ ] Rate limiting en API REST
- [ ] Paginación en endpoints de resultados
- [ ] Sistema de rankings global
- [ ] Notificaciones push

#### 🧪 Tests
- [ ] Tests de integración end-to-end
- [ ] Tests de carga (stress testing)
- [ ] Tests de reconexión WebSocket
- [ ] Tests de Gemini AI service

#### 📚 Documentación
- [ ] Tutorial de inicio rápido
- [ ] Guía de arquitectura detallada
- [ ] Diagramas de flujo
- [ ] Ejemplos de cliente (React, Vue)
- [ ] Traducción del README a inglés

#### ⚡ Optimizaciones
- [ ] Compresión de mensajes WebSocket
- [ ] CDN para assets estáticos
- [ ] Caché de resultados frecuentes
- [ ] Índices de MongoDB optimizados

#### 🎨 Nuevas Features
- [ ] Salas privadas con contraseña
- [ ] Modo espectador
- [ ] Replay de partidas
- [ ] Avatares personalizados
- [ ] Sistema de achievements/logros
- [ ] Integración con Discord

### Code Review

Cuando revises PRs de otros:

- ✅ Verifica que pasen todos los tests
- ✅ Revisa cobertura de código
- ✅ Verifica que siga convenciones
- ✅ Prueba localmente si es posible
- ✅ Da feedback constructivo
- ✅ Aprueba cuando esté listo

### Reporte de Bugs

Usa la [plantilla de issue](https://github.com/JesusJC15/triviando-backend/issues/new) e incluye:

```markdown
**Descripción del Bug**
Descripción clara del problema

**Para Reproducir**
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento Esperado**
Lo que debería pasar

**Screenshots/Logs**
Si aplica, agrega capturas o logs

**Entorno**
- OS: [ej. Ubuntu 22.04]
- Node: [ej. 22.1.0]
- npm: [ej. 9.5.0]
- Browser (si aplica): [ej. Chrome 120]
```

### Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contribuidores
- Reporta comportamiento inapropiado

---

## 📊 CI/CD y Calidad de Código

### GitHub Actions

El pipeline de CI/CD (`.github/workflows/test_triviando-backend.yml`) se ejecuta en cada push a `main`:

**Build Job:**
1. ✅ Setup Node.js 22.x
2. ✅ Crear `.env` desde secrets
3. ✅ `npm ci` (instalación limpia)
4. ✅ `npm run build` (compilación)
5. ✅ Upload artifact
6. ✅ `npm test` (tests + cobertura)
7. ✅ Verificar cobertura ≥ 80%

**Test Job:**
1. ✅ Download artifact
2. ✅ Setup Node.js
3. ✅ Crear `.env`
4. ✅ `npm ci`
5. ✅ `npm test`

**Deploy Job** (solo si los anteriores pasan):
1. ✅ Deploy a Azure Web Apps

### SonarCloud

**Quality Gate Configurado:**

| Métrica | Umbral | Estado |
|---------|--------|--------|
| Coverage | ≥ 80% | ✅ Passing |
| Maintainability Rating | A | ✅ Passing |
| Reliability Rating | A | ✅ Passing |
| Security Rating | A | ✅ Passing |
| Code Duplication | ≤ 3% | ✅ Passing |
| Code Smells | ≤ 10 per 1000 LOC | ✅ Passing |

Ver resultados: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pokesaurios_triviando-backend&metric=alert_status&token=88e1d8129af6360bb8859bc4ca300010cb528328)](https://sonarcloud.io/summary/new_code?id=Pokesaurios_triviando-backend)

### Status Badges

Agrega estos badges a tu fork:

```markdown
![Build Status](https://github.com/TU_USUARIO/triviando-backend/actions/workflows/test_triviando-backend.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-87%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

```
MIT License

Copyright (c) 2024 TrivIAndo Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Agradecimientos

Este proyecto fue desarrollado como parte de la materia **Arquitectura de Software (ARSW)** con el objetivo de aplicar conceptos modernos de desarrollo backend, arquitectura escalable y buenas prácticas de ingeniería de software.

### Tecnologías y Servicios Utilizados

- [Node.js](https://nodejs.org/) - Runtime de JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Express](https://expressjs.com/) - Framework web minimalista
- [Socket.IO](https://socket.io/) - Librería de WebSockets en tiempo real
- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL
- [Redis](https://redis.io/) - Almacén de datos en memoria
- [Google Gemini AI](https://ai.google.dev/) - IA generativa
- [Jest](https://jestjs.io/) - Framework de testing
- [Azure](https://azure.microsoft.com/) - Plataforma de cloud computing
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [SonarCloud](https://sonarcloud.io/) - Análisis de calidad de código

### Inspiración

Este proyecto fue inspirado por:
- Kahoot! - Juegos de trivia educativos
- Jackbox Games - Juegos multijugador de fiesta
- Trivia HQ - Trivias en vivo con premios

### Recursos y Referencias

#### Documentación Oficial
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Redis Documentation](https://redis.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

#### Tutoriales y Guías
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [The Twelve-Factor App](https://12factor.net/)
- [REST API Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

#### Libros Recomendados
- "Node.js Design Patterns" - Mario Casciaro & Luciano Mammino
- "Clean Architecture" - Robert C. Martin
- "Designing Data-Intensive Applications" - Martin Kleppmann
- "System Design Interview" - Alex Xu

---

## 📞 Contacto y Enlaces

### Repositorio
- **GitHub:** [github.com/JesusJC15/triviando-backend](https://github.com/JesusJC15/triviando-backend)
- **Issues:** [Reportar un problema](https://github.com/JesusJC15/triviando-backend/issues)
- **Pull Requests:** [Contribuir al proyecto](https://github.com/JesusJC15/triviando-backend/pulls)

### Equipo de Desarrollo
- **Jesús Alberto Jauregui Conde** - [GitHub](https://github.com/JesusJC15)
- **Natalia Espitia Espinel** - Desarrollo Full Stack
- **Mayerlly Suárez Correa** - Backend & DevOps

### Documentación Adicional
- 📄 [PROFILE.md](./PROFILE.md) - Portafolio y resumen de habilidades
- 📊 [SonarCloud Project](https://sonarcloud.io/summary/new_code?id=Pokesaurios_triviando-backend)
- 🚀 [Azure Web App](https://triviando-backend.azurewebsites.net)

---

## 🎓 Acerca del Proyecto

### Contexto Académico

**TrivIAndo Backend** fue desarrollado como proyecto final para la asignatura de Arquitectura de Software (ARSW) en 2024. El proyecto demuestra la aplicación práctica de:

- ✅ Patrones de arquitectura (MVC, Repository, Service Layer)
- ✅ Comunicación en tiempo real con WebSockets
- ✅ Bases de datos NoSQL y caché distribuida
- ✅ Integración con servicios de IA
- ✅ Testing exhaustivo y CI/CD
- ✅ Despliegue en la nube
- ✅ Escalabilidad horizontal
- ✅ Documentación técnica completa

### Objetivos de Aprendizaje

1. **Arquitectura de Microservicios:** Diseño modular y desacoplado
2. **Real-Time Systems:** Manejo de conexiones concurrentes
3. **Distributed Systems:** Coordinación con Redis y workers
4. **Cloud Computing:** Despliegue y escalado en Azure
5. **DevOps Practices:** Automatización de build, test y deploy
6. **Code Quality:** Mantener altos estándares de calidad

### Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de código | ~5,000+ |
| Tests | 150+ |
| Cobertura | 87%+ |
| Archivos | 60+ |
| Endpoints REST | 10+ |
| Eventos WebSocket | 15+ |
| Dependencias | 30+ |
| DevDependencies | 25+ |

---

<div align="center">

### ⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

**Desarrollado con ❤️ por el equipo de TrivIAndo**

[⬆ Volver arriba](#-triviando--backend)

</div>
