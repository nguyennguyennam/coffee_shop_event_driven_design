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

  // Theo dõi thay đổi cookie mỗi khi pathname thay đổi
  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('user'));
  }, [pathname]);

  const handleProfileAction = () => {
    if (isLoggedIn) {
      // Xử lý đăng xuất
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
      onClick: handleProfileAction
    },
  ];

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 280 },
        height: '100vh',
        background: 'linear-gradient(180deg, #F5F5F5 0%, #E8E8E8 100%)',
        p: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center' }}>
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
                    : { '&:hover': { 
                        transform: 'translateY(-1px)', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                      } 
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