import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "../Pages/images/Notification.png"
import DatePicker from "react-datepicker";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { saveAs } from 'file-saver';
import Navigation from "./Navigation";
import moment from 'moment';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";


function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [vehicles, setVehicles] = useState([null]); // Default value for vehicles
  const [descriptions, setDescriptions] = useState([null]); // Default value for descriptions
  const [dates, setDates] = useState([new Date()]); // Default date for the first row 
  const [advances, setAdvances] = useState([null]); // Default value for advance
  const [pendings, setPendings] = useState([null]); // Default value for pending
  const [names, setNames] = useState([""]); // State for names
  const [projectStatuses, setProjectStatuses] = useState([null]); // Default value for project statuses
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [taskData, setTaskData] = useState([]);
  const [time, setTime] = useState('');
  const [location, setlocation] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [formData, setFormData] = useState({});
  

  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState({ start: '', end: '' });
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [searchName, setSearchName] = useState('');

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
      case "projectStatus":
        const newStatuses = [...projectStatuses];
        newStatuses[index] = value;
        setProjectStatuses(newStatuses);
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
    axios.get(`http://localhost:5000/invoice/getexcel/${id}`, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'data.xlsx');
      })
      .catch((error) => {
        console.error('There was an error downloading the Excel file!', error);
      });
  };


  const handleTimeChange = (event) => {
    const time24h = moment(event.target.value, 'h:mm A').format('HH:mm:ss');
    setTime(time24h);

  };

  const handlelocationChange = (event) => {
    setlocation(event.target.value);
  };

  const handleAdvanceChange = (value, index) => {
    const newAdvances = [...advances];
    newAdvances[index] = value;
    setAdvances(newAdvances);
  };

  const handlePendingChange = (value, index) => {
    const newPendings = [...pendings];
    newPendings[index] = value;
    setPendings(newPendings);
  };

  const handleSubmit = async () => {
    const formData = {
      names,
      vehicles,
      descriptions,
      location,
      dates,
      time,
      advances,
      pendings,
      projectStatuses,
    };

    try {
      const result = await fetch("http://localhost:5000/invoice/post/E-invoice", {
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

  const format12 = (time24h) =>{
    const formattedTime = moment(time24h, 'HH:mm:ss').format('h:mm A');
    return formattedTime;
  }
 

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/invoice/get/E-invoice");
      const data = await response.json();
      setTaskData(data.rows);
      setFilteredData(data.rows);
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [timeFilter, dateFilter, searchName]);


  const resetFilters = () => {
    setTimeFilter({ start: '', end: '' });
    setDateFilter({ start: '', end: '' });
    setSearchName('');
    setFilteredData(taskData); // Reset to original data
  };

  const filterData = () => {
    let data = taskData;

    if (timeFilter.start && timeFilter.end) {
      data = data.filter(invoice => {
      
        const invoiceTime = invoice.time;
      
        const startTime = moment(timeFilter.start, 'h:mm A').format('HH:mm:ss');
        const endTime = moment(timeFilter.end, 'h:mm A').format('HH:mm:ss');

        return invoiceTime >= startTime && invoiceTime <= endTime;
      });
    }

    if (dateFilter.start && dateFilter.end) {
      data = data.filter(invoice =>
        invoice.date >= dateFilter.start && invoice.date <= dateFilter.end
      );
    }

    if (searchName) {
      data = data.filter(invoice =>
        invoice.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredData(data);
  };
  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    setFormData(invoice);
    setEditModalOpen(true);
  };

  const handleDelete = (invoice) => {
    setCurrentInvoice(invoice);
    setDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/invoice/delete/${currentInvoice.id}`, {
        method: 'DELETE',
      });
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting Invoice:", error);
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
      await fetch(`http://localhost:5000/invoice/update/${currentInvoice.id}`, {
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
    <div className="bg-gray-100  flex">
      <aside className="w-64 bg-white text-white flex-shrink-0 fixed h-full">
        <div className="p-6">
          <img
            className="w-24 h-24 text-white p-2"
            src={Logo}
            alt="Logo"
          />
          <Navigation />
        </div>
      </aside>
      <div className="flex-1 flex flex-col ml-64 h-screen">
        <header className="bg-white shadow p-7 flex items-center">
          <h2 className="text-xl font-bold text-[#3d3d3d] flex-1">Invoice</h2>
          <div className="flex-1 flex justify-center ml-60">
           
          </div>
          <div className="w-8 h-8  cursor-pointer hover:red-300">
            <img src={Notification} alt="icon" />
          </div>
          <button className="text-[#FFFF] bg-[#ea8732] ml-9 mr-9 border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm" onClick={handleSubmit}>
            Submit
          </button>
        </header>

        <div className="bg-white shadow p-10 flex items-center justify-center ">
          <div className="filters">
            <input
              type="time"
              value={timeFilter.start}
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              onChange={(e) => setTimeFilter({ ...timeFilter, start: e.target.value })}
              placeholder="Start Time"
            />
            <input
              type="time"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={timeFilter.end}
              onChange={(e) => setTimeFilter({ ...timeFilter, end: e.target.value })}
              placeholder="End Time"
            />
            <input
              type="date"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              placeholder="End Date"
            />
            <input
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search Company"
            />
            <button onClick={resetFilters} className="bg-[#ea8732] text-white px-6 py-1 rounded-md">
              Reset
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 flex justify-center overflow-y-auto">
          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-left">Company</th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">Vehicle</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Description</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Location</th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Date</th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Time</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Advance</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Pending</th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">Amount Status</th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Download Invoice</th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
Action
</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-[#3d3d3d] border-t">
                  <td className="py-3 px-4 text-left text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Company Name"
                      onChange={(e) => { setNames(e.target.value) }}
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
                        <div className="absolute mt-2 w-full py-1 bg-white border border-gray-300 rounded shadow-lg">
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
                          ].map((item) => (
                            <button
                              key={item}
                              onClick={() => handleDropdownChange(item, 0, "vehicle")}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                            >
                              {item}
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
                      placeholder="Description"
                      value={descriptions[0] || ""}
                      onChange={(e) => {
                        const newDescriptions = [...descriptions];
                        newDescriptions[0] = e.target.value;
                        setDescriptions(newDescriptions);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full py-1 px-2 border rounded"
                      value={location}
                      onChange={handlelocationChange}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <DatePicker
                      selected={dates[0]}
                      onChange={(date) => handleDateChange(date, 0)}
                      className="text-center bg-white border rounded w-full py-1 px-3"
                      dateFormat="dd/MM/yyyy"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="time"
                       className="w-full py-1 px-2 border rounded"
                      value={time}
                      onChange={handleTimeChange}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="number"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="0"
                      value={advances[0] || ""}
                      onChange={(e) => {
                        const newAdvances = [...advances];
                        newAdvances[0] = e.target.value;
                        setAdvances(newAdvances);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="number"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="0"
                      value={pendings[0] || ""}
                      onChange={(e) => {
                        const newPendings = [...pendings];
                        newPendings[0] = e.target.value;
                        setPendings(newPendings);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <div className="relative inline-block">
                      <button
                        className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                        type="button"
                        onClick={() => toggleDropdown(1)}
                      >
                        {projectStatuses[0] || "Choose Status"}
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
                      {dropdownOpen === 1 && (
                        <div className="absolute mt-2 w-full py-1 bg-white border border-gray-300 rounded shadow-lg">
                          {["Pending", "Complete"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleDropdownChange(status, 0, "projectStatus")}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                {/* Empty rows */}
                {filteredData.map((invoice, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">{invoice.name}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.vehicle}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.description}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.Location}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.date}</td>
                    <td className="py-3 px-6 text-center text-xs"> {format12(invoice.time)}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.advance}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.pending}</td>
                    <td className="py-3 px-6 text-center text-xs">{invoice.project_status}</td>
                    <td className="py-3 px-6 text-center text-xs"> <button className='bg-[#ea8732] p-1 rounded-md text-white font-medium' onClick={() => downloadExcel(invoice.id)}>
                      Download Invoice
                    </button></td>
     <td className=" text-center text-xs">
     <button
                                onClick={() => handleEdit(invoice)}
     
                               className="text-blue-500  hover:text-blue-700"
     >
       <FaRegEdit className="h-5 w-5" />
     </button>
     <button
       onClick={() => handleDelete(invoice)}
       className="text-black-500 hover:text-red-700 ml-2"
     >
       <MdDelete className="h-5 w-6" />
     </button>
     </td>
     
                  </tr>
                ))}
                {Array.from({ length: 20 }).map((_, index) => (
                  <tr key={index + taskData.length} className="border-t">
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
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
    <Modal   show={editModalOpen}  onClose={() => setEditModalOpen(false)}>
 <div className="h-auto w-auto">
 <h2 className="text-lg font-bold">Edit Invoice</h2>
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
            value={formData.vehicle || ""}
            required
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
            name="Location"
            value={formData.Location || ""}
            required
            onChange={handleChange}
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input
            type="time"
            name="time"
            value={formData.time || ""}
            onChange={handleChange}
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Advance</label>
                     <input
            type="text"
            name="advance"
            required
            value={formData.advance || ""}
            onChange={handleChange}
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Pending</label>
                     <input
            type="text"
            name="pending"
            value={formData.pending || ""}
            required
            onChange={handleChange}
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Status</label>
                     {/* <input
            type="text"
            name="project_status"
          required
            value={formData.project_status || ""}
            onChange={handleChange}
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            /> */}
                  
<select
           name="project_status"
            value={formData.project_status || ""}
            onChange={handleChange}
          required
          className="mt-1 block h-8  w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Payment Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>

                  </select>
          </div>
        </div>
        <button type="submit"   className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
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
