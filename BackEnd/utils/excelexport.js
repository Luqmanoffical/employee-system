const XLSX = require('xlsx');

const exportexcel = (res, data, filename ) => {
  // Create a new workbook and add a worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set the width for each column
  const columnWidths = data[0] ? Object.keys(data[0]).map(() => ({ wch: 20 })) : []; // Adjust the number 20 to set the width

  worksheet['!cols'] = columnWidths;

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write the workbook to a buffer
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // Send the file to the client
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
};


module.exports = exportexcel;
