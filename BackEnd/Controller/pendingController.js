
const express = require('express')
const connectDB = require('../Config/db')
const exportexcel = require('../utils/excelexport')

exports.getcusterexcel = async (req, res) => {
    var userid = req.params.id;

    connectDB.query('SELECT * FROM pending WHERE id = ?',userid, (err, rows, fields) => {
        if (err) {
            // Handle the error and respond accordingly
            console.error('Error executing query', err);
            return res.status(500).json({
                "Message": "Internal Server Error"
            });
        }

        
          exportexcel(res, rows, 'pending.xlsx');

    });

  
};

exports.postdata = async (req, res) => {
    try {
        
        // Extract data from request body
       
        const { names, locations, dates, advances, pendings, totals,paymentStatuses} = req.body;

        // Ensure all required fields are present
        if (!names ||!locations ||!dates || !advances || !pendings || !totals || !paymentStatuses ) {
            return res.status(400).json({ Message: "All fields are required" });
        }

       
        // Execute the query
        const query = ' INSERT INTO `pending`(`name`, `location`, `date`, `advance`, `pending`, `total`, `payment_status`) VALUES (?,?,?,?,?,?,?)';
        await connectDB.query(query, [names, locations, dates, advances, pendings, totals,paymentStatuses]);

        // Send success response
        res.json({ Message: "Data has been saved" });
    } catch (error) {
        // Handle errors
        console.error('Error inserting data:', error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
};

        

exports.getdata = async (req, res) => {
    connectDB.query('SELECT * FROM pending', (err, rows, fields) => {
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
    
        connectDB.query('DELETE FROM pending WHERE `id` = ?',id, (err,  fields) => {
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
        const { name, location, date, advance, pending, total, payment_status } = req.body;
    
        const query = `
            UPDATE pending
            SET name = ?, location = ?,  date = ?, advance = ?, pending = ?, total = ?, payment_status = ?
            WHERE id = ?
        `;
        
        connectDB.query(query, [name, location, date, advance, pending, total, payment_status, id], (err, results) => {
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
    
    
    

