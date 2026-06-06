# DSY2206 — Actividad Sumativa S3 — Semana 3
## SaludAlerta — Sistema de Alertas Médicas en Tiempo Real

**Asignatura:** Desarrollo Cloud Native I (DSY2206)
**Experiencia:** 1 — Semana 3 (Sumativa 40%)
**Integrantes:** Grupo 2
**Tenant Azure B2C:** `CloudeGrupo2.onmicrosoft.com`
**Base de datos:** AlertasDB — Oracle Autonomous Database 19c (Santiago)

---

## Descripción

Sistema hospitalario para gestionar señales vitales de pacientes críticos, con:
- Login via **Azure AD B2C (IDaaS)**
- Backend **Spring Boot 3** securitizado con **Spring Security + JWT**
- Frontend **Angular 17** con **MSAL**
- APIs expuestas via **Azure API Management**
- Base de datos **Oracle Autonomous Database** en OCI

---

## Estructura del proyecto

```
C:\Medicas\
├── README.md
├── backend\                        → Spring Boot 3 + Spring Security + JPA
│   ├── pom.xml
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── wallet\                     → Wallet Oracle AlertasDB (descomprimir aquí)
│   └── src\main\java\com\medicas\bff\
│       ├── BffApplication.java
│       ├── controller\
│       │   ├── PacienteController.java   → GET/POST/PUT/DELETE /api/pacientes
│       │   ├── SenalVitalController.java → GET/POST/PUT/DELETE /api/senales
│       │   └── AlertaController.java     → GET/POST/PUT/DELETE /api/alertas
│       ├── model\
│       │   ├── Paciente.java
│       │   ├── SenalVital.java
│       │   └── Alerta.java
│       ├── repository\
│       └── security\
│           └── SecurityConfig.java       → OAuth2 Resource Server JWT
└── frontend\                       → Angular 17 + MSAL
    └── src\app\
        ├── components\
        │   ├── dashboard\           → Métricas generales + alertas críticas
        │   ├── pacientes\           → CRUD pacientes
        │   ├── senales\             → CRUD señales vitales
        │   ├── alertas\             → CRUD alertas
        │   └── navbar\              → Navegación + logout
        ├── services\medicas.service.ts
        └── models\medicas.models.ts
```

---

## Endpoints del BFF (registrados en API Manager)

| Método | Endpoint                          | Descripción                  |
|--------|-----------------------------------|------------------------------|
| GET    | /api/pacientes                    | Listar todos los pacientes   |
| GET    | /api/pacientes/{id}               | Obtener paciente por ID      |
| POST   | /api/pacientes                    | Crear paciente               |
| PUT    | /api/pacientes/{id}               | Actualizar paciente          |
| DELETE | /api/pacientes/{id}               | Eliminar paciente            |
| GET    | /api/senales                      | Listar señales vitales       |
| GET    | /api/senales/paciente/{id}        | Señales de un paciente       |
| POST   | /api/senales                      | Registrar señal vital        |
| PUT    | /api/senales/{id}                 | Actualizar señal             |
| DELETE | /api/senales/{id}                 | Eliminar señal               |
| GET    | /api/alertas                      | Listar alertas               |
| GET    | /api/alertas/pendientes           | Alertas sin atender          |
| GET    | /api/alertas/paciente/{id}        | Alertas de un paciente       |
| POST   | /api/alertas                      | Crear alerta                 |
| PUT    | /api/alertas/{id}                 | Actualizar alerta            |
| DELETE | /api/alertas/{id}                 | Eliminar alerta              |

---

## Configuración Azure AD B2C

- **Tenant:** CloudeGrupo2.onmicrosoft.com
- **Client ID:** 498e47b6-e1a3-4881-ad4f-f2859feb9004
- **Flujo:** B2C_1_grupo2
- **Redirect URI:** http://localhost:4200

---

## Cómo ejecutar

### Backend
```bash
# 1. Descomprimir wallet Oracle en backend/wallet/
# 2. Instalar dependencias y compilar
cd C:\Medicas\backend
mvn clean install -DskipTests

# 3. Correr directamente
mvn spring-boot:run

# O con Docker
docker-compose up --build
```

### Frontend
```bash
cd C:\Medicas\frontend
npm install
ng serve
# Abrir http://localhost:4200
```


