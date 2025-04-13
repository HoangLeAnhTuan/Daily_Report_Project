FROM eclipse-temurin:17-jdk as builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x ./mvnw
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Biến môi trường có thể được ghi đè khi chạy container
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3307/daily_report_db
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root
ENV SERVER_PORT=8081
ENV CORS_ALLOWED_ORIGINS=http://localhost:3000,https://daily-report-app.vercel.app

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"] 