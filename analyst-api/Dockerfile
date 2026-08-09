# syntax=docker/dockerfile:1

# Maven comes from the build image rather than the wrapper: mvnw and .mvn/ are
# git-ignored, so they do not exist in the checkout Coolify builds from.
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build

# Dependency layer first: it only re-resolves when the pom changes.
COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline

COPY src/ src/
RUN mvn -B -ntp clean package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd --system --create-home --shell /usr/sbin/nologin app
COPY --from=build /build/target/*.jar app.jar
USER app

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
