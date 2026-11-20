import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

const NAV = [
  { label: 'Início', path: '/' },
  { label: 'Quando & Onde', path: '/quando-onde' },
  { label: 'Confirmar Presença', path: '/rsvp' },
];

export function Footer() {
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  return (
    <Box component="footer" sx={{ backgroundColor: COLORS.ink, color: '#E9E0CF', py: { xs: 9, md: 12 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography
          sx={{
            fontFamily: FONTS.SANS,
            fontWeight: 400,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            fontSize: '0.66rem',
            color: COLORS.accent,
            mb: 2.5,
            pl: '0.42em',
          }}
        >
          — {wedding.dateShort} —
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.DISPLAY,
            fontSize: { xs: '2.6rem', md: '3.6rem' },
            fontWeight: 300,
            mb: 1,
            color: '#F7F2E9',
          }}
        >
          {wedding.couple}
        </Typography>
        <Typography variant="body2" sx={{ color: '#A99F8C', mb: 4 }}>
          {wedding.venue} · {wedding.address2}
        </Typography>
        <Box
          component="nav"
          aria-label="Navegação do rodapé"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
            alignItems: 'center',
            justifyItems: 'center',
            rowGap: 0.5,
            columnGap: { sm: 4 },
            mb: 5,
          }}
        >
          {NAV.map((item, index) => (
            <Box
              key={item.path}
              component="button"
              type="button"
              onClick={() => go(item.path)}
              sx={{
                justifySelf: {
                  xs: 'center',
                  sm: index === 0 ? 'end' : index === 2 ? 'start' : 'center',
                },
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#E9E0CF',
                fontFamily: FONTS.SANS,
                fontWeight: 300,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontSize: '0.68rem',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                opacity: 0.85,
                '&:hover': { opacity: 1 },
                minHeight: 44,
                minWidth: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                p: 0,
                px: 1,
                pl: 'calc(8px + 0.2em)',
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>
        <Typography
          sx={{
            fontFamily: FONTS.SANS,
            fontWeight: 300,
            fontSize: '0.64rem',
            letterSpacing: '0.14em',
            pl: '0.14em',
            color: '#7E7565',
            textTransform: 'uppercase',
          }}
        >
          Com amor, em São José dos Campos
        </Typography>
      </Container>
    </Box>
  );
}
