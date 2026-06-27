# Guión de grabación — Sumativa S6 (Semana 6)
## "Desarrollando sistema asíncrono con la utilización de colas"
### Grupo 2 — DSY2206 — Sistema SaludAlerta

**Duración objetivo:** 7–9 minutos (la pauta exige mínimo 5, máximo 10)
**Herramienta de grabación:** Teams o Kaltura (reunión grabada con tu compañera)
**Participantes:** Persona 1 (tú) y Persona 2 (tu compañera) — alternar quién habla en cada parte, para que quede evidencia de participación equitativa de ambos (criterio 1 de la pauta, 10 pts)

---

## CÓMO ESTE GUIÓN SE RELACIONA CON LA PAUTA DE EVALUACIÓN (100 pts)

| # | Criterio de la pauta | Pts | Parte del guión que lo cubre |
|---|---|---|---|
| 1 | Git colaborativo (participación equitativa) | 10 | Parte 1 (ambos hablan) + Parte 8 (mostrar commits de ambos en GitHub) |
| 2 | Configurar RabbitMQ en Docker | 20 | Parte 2 y Parte 3 |
| 3 | Configurar DOS colas RabbitMQ y publicar mensajes | 20 | Parte 3, Parte 4, Parte 5 |
| 4 | DOS microservicios consumidores | 20 | Parte 6 y Parte 7 |
| 5 | DOS microservicios productores | 20 | Parte 4 y Parte 5 |
| 6 | Video: despliegue en cloud + cola MQ + Oracle + JSON | 10 | Todo el video (especialmente Parte 2, mostrando que es EC2 y no localhost) |

No te saltes ninguna parte: cada una suma puntos en un criterio distinto.

---

## PASO 0 — Preparación previa (NO se graba, hacerlo 10–15 min antes)

1. **Confirmar la IP pública actual del EC2.** Abre `C:\Medicas\IP_ACTUAL_EC2.txt` y corre el comando de verificación que está ahí (la IP cambia si la instancia se reinició). A la fecha de este guión la IP confirmada y validada end-to-end es:

   ```
   54.90.191.124
   ```

   Si cambió, reemplaza esa IP en todos los pasos de abajo.

2. **Confirmar que los 5 contenedores están arriba**, por SSH:
   ```bash
   sudo docker ps --format "{{.Names}}: {{.Status}}"
   ```
   Debes ver `Up` (no `Exited`) en: `rabbitmq_grupo2` (healthy), `producer1_alertas_grupo2`, `producer2_resumen_grupo2`, `consumer1_oracle_grupo2`, `consumer2_json_grupo2`.

   Si alguno no está corriendo:
   ```bash
   cd /home/ec2-user/consumer-grupo2 && sudo DOCKER_BUILDKIT=0 /usr/local/bin/docker-compose up -d
   ```

3. **Preparar las pestañas/ventanas que vas a compartir, en este orden** (para no perder tiempo cambiando de ventana en vivo):
   - Pestaña 1: Postman, con la colección/requests ya armados (ver Parte 4 y 5 para los bodies exactos)
   - Pestaña 2: Navegador en `http://54.90.191.124:15672` (RabbitMQ Management — login `guest` / `guest`)
   - Pestaña 3: Terminal con sesión SSH abierta al EC2 (para mostrar `docker ps` y logs)
   - Pestaña 4: Oracle Cloud — Database Actions / SQL Worksheet de la Autonomous DB `AlertasDB`
   - Pestaña 5: GitHub, repo `https://github.com/cricamps/consumer-grupo2`

4. **Ensayo mudo:** dispara una vez cada request de Postman antes de grabar, para confirmar que todo responde y no perder tiempo en vivo. Ya quedó validado hoy — si no ha pasado mucho tiempo desde la última prueba, puedes saltarte este paso.

---

## EL VIDEO (esto sí se grabra)

### Parte 1 — Introducción (30–40 seg) — habla Persona 1

**Qué mostrar en pantalla:** nada todavía, o una diapositiva/portada simple con el nombre del grupo (opcional). Si no tienen portada, pueden empezar directo mostrando sus caras en la cámara de Teams.

**Qué decir (texto sugerido, pueden adaptarlo a su forma de hablar):**

> "Hola, somos el Grupo 2 de Desarrollo Cloud Native I, DSY2206. Soy [tu nombre] y junto a [nombre de tu compañera] vamos a presentar la actividad sumativa de la Semana 6: un sistema asíncrono con RabbitMQ para SaludAlerta, nuestra plataforma de alertas médicas. Vamos a mostrar la arquitectura completa desplegada en AWS, con dos microservicios productores, dos consumidores, y dos colas independientes."

---

### Parte 2 — Arquitectura y despliegue en la nube (1 min) — habla Persona 2

**Qué mostrar en pantalla:** la Pestaña 3 (terminal SSH) — primero corre el comando, luego deja la salida visible mientras hablas.

**Comando a correr en vivo (cópialo, no lo escribas a mano para no perder tiempo):**
```bash
sudo docker ps --format "{{.Names}}: {{.Status}}"
```

**Resultado esperado en pantalla** (ya confirmado hoy, debe verse similar a esto):
```
consumer2_json_grupo2: Up X minutes
producer1_alertas_grupo2: Up X minutes
consumer1_oracle_grupo2: Up X minutes
producer2_resumen_grupo2: Up X minutes
rabbitmq_grupo2: Up X minutes (healthy)
```

**Qué decir:**

> "Todo este sistema está corriendo en una instancia EC2 de AWS, no en nuestras máquinas locales. Acá en la terminal, conectados por SSH a esa instancia en la nube, vemos los cinco contenedores Docker activos: el broker RabbitMQ y nuestros cuatro microservicios — dos productores y dos consumidores — todos desplegados con Docker Compose."

**Tip de cámara:** si pueden, acerquen/zoom a la salida del comando para que se lea bien en la grabación.

---

### Parte 3 — RabbitMQ: exchange fanout y las dos colas (1.5 min) — habla Persona 1

**Qué mostrar en pantalla:** Pestaña 2, navegador en `http://54.90.191.124:15672`

**Pasos exactos a hacer en vivo:**
1. Login con usuario `guest` y contraseña `guest`.
2. Click en la pestaña **Exchanges** (arriba).
3. Buscar y hacer click en `exchange_alertas_grupo2`.
4. Señalar con el cursor (o resaltar) los campos: **Type: fanout**, **Durable: true**.
5. Volver atrás, ir a la pestaña **Queues and Streams**.
6. Mostrar las dos colas en la lista: `cola_alertas_oracle_grupo2` y `cola_alertas_json_grupo2`. Señalar la columna de mensajes (puede estar en 0 si ya se consumieron, lo cual también es buena señal: significa que los consumidores SÍ están leyendo).

**Qué decir:**

> "Acá en la interfaz de administración de RabbitMQ vemos la configuración del broker. Configuramos un exchange tipo *fanout* llamado `exchange_alertas_grupo2`. Un exchange fanout reparte cada mensaje que llega a TODAS las colas que tiene asociadas, sin importar ninguna clave de enrutamiento. En nuestro caso, este exchange está conectado a dos colas: `cola_alertas_oracle_grupo2`, que alimenta al consumidor que persiste en Oracle, y `cola_alertas_json_grupo2`, que alimenta al consumidor que genera archivos JSON de auditoría. Así, cualquier mensaje publicado —ya sea una alerta o un resumen periódico— llega de forma simultánea e independiente a ambos consumidores."

> "Es importante mencionar que esta topología se crea automáticamente: no la armamos manualmente desde esta interfaz, sino que cada uno de nuestros cuatro microservicios la declara en su propia configuración de Spring Boot al arrancar, usando anotaciones de Spring AMQP. Esto asegura que el sistema sea reproducible: si alguien clona nuestro repositorio y levanta los contenedores, la cola y el exchange se crean solos."

---

### Parte 4 — Productor 1: detección de anomalías en signos vitales (1.5–2 min) — habla Persona 2

**Qué mostrar en pantalla:** Pestaña 1, Postman

**Caso A — CON anomalía (debe detectar y publicar alerta):**

Configurar el request:
```
Método: POST
URL: http://54.90.191.124:8086/signos-vitales/evaluar
Header: Content-Type: application/json
```
Body (raw, JSON):
```json
{
  "pacienteId": "P001",
  "pacienteNombre": "Juan Pérez",
  "frecuenciaCardiaca": 140,
  "presionSistolica": 180,
  "presionDiastolica": 110,
  "saturacionOxigeno": 89,
  "temperatura": 39.2
}
```

Dar **Send**. La respuesta esperada es **200 OK**, similar a esta (es la respuesta real que ya validamos hoy):
```json
{
  "anomaliaDetectada": true,
  "descripcion": "Frecuencia cardiaca anormal: 140 bpm (rango normal 60-100) | Presión sistólica anormal: 180 mmHg (rango normal 90-140) | Presión diastólica anormal: 110 mmHg (rango normal 60-90) | Saturación de oxígeno baja: 89% (mínimo normal 95%) | Temperatura anormal: 39.2°C (rango normal 36.0-37.5°C)",
  "alertaPublicada": true
}
```

**Qué decir (Caso A):**

> "Este endpoint, `POST /signos-vitales/evaluar`, simula un dispositivo médico enviando las señales vitales de un paciente en tiempo real. Productor 1 evalúa cada valor —frecuencia cardíaca, presión arterial, saturación de oxígeno y temperatura— contra rangos clínicos normales. En este caso enviamos signos claramente alterados, y como ven en la respuesta, el sistema detectó las cinco anomalías a la vez, generó una descripción detallada, y `alertaPublicada` quedó en `true`: el mensaje se publicó exitosamente al exchange."

**Caso B — SIN anomalía (NO debe publicar nada, para demostrar la lógica condicional):**

Cambiar el body a:
```json
{
  "pacienteId": "P002",
  "pacienteNombre": "Ana Soto",
  "frecuenciaCardiaca": 72,
  "presionSistolica": 110,
  "presionDiastolica": 75,
  "saturacionOxigeno": 98,
  "temperatura": 36.5
}
```

Respuesta esperada:
```json
{
  "anomaliaDetectada": false,
  "descripcion": "Sin anomalías detectadas",
  "alertaPublicada": false
}
```
(la descripción exacta puede variar levemente, lo importante es `anomaliaDetectada: false` y `alertaPublicada: false`)

**Qué decir (Caso B):**

> "Y si las señales están dentro de parámetros normales, como en este segundo caso con la paciente Ana Soto, el sistema no genera ninguna alerta innecesaria — `alertaPublicada` queda en `false`. Esto evita saturar a Oracle y al sistema de auditoría con eventos que no requieren atención médica."

---

### Parte 5 — Productor 2: resumen periódico programado (1 min) — habla Persona 1

**Qué mostrar en pantalla:** Postman

Configurar el request:
```
Método: POST
URL: http://54.90.191.124:8085/resumen/enviar
(sin body)
```

Dar **Send**. Respuesta esperada:
```json
{
  "exito": true,
  "mensajesPublicados": 3,
  "mensaje": "Resumen periódico publicado en el exchange"
}
```

**Qué decir:**

> "Productor 2 normalmente trabaja solo, sin intervención humana: cada 5 minutos, mediante una tarea programada con la anotación `@Scheduled` de Spring, publica automáticamente un resumen de signos vitales de todos los pacientes que el sistema está monitoreando, para mantener un registro histórico continuo, no solo reactivo ante alertas. Para no esperar los 5 minutos durante esta grabación, expusimos también un endpoint, `POST /resumen/enviar`, que dispara esa misma lógica manualmente. Como ven, publicó tres mensajes de tipo resumen, uno por cada paciente simulado."

---

### Parte 6 — Consumidor 1: persistencia en Oracle Cloud (1.5 min) — habla Persona 2

**Qué mostrar en pantalla:** primero Pestaña 3 (terminal SSH), luego Pestaña 4 (Oracle SQL Worksheet)

**Paso A — Logs del contenedor (terminal):**
```bash
sudo docker logs consumer1_oracle_grupo2 --tail 15
```
Buscar y señalar una línea similar a:
```
[consumer1-oracle] ... MensajeListener : Mensaje guardado en Oracle (tabla HISTORIAL_SIGNOS_GRUPO2) con éxito.
```

**Qué decir:**

> "Consumidor 1 escucha permanentemente la cola `cola_alertas_oracle_grupo2`. Como vemos en sus logs, cada mensaje recibido —ya sea alerta o resumen— se persiste exitosamente en una tabla de nuestra base de datos Oracle Cloud."

**Paso B — Verificación directa en Oracle (SQL Worksheet):**

Correr la consulta:
```sql
SELECT TIPO, PACIENTE_ID, PACIENTE_NOMBRE, DESCRIPCION, FECHA_RECEPCION
FROM HISTORIAL_SIGNOS_GRUPO2
ORDER BY FECHA_RECEPCION DESC;
```

Señalar en los resultados: la fila con `TIPO = ALERTA`, `PACIENTE_ID = P001`, cuya descripción debe coincidir con la que vimos en Postman en la Parte 4 (Caso A). También señalar filas con `TIPO = RESUMEN` correspondientes a la Parte 5.

**Qué decir:**

> "Y acá, directamente en la consola de Oracle Cloud, confirmamos que el dato no solo se procesó: quedó efectivamente almacenado. Esta fila corresponde exactamente a la alerta del paciente Juan Pérez que generamos hace un momento desde Postman, con la misma descripción de anomalías. Esto demuestra la persistencia real en una base de datos en la nube, fuera de nuestra instancia EC2."

---

### Parte 7 — Consumidor 2: generación de archivos JSON para auditoría (1.5 min) — habla Persona 1

**Qué mostrar en pantalla:** Postman

**Paso A — Listar los archivos generados:**
```
GET http://54.90.191.124:8084/alertas-json/listar
```
Respuesta esperada: un arreglo con nombres de archivo, por ejemplo:
```json
[
  "alerta_P001_20260627_054103680.json"
]
```

**Paso B — Ver el contenido de uno de esos archivos:**
```
GET http://54.90.191.124:8084/alertas-json/alerta_P001_20260627_054103680.json
```
(reemplazar el nombre exacto por el que aparezca en el paso A — el nombre incluye el ID de paciente y un timestamp, así que será distinto cada vez)

Mostrar el contenido devuelto: debe incluir tipo, paciente, descripción de la anomalía y fecha — coincidiendo con la alerta de la Parte 4.

**Qué decir:**

> "Consumidor 2 escucha la otra cola del mismo exchange, `cola_alertas_json_grupo2`, de forma totalmente independiente a Consumidor 1. Cuando el mensaje recibido es de tipo alerta, genera automáticamente un archivo JSON en el sistema de archivos, pensado para fines de auditoría y cumplimiento normativo, tal como exige el caso de SaludAlerta. Expusimos un endpoint para listar y consultar esos archivos sin necesidad de entrar por SSH al servidor. Como ven, el archivo generado contiene exactamente el mismo detalle de la anomalía que vimos antes en Oracle y en Postman."

> "Un detalle importante de nuestra lógica de negocio: los mensajes de tipo resumen, los que vienen de Productor 2, NO generan un archivo JSON — solo se auditan en el log del consumidor. Solo las alertas reales generan evidencia en disco, que es justamente lo que tiene sentido auditar."

---

### Parte 8 — Trabajo colaborativo y cierre (45 seg–1 min) — habla Persona 2

**Qué mostrar en pantalla:** Pestaña 5, GitHub — `https://github.com/cricamps/consumer-grupo2`

**Qué hacer:** ir a la pestaña de **Commits** o al historial de contribuciones, mostrar que hay commits de ambos integrantes del grupo.

**Qué decir:**

> "Todo el código de este sistema está disponible en nuestro repositorio de GitHub, con el historial de commits de ambos integrantes del Grupo 2, reflejando el trabajo colaborativo a lo largo de esta actividad."

> "En resumen: implementamos un exchange fanout con dos colas independientes; dos productores —uno reactivo ante anomalías de signos vitales, y otro programado que envía resúmenes periódicos—; y dos consumidores totalmente independientes entre sí —uno que persiste en Oracle Cloud, y otro que genera evidencia en archivos JSON—. Todo esto desplegado y funcionando en una instancia EC2 de AWS, no en nuestras máquinas locales. Muchas gracias."

---

## Checklist final antes de dar "Detener grabación"

- [ ] Se mostró el `docker ps` en el EC2 (prueba de despliegue en la nube, no localhost) — Parte 2
- [ ] Se mostró el exchange `exchange_alertas_grupo2` tipo fanout y las 2 colas en RabbitMQ Management — Parte 3
- [ ] Se probó Productor 1 CON anomalía (publica alerta, `alertaPublicada: true`) — Parte 4
- [ ] Se probó Productor 1 SIN anomalía (no publica, `alertaPublicada: false`) — Parte 4
- [ ] Se probó Productor 2 (`/resumen/enviar`) — Parte 5
- [ ] Se mostró el log de Consumidor 1 Y el registro real en la tabla Oracle `HISTORIAL_SIGNOS_GRUPO2` — Parte 6
- [ ] Se mostró el archivo `.json` generado por Consumidor 2 con su contenido — Parte 7
- [ ] Se mostró el repositorio de GitHub con commits de ambos integrantes — Parte 8
- [ ] Ambas personas hablaron en partes distintas (participación equitativa)
- [ ] Duración total entre 5 y 10 minutos
- [ ] Se subió la grabación (Kaltura/Teams) y se pegó el link en el Formato de Respuesta (Forma A) antes de entregar

---

## Plan B — si algo falla en vivo durante la grabación

- **Si Postman da timeout o "connection refused":** la instancia EC2 probablemente se reinició y cambió de IP, o los contenedores no están corriendo. Antes de grabar, siempre correr el chequeo del Paso 0. Si pasa EN VIVO, se puede cortar, verificar `docker ps` por SSH, y volver a grabar esa sección sin necesidad de repetir todo el video desde el inicio (graben por partes si su herramienta lo permite, o repitan solo la toma).
- **Si RabbitMQ Management no carga:** confirmar que el puerto `15672` sigue abierto en el Security Group de la instancia (a veces se resetea junto con el lab de Vocareum).
- **Si el servidor se pone lento o no responde:** ya se configuró swap de 2GB en la instancia para evitar que se cuelgue por falta de RAM; si igual ocurre, ver las instrucciones de recuperación en `C:\Medicas\IP_ACTUAL_EC2.txt`.
