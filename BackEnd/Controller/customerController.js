
const express = require('express')
const connectDB = require('../Config/db')
const exportexcel = require('../utils/excelexport')



exports.postdata = async (req, res) => {
    try {

        // Extract data from request body
        const { names, vehicles, descriptions, dates, contacts, deals, customers } = req.body;

        // Ensure all required fields are present
        if (!names || !vehicles || !descriptions || !dates || !contacts || !deals || !customers) {
            return res.status(400).json({ Message: "All fields are required" });
        }


        // Execute the query
        const query = ' INSERT INTO `customers`(`name`, `vehicle`, `description`, `date`, `contact`, `deals`, `customer`)  VALUES (?,?,?,?,?,?,?)';
        await connectDB.query(query, [names, vehicles, descriptions, dates, contacts, deals, customers]);

        // Send success response
        res.json({ Message: "Data has been saved" });
    } catch (error) {
        // Handle errors
        console.error('Error inserting data:', error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
};


exports.getcusterexcel = async (req, res) => {
    var userid = req.params.id;

    connectDB.query('SELECT * FROM customers WHERE id = ?', userid, (err, rows, fields) => {
        if (err) {
            // Handle the error and respond accordingly
            console.error('Error executing query', err);
            return res.status(500).json({
                "Message": "Internal Server Error"
            });
        }


        exportexcel(res, rows, 'users.xlsx');

    });


};

exports.chartdata = async (req, res) => {
    const { startDate, endDate } = req.query;

    // SQL query to filter data by date range
    const query = `
    SELECT date, COUNT(*) as count 
    FROM customers 
    WHERE date BETWEEN ? AND ?
    GROUP BY date
    ORDER BY date ASC`;

    connectDB.query(query, [startDate, endDate], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getdata = async (req, res) => {

    connectDB.query('SELECT * FROM customers', (err, rows, fields) => {
        if (err) {
            // Handle the error and respond accordingly
            console.error('Error executing query', err);
            return res.status(500).json({
                "Message": "Internal Server Error"
            });
        }

        // Respond with the rows from the database
        res.json({
            rows
        });
    });
};


exports.deletedata = async (req, res) => {
const id =req.params.id;

    connectDB.query('DELETE FROM customers WHERE `id` = ?',id, (err,  fields) => {
        if (err) {
            // Handle the error and respond accordingly
            console.error('Error executing query', err);
            return res.status(500).json({
                "Message": "Internal Server Error"
            });
        }

        // Respond with the rows from the database
        res.json({
           'Message' : 'deleted sucessfully'
        });
    });
};

exports.updatedata = async (req, res) => {
    const id = req.params.id;
    const { name, vehicle, description, date, contact, deals, customer } = req.body;

    const query = `
        UPDATE customers
        SET name = ?, vehicle = ?, description = ?, date = ?, contact = ?, deals = ?, customer = ?
        WHERE id = ?
    `;
    
    connectDB.query(query, [name, vehicle, description, date, contact, deals, customer, id], (err, results) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({
                "Message": "Internal Server Error"
            });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({
                "Message": "Customer not found"
            });
        }

        // Respond with a success message
        res.json({
            'Message': 'Updated successfully'
        });
    });
};


