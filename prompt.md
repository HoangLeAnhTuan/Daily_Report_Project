I’m starting a new project called **daily report website** using Spring Boot and MySQL for the backend, as described in `cursor.md`. Please create the backend from scratch based on `cursor.md` and `Backend.cursorrules`, assuming no code exists yet. Perform the following tasks:

1. **Setup Project Structure**:
   - Create a Spring Boot project with Maven in `daily-report-project/backend/`.
   - Include dependencies: Spring Web, Spring Data JPA, MySQL Driver, Spring Security, JJWT (version 0.9.1).
   - Set up package structure: `com.example.dailyreportbackend` with subpackages `model`, `repository`, `controller`, `security`, `config`.
   - Configure `src/main/resources/application.properties` for:
     - MySQL connection (localhost:3307, database `daily_report_db`, username `root`, password `root`).
     - JPA with `ddl-auto=update`, show SQL.
     - JWT settings (`jwt.secret` with a secure random string, `jwt.expiration=3600000`).
     - Basic Hikari pool (max size 5, connection timeout 20000).

2. **Create Models**:
   - Create `model/User.java` with fields: `id` (Long, auto-increment), `email` (String), `password` (String).
   - Create `model/Tag.java` with fields: `id` (Long, auto-increment), `name` (String).
   - Create `model/Report.java` with fields: `id` (Long, auto-increment), `title` (String), `content` (String), `date` (String), `tagId` (Long), `userId` (Long), `progress` (Integer, 0-100), `remainingHours` (Double), `issue` (String, nullable), `solution` (String, nullable).
   - Use JPA annotations (@Entity, @Id, etc.) and include getters/setters per `Backend.cursorrules`.

3. **Create Repositories**:
   - Create `repository/UserRepository.java` with method `findByEmail(String email)`.
   - Create `repository/TagRepository.java` with standard JPA methods.
   - Create `repository/ReportRepository.java` with methods: `findByUserId(Long userId)`, `findByUserIdAndDate(Long userId, String date)`, `findByUserIdAndTagId(Long userId, Long tagId)`, `countByUserId(Long userId)`.

4. **Create Controllers**:
   - Create `controller/TagController.java` with:
     - GET /api/tags (return all tags).
     - POST /api/tags (create a tag, for testing).
   - Create `controller/ReportController.java` with:
     - GET /api/reports (filter by `userId`, optional `date` or `tagId`).
     - GET /api/reports/count (count reports by `userId`).
     - POST /api/reports (create report with all fields: title, content, date, tagId, userId, progress, remainingHours, issue, solution).
     - DELETE /api/reports/{id} (delete report).
   - Add @CrossOrigin(origins = "http://localhost:3000") and minimal logging (System.out.println) per `Backend.cursorrules`.

5. **Prepare Authentication**:
   - Create `config/SecurityConfig.java` with BCrypt PasswordEncoder bean.
   - Create `security/JwtUtil.java` with methods to:
     - Generate JWT (using `jwt.secret` and `jwt.expiration`).
     - Validate JWT.
     - Extract userId from JWT.
   - Create `controller/AuthController.java` with empty endpoints (to be filled later): POST /api/auth/register, POST /api/auth/login, POST /api/auth/forgot-password, POST /api/auth/reset-password.
   - Ensure `/api/auth/*` and `/api/tags` are public, but `/api/reports/*` will be JWT-protected later.

6. **Update Development Status**:
   - Edit `cursor.md`, update `### Development Status` to:
     - Completed: Backend project setup, models (User, Tag, Report), repositories, APIs for tags and reports, initial authentication setup (SecurityConfig, JwtUtil).
     - In Progress: Preparing JWT authentication endpoints.
     - Next Steps: Implement JWT auth (register, login, forgot-password, reset-password), secure reports APIs, start Next.js frontend, Dockerize backend.
   - Keep the update concise and aligned with a 4-day timeline.

7. **Additional Requests**:
   - Generate a SQL script in `src/main/resources/data.sql` to insert default tags: "Important", "Normal", "Urgent".
   - Create a JUnit test in `src/test/java/com/example/dailyreportbackend/ReportControllerTest.java` to test:
     - POST /api/reports (mock ReportRepository, verify status 201, check saved fields including progress, remainingHours).
     - GET /api/reports (mock data, verify response).
   - Suggest one logging improvement for `application.properties` (e.g., enable debug SQL).
   - Provide a Postman JSON body example for POST /api/reports with all fields.

Please:
- Follow `cursor.md` and `Backend.cursorrules` strictly.
- Use **Claude 3.7 Sonnet** for complex tasks (JWT, tests) and **GPT-4o** for quick setup (models, config).
- Ensure code is minimal, compatible with Spring Boot 3.4.4, MySQL 8.0, and my setup (port 8081, MySQL on 3307).
- Output all files clearly (e.g., `Report.java`, `application.properties`) for easy copying.
- If clarification needed, suggest a question (e.g., "Do you want a specific MySQL port?").
- After creating, suggest commands to run and test the project (e.g., `mvn spring-boot:run`, Postman tests).