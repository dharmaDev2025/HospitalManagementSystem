import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminDoctorManagement from "./pages/AdminDoctorManagement";
import AdminMedicineManagement from "./pages/AdminMedicineManagement";
import AdminPharmacy from "./pages/AdminPharmacy";
import AdminOrders from "./pages/AdminOrders";
import AmbulanceManagement
from "./pages/AmbulanceManagement";
import InsuranceAdmin from "./pages/InsuranceAdmin";
import BedManagement from "./pages/BedManagement";
import BloodManagement from "./pages/BloodManagement";
import AdminBedBookings from "./pages/AdminBedbookings";
import LabExpertManagement from "./pages/LabExpertManagement";
import LabExpertDashboard from "./pages/LabExpertDashboard";
import Medicines from "./pages/Medicines";
import MyOrders from "./pages/MyOrders";
import Ambulance from "./pages/Ambulance";
import Blood from "./pages/Blood";
import Bed from "./pages/Bed";
import Insurance from "./pages/Insurance";
import LabTestBooking from "./pages/LabTestBooking";
import MyLabReports from "./pages/MyLabReports";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ChatPage from "./pages/ChatPage";
import MyPrescriptions from "./pages/MyPrescriptions";
import ProfilePage from "./pages/ProfilePage";




function App() {

  return (

    <Routes>
      <Route path="/doctors" element={<BookAppointment />} />
      <Route path="/profile" element={<ProfilePage />} />
     <Route
  path="/my-appointments"
  element={<MyAppointments />}
/>
<Route path="/chat/:appointmentId" element={<ChatPage />} />
<Route
  path="/my-prescriptions"
  element={<MyPrescriptions />}
/>

    <Route
  path="/my-lab-reports"
  element={<MyLabReports />}
/>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/doctor/dashboard"
        element={<DoctorDashboard />}
      />
      <Route path="/my-orders" element={<MyOrders/>}/>
      <Route path="/lab-tests" element={<LabTestBooking/>}/>
     
   
<Route path="/patient/dashboard" element={<UserDashboard />} />
<Route path="/medicines" element={<Medicines />} />
    
  <Route path="/ambulance" element={<Ambulance/>}/>

<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>
<Route path="/insurance" element={<Insurance/>}/>
<Route path="/blood-request" element={<Blood />} />
<Route
  path="/admin/doctors"
  element={<AdminDoctorManagement />}
/>
<Route
  path="/admin/medicines"
  element={<AdminMedicineManagement />}
/>
<Route
  path="/admin/pharmacy"
  element={<AdminPharmacy />}
/>
<Route
  path="/admin/orders"
  element={<AdminOrders />}
/>
<Route
  path="/admin/ambulance"
  element={<AmbulanceManagement />}
/>
<Route
  path="/admin/insurance"
  element={<InsuranceAdmin />}
/>
<Route
path="/admin/beds"  element={<BedManagement/>}
/>
 <Route path="/admin/blood" element={<BloodManagement/>}/>
<Route path="/admin/bed-bookings" element={<AdminBedBookings/>}/>
<Route path="/admin/lab" element={<LabExpertManagement/>}/>
<Route
  path="/lab/dashboard"
  element={<LabExpertDashboard />}
/>
<Route path="/payment-success" element={<Medicines />} />
<Route
  path="/bed-booking"
  element={<Bed />}
/>


    </Routes>
  );
}

export default App;