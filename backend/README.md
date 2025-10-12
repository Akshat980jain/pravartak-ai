# DBT Portal Backend API

A comprehensive backend API for the Direct Benefit Transfer (DBT) Implementation Portal built with Node.js, Express.js, and MongoDB.

## 🚀 Features

### Core Functionality
- **Role-based Authentication & Authorization** with JWT tokens
- **Beneficiary Management** with comprehensive profile tracking
- **DBT Fund Disbursement** with approval workflows
- **Document Management** with secure file uploads
- **Grievance Redressal System** with SLA tracking
- **Audit & Compliance** with comprehensive logging
- **Integration APIs** for external systems (UIDAI, eCourts, CCTNS, PFMS)
- **Real-time Notifications** via Email and SMS
- **Comprehensive Reporting** with analytics and dashboards

### User Roles
1. **Admin** - Central Authority with full system access
2. **Scheme Officer** - State-level fund approval and monitoring
3. **Field Officer** - District-level beneficiary registration and verification
4. **Beneficiary** - Citizens applying for DBT benefits
5. **Auditor** - Compliance monitoring and audit trails

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Validation**: Joi + express-validator
- **File Upload**: Multer
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger UI

## 📁 Project Structure

```
backend/
├── models/                 # Database models
│   ├── User.js            # User management
│   ├── Beneficiary.js     # Beneficiary profiles
│   ├── Fund.js           # Fund disbursement
│   └── Grievance.js      # Grievance management
├── routes/                # API routes
│   ├── auth.js           # Authentication
│   ├── beneficiaries.js  # Beneficiary management
│   ├── funds.js          # Fund disbursement
│   ├── documents.js      # Document management
│   ├── grievances.js     # Grievance system
│   ├── audit.js          # Audit logs
│   ├── reports.js        # Reporting
│   ├── dashboard.js      # Dashboard APIs
│   ├── integration.js    # External integrations
│   └── notifications.js  # Notifications
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   └── errorHandler.js   # Error handling
├── utils/                 # Utility functions
│   ├── logger.js         # Logging configuration
│   ├── encryption.js     # Data encryption
│   └── responseFormatter.js # API response formatting
├── server.js             # Main server file
├── package.json          # Dependencies
└── README.md            # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/dbt-portal
   JWT_SECRET=your-super-secret-jwt-key
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Access API Documentation**
   - Swagger UI: `http://localhost:3000/api-docs`
   - Health Check: `http://localhost:3000/health`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update-password` - Update password

### Beneficiary Management
- `POST /api/beneficiaries` - Register beneficiary
- `GET /api/beneficiaries` - List beneficiaries (with filters)
- `GET /api/beneficiaries/:id` - Get beneficiary details
- `PUT /api/beneficiaries/:id` - Update beneficiary
- `PUT /api/beneficiaries/:id/status` - Update application status

### Fund Disbursement
- `POST /api/funds/sanction` - Initiate fund sanction
- `GET /api/funds` - List fund sanctions
- `GET /api/funds/status/:beneficiaryId` - Track disbursement
- `PUT /api/funds/:id/approve` - Approve fund
- `PUT /api/funds/:id/disburse` - Initiate disbursement
- `GET /api/funds/summary` - Fund summary statistics

### Grievance System
- `POST /api/grievances` - Submit grievance
- `GET /api/grievances` - List grievances
- `GET /api/grievances/:id` - Get grievance details
- `PUT /api/grievances/:id/assign` - Assign grievance
- `PUT /api/grievances/:id/resolve` - Resolve grievance
- `POST /api/grievances/:id/feedback` - Submit feedback

### Document Management
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Download document

### Integration APIs
- `GET /api/integration/aadhaar/:number` - Aadhaar verification
- `GET /api/integration/ecourts/:caseId` - eCourts case verification
- `GET /api/integration/cctns/:crimeId` - CCTNS data fetch
- `POST /api/integration/pfms/verify` - PFMS account verification

### Reporting & Analytics
- `GET /api/reports/fund-flow` - Fund flow reports
- `GET /api/reports/beneficiary-stats` - Beneficiary statistics
- `GET /api/reports/compliance` - Compliance reports
- `GET /api/audit/logs` - Audit logs
- `GET /api/dashboard/overview` - Dashboard overview

### Notifications
- `POST /api/notifications/email` - Send email
- `POST /api/notifications/sms` - Send SMS
- `POST /api/notifications/bulk` - Bulk notifications
- `GET /api/notifications/templates` - Notification templates

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (RBAC)
- **Password Hashing** with bcrypt
- **Data Encryption** for sensitive information
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Protection**
- **Helmet Security Headers**
- **Audit Logging** for all actions

## 📊 Database Schema

### User Model
- Personal information (name, email, mobile, Aadhaar)
- Role and permissions
- Address and jurisdiction
- Account status and security

### Beneficiary Model
- Personal and contact details
- Caste and category information
- Bank account details (encrypted)
- Case information
- Family and economic details
- Application status and documents

### Fund Model
- Beneficiary and scheme information
- Financial details (sanctioned, disbursed amounts)
- Transaction tracking (UTR, status)
- Approval and disbursement workflow
- Audit trail

### Grievance Model
- Complaint details and categorization
- Status tracking and SLA monitoring
- Assignment and escalation
- Communication history
- Resolution and feedback

## 🔧 Configuration

### Environment Variables
```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/dbt-portal

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📈 Monitoring & Logging

- **Winston Logger** for structured logging
- **Morgan** for HTTP request logging
- **Health Check** endpoint for monitoring
- **Audit Trail** for all user actions
- **Error Tracking** with detailed stack traces

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secrets
- [ ] Set up MongoDB with authentication
- [ ] Configure SMTP for email notifications
- [ ] Set up file storage (local or cloud)
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging
- [ ] Set up backup strategy

### Docker Deployment
```bash
# Build image
docker build -t dbt-portal-backend .

# Run container
docker run -p 3000:3000 --env-file .env dbt-portal-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api-docs`

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added integration APIs and enhanced reporting
- **v1.2.0** - Improved security and audit features

---

**Built with ❤️ for transparent and efficient DBT implementation**
