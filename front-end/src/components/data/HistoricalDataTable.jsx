import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
  Chip,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  formatRiverLevel, 
  formatPrecipitation, 
  formatTemperature, 
  formatDateString 
} from '../../utils/formatters';

/**
 * Component to display historical flood data in a table with sorting and pagination
 */
const HistoricalDataTable = ({ data, loading, error }) => {
  const theme = useTheme();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Sorting state
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Create sort handler
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };
  
  // Sort function
  const sortData = (array) => {
    if (!array || array.length === 0) return [];
    
    return [...array].sort((a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];
      
      // Handle dates
      if (orderBy === 'date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      // Sort order
      const comparator = order === 'asc' ? 1 : -1;
      
      // Compare values
      if (valueB < valueA) {
        return -1 * comparator;
      }
      if (valueB > valueA) {
        return 1 * comparator;
      }
      return 0;
    });
  };
  
  // Generate rows
  const getRowsForPage = () => {
    const sortedData = sortData(data);
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading data
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Paper>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No historical data available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filter criteria or date range
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="historical data table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={createSortHandler('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'region'}
                  direction={orderBy === 'region' ? order : 'asc'}
                  onClick={createSortHandler('region')}
                >
                  Region
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'river_level'}
                  direction={orderBy === 'river_level' ? order : 'asc'}
                  onClick={createSortHandler('river_level')}
                >
                  River Level
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'precipitation'}
                  direction={orderBy === 'precipitation' ? order : 'asc'}
                  onClick={createSortHandler('precipitation')}
                >
                  Precipitation
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'temperature'}
                  direction={orderBy === 'temperature' ? order : 'asc'}
                  onClick={createSortHandler('temperature')}
                >
                  Temperature
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'flood_status'}
                  direction={orderBy === 'flood_status' ? order : 'asc'}
                  onClick={createSortHandler('flood_status')}
                >
                  Flood Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getRowsForPage().map((row, index) => (
              <TableRow
                hover
                key={`${row.date}-${row.region}-${index}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {formatDateString(row.date)}
                </TableCell>
                <TableCell>{row.region}</TableCell>
                <TableCell>{formatRiverLevel(row.river_level)}</TableCell>
                <TableCell>{formatPrecipitation(row.precipitation)}</TableCell>
                <TableCell>{formatTemperature(row.temperature)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.flood_status ? "Flood" : "No Flood"}
                    size="small"
                    sx={{
                      bgcolor: row.flood_status 
                        ? `${theme.palette.error.main}20`
                        : `${theme.palette.success.main}20`,
                      color: row.flood_status 
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                      fontWeight: 'medium'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default HistoricalDataTable;