# PrivacyGuard

PrivacyGuard is a **cost-effective and scalable software solution** that helps businesses manage data privacy, mitigate risks, and stay compliant with **GDPR** and **CCPA** regulations. It gives users control over their personal information while automating data classification, monitoring compliance workflows, and detecting potential breaches. By proactively protecting sensitive data, PrivacyGuard enables organizations to minimize privacy risks and enhance security.

---

## Features

### 🔒 **Enhanced Data Security**

- **JWT Authentication**: Ensures secure access to the platform by providing stateless and tamper-proof authentication.
- **Sensitive Data Masking**: Automatically detects and masks sensitive data in documents and datasets to prevent privacy breaches.
- **Privacy Compliance**: Designed to meet **CCPA** and **GDPR** standards, ensuring organizations handle data responsibly.

### 📂 **Comprehensive Data Handling**

- **Backend File Support**:
  - Supports **text**, **Excel (.xlsx)**, and **CSV** files for secure processing.
- **Model File Support**:
  - Capable of processing **PDF**, **CSV**, **JSON**, **TXT**, and **image** formats to detect and mask sensitive details.
- **Data Operations**:
  - **Access**: Retrieve and view data securely.
  - **Modify**: Edit sensitive data without risking privacy breaches.
  - **Delete**: Securely erase data as needed.
  - **Rectify**: Correct inaccuracies in datasets effectively.

### 🌟 **Professional and Accessible UI**

- **Professional Design**: A polished and intuitive user interface ensures a seamless experience for users.
- **User-Centric Approach**: Responsive design and clear navigation make data management accessible to all.

### 🌟 **Scalable and Cost-Effective**

- **Affordable for Small Businesses**: A powerful alternative to expensive, high-end security software, ideal for organizations with limited budgets.
- **Scalable Architecture**: Designed to handle increasing data volumes and user demands effortlessly.

### 💡 **Proactive Privacy Protection**

- **Data Classification**: Automatically organizes and classifies sensitive data to streamline privacy management.
- **Compliance Workflow Monitoring**: Tracks workflows to ensure compliance with privacy regulations.
- **Breach Detection**: Identifies potential data breaches to enable proactive mitigation.

---

## Technologies Used

- **React & TypeScript**: Modern, type-safe frontend development.
- **Node.js & Express**: Backend server for secure and efficient API handling.
- **JWT (JSON Web Tokens)**: Ensures secure user sessions.
- **Tailwind CSS**: Responsive and customizable UI styling.
- **Framer Motion**: Adds smooth animations for an engaging user experience.
- **Zod & React-Hook-Form**: Ensures secure and accurate data input.

---

## Installation

### Prerequisites

- Node.js installed on your system.
- A backend server running at `http://localhost:5000` with endpoints for data management and authentication.

### Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Start the development server
   ```
   npm run dev
   ```

### API Endpoints

#### Authentication

    POST /auth/register: User registration.
    POST /auth/login: User login with JWT token generation.

#### Data Management

    POST /data/upload: Upload files (text, Excel, or CSV).
    GET /data/view: Securely access data.
    PUT /data/modify: Modify existing records.
    DELETE /data/delete: Delete sensitive data permanently.
    POST /data/mask: Mask sensitive information in documents or datasets.

### Future Enhancements

- Third-Party Integrations: Add support for cloud storage platforms like AWS, Google Drive, etc.

- Role-Based Access Control: Implement user roles and permissions to enhance security.

- Advanced Analytics: Enable reporting and analytics for uploaded datasets.

- Localization: Add multi-language support for global accessibility.

- Dark Mode: Improve user experience with a dark theme option.
