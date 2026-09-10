# Build stage
FROM maven:3.8.5-openjdk-17 AS build
# Set memory limits for Maven to prevent Render OOM
ENV MAVEN_OPTS="-Xms256m -Xmx512m"
COPY . /app
WORKDIR /app
# Run build with memory-efficient flags
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Run stage
FROM eclipse-temurin:17-jdk-jammy
# Set memory limits for the running app
ENV JAVA_OPTS="-Xms256m -Xmx512m"
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
