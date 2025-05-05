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
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';

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
      <Typography variant="h6" sx={{ my: 2 }}>
      💸 Financial Bill Tracker
      </Typography>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.name}
            component={NextLink as React.ElementType}
            href={item.href}
            selected={pathname === item.href}
            sx={{
              textDecoration: 'none', 
              color: 'inherit',
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" component="nav" sx={{ flexShrink: 0 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
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
                    component="div"
                    sx={{ 
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    💸 Financial Bill Tracker
                  </Typography>
                  
                  {/* Right-aligned navigation links */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'flex-end'
                  }}>
                    {navigationItems.map((item) => (
                      <Button
                        key={item.name}
                        component={NextLink as React.ElementType}
                        href={item.href}
                        sx={{ 
                          my: 2, 
                          color: 'white', 
                          display: 'block',
                          backgroundColor: pathname === item.href ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          },
                          textDecoration: 'none',
                          justifyContent: 'center',
                          ml: 1 // Add margin-left to create some space between buttons
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
