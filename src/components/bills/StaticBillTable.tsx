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
import { staticBills, formatCurrency, formatDate } from '@/lib/staticData';

export default function StaticBillTable() {
  const theme = useTheme();
  const bills = staticBills;
  
  // State for dialog management
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete'>('view');
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // For static version, these functions don't change data
  const handleTogglePaidStatus = (id: string) => {
    console.log(`Toggle paid status for bill ${id} - static version, no changes made`);
  };

  const handleConfirmDelete = () => {
    if (selectedBill) {
      console.log(`Delete bill ${selectedBill.id} - static version, no changes made`);
      handleCloseDialog();
    }
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
          <Table sx={{ minWidth: 650 }} aria-label="bills table">
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
                      aria-label="Toggle paid status"
                      data-testid="toggle-status-button"
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
                      aria-label="View bill details"
                      data-testid="view-bill-button"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bill, 'edit')}
                      aria-label="Edit bill"
                      data-testid="edit-bill-button"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bill, 'delete')}
                      aria-label="Delete bill"
                      data-testid="delete-bill-button"
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
        />
      </Paper>

      {/* Dialog for View/Edit/Delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth={dialogType === 'edit' ? 'md' : 'sm'}
        fullWidth
      >
        {dialogType === 'view' && selectedBill && (
          <>
            <DialogTitle>Bill Details</DialogTitle>
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
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog(selectedBill, 'edit');
                }}
                color="primary"
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}

        {dialogType === 'edit' && selectedBill && (
          <>
            <DialogTitle>Edit Bill</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  This is a static version of the app.
                  In the full application, you would be able to edit this bill here.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}

        {dialogType === 'delete' && (
          <>
            <DialogTitle>Delete Bill</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this bill? This action cannot be undone.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                (This is a static version - no actual deletion will occur)
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}