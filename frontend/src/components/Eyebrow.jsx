import { Typography } from '@mui/material';
import { COLORS, FONTS } from '../theme';

export function Eyebrow({ children, sx, color }) {
  return (
    <Typography
      component="div"
      sx={{
        fontFamily: FONTS.SANS,
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.42em',
        fontSize: { xs: '0.66rem', md: '0.72rem' },
        color: color || COLORS.accent,
        mb: 3,
        pl: '0.42em',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
