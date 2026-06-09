import { createTheme } from '@mui/material/styles';

export const COLORS = {
  cream: '#F4EEE3',
  creamDeep: '#ECE3D4',
  ink: '#1C1B19',
  taupe: '#7A6F60',
  line: '#CDC2AE',
  accent: '#8A6F52',
};

export const FONTS = {
  DISPLAY: '"Cormorant Garamond", Georgia, serif',
  SANS: '"Jost", "Helvetica Neue", Arial, sans-serif',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: COLORS.cream, paper: COLORS.cream },
    text: { primary: COLORS.ink, secondary: COLORS.taupe },
    primary: { main: COLORS.ink },
    divider: COLORS.line,
  },
  typography: {
    fontFamily: FONTS.SANS,
    h1: { fontFamily: FONTS.DISPLAY, fontWeight: 400, letterSpacing: '0.005em', lineHeight: 1.02 },
    h2: { fontFamily: FONTS.DISPLAY, fontWeight: 400, lineHeight: 1.08 },
    h3: { fontFamily: FONTS.DISPLAY, fontWeight: 400, lineHeight: 1.12 },
    h4: { fontFamily: FONTS.DISPLAY, fontWeight: 400, lineHeight: 1.2 },
    h5: { fontFamily: FONTS.DISPLAY, fontWeight: 400, lineHeight: 1.3 },
    body1: { fontFamily: FONTS.SANS, fontWeight: 300, fontSize: '1.0625rem', lineHeight: 1.95, letterSpacing: '0.01em', color: COLORS.taupe },
    body2: { fontFamily: FONTS.SANS, fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, letterSpacing: '0.01em', color: COLORS.taupe },
    button: { fontFamily: FONTS.SANS, fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: '0.72rem' },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: COLORS.cream } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 0,
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 30,
          paddingRight: 30,
          minHeight: 44,
          transition: 'all .4s ease',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        },
        outlined: {
          borderColor: COLORS.ink,
          color: COLORS.ink,
          borderWidth: 1,
          '&:hover': { backgroundColor: COLORS.ink, color: COLORS.cream, borderColor: COLORS.ink },
        },
        contained: {
          backgroundColor: COLORS.ink,
          color: COLORS.cream,
          '&:hover': { backgroundColor: '#000' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: COLORS.line },
          '&:hover fieldset': { borderColor: COLORS.taupe },
          '&.Mui-focused fieldset': { borderColor: COLORS.ink, borderWidth: 1 },
        },
        input: { fontFamily: FONTS.SANS, fontWeight: 300, color: COLORS.ink, fontSize: '1rem' },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: FONTS.SANS, fontWeight: 300, color: COLORS.taupe } } },
    MuiSelect: {
      styleOverrides: { select: { fontSize: '1rem' } },
    },
    MuiMenuItem: {
      styleOverrides: { root: { minHeight: 44 } },
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: { minHeight: 44, alignItems: 'center' },
        label: { paddingTop: 2, paddingBottom: 2 },
      },
    },
  },
});

export default theme;
