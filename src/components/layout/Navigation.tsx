'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';

// Skip link styling to make it visible only when focused
const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  top: '-40px',
  left: 0,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  zIndex: theme.zIndex.tooltip,
  transition: 'top 0.2s',
  textDecoration: 'none',
  '&:focus': {
    top: 0,
  },
}));

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Bill Management',
    href: '/',
    icon: <HomeIcon />
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: <InsightsIcon />
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" component="h2" sx={{ my: 2 }}>
      💸 Financial Bill Tracker
      </Typography>
      <List role="menu" aria-label="navigation options">
        {navigationItems.map((item) => (
          <ListItem 
            key={item.name}
            component={NextLink as React.ElementType}
            href={item.href}
            selected={pathname === item.href}
            role="menuitem"
            aria-current={pathname === item.href ? "page" : undefined}
            sx={{
              textDecoration: 'none', 
              color: 'inherit',
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              },
            }}
          >
            <ListItemIcon aria-hidden="true">{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Skip link for keyboard navigation */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      
      <AppBar position="static" component="nav" sx={{ flexShrink: 0 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open navigation menu"
                  aria-expanded={drawerOpen}
                  aria-controls="mobile-navigation-menu"
                  sx={{ mr: 2 }}
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="h1"
                  sx={{ flexGrow: 1 }}
                >
                  💸 Financial Bill Tracker
                </Typography>
              </>
            ) : (
              <>
                {/* Flex container with 3 sections: empty space, title, navigation */}
                <Box sx={{ 
                  display: 'flex', 
                  width: '100%', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  {/* Left empty space to balance the layout */}
                  <Box sx={{ flex: 1 }} />
                  
                  {/* Centered title */}
                  <Typography
                    variant="h6"
                    noWrap
                    component="h1"
                    sx={{ 
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    💸 Financial Bill Tracker
                  </Typography>
                  
                  {/* Right-aligned navigation links */}
                  <Box 
                    component="nav" 
                    aria-label="main navigation"
                    sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      justifyContent: 'flex-end'
                    }}
                  >
                    {navigationItems.map((item) => (
                      <Button
                        key={item.name}
                        component={NextLink as React.ElementType}
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        sx={{ 
                          my: 2, 
                          color: 'white', 
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: pathname === item.href ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid white',
                            outlineOffset: '2px',
                          },
                          textDecoration: 'none',
                          ml: 1, // Add margin-left to create some space between buttons
                          // Target the startIcon to improve alignment
                          '& .MuiButton-startIcon': {
                            marginRight: '4px', // Reduce space between icon and text
                            marginLeft: 0,
                            display: 'flex',
                            alignItems: 'center'
                          },
                          // Create more balanced appearance
                          justifyContent: 'center',
                          gap: 1
                        }}
                        startIcon={item.icon}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        id="mobile-navigation-menu"
        aria-label="mobile navigation"
        anchor="left"
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: 240 
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
