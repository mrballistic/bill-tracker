import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/components/theme/ThemeRegistry';
import Navigation from '@/components/layout/Navigation';
import { Box, Container } from '@mui/material';
import { BillProvider } from '@/contexts/BillContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financial Bill Tracker",
  description: "Track and analyze your bills and expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/bill-tracker/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/bill-tracker/favicon-96x96.png" />
        <link rel="manifest" href="/bill-tracker/site.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <BillProvider>
            {/* Skip to main content link */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              <Container 
                component="main"
                id="main-content"
                tabIndex={-1}
                sx={{ 
                  flexGrow: 1, 
                  py: 3,
                  // Focus styling for skip link navigation
                  '&:focus': {
                    outline: 'none',
                  } 
                }}
              >
                {children}
              </Container>
            </Box>
          </BillProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
