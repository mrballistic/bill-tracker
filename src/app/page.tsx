'use client';

import { Container, Typography, Box } from '@mui/material';
import BillForm from '@/components/bills/BillForm';
import BillTable from '@/components/bills/BillTable';
import { BillProvider } from '@/contexts/BillContext';

export default function Home() {
  return (
    <BillProvider>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bill Management
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Track and manage your financial obligations in one place.
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Bill
          </Typography>
          <BillForm />
        </Box>
        
        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Your Bills
          </Typography>
          <BillTable />
        </Box>
      </Container>
    </BillProvider>
  );
}
