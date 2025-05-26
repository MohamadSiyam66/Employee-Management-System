# Employee-Management-System
The Employee Management System is a full-stack web application designed to manage employee records efficiently. It allows organizations to handle employee data, attendance, timesheet and manage leave through a user-friendly interface with robust backend support.

## 🛠️ Technologies Used

### 🔧 Backend
- Java 21.0.1 (JDK)
- Spring Boot
- Spring Data JPA
- RESTful APIs
- MySQL

### 💻 Frontend
- React.js v19
- Node.js v22.13.1

### 🧪 Tools
- Postman (for API testing)

## 🚀 Features

- Add, update, and delete employees  
- Fetch employee lists with filtering and searching   
- RESTful API architecture for clean integration  
- Auto-database creation via Spring Boot on startup
  
## ⚙️ Instructions to Run the Backend

### 1. Install Java JDK 21.0.1
Ensure Java is properly installed and available in your system PATH.

### 2. Use IntelliJ IDEA (Ultimate or Community Edition)
Open the project using IntelliJ IDEA.

### 3. Enable Annotation Processing  
Go to:  
`Settings -> Build, Execution, Deployment -> Compiler -> Annotation Processors`  
✅ Check **"Enable annotation processing"**
`Settings -> Build, Execution, Deployment -> Compiler -> Annotation Processors -> Annotation Profile For Backend`
✅ Check **"Enable annotation processing"** and **"Obtain Processors from project classpath** 

### 4. Download Maven Dependencies (Intellij Idea will ask automatically)

### 5. Open MySQL Workbench or MySql commandline 
  - Enter your password (1234)
  - Create Database named 'ems_rubaai_db'. if you are using mysql cmd line ->  **create database new;**

### 6. Go to main/resources/application.properties
  - set username (root)
  - set password (1234)
  - **use your mysql password and username by default it will be root and 1234**

### 7. Run the Application
Run the backend using IntelliJ **Use Below reference image**

![image](https://github.com/user-attachments/assets/c2aef494-2fd3-4833-8da4-533f808defe2)

## ⚙️ Instructions to Run the Frontend

### 1. Clone the frontend or Download zip file
### 2. Open with a code editor VS Code / WebStorm
### 3. Open terminal and run : 
  - **npm install**
  - **npm install axios**
  - **npm install lucide-react**
  - **npm install react-router-dom**
  - **npm run dev**



