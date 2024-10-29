import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "./images/Notification.png";
import DatePicker from "react-datepicker";
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
  const [workHours, setWorkHours] = useState([null]); // Default value for work hours
  const [taskStatus, setTaskStatus] = useState([null]); // Default value for task status
  const [dates, setDates] = useState([new Date()]); // Default date for the first row
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [taskdata, settaskdata] = useState(['']);
  const [time, setTime] = useState('');
  const [company, setCompany] = useState('');

  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState({ start: '', end: '' });
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');


  
const [editModalOpen, setEditModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [currentTask, setCurrentTask] = useState(null);
const [form, setForm] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    company: "",
    task: "",
    work_hours: workHours[0],
    date: dates[0],
    time: "",
    task_status: taskStatus[0]
  });

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const downloadExcel = (id) => {
    axios.get(`http://localhost:5000/employeetask/getexcel/${id}`, { responseType: 'blob' })
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
    setFormData({ ...formData, time: time24h });
  };
 

  const handleWorkHoursChange = (hours, index) => {
    const newWorkHours = [...workHours];
    newWorkHours[index] = hours;
    setWorkHours(newWorkHours);
    setFormData({ ...formData, work_hours: hours }); // Update formData
    setDropdownOpen(null); // Close dropdown after selection
  };

  const format12 = (time24h) =>{
    const formattedTime = moment(time24h, 'HH:mm:ss').format('h:mm A');
    return formattedTime;
  }

  const handleTaskStatusChange = (status, index) => {
    const newTaskStatus = [...taskStatus];
    newTaskStatus[index] = status;
    setTaskStatus(newTaskStatus);
    setFormData({ ...formData, task_status: status }); // Update formData
    setDropdownOpen(null); // Close dropdown after selection
  };

  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}Z`); // Convert the time string to a Date object
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };


  const handleDateChange = (date, index) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
    setFormData({ ...formData, date: date }); // Update formData
  };
  const handlecompanyChange = (event) => {
    setCompany(event.target.value);
    setFormData({ ...formData, company: company });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const reslt = await fetch("http://localhost:5000/employeetask/post/Etask", {
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
      const response = await fetch("http://localhost:5000/employeetask/get/Etask");
      const data = await response.json();
      settaskdata(data.rows)
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
  }, [timeFilter, searchName ,searchCompany]);


  const resetFilters = () => {
    setTimeFilter({ start: '', end: '' });
    setSearchName('');
    setSearchCompany('');
    setFilteredData(taskdata); // Reset to original data
  };

  const filterData = () => {
    let data = taskdata;


    if (timeFilter.start && timeFilter.end) {
      data = data.filter(invoice => {
      
        const invoiceTime = invoice.time;
      
        const startTime = moment(timeFilter.start, 'h:mm A').format('HH:mm:ss');
        const endTime = moment(timeFilter.end, 'h:mm A').format('HH:mm:ss');

        return invoiceTime >= startTime && invoiceTime <= endTime;
      });
    }

    if (searchName) {
      data = data.filter(invoice =>
        invoice.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchCompany) {
      data = data.filter(invoice =>
        invoice.company.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }

    setFilteredData(data);
  };


  
const handleEdit = (Task) => {
  setCurrentTask(Task);
  setForm(Task);
  setEditModalOpen(true);
};

const handleDelete = (Task) => {
  setCurrentTask(Task);
  setDeleteModalOpen(true);
};

const handleConfirmDelete = async () => {
  try {
    await fetch(`http://localhost:5000/employeetask/delete/${currentTask.id}`, {
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
  setForm((prevData) => ({
    ...prevData,
    [name]: value
  }));
};
const handleSubmitChange = async (e) => {
  e.preventDefault();

  try {
    await fetch(`http://localhost:5000/employeetask/update/${currentTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
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
          <img
            className="w-24 h-24 text-white p-2"
            src={Logo}
            alt="Logo"
          />
          <Navigation />
        </div>
      </aside>
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#3d3d3d]">Employee Task</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1 flex justify-center ml-60">
               
              </div>
              <div className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full">
                <img src={Notification} alt="Notification Icon" />
              </div>
              <button
                className="text-[#FFFF] bg-[#ea8732] border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm"
                onClick={handleSubmit} // Attach submit handler
              >
                Submit
              </button>
            </div>
          </div>
        </header>
        <div className="bg-white shadow p-10 flex items-center justify-center">
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
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search Employee"
            />
            <input
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="Search company"
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
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">Employee</th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">Company</th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">Location</th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Task</th>
                  <th className="py-3 px-8 bg-gray-200 text-[#3d3d3d] text-center">Work Hours</th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">Date</th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">Time</th>
                  <th className="py-3 px-6 bg-gray-200 text-[#3d3d3d] text-center">Changes</th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
Action
</th>
                  {/* <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Download Data</th> */}
                </tr>
              </thead>
              <tbody>
                <tr className="text-[#3d3d3d] border-t">
                  <td className="py-3 px-6 text-left text-xs">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Employee"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      placeholder="company"
                      className="w-full py-1 px-2 border rounded"
                      value={company}
                      onChange={handlecompanyChange}
                    />
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Location"
                    />
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <input
                      type="text"
                      name="task"
                      value={formData.task}
                      onChange={handleInputChange}
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Task"
                    />
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <div className="relative inline-block">
                      <button
                        className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                        type="button"
                        onClick={() => toggleDropdown(0)}
                      >
                        {workHours[0] || "Choose"}
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
                        <div className="absolute mt-2 w-24 py-1 bg-white border border-gray-300 rounded shadow-lg">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((hours) => (
                            <button
                              key={hours}
                              onClick={() => handleWorkHoursChange(hours, 0)}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                            >
                              {hours} Hour{hours > 1 ? 's' : ''}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
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
                  <td className="py-3 px-6 text-center text-xs">
                    <div className="relative inline-block">
                      <button
                        className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                        type="button"
                        onClick={() => toggleDropdown(1)}
                      >
                        {taskStatus[0] || "Choose"}
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
                          {["Pending", "Completed"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleTaskStatusChange(status, 0)}
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

                {/* Existing task data rows */}
                {filteredData.map((task, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-center text-xs">{task.name}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.company}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.location}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.task}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.work_hours}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.date}</td>
                    <td className="py-3 px-6 text-center text-xs">{format12(task.time)}</td>
                    <td className="py-3 px-6 text-center text-xs">{task.task_status}</td>
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

                {/* Adding 10 empty rows */}
                {Array.from({ length: 20 }).map((_, index) => (
                  <tr key={index + taskdata.length} className="border-t">
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
 <h2 className="text-lg font-bold">Edit Task</h2>
      <form onSubmit={handleSubmitChange}>
      <div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700">Name</label>
<input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            required
            className="mt-1 block p-2 h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
            type="text"
            name="company"
            value={form.company || ""}
            onChange={handleChange}
            required
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
            type="text"
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            required
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task</label>
                      <input
            type="text"
            name="task"
            value={form.task || ""}
            onChange={handleChange}
            required
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Working Hour</label>
                      {/* <input
            type="text"
            name="work_hours"
            value={form.work_hours || ""}
            onChange={handleChange}
            required
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            /> */}
            <select
                    name="work_hours"
                    value={form.work_hours || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8  w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Work Hours</option>
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="5">5 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="7">7 Hours</option>
                    <option value="8">8 Hours</option>
                    <option value="9">9 Hours</option>
                    <option value="10">10 Hours</option>
                    <option value="11">11 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="13">13 Hours</option>
                    <option value="14">14 Hours</option>
                    <option value="15">15 Hours</option>
                  </select>

          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700">Date</label>
  <input
    type="date"
    name="date"
    value={form.date|| ""}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700">Time</label>
  <input
    type="time"
    name="time"
    value={form.time || ""}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  />
</div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Status</label>
                     {/* <input
            type="text"
            name="task_status"
            value={form.task_status || ""}
            onChange={handleChange}
            required
            className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            /> */}
          <select
                   name="task_status"
                   value={form.task_status || ""}
                   onChange={handleChange}
                   required
                    className="mt-1 block h-8  w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select  Status</option>
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
