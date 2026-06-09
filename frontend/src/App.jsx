import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { NavBar } from './layout/NavBar';
import { Footer } from './layout/Footer';
import { Home } from './pages/Home';
import { WhenWhere } from './pages/WhenWhere';
import { RSVP } from './pages/RSVP';
import { COLORS } from './theme';

const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; }
  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    overflow-x: hidden;
  }
  html, body, #root { margin: 0; padding: 0; }
  body {
    background: ${COLORS.cream};
    overflow-x: hidden;
    padding-bottom: env(safe-area-inset-bottom);
  }
  button, a, [role="button"] {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  input, select, textarea {
    font-size: 16px !important;
  }
  .MuiOutlinedInput-input, .MuiSelect-select {
    font-size: 16px !important;
  }
  .reveal { }
  .reveal.in { animation: revealUp 0.9s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal.in { animation: none; }
  }
  @media (max-width: 375px) {
    .MuiTypography-root { letter-spacing: 0.01em !important; }
  }
  ::selection { background: ${COLORS.ink}; color: ${COLORS.cream}; }
  @keyframes draw { to { stroke-dashoffset: 0; } }
  @keyframes popIn { 0%{ transform: scale(.6); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{globalStyles}</style>
      <Router>
        <Box sx={{ backgroundColor: COLORS.cream, minHeight: '100vh', overflowX: 'hidden' }}>
          <NavBar />
          <Box>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quando-onde" element={<WhenWhere />} />
              <Route path="/rsvp" element={<RSVP />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}
