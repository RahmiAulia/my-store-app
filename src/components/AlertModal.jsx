// src/components/AlertModal.js
import React from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const AlertModal = NiceModal.create(({ message, isSuccess }) => {
  const modal = useModal();

  return (
    <Dialog open={modal.visible} onClose={() => modal.hide()}>
      <DialogTitle>{isSuccess ? "Success" : "Error"}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => modal.hide()} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AlertModal;
