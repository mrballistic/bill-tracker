'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Typography,
  Paper,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import { Bill, BillFormData, BILL_CATEGORIES } from '@/models/Bill';
import { useBills } from '@/contexts/BillContext';

interface BillFormProps {
  initialData?: Bill;
  onCancel?: () => void;
}

// Default form values
const defaultFormData: BillFormData = {
  name: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  category: 'Other',
  isPaid: false,
  notes: '',
};

export default function BillForm({ initialData, onCancel }: BillFormProps) {
  const isEditMode = !!initialData;
  
  // Initialize with either provided data or defaults
  const [formData, setFormData] = useState<BillFormData>(
    initialData 
      ? { 
          name: initialData.name,
          amount: initialData.amount,
          date: initialData.date,
          category: initialData.category,
          isPaid: initialData.isPaid,
          notes: initialData.notes || '',
        } 
      : defaultFormData
  );

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Context for bill operations
  const { addBill, updateBill } = useBills();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode && initialData) {
      updateBill(initialData.id, formData);
    } else {
      addBill(formData);
    }
    
    // Reset form if not in edit mode
    if (!isEditMode) {
      setFormData(defaultFormData);
    }
    
    // Call onCancel which can be used to close dialogs or navigate away
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Edit Bill' : 'Add New Bill'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Bill Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="amount"
              label="Amount ($)"
              name="amount"
              type="number"
              InputProps={{ inputProps: { min: 0, step: "0.01" } }}
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="date"
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleSelectChange}
              >
                {BILL_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label="Notes (Optional)"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Paid"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              {onCancel && (
                <Button onClick={onCancel} variant="outlined">
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary">
                {isEditMode ? 'Update Bill' : 'Add Bill'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
