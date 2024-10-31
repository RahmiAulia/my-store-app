import React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotificationModal = NiceModal.create(({ message }) => {
  const modal = useModal();
  const navigate = useNavigate();

  const handleClose = () => {
    modal.hide();
    navigate("/"); // Arahkan ke beranda setelah menutup modal
  };

  return (
    <Dialog open={modal.visible} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Notification</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} fullWidth>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default NotificationModal;
