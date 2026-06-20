# producer-grupo2

Microservicio **productor** RabbitMQ para el sistema **SaludAlerta**.  
DSY2206 – Desarrollo Cloud Native I | Grupo 2 | Semana 5 - Actividad Formativa 4

---

## Requisitos previos

- Java 21
- Maven
- Docker con RabbitMQ corriendo (mismo que S4)
- Oracle Wallet en `C:\Medicas\Wallet_AlertasDB`


```bash
docker run -d --name rabbitmq-grupo2 \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```

Consola de administración: http://localhost:15672 (guest/guest)

## Ejecutar el productor

```bash
cd producer
mvn spring-boot:run
```

Corre en **http://localhost:8081**

---

## Endpoints

### 1. Publicar mensaje genérico

```
POST http://localhost:8081/mensajes/publicar
Content-Type: application/json

{
  "mensaje": "Prueba de mensaje desde el productor"
}
```

### 2. Publicar alerta médica

```
POST http://localhost:8081/alertas/publicar
Content-Type: application/json

{
  "paciente": "Juan Pérez",
  "tipoAlerta": "Presión arterial elevada",
  "descripcion": "PA: 180/110 mmHg - Requiere atención inmediata",
  "nivelUrgencia": "ALTO"
}
```

### 3. Listar mensajes publicados (desde Oracle)

```
GET http://localhost:8081/mensajes/enviados
```

### 4. Health check

```
GET http://localhost:8081/actuator/health
```

---

## Flujo completo productor → consumer

```
Postman → POST /mensajes/publicar
              ↓
       Producer (8081)
       - Publica en cola_Grupo2 (RabbitMQ)
       - Guarda en MENSAJES_PUBLICADOS (Oracle)
              ↓
       RabbitMQ: cola_Grupo2
              ↓
       Consumer (8082)
       - Consume mensaje
       - Muestra en consola
       - Guarda en MENSAJES_COLA (Oracle)
```

## Ejecutar tests

```bash
mvn test
```
