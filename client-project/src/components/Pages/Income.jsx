
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "../Pages/images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { saveAs } from 'file-saver';
import Navigation from './Navigation';
import BarChart from '../BarChart';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";


function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dates, setDates] = useState([new Date()]); // Default date for the first row
  const [salaries, setSalaries] = useState([null]); // Default value for salary
  const [salaryStatuses, setSalaryStatuses] = useState([null]); // Default value for salary statuses
  const [descriptions, setDescriptions] = useState([""]); // State for descriptions
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [names, setNames] = useState([""]); // State for names
  const [taskData, setTaskData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [searchName, setSearchName] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [formData, setFormData] = useState({});




  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDropdownChange = (value, index, type) => {
    switch (type) {
      case "salaryStatus":
        const newStatuses = [...salaryStatuses];
        newStatuses[index] = value;
        setSalaryStatuses(newStatuses);
        break;
      default:
        break;
    }
    setDropdownOpen(null); // Close dropdown after selection
  };

  const downloadExcel = (id) => {
    axios.get(`http://localhost:5000/income/getexcel/${id}`, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'data.xlsx');
      })
      .catch((error) => {
        console.error('There was an error downloading the Excel file!', error);
      });
  };


  const handleDateChange = (date, index) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
  };

  const handleDescriptionChange = (value, index) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };


  const handleSubmit = async () => {
    const formData = {
      dates,
      salaries,
      salaryStatuses,
      descriptions,
      names,
    };

    try {
      const result = await fetch("http://localhost:5000/income/post/E-income", {
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
      const response = await fetch("http://localhost:5000/income/get/E-income");
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
  }, [dateFilter, searchName]);


  const resetFilters = () => {

    setDateFilter({ start: '', end: '' });
    setSearchName('');
    setFilteredData(taskData); // Reset to original data
  };

  const filterData = () => {
    let data = taskData;

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

  const chartLabels = filteredData.map(item => item.date);
  const chartData = filteredData.map(item => item.salary);

  const handleEdit = (income) => {
    setCurrentIncome(income);
    setFormData(income);
    setEditModalOpen(true);
  };

  const handleDelete = (income) => {
    setCurrentIncome(income);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/income/delete/${currentIncome.id}`, {
        method: 'DELETE',
      });
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting Income:", error);
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
      await fetch(`http://localhost:5000/income/update/${currentIncome.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating Income data:", error);
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
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7 flex items-center">
          <h2 className="text-xl font-bold text-[#3d3d3d] flex-1">Income</h2>
          <div className="flex-1 flex justify-center ml-60">

          </div>
          <div className="w-8 h-8 cursor-pointer hover:red-300">
            <img src={Notification} alt="icon" />
          </div>
          <button className="text-[#FFFF] bg-[#ea8732] ml-9 mr-9 border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm"
            onClick={handleSubmit} >
            Submit
          </button>
        </header>
        <div className="bg-white shadow p-10 flex items-center justify-center">
          <div className="filters">

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
              placeholder="Search Customer"
            />
            <button onClick={resetFilters} className="bg-[#ea8732] text-white px-6 py-1 rounded-md">
              Reset
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 flex justify-center overflow-y-auto ">
          <div className="overflow-x-auto w-full max-w-4xl h-96">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">Name</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Description</th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">Date</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Amount</th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Amount Status</th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Action
                  </th>
                  {/* <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Download Data</th> */}
                </tr>
              </thead>
              <tbody>
                {names.map((name, index) => (
                  <tr key={index} className="text-[#3d3d3d] border-t">
                    <td className="py-3 px-4 text-center text-xs">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const newNames = [...names];
                          newNames[index] = e.target.value;
                          setNames(newNames);
                        }}
                        className="w-full py-1 px-2 border rounded"
                        placeholder="Enter Name"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      <input
                        type="text"
                        value={descriptions[index]}
                        onChange={(e) => handleDescriptionChange(e.target.value, index)}
                        className="w-full py-1 px-2 border rounded"
                        placeholder="Enter Description"
                      />
                    </td>
                    <td className="py-3 px-10 text-center text-xs">
                      <DatePicker
                        selected={dates[index]}
                        onChange={(date) => handleDateChange(date, index)}
                        className="w-full py-1 px-2 border rounded"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      <input
                        type="number"
                        value={salaries[index] || ""}
                        onChange={(e) => {
                          const newSalaries = [...salaries];
                          newSalaries[index] = e.target.value;
                          setSalaries(newSalaries);
                        }}
                        className="w-full py-1 px-2 border rounded"
                        placeholder="0"
                      />
                    </td>

                    <td className="py-3 px-4 text-center text-xs">
                      <div className="relative inline-block">
                        <button
                          className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                          type="button"
                          onClick={() => toggleDropdown(index)}
                        >
                          {salaryStatuses[index] || "Choose Status"}
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
                        {dropdownOpen === index && (
                          <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-lg">
                            <ul className="list-none m-0 p-0">
                              {["Pending", "Paid"].map((status, i) => (
                                <li
                                  key={i}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleDropdownChange(status, index, "salaryStatus")}
                                >
                                  {status}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Render rows based on taskData */}
                {filteredData.map((task, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">{task.name}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.description}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.date}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.salary}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.salary_status}</td>

                    <td className=" text-center text-xs">
                      <button
                        onClick={() => handleEdit(task)}

                        className="text-blue-500  hover:text-blue-700"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="text-black-500 hover:text-red-700 ml-2"
                      >
                        <MdDelete className="h-5 w-6" />
                      </button>
                    </td>
                    {/* <td className="py-3 px-6 text-center text-xs"> <button className='bg-[#ea8732] p-1 rounded-md text-white font-medium'   onClick={() => downloadExcel(task.id)}>
      Download Excel
    </button></td> */}
                  </tr>
                ))}

                {/* Add 10 empty rows */}
                {[...Array(20)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
        <div className="bg-white shadow flex items-center justify-center ">
          <  BarChart chartData={chartData} chartLabels={chartLabels} />
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
                    required
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="mt-1 block p-2 h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
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
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    required
                    value={formData.salary || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary Status</label>
                  <select
                    name="salary_status"
                    value={formData.salary_status}
                    required
                    onChange={handleChange}
                    className="mt-1 block h-8  w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Salary Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
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
