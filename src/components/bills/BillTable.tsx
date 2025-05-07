'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Bill } from '@/models/Bill';
import { useBills } from '@/contexts/BillContext';
import BillForm from './BillForm';

export default function BillTable() {
  const theme = useTheme();
  const { bills, togglePaidStatus, deleteBill } = useBills();
  
  // State for dialog management
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete'>('view');
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Open dialog for viewing, editing, or deleting a bill
  const handleOpenDialog = (bill: Bill, type: 'view' | 'edit' | 'delete') => {
    setSelectedBill(bill);
    setDialogType(type);
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (selectedBill) {
      deleteBill(selectedBill.id);
      handleCloseDialog();
    }
  };

  // Handle toggle paid status
  const handleTogglePaidStatus = (id: string) => {
    togglePaidStatus(id);
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate empty rows to maintain consistent table height during pagination
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - bills.length)
    : 0;

  return (
    <>
      <Paper elevation={2} sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table 
            sx={{ minWidth: 650 }} 
            aria-label="Bills management table"
            aria-describedby="bills-table-description"
          >
            <caption id="bills-table-description" className="sr-only">
              Table of bills showing status, name, amount, date, category, and actions
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? bills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : bills
              ).map((bill) => (
                <TableRow
                  key={bill.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: bill.isPaid
                      ? theme.palette.action.hover
                      : 'inherit'
                  }}
                >
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleTogglePaidStatus(bill.id)}
                      color={bill.isPaid ? 'success' : 'default'}
                      aria-label={bill.isPaid ? "Mark as unpaid" : "Mark as paid"}
                      aria-pressed={bill.isPaid}
                      sx={{
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      {bill.isPaid ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {bill.name}
                  </TableCell>
                  <TableCell>{formatCurrency(bill.amount)}</TableCell>
                  <TableCell>{formatDate(bill.date)}</TableCell>
                  <TableCell>
                    <Chip
                      label={bill.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bill, 'view')}
                      aria-label={`View details for ${bill.name}`}
                      sx={{
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bill, 'edit')}
                      aria-label={`Edit ${bill.name}`}
                      sx={{
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bill, 'delete')}
                      aria-label={`Delete ${bill.name}`}
                      sx={{
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
              {bills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No bills found. Add your first bill using the form above.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bills.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Bills per page:"
          getItemAriaLabel={(type) => {
            if (type === 'first') return 'Go to first page';
            if (type === 'last') return 'Go to last page';
            if (type === 'next') return 'Go to next page';
            return 'Go to previous page';
          }}
        />
      </Paper>

      {/* Dialog for View/Edit/Delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth={dialogType === 'edit' ? 'md' : 'sm'}
        fullWidth
        aria-labelledby="dialog-title"
      >
        {dialogType === 'view' && selectedBill && (
          <>
            <DialogTitle id="dialog-title">Bill Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">{selectedBill.name}</Typography>
                <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Typography variant="body2">
                    <strong>Amount:</strong> {formatCurrency(selectedBill.amount)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {formatDate(selectedBill.date)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {selectedBill.category}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={selectedBill.isPaid ? 'Paid' : 'Unpaid'}
                      size="small"
                      color={selectedBill.isPaid ? 'success' : 'default'}
                      variant={selectedBill.isPaid ? 'filled' : 'outlined'}
                      role="status"
                    />
                  </Typography>
                </Box>
                {selectedBill.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Notes:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                      {selectedBill.notes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog}
                sx={{
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog(selectedBill, 'edit');
                }}
                color="primary"
                sx={{
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}

        {dialogType === 'edit' && selectedBill && (
          <>
            <DialogTitle id="dialog-title">Edit Bill</DialogTitle>
            <DialogContent>
              <BillForm
                initialData={selectedBill}
                onCancel={handleCloseDialog}
              />
            </DialogContent>
          </>
        )}

        {dialogType === 'delete' && (
          <>
            <DialogTitle id="dialog-title">Delete Bill</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this bill? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog}
                sx={{
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                color="error"
                aria-label="Confirm delete bill"
                sx={{
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'error.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
