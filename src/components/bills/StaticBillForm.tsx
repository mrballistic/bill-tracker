'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Bill, BILL_CATEGORIES } from '@/models/Bill';

// Export these handlers to make them easier to test
export const formHandlers = {
  handleSelectChange: (
    setBill: React.Dispatch<React.SetStateAction<Partial<Bill>>>, 
    e: SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name) {
      setBill((prev) => ({ ...prev, [name]: value }));
    }
  }
};

export default function StaticBillForm() {
  const [bill, setBill] = useState<Partial<Bill>>({
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Utilities',
    isPaid: false,
  });

  // Just for visual feedback in the static version
  const [submitted, setSubmitted] = useState(false);

  // Separate handlers for different input types
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      // Convert to number for amount field
      if (name === 'amount') {
        setBill((prev) => ({ ...prev, [name]: Number(value) }));
      } else {
        setBill((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    formHandlers.handleSelectChange(setBill, e);
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBill((prev) => ({ ...prev, isPaid: e.target.checked }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setBill((prev) => ({ ...prev, date: date.toISOString().split('T')[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In static version, just show a success message
    setSubmitted(true);
    setTimeout(() => {
      setBill({
        name: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Utilities',
        isPaid: false,
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add New Bill
      </Typography>

      {submitted ? (
        <Box sx={{ textAlign: 'center', py: 3 }} data-testid="bill-submit-success">
          <Typography variant="h6" color="success.main">
            Bill submitted successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (This is just a static demo - no data was actually saved)
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate role="form" data-testid="bill-form">
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Bill Name"
              value={bill.name}
              onChange={handleTextChange}
              inputProps={{ "data-testid": "bill-name-input" }}
            />

            <TextField
              required
              fullWidth
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              value={bill.amount}
              onChange={handleTextChange}
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
              }}
              inputProps={{ "data-testid": "bill-amount-input" }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={bill.date ? new Date(bill.date) : null}
                onChange={handleDateChange}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={bill.category || ''}
                label="Category"
                onChange={handleSelectChange}
                data-testid="bill-category-select"
              >
                {BILL_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={bill.isPaid || false}
                  onChange={handleSwitchChange}
                  name="isPaid"
                />
              }
              label="Paid"
              data-testid="bill-paid-switch"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              data-testid="submit-bill-button"
            >
              Add Bill
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}