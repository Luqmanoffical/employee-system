import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Pages/images/logo.jpeg";
import Notification from "../components/Pages/images/Notification.png"
import DashboardDonutChart from './DashboardDonutChart';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  
  const { logout } = useAuth();

  
  return (
    
    <body>

      <div className="bg-gray-100 h-screen flex">

        <aside className="w-64 bg-white text-white flex-shrink-0">
          <div className="p-6">
            <img
              className=' fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="0" class="w-24 h-24 text-white p-2" '
              src={Logo}
              alt=""
            />
            <nav>
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
              </nav>
           
              <button      onClick={() => logout()}
               className="block text-[#3d3d3d] text-sm py-2.5 px-4 rounded hover:bg-[#ea8732] hover:text-white font-bold w-full text-left">
                Sign Out
              </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow p-7">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#3d3d3d]">Dashboard</h2>
              <div className="flex-grow"></div>
              <div className="flex gap-6">
              <div className="flex space-x-4 text-xs">
                {/* <input
                  type="text"
                  placeholder="Search"
                  className="px-4 py-1 border rounded"
                /> */}
              </div>
              <div className="w-8 h-8 cursor-pointer hover:red-300">
                <img src={Notification} alt="icon" />
              </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-10 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Example Cards */}
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Employeesalary">
                  <button className="text-base font-semibold">
                    Employee Salary
                  </button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Employeetask">
                  <button className="text-base font-semibold">
                    Employee Task
                  </button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Income">
                  <button className="text-base font-semibold">Income</button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Expenses">
                  <button className="text-base font-semibold">Expenses</button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Customer">
                  <button className="text-base font-semibold">Customers</button>{" "}
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Vehicle">
                  <button className="text-base font-semibold">Vehicles</button>
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Pending">
                  {" "}
                  <button className="text-base font-semibold">
                    Pending
                  </button>{" "}
                </Link>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md text-center transition-shadow duration-300 cursor-pointer hover:bg-[#ea8732] hover:text-white hover:shadow-lg hover:shadow-gray-400">
                <Link to="/Invoice">
                  <button className="text-base font-semibold">Invoice</button>{" "}
                </Link>
              </div>

              
            </div>


            {/* <DashboardDonutChart /> */}


          </main>
        </div>
      </div>
    </body>
  );
}

export default Home;
