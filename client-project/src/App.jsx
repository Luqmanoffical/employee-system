import React from 'react';
import { Routes, Route,  BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Signin from './components/Pages/Signin';
import Home from './components/Home';
import Vehicle from './components/Pages/Vehicle';
import Customer from './components/Pages/Customer';
import Invoice from './components/Pages/Invoice';
import Income from './components/Pages/Income';
import Employeetask from './components/Pages/Employeetask';
import Employeesalary from './components/Pages/Employeesalary';
import Report from './components/Pages/Report';
import PrivateRoute from './components/PrivateRoute';
import Pending from"./components/Pages/Pending"
import Expenses from"./components/Pages/Expenses"

function App() {
  
  return (

    <AuthProvider>
  <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      <Route path="/vehicle" element={<PrivateRoute element={<Vehicle />} />} />
      <Route path="/customer" element={<PrivateRoute element={<Customer />} />} />
      <Route path="/invoice" element={<PrivateRoute element={<Invoice />} />} />
      <Route path="/income" element={<PrivateRoute element={<Income />} />} />
      <Route path="/employeetask" element={<PrivateRoute element={<Employeetask />} />} />
      <Route path="/employeesalary" element={<PrivateRoute element={<Employeesalary />} />} />
      <Route path="/report" element={<PrivateRoute element={<Report />} />} />
      <Route path="/pending" element={<PrivateRoute element={<Pending  />} />} />
      <Route path="/expenses" element={<PrivateRoute element={<Expenses  />} />} />
   
    </Routes>
    </AuthProvider>
  );
}

export default App;
