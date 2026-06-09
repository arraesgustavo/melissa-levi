import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, IconButton, Drawer, Stack, Button, useMediaQuery } from '@mui/material';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

const NAV = [
  { label: 'Quando & Onde', path: '/quando-onde' },
  { label: 'Confirmar Presença', path: '/rsvp' },
];

function Burger({ open }) {
  const bar = (t) => ({
    position: 'absolute',
    left: 0,
    width: 22,
    height: '1.4px',
    background: 'currentColor',
    transition: 'transform .35s ease, opacity .35s ease',
    ...t,
  });
  return (
    <Box sx={{ position: 'relative', width: 22, height: 14 }}>
      <Box sx={bar({ top: open ? 6 : 0, transform: open ? 'rotate(45deg)' : 'none' })} />
      <Box sx={bar({ top: 6, opacity: open ? 0 : 1 })} />
      <Box sx={bar({ top: open ? 6 : 12, transform: open ? 'rotate(-45deg)' : 'none' })} />
    </Box>
  );
}

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:899px)');

  const isHome = location.pathname === '/';
  const overHero = isHome && !scrolled;
  const fg = overHero ? '#F7F2E9' : COLORS.ink;

  const go = (path) => {
    setOpen(false);
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const NavLink = ({ item, active }) => (
    <Box
      component="button"
      onClick={() => go(item.path)}
      sx={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: fg,
        p: 0,
        fontFamily: FONTS.SANS,
        fontWeight: 400,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontSize: '0.72rem',
        position: 'relative',
        transition: 'color .3s ease',
        whiteSpace: 'nowrap',
        minHeight: 44,
        display: 'inline-flex',
        alignItems: 'center',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: -6,
          height: '1px',
          width: active ? '100%' : 0,
          background: 'currentColor',
          transition: 'width .4s ease',
        },
        '&:hover::after': { width: '100%' },
      }}
    >
      {item.label}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          transition: 'background .5s ease, box-shadow .5s ease, padding .4s ease',
          backgroundColor: overHero ? 'transparent' : 'rgba(244,238,227,.92)',
          backdropFilter: overHero ? 'none' : 'saturate(140%) blur(8px)',
          boxShadow: overHero ? 'none' : '0 1px 0 rgba(205,194,174,.6)',
          py: overHero ? { xs: 2.5, md: 3.5 } : { xs: 1.8, md: 2.2 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: fg }}>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              {isMobile ? (
                <IconButton onClick={() => setOpen(true)} sx={{ color: fg, ml: -1 }}>
                  <Burger open={open} />
                </IconButton>
              ) : (
                <NavLink item={NAV[0]} active={location.pathname === NAV[0].path} />
              )}
            </Box>
            <Box
              component="button"
              onClick={() => go('/')}
              sx={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: fg,
                px: 2,
                fontFamily: FONTS.DISPLAY,
                fontWeight: 400,
                whiteSpace: 'nowrap',
                fontSize: { xs: '1.4rem', md: '1.85rem' },
                letterSpacing: '0.04em',
                lineHeight: 1,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              {wedding.couple}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {isMobile ? (
                <Box sx={{ width: 40 }} />
              ) : (
                <NavLink item={NAV[1]} active={location.pathname === NAV[1].path} />
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Drawer
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { backgroundColor: COLORS.cream, backgroundImage: 'none', pt: 12, pb: 6 } }}
      >
        <Stack spacing={1} alignItems="center" sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', top: -64, right: 16, color: COLORS.ink }}
          >
            <Burger open />
          </IconButton>
          {[{ label: 'Início', path: '/' }, ...NAV].map((item) => (
            <Button
              key={item.path}
              onClick={() => go(item.path)}
              sx={{
                fontFamily: FONTS.DISPLAY,
                textTransform: 'none',
                letterSpacing: '0.02em',
                fontSize: '2rem',
                color: COLORS.ink,
                py: 1.2,
                minHeight: 56,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </>
  );
}
