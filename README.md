# Hospital Management System

Live Demo: https://hospital-management-system-ruby-mu.vercel.app/

A full-stack Hospital Management System built with the MERN stack. It supports patient, doctor, admin, and lab expert roles with appointment booking, medicine ordering, lab test management, ambulance, blood bank, insurance, chat, file sharing, and video consultation features.

## Tech Stack

**Frontend:** React.js, Vite, CSS, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT, Role-based access  
**Payment:** Stripe  
**Realtime:** Socket.IO, WebRTC  
**File Upload:** Multer, Cloudinary  
**PDF:** PDFKit  
**Deployment:** Vercel, Render

## Features

### Patient
- Register and login
- View doctors
- Book online/offline appointments
- Stripe payment
- Chat with doctor
- Video consultation
- Upload images/files in chat
- View and download prescriptions
- Order medicines
- Book lab tests
- View lab reports
- Request ambulance
- Request blood
- Apply insurance claim

### Doctor
- Login
- View appointments
- Accept/reject appointments
- Chat with patient
- Video call consultation
- Add prescriptions
- Complete appointment

### Admin
- Manage doctors
- Manage medicines
- Manage orders
- Manage lab experts and lab tests
- Manage ambulance
- Manage beds
- Manage blood stock and requests
- Manage insurance and claims

### Lab Expert
- View assigned test bookings
- Update test status
- Chat with patient
- Generate/upload lab reports

## Installation

```bash
git clone https://github.com/your-username/HospitalManagementSystem.git
cd HospitalManagementSystem
