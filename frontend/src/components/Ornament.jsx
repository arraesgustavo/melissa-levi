import { Box } from '@mui/material';
import { COLORS } from '../theme';

export function Ornament({ sx }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, my: 4, ...sx }}>
      <Box sx={{ width: 46, height: '1px', background: COLORS.line }} />
      <Box sx={{ width: 5, height: 5, transform: 'rotate(45deg)', border: `1px solid ${COLORS.accent}` }} />
      <Box sx={{ width: 46, height: '1px', background: COLORS.line }} />
    </Box>
  );
}
