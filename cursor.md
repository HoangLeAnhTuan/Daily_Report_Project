# Global Context for Daily Report Website

## Project Overview

This is a simple daily report website built to learn modern web development. The application allows users to:

-   Register and log in (using JWT for authentication).
-   Reset password if forgotten (simulated email link with token).
-   Create, view, and delete daily reports (title, content, date, tag).
-   Filter reports by date or tag (e.g., "Important", "Normal", "Urgent").
-   View total number of reports.
-   Show toast notifications for success/error actions.

The project is developed in 4 days, keeping features minimal but functional. It uses Spring Boot (backend), Next.js (frontend), MySQL (database), Docker (containerization), Azure (backend deployment), and Vercel (frontend deployment).

## Technologies

-   **Backend**:
    -   Spring Boot 3.4.4 (Java 17, Maven).
    -   Spring Data JPA for MySQL integration.
    -   Spring Security + JJWT for JWT-based authentication.
-   **Frontend**:
    -   Next.js 14 (TypeScript, Tailwind CSS for styling).
    -   Axios for API calls.
    -   react-toastify for notifications.
-   **Database**: MySQL 8.0 (local or Dockerized).
-   **Containerization**: Docker + Docker Compose.
-   **Deployment**:
    -   Backend + MySQL: Azure Container Instances + Azure Database for MySQL.
    -   Frontend: Vercel.
-   **Tools**: IntelliJ/VSCode, Postman (for API testing), Azure CLI.

## Project Structure

daily-report-project/
├── backend/ # Spring Boot backend
│ ├── src/main/java/com/example/dailyreportbackend/
│ │ ├── controller/ # REST controllers (ReportController, TagController, AuthController)
│ │ ├── model/ # Entities (User, Report, Tag)
│ │ ├── repository/ # JPA repositories
│ │ ├── exception/ # Exception logic
│ │ ├── service/ # Business logic
│ │ ├── dto/ # Data Transfer Objects
│ │ ├── security/ # JWT configuration
│ ├── src/main/resources/
│ │ ├── application.properties # Database and JWT config
│ │ ├── data.sql # Default data for testing
│ ├── Dockerfile # Docker config for backend
│ ├── docker-compose.yml # Local backend + MySQL setup
├── frontend/ # Next.js frontend
│ ├── app/ # Pages and components
│ │ ├── page.tsx # Trang chủ hiển thị danh sách báo cáo
│ │ ├── create-report/ # Trang tạo báo cáo mới
│ │ ├── search/ # Trang tìm kiếm báo cáo
│ │ ├── auth/ # Các trang liên quan đến xác thực
│ │ ├── components/ # Các component dùng chung
│ │ ├── context/ # Context API cho quản lý state
│ │ ├── services/ # API services
│ ├── public/ # Static assets
│ ├── package.json # Dependencies (axios, react-toastify)
│ ├── tailwind.config.js # Tailwind CSS config
├── cursor.md # This file (global context)

## Coding Guidelines

-   **Backend**:
    -   Use RESTful conventions (e.g., GET /api/reports, POST /api/auth/login).
    -   Follow Spring Boot best practices (e.g., use @RestController, @Autowired).
    -   Name entities and fields clearly (e.g., Report.title, User.email).
    -   Enable CORS for Next.js (http://localhost:3000 locally, Vercel URL in production).
    -   Hash passwords with BCrypt.
    -   Use JPA for database operations, avoid raw SQL.
-   **Frontend**:
    -   Use TypeScript for type safety.
    -   Organize components in `app/components/`.
    -   Use Tailwind CSS for minimal styling effort.
    -   Store JWT in localStorage for authentication.
    -   Use axios for API calls with proper error handling.
    -   Show toast notifications for all user actions (create, delete, login, etc.).
-   **General**:
    -   Keep code simple and minimal (MVP focus).
    -   Avoid complex features like role-based authorization or pagination.
    -   Use consistent naming (camelCase for Java/TypeScript, snake_case for database).
    -   Write minimal comments, prioritize clear code.

## Features and Implementation Notes

-   **Authentication**:
    -   Register: POST /api/auth/register (email, password).
    -   Login: POST /api/auth/login (returns JWT).
    -   Forgot Password: POST /api/auth/forgot-password (simulate email with token in DB).
    -   Reset Password: POST /api/auth/reset-password (validate token).
    -   Protect /api/reports endpoints with JWT.
-   **Reports**:
    -   Create: POST /api/reports (title, content, date, tagId, userId, progress, remainingHours, issue, solution).
    -   View: GET /api/reports?userId=X (optional ?date=YYYY-MM-DD or ?tagId=Y).
    -   Delete: DELETE /api/reports/{id}.
    -   Count: GET /api/reports/count?userId=X.
    -   **Progress Tracking**:
        -   Progress: Percentage completed (0-100%, e.g., 30% for task A, 80% for task B).
        -   Remaining Hours: Estimated hours to complete the task (e.g., 5 hours).
        -   Issue: Reason for delay or problem (string, nullable, e.g., "Blocked by dependency").
        -   Solution: Proposed fix (string, nullable, e.g., "Coordinate with team").
-   **Tags**:
    -   Predefined tags: "Important", "Normal", "Urgent" (stored in DB).
    -   View: GET /api/tags.
    -   Filter reports by tag: GET /api/reports?tagId=X&userId=Y.
-   **Frontend**:
    -   Pages: /login, /register, /forgot-password, /reset-password, / (main report page).
    -   Main page: Form to create report (include progress, remaining hours, issue, solution), list of reports (show progress, hours, issue, solution), filter by date/tag, total count.
    -   Use Tailwind for responsive design (simple, not fancy).

## Instructions for Cursor

-   **Code Suggestions**:
    -   Prioritize Spring Boot and Next.js conventions.
    -   Suggest minimal, working code for MVP (avoid over-engineering).
    -   Include TypeScript types for Next.js components and API responses.
    -   Provide REST API endpoints with proper HTTP methods and paths.
    -   Suggest JPA queries for ReportRepository (e.g., findByUserIdAndDate).
-   **Debugging**:
    -   Check for common errors: CORS, JWT validation, MySQL connection issues.
    -   Warn about missing @CrossOrigin or incorrect application.properties.
    -   Suggest logging (e.g., console.log, System.out.println) for debugging.
-   **Avoid**:
    -   Do not suggest complex features (e.g., role-based auth, file upload).
    -   Do not use deprecated APIs (e.g., old Spring Security methods).
    -   Do not suggest non-TypeScript code for Next.js.
-   **Deployment**:
    -   Suggest Dockerfile and docker-compose.yml for backend + MySQL.
    -   Provide Azure CLI commands for Container Instances and MySQL setup.
    -   Remind to update API URLs in Next.js for Vercel deployment.

## Development Status

-   Completed:

    -   Backend project setup: models (User, Report, Tag), repositories, APIs for tags and reports
    -   Initial database configuration with MySQL and sample data
    -   Authentication system implementation (JwtUtil, JwtConfig, JwtRequestFilter)
    -   User registration and login with JWT
    -   Password reset functionality (token generation and validation)
    -   Security configuration with CORS support
    -   Protected endpoints with JWT-based authorization
    -   Exception handling with GlobalExceptionHandler
    -   Service layer implementation following the separation of concerns principle
    -   DTO pattern implementation for data transfer between layers
    -   RESTful API endpoints for authentication, reports, and tags
    -   Integration of BCrypt password encoding
    -   Frontend structure with Next.js and Tailwind CSS
    -   User authentication flow (login, register, forgot password, reset password)
    -   Report management (list, create, filter by date/tag, delete)
    -   Search functionality for reports
    -   Responsive UI design with error handling and loading states
    -   Username display from email in navigation bar

-   In Progress:
    -   Final UI/UX improvements
    -   Cross-browser compatibility testing
-   Next Steps:
    -   Add more search features (date range, tag filter in search)
    -   Dockerize backend
    -   Deploy to Azure (backend) and Vercel (frontend)
    -   Implement user profile page

## Backend Implementation Details

### Layers Architecture

The backend follows a layered architecture approach:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic
3. **Repository Layer**: Handles data access
4. **Model Layer**: Represents database entities
5. **DTO Layer**: Data transfer objects for API communication
6. **Exception Layer**: Custom exceptions and exception handling

### Exception Handling

-   `GlobalExceptionHandler`: Centralized exception handling using Spring's `@RestControllerAdvice`
-   `ResourceNotFoundException`: Custom exception for when resources are not found
-   `JwtException`: Custom exception for JWT-related errors
-   `ErrorResponse`: Standardized error response format

### Security Configuration

-   JWT-based authentication without sessions (stateless)
-   Spring Security configuration for protecting endpoints
-   CORS support for frontend integration
-   Password encryption using BCrypt

### API Endpoints

-   **Auth API**: Registration, login, forgot password, reset password
-   **Report API**: CRUD operations, filtering, counting
-   **Tag API**: CRUD operations for tags

## Frontend Implementation

### Pages

-   **Main Page (`/`)**: Hiển thị danh sách báo cáo, lọc theo ngày và tag
-   **Create Report (`/create-report`)**: Trang riêng biệt để tạo báo cáo mới
-   **Search (`/search`)**: Tìm kiếm báo cáo theo nội dung và tiêu đề
-   **Auth Pages**:
    -   Login (`/auth/login`)
    -   Register (`/auth/register`)
    -   Forgot Password (`/auth/forgot-password`)
    -   Reset Password (`/auth/reset-password`)

### Components

-   **Navigation**: Thanh điều hướng hiển thị tên người dùng và các đường dẫn
-   **ReportForm**: Component form tạo báo cáo với validate dữ liệu
-   **Common UI Components**: Loading spinners, error messages, notifications

### Services

-   **API Service**: Cấu hình Axios với interceptors cho token auth
-   **Auth Service**: Xử lý đăng nhập, đăng ký, quên mật khẩu
-   **Report Service**: CRUD operations cho báo cáo
-   **Tag Service**: Lấy danh sách tag

### Context

-   **Auth Context**: Quản lý state xác thực người dùng toàn ứng dụng

### Features

-   **Auth Flow**: Xác thực JWT đầy đủ với localStorage
-   **Protected Routes**: Chuyển hướng khi chưa đăng nhập
-   **Real-time Validation**: Kiểm tra dữ liệu form trực tiếp
-   **Responsive Design**: Giao diện tương thích mobile và desktop
-   **Error Handling**: Toast notifications khi có lỗi hoặc thành công
-   **Date Filtering**: Lọc báo cáo theo ngày (mặc định ngày hiện tại)
-   **Username Display**: Hiển thị username từ email người dùng
