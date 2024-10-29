import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "../Pages/images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { saveAs } from 'file-saver';
import Navigation from './Navigation';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";


function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [vehicles, setVehicles] = useState([null]); // Default value for vehicles
  const [descriptions, setDescriptions] = useState([null]); // Default value for descriptions
  const [dates, setDates] = useState([new Date()]); // Default date for the first row
  const [locations, setLocations] = useState([null]); // Default value for locations
  const [charges, setCharges] = useState(''); // Default value for charges
  const [names, setNames] = useState([""]); // State for names
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [taskData, setTaskData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [formData, setFormData] = useState({});

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDropdownChange = (value, index, type) => {
    switch (type) {
      case "vehicle":
        const newVehicles = [...vehicles];
        newVehicles[index] = value;
        setVehicles(newVehicles);
        break;
      case "description":
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
        break;
      default:
        break;
    }
    setDropdownOpen(null); // Close dropdown after selection
  };

  const handleDateChange = (date, index) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
  };

  const downloadExcel = (id) => {
    axios.get(`http://localhost:5000/vehicles/getexcel/${id}`, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'data.xlsx');
      })
      .catch((error) => {
        console.error('There was an error downloading the Excel file!', error);
      });
  };


  const handleSubmit = async () => {
    const formData = {
      names,
      vehicles,
      descriptions,
      dates,
      locations,
      charges,
    };

    try {
      const result = await fetch("http://localhost:5000/vehicles/post/E-vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      fetchData();

      // Optionally handle response or update state after successful POST
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/vehicles/get/E-vehicles");
      const data = await response.json();
      setTaskData(data.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (vehicles) => {
    setCurrentVehicle(vehicles);
    setFormData(vehicles);
    setEditModalOpen(true);
  };

  const handleDelete = (vehicles) => {
    setCurrentVehicle(vehicles);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/vehicles/delete/${currentVehicle.id}`, {
        method: 'DELETE',
      });
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }

  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmitChange = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5000/vehicles/update/${currentVehicle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating customer data:", error);
    }
  };



  return (
    <div className="bg-gray-100 h-screen flex">
      <aside className="w-64 bg-white text-white flex-shrink-0 fixed h-full">
        <div className="p-6">
          <img className="w-24 h-24 text-white p-2" src={Logo} alt="Logo" />
          <Navigation />
        </div>
      </aside>
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#3d3d3d]">Vehicles</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 px-3 py-1 border rounded shadow-sm text-xs mr-4"
            />
            <img className="w-8 h-8 cursor-pointer hover:red-300 mr-4" src={Notification} alt="icon" />
            <button className="text-white bg-[#ea8732] border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </header>
        <div className="flex-1 p-6 flex justify-center overflow-y-auto">
          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-left">Name</th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">Vehicle</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Description</th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">Date</th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">Location</th> {/* Updated Header */}
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">Charges</th> {/* Updated Header */}
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Action
                  </th>
                  {/* <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Download Data</th> */}
                </tr>
              </thead>
              <tbody>
                {/* Input Row */}
                <tr className="text-[#3d3d3d] border-t">
                  <td className="py-3 px-4 text-left text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Name"
                      onChange={(e) => {
                        setNames(e.target.value);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <div className="relative inline-block">
                      <button
                        className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                        type="button"
                        onClick={() => toggleDropdown(0)}
                      >
                        {vehicles[0] || "Choose Vehicle"}
                        <svg
                          className="w-2.5 h-2.5 ml-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>
                      {dropdownOpen === 0 && (
                        <div className="absolute mt-2 w-full py-1 bg-white border border-gray-200 rounded shadow-md">
                          {[
                            "Crane: 25-Ton",
                            "Crane: 50-Ton",
                            "Crane: 70-Ton",
                            "Crane: 100-Ton",
                            "Forklift: 3-Ton",
                            "Forklift: 5-Ton",
                            "Forklift: 7-Ton",
                            "Forklift: 10-Ton",
                            "Boomloader: 523",
                            "Boomloader: 540",
                          ].map((option) => (
                            <button
                              key={option}
                              className="block w-full text-left px-4 py-1 text-gray-800 hover:bg-gray-200"
                              onClick={() =>
                                handleDropdownChange(option, 0, "vehicle")
                              }
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Description"
                      onChange={(e) => {
                        setDescriptions(e.target.value);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <DatePicker
                      selected={dates[0]}
                      onChange={(date) => handleDateChange(date, 0)}
                      className="border rounded py-1 px-2 text-center w-full"
                      dateFormat="dd/MM/yyyy"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Location"
                      onChange={(e) => {
                        setLocations(e.target.value);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="number"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="0"
                      onChange={(e) => {
                        setCharges(e.target.value);
                      }}
                    />
                  </td>
                </tr>

                {/* Data Rows */}
                {taskData.map((vehicle, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">{vehicle.name}</td>
                    <td className="py-3 px-6 text-center text-xs">{vehicle.vehicle}</td>
                    <td className="py-3 px-6 text-center text-xs">{vehicle.description}</td>
                    <td className="py-3 px-6 text-center text-xs">{vehicle.date}</td>
                    <td className="py-3 px-6 text-center text-xs">{vehicle.location}</td>
                    <td className="py-3 px-6 text-center text-xs">{vehicle.charges}</td>
                    <td className=" text-center text-xs">
                      <button
                        onClick={() => handleEdit(vehicle)}

                        className="text-blue-500  hover:text-blue-700"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle)}
                        className="text-black-500 hover:text-red-700 ml-2"
                      >
                        <MdDelete className="h-5 w-6" />
                      </button>
                    </td>

                    {/* <td className="py-3 px-6 text-center text-xs"> <button className='bg-[#ea8732] p-1 rounded-md text-white font-medium'   onClick={() => downloadExcel(vehicle.id)}>
      Download Excel
    </button></td> */}
                  </tr>
                ))}

                {/* Empty Rows */}
                {[...Array(20)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <div className="h-auto w-auto">
            <h2 className="text-lg font-bold">Edit Customer</h2>
            <form onSubmit={handleSubmitChange}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="mt-1 block p-2 h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                  {/* <input
                    type="text"
                    name="vehicle"
                    required
                    value={formData.vehicle || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  /> */}
                <select
            name="vehicle"
            required
            value={formData.vehicle || ""}
            onChange={handleChange}
                    className="mt-1 block h-8  w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select vehicle</option>
                    <option value="Crane: 50-Ton">Crane: 50-Ton</option>
                    <option value="Crane: 70-Ton">Crane: 70-Ton</option>
                    <option value="Crane: 100-Ton">Crane: 100-Ton</option>
                    <option value="Forklift: 3-Ton">Forklift: 3-Ton</option>
                    <option value="Forklift: 5-Ton">Forklift: 5-Ton</option>
                    <option value="Forklift: 7-Ton">Forklift: 7-Ton</option>
                    <option value="Forklift: 10-Ton">Forklift: 10-Ton</option>
                    <option value="Boomloader: 523">Boomloader: 523</option>
                    <option value="Boomloader: 540">Boomloader: 540</option>

                  </select>


                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    required
                    value={formData.description || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Charges</label>
                  <input
                    type="text"
                    name="charges"
                    required
                    value={formData.charges || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >Save Changes</button>
            </form>
          </div>
        </Modal>
      )}

      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-lg font-bold">Confirm Delete</h2>
        <p>Are you sure you want to delete this customer?</p>
        <button
          onClick={handleConfirmDelete}
          className="bg-red-500 text-white py-2  px-4 rounded mt-4"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="bg-gray-500 text-white py-2 px-4 rounded mt-4 ml-2"
        >
          Cancel
        </button>
      </Modal>

    </div>
  );
}

export default Employeetask;