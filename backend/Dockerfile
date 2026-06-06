FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar JAR
COPY --from=build /app/target/bff-0.0.1-SNAPSHOT.jar app.jar

# Copiar wallet de Oracle dentro de la imagen
COPY wallet/ /app/wallet/

EXPOSE 8080

ENTRYPOINT ["java", \
  "-Doracle.net.tns_admin=/app/wallet", \
  "-jar", "app.jar"]
