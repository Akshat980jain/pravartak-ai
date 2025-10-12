# DBT (Direct Benefit Transfer) Portal

A comprehensive role-based application management system for Direct Benefit Transfer schemes with 8 different user roles and complete workflow management.

## 🚀 Features

### ✅ Role-Based Authentication System
- **8 Different User Roles** with specific permissions and access levels
- **Secure Login** with mobile number/OTP and Aadhaar verification
- **Role-specific dashboards** with customized functionality

### ✅ User Roles & Access Levels

| Level | Role | Function | Access Type |
|-------|------|----------|-------------|
| 1 | **Victim / Beneficiary** | Apply, Track, Feedback | Self-only |
| 2 | **District Officer** | Verify & Forward | Regional |
| 3 | **State Welfare Officer** | Approve & Sanction | State-wide |
| 4 | **Central Ministry Admin (MoSJE)** | Monitor & Audit | Nationwide |
| 5 | **Financial Officer** | Fund Disbursement | Transactional |
| 6 | **Grievance Officer** | Complaint Handling | Support-based |
| 7 | **System Admin** | Backend & API Maintenance | Technical |
| 8 | **Auditor** | Compliance & Oversight | Read-only |

### ✅ Core Features

#### 🤖 **Intelligent Chatbot**
- **Right-bottom corner** floating chatbot
- **Role-specific responses** based on user permissions
- **Real-time assistance** for all DBT-related queries
- **Context-aware help** for different user types

#### 💰 **Official Payment Portal Integration**
- **Fund disbursement** management
- **Bulk payment processing**
- **Payment status tracking**
- **Bank account verification**
- **Transaction history**

#### 📋 **Application Management System**
- **Complete application workflow** from submission to approval
- **Document upload** and verification
- **Real-time status tracking**
- **Application ID generation**
- **Multi-scheme support** (Pension, Disability, Widow, Maternity, Scholarship)

#### 🎯 **Grievance Handling System**
- **Complaint submission** and tracking
- **Priority-based** issue management
- **Assignment and resolution** workflow
- **Status updates** and notifications
- **Comprehensive reporting**

#### 🔍 **Audit & Monitoring System**
- **Complete audit logs** with user actions
- **Compliance reporting** and monitoring
- **System performance metrics**
- **Real-time monitoring** dashboard
- **Report generation** and export

### ✅ Role-Specific Features

#### 👤 **Victim/Beneficiary**
- Apply for DBT benefits
- Track application status
- Submit feedback and grievances
- View payment history

#### 🏛️ **District Officer**
- Verify applications and documents
- Forward approved applications
- Regional application management
- Document verification workflow

#### 🏛️ **State Welfare Officer**
- Approve and sanction applications
- State-wide application oversight
- Final approval authority
- State-level reporting

#### 🏛️ **Central Ministry Admin**
- Nationwide monitoring and audit
- System-wide analytics
- Policy implementation
- National-level reporting

#### 💰 **Financial Officer**
- Fund disbursement processing
- Payment gateway management
- Bulk payment operations
- Financial reporting

#### 🎧 **Grievance Officer**
- Complaint handling and resolution
- Issue assignment and tracking
- Customer support management
- Resolution reporting

#### ⚙️ **System Admin**
- Backend and API maintenance
- User management
- System configuration
- Technical monitoring

#### 📊 **Auditor**
- Compliance oversight
- Audit report generation
- Read-only system access
- Regulatory compliance monitoring

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 🔐 Demo Login Credentials

### Test Users for Each Role:

| Role | Mobile Number | Password |
|------|---------------|----------|
| Victim/Beneficiary | 9876543210 | - |
| District Officer | 9876543211 | - |
| State Welfare Officer | 9876543212 | - |
| Central Ministry Admin | 9876543214 | - |
| Financial Officer | 9876543213 | - |
| Grievance Officer | 9876543215 | - |
| System Admin | 9876543216 | - |
| Auditor | 9876543217 | - |

*Note: Use mobile number for login, role selection is automatic based on the number*

## 📱 Key Pages & Features

### 🏠 **Home Page**
- Public landing page
- Feature overview
- Login access

### 🔐 **Login Page**
- Mobile number/OTP login
- Aadhaar verification
- Role-based authentication

### 📊 **Dashboard**
- Role-specific dashboard
- Customized statistics
- Quick action buttons
- Real-time updates

### 📝 **Apply Page**
- Complete application form
- Document upload
- Scheme selection
- Bank details

### 🔍 **Track Page**
- Application status tracking
- Search by ID/Aadhaar
- Timeline view
- Status updates

### 💬 **Chatbot**
- Intelligent assistance
- Role-specific help
- Real-time responses
- Context-aware support

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - User preference support
- **Accessibility** - WCAG compliant
- **Modern UI** - Clean and intuitive interface
- **Smooth Animations** - Enhanced user experience
- **Real-time Updates** - Live status changes

## 🔒 Security Features

- **Role-based Access Control** (RBAC)
- **Secure Authentication** with OTP
- **Audit Logging** for all actions
- **Data Encryption** for sensitive information
- **Session Management** with automatic logout
- **Input Validation** and sanitization

## 📈 Performance Features

- **Lazy Loading** for better performance
- **Optimized Bundle** size
- **Caching Strategy** for API calls
- **Real-time Updates** without page refresh
- **Progressive Web App** capabilities

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and queries:
- **Email**: support@dbtportal.gov.in
- **Helpline**: 1800-XXX-XXXX
- **Chatbot**: Available 24/7 in the application

## 🔄 Version History

- **v1.0.0** - Initial release with all 8 roles and core features
- **v1.1.0** - Enhanced chatbot with role-specific responses
- **v1.2.0** - Added comprehensive audit and monitoring system
- **v1.3.0** - Improved grievance handling and payment integration

---

**Built with ❤️ for Digital India Initiative**