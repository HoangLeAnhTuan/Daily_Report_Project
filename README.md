# Daily Report Application

Ứng dụng quản lý báo cáo công việc hàng ngày, cho phép người dùng tạo và theo dõi tiến độ công việc.

## Công nghệ sử dụng

### Backend

-   Spring Boot 3.4.4
-   Java 17
-   MySQL 8.0
-   Spring Data JPA
-   Spring Security + JWT

### Frontend

-   Next.js 14
-   TypeScript
-   Tailwind CSS
-   Axios

## Cài đặt và Chạy

### Yêu cầu

-   JDK 17+
-   Maven
-   Node.js 18+
-   Docker & Docker Compose (tùy chọn)
-   MySQL 8.0 (nếu không dùng Docker)

### Chạy Backend

#### Sử dụng Maven

```bash
cd backend
mvn spring-boot:run
```

#### Sử dụng Docker Compose

```bash
cd backend
docker-compose up
```

### Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Ứng dụng sẽ chạy tại:

-   Backend: http://localhost:8081
-   Frontend: http://localhost:3000

## Biến Môi Trường

### Backend (.env hoặc biến môi trường hệ thống)

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3307/daily_report_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
SERVER_PORT=8081
CORS_ALLOWED_ORIGINS=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600000
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_APP_NAME=Daily Report
```

## Deploy lên Vercel

### 1. Đăng ký tài khoản Vercel

Nếu chưa có, đăng ký tài khoản tại [Vercel](https://vercel.com).

### 2. Cài đặt Vercel CLI

```bash
npm i -g vercel
```

### 3. Login và Deploy

```bash
cd frontend
vercel login
vercel
```

Theo hướng dẫn để thiết lập dự án. Đối với các biến môi trường, bạn có thể thiết lập trong dashboard của Vercel.

### 4. Chạy Production Build

```bash
vercel --prod
```

## Deploy Backend lên Azure

### 1. Đăng ký và cài đặt Azure CLI

Nếu chưa có, đăng ký tài khoản tại [Azure](https://azure.microsoft.com).

### 2. Đăng nhập Azure

```bash
az login
```

### 3. Tạo Container Registry

```bash
az acr create --name dailyreportregistry --resource-group YOUR_RESOURCE_GROUP --sku Basic --admin-enabled true
```

### 4. Build và Push Docker Image

```bash
cd backend
az acr build --registry dailyreportregistry --image daily-report-backend:latest .
```

### 5. Tạo Azure Container Instance

```bash
az container create \
  --resource-group YOUR_RESOURCE_GROUP \
  --name daily-report-backend \
  --image dailyreportregistry.azurecr.io/daily-report-backend:latest \
  --registry-login-server dailyreportregistry.azurecr.io \
  --registry-username REGISTRY_USERNAME \
  --registry-password REGISTRY_PASSWORD \
  --dns-name-label daily-report-backend \
  --ports 8081 \
  --environment-variables \
    SPRING_DATASOURCE_URL=YOUR_MYSQL_URL \
    SPRING_DATASOURCE_USERNAME=YOUR_MYSQL_USERNAME \
    SPRING_DATASOURCE_PASSWORD=YOUR_MYSQL_PASSWORD \
    CORS_ALLOWED_ORIGINS=https://daily-report-app.vercel.app
```

### 6. Tạo Azure Database for MySQL

```bash
az mysql server create \
  --resource-group YOUR_RESOURCE_GROUP \
  --name daily-report-mysql \
  --location eastus \
  --admin-user YOUR_ADMIN_USERNAME \
  --admin-password YOUR_ADMIN_PASSWORD \
  --sku-name GP_Gen5_2
```

### 7. Cấu hình Firewall cho MySQL

```bash
az mysql server firewall-rule create \
  --resource-group YOUR_RESOURCE_GROUP \
  --server daily-report-mysql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Cấu trúc Dự Án

### Backend

```
backend/
├── src/main/java/com/example/dailyreportbackend/
│   ├── controller/       # REST controllers
│   ├── model/            # Entities (User, Report, Tag)
│   ├── repository/       # JPA repositories
│   ├── exception/        # Exception handling
│   ├── service/          # Business logic
│   ├── dto/              # Data Transfer Objects
│   ├── security/         # JWT configuration
│   └── DailyReportBackendApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── data.sql
├── Dockerfile
└── docker-compose.yml
```

### Frontend

```
frontend/
├── app/
│   ├── components/     # Shared components
│   ├── context/        # React context providers
│   ├── services/       # API services
│   ├── auth/           # Authentication pages
│   ├── create-report/  # Create report page
│   ├── search/         # Search page
│   └── page.tsx        # Home page
├── public/
│   └── assets/         # Static files
├── .env.local          # Environment variables
├── next.config.js      # Next.js configuration
└── vercel.json         # Vercel configuration
```
