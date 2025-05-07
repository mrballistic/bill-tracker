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
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
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
      <Typography variant="h6" component="h2" id="form-title" gutterBottom>
        {isEditMode ? 'Edit Bill' : 'Add New Bill'}
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
        aria-labelledby="form-title"
        sx={{
          '& .MuiFormControl-root': { 
            mb: 2 
          },
          '& .MuiButton-root': { 
            mt: 1,
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 8px)' } }}>
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
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              inputProps={{
                'aria-label': 'Bill name'
              }}
            />
            {errors.name && <span id="name-error" className="sr-only">{errors.name}</span>}
          </Box>
          
          <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 8px)' } }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="amount"
              label="Amount ($)"
              name="amount"
              type="number"
              InputProps={{ 
                inputProps: { 
                  min: 0, 
                  step: "0.01",
                  'aria-label': 'Bill amount in dollars'
                } 
              }}
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              aria-required="true"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
            {errors.amount && <span id="amount-error" className="sr-only">{errors.amount}</span>}
          </Box>
          
          <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 8px)' } }}>
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
              aria-required="true"
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "date-error" : undefined}
              inputProps={{
                'aria-label': 'Bill due date'
              }}
            />
            {errors.date && <span id="date-error" className="sr-only">{errors.date}</span>}
          </Box>
          
          <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 8px)' } }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleSelectChange}
                aria-label="Bill category"
                inputProps={{
                  'aria-label': 'Select bill category'
                }}
              >
                {BILL_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ flex: '0 0 100%' }}>
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
              aria-label="Additional notes about the bill"
            />
          </Box>
          
          <Box sx={{ flex: '0 0 100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  color="primary"
                  inputProps={{
                    'aria-label': 'Mark bill as paid'
                  }}
                />
              }
              label="Paid"
            />
          </Box>
          
          <Box sx={{ flex: '0 0 100%', display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            {onCancel && (
              <Button 
                onClick={onCancel} 
                variant="outlined"
                aria-label={isEditMode ? "Cancel editing bill" : "Cancel adding new bill"}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              aria-label={isEditMode ? "Update bill" : "Add new bill"}
            >
              {isEditMode ? 'Update Bill' : 'Add Bill'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
