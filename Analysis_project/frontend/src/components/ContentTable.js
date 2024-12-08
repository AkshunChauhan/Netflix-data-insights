import React, { useState } from 'react';
import { useTheme, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';

const ContentTable = ({ contentData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  // Columns definition
  const columns = [
    { id: 'index', label: 'Index', minWidth: 50 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'release_year', label: 'Release Year', minWidth: 100 },
    { id: 'rating', label: 'Rating', minWidth: 100 },
    // { id: 'listed_in', label: 'Genre', minWidth: 170 },
  ];

  // Handle page changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ marginTop: 8, color: theme.palette.text.primary }}>
      <Typography variant="h6">Filtered Content</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contentData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow hover key={index}>
                    {/* Add the index as the first column */}
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    {columns.slice(1).map((column) => {
                      const value = item[column.id];
                      return (
                        <TableCell key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={contentData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ContentTable;
