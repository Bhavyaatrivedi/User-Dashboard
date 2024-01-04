import React from "react";
import { Routes, Route, Navigate  } from "react-router-dom";
import ResetPassword from "views/auth/ResetPassw";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";



const App = () => {
  return (
   
       <Routes>
      <Route path="auth/*" element={<AuthLayout />} />

      <Route path="rtl/*" element={<RtlLayout />} />

      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route element={<AdminLayout/>} path="admin/*" exact/>
      
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
    
   
  );
};

export default App;
