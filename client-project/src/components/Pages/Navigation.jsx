import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';



function Navigation() {
  const { logout } = useAuth();

  
  return (
    <nav>
    {/* Navigation Links */}
    <Link to="/home">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Dashboard
      </button>
    </Link>
    <Link to="/Employeesalary">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Employee Salary
      </button>
    </Link>
    <Link to="/Employeetask">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Employee Task
      </button>
    </Link>
    <Link to="/Income">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Income
      </button>
    </Link>
    <Link to="/Expenses">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Expenses
      </button>
    </Link>
    <Link to="/Customer">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Customers
      </button>
    </Link>
    <Link to="/Vehicle">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Vehicles
      </button>
    </Link>
    <Link to="/Pending">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Pending
      </button>
    </Link>
    <Link to="/Invoice">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
        Invoice
      </button>
    </Link>
    <Link to="/Report">
      <button className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
      Invoice Generate
      </button>
    </Link>
    <button   onClick={() => logout()}
    className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
      Sign Out
    </button>
  </nav>
  )
}

export default Navigation