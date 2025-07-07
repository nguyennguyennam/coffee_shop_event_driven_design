import React from 'react';
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
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/pages/sidebar.css'; // Import sidebar CSS to apply .sidebar h2 styles

interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const Sidebar: React.FC = () => {
  const menuItems: MenuItem[] = [
    { path: '/', icon: HomeIcon, label: 'Trang chủ' },
    { path: '/products', icon: ProductIcon, label: 'Sản phẩm' },
    { path: '/cart', icon: CartIcon, label: 'Giỏ hàng' },
    { path: '/login', icon: PersonIcon, label: 'Đăng nhập' },
  ];

  const { pathname } = useLocation();

  return (
    <div className="sidebar">
      {/* Logo */}
      <h2 className='sidebar-header'>
          Coffee Shop
      </h2>


      {/* Menu Items */}
      <List sx={{ p: 0 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} sx={{ p: 0, mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
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
                    : { '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }),
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
    </div>
  );
};

export default Sidebar;

