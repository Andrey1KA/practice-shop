import Box from '@mui/material/Box';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import type { SxProps, Theme } from '@mui/material/styles';

interface ProductImagePlaceholderProps {
  sx?: SxProps<Theme>;
  iconSize?: number;
}

export function ProductImagePlaceholder({ sx, iconSize = 48 }: ProductImagePlaceholderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        color: 'action.active',
        ...sx,
      }}
    >
      <Inventory2OutlinedIcon sx={{ fontSize: iconSize }} />
    </Box>
  );
}
