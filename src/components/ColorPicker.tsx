import React from 'react';
import { Box, Button, Popover, Grid } from '@mui/material';

const defaultColors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
  '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  '#795548', '#607d8b'
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          minWidth: 36,
          width: 36,
          height: 36,
          p: 0,
          bgcolor: value,
          '&:hover': {
            bgcolor: value,
            opacity: 0.8,
          },
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            {defaultColors.map((color) => (
              <Grid item key={color}>
                <Button
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    p: 0,
                    bgcolor: color,
                    '&:hover': {
                      bgcolor: color,
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => {
                    onChange(color);
                    handleClose();
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  );
};