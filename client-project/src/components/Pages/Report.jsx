import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "../Pages/images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";
import axios from 'axios';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import Navigation from "./Navigation";

function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [vehicles, setVehicles] = useState([null]);
  const [descriptions, setDescriptions] = useState([null]);
  const [dates, setDates] = useState([new Date()]);
  const [advances, setAdvances] = useState([null]);
  const [pendings, setPendings] = useState([null]);
  const [names, setNames] = useState([""]);
  const [projectStatuses, setProjectStatuses] = useState([null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskData, setTaskData] = useState([]);

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
    setDropdownOpen(null);
  };

  const handleDateChange = (date, index) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
  };

  const handleAdvanceChange = (value, index) => {
    const newAdvances = [...advances];
    newAdvances[index] = value;
    setAdvances(newAdvances);
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


  const handlePendingChange = (value, index) => {
    const newPendings = [...pendings];
    newPendings[index] = value;
    setPendings(newPendings);
  };

  // const handleSubmit = async () => {
  //   const formData = {
  //     names,
  //     vehicles,
  //     descriptions,
  //     dates,
  //     advances,
  //     pendings,
  //     projectStatuses,
  //   };

  //   try {
  //     const result = await fetch("http://localhost:5000/invoice/post/E-invoice", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     fetchData();
  //   } catch (error) {
  //     console.error("Error posting data:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/invoice/get/E-invoice");
      const data = await response.json();
      setTaskData(data.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePDF = () => {
    const input = document.getElementById("invoice-table"); // Capture the table element
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("invoice.pdf");
    });
  };

  return (
    <div className="bg-gray-100 h-screen flex">
      <aside className="w-64 bg-white text-white flex-shrink-0 fixed h-full">
        <div className="p-6">
          <img className="w-24 h-24 text-white p-2" src={Logo} alt="Logo" />
         <Navigation/>
        </div>
      </aside>
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7 flex items-center">
          <h2 className="text-xl font-bold text-[#3d3d3d] flex-1">Invoice</h2>
          <div className="flex-1 flex justify-center ml-60">
            {/* <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs"
            /> */}
          </div>
          <div className="w-8 h-8 cursor-pointer hover:red-300">
            <img src={Notification} alt="icon" />
          </div>
          
          <button
            className="text-[#FFFF] bg-[#ea8732] ml-4 border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm"
            onClick={generatePDF}
          >
            Download PDF
          </button>
        </header>
        <div className="flex-1 p-6 flex justify-center overflow-y-auto">
          <div className="overflow-x-auto w-full max-w-4xl">
            <table
              id="invoice-table"
              className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Your existing table structure */}
              <thead>
              <tr>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-left">Name</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Vehicle</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Description</th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">Date</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Advance</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Pending</th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">Project Status</th>
                  {/* <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">Download Data</th> */}
                </tr>
              </thead>
              <tbody>
                {/* Table rows and data */}
                <tr className="text-[#3d3d3d] border-t">
                  {/* First row input fields */}
                </tr>
                {taskData.map((invoice, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">
                      {invoice.name}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {invoice.vehicle}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {invoice.description}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {invoice.date}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {invoice.advance}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {invoice.pending}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {invoice.project_status}
                    </td>
                    {/* <td className="py-3 px-6 text-center text-xs"> <button className='bg-[#ea8732] p-1 rounded-md text-white font-medium'   onClick={() => downloadExcel(invoice.id)}>
                    Download Excel
                  </button></td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employeetask;
