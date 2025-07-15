import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material';
import { io } from 'socket.io-client';

export default function CustomerNotification() {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Connect to the Shipper's socket server (adjust URL as needed)
    const socket = io("http://localhost:3006");
    socket.on("customerNotification", (data) => {
      // Data example: { orderId, customerId, message }
      setNotification(data.message);
      setOpen(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleClose = (_event: React.SyntheticEvent<Element, Event> | Event, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert severity="info" sx={{ width: '100%' }}>
        {notification}
      </Alert>
    </Snackbar>
  );
}
