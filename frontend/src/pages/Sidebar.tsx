import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home as HomeIcon,
  Inventory as ProductIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!Cookies.get('user'));

  // Monitor cookie changes when pathname changes
  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('user'));
  }, [pathname]);

  const handleProfileAction = () => {
    if (isLoggedIn) {
      Cookies.remove('token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const menuItems: MenuItem[] = [
    { path: '/', icon: HomeIcon, label: 'Trang chủ' },
    { path: '/products', icon: ProductIcon, label: 'Sản phẩm' },
    { path: '/cart', icon: CartIcon, label: 'Giỏ hàng' },
    {
      path: isLoggedIn ? '/profile' : '/login',
      icon: PersonIcon,
      label: isLoggedIn ? 'Hồ sơ' : 'Đăng nhập',
      onClick: handleProfileAction,
    },
  ];

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: 'background.default',
        height: '100vh',
        p: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
      data-testid="sidebar"
    >
      {/* Logo */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, color: 'primary.main' }}
        >
          Coffee Shop
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ p: 0 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} sx={{ p: 0, mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={item.onClick}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s ease',
                  ...(isActive
                    ? {
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }
                    : {
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        },
                      }),
                }}
              >
                <ListItemIcon
                  sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'primary.main' : 'text.secondary',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;