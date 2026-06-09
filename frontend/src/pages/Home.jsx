import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Eyebrow, Ornament, FadeImage, Reveal } from '../components';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

function go(navigate, path) {
  navigate(path);
  window.scrollTo({ top: 0 });
}

function Hero({ navigate }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '92vh', md: '100vh' },
        minHeight: 560,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <FadeImage src={wedding.img.hero} alt="Melissa e Levi" position="center 40%" sx={{ position: 'absolute', inset: 0 }} />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(20,18,16,.46) 0%, rgba(20,18,16,.12) 32%, rgba(20,18,16,.22) 70%, rgba(20,18,16,.5) 100%)',
        }}
      />
      <Box sx={{ position: 'relative', color: '#F7F2E9', px: 3, animation: 'revealUp 1.1s cubic-bezier(.16,1,.3,1) .1s both' }}>
        <Typography
          component="div"
          sx={{
            fontFamily: FONTS.SANS,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
            fontSize: { xs: '0.66rem', md: '0.78rem' },
            color: '#ffffff',
            opacity: 0.92,
            mb: { xs: 2.5, md: 3.5 },
            pl: '0.5em',
            textShadow: '0 1px 18px rgba(0,0,0,.4)',
          }}
        >
          — {wedding.dateShort} —
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4.1rem', sm: '5.5rem', md: '8rem' },
            fontWeight: 300,
            lineHeight: 0.98,
            textShadow: '0 2px 40px rgba(0,0,0,.25)',
          }}
        >
          {wedding.bride}
          <Box component="span" sx={{ display: 'block', fontStyle: 'italic', fontSize: '0.62em', fontWeight: 300, my: { xs: 0.2, md: 0.4 } }}>
            &amp;
          </Box>
          {wedding.groom}
        </Typography>
        <Typography
          component="div"
          sx={{
            fontFamily: FONTS.SANS,
            fontWeight: 300,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            color: '#ffffff',
            mt: { xs: 3, md: 4 },
            opacity: 0.95,
            pl: '0.34em',
          }}
        >
          Vamos nos casar
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: 56,
          background: 'linear-gradient(#F7F2E9, transparent)',
          opacity: 0.7,
        }}
      />
    </Box>
  );
}

function Invitation() {
  return (
    <Box sx={{ py: { xs: 11, md: 18 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Reveal>
          <Eyebrow>Uma União Abençoada</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.9rem', md: '2.9rem' },
              color: COLORS.ink,
              fontWeight: 400,
              maxWidth: 880,
              mx: 'auto',
              lineHeight: 1.28,
              textWrap: 'balance',
            }}
          >
            Melissa e Levi têm a alegria de convidar você para celebrar o casamento deles, na presença de família e amigos queridos.
          </Typography>
        </Reveal>
        <Reveal delay={160}>
          <Ornament />
        </Reveal>
        <Reveal delay={200}>
          <Typography variant="body1" sx={{ maxWidth: 560, mx: 'auto' }}>
            Começaremos com uma cerimônia no jardim, e em seguida reuniremos todos para uma noite de jantar, dança e muita celebração.
          </Typography>
        </Reveal>
      </Container>
    </Box>
  );
}

function WhenWhereStrip({ navigate }) {
  const Col = ({ label, title, lines, href }) => (
    <Grid item xs={12} md={6}>
      <Reveal sx={{ textAlign: 'center', px: { xs: 0, md: 4 } }}>
        <Eyebrow>{label}</Eyebrow>
        <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, color: COLORS.ink, mb: 2 }}>
          {title}
        </Typography>
        {lines.map((l, i) => (
          <Typography key={i} variant="body1" sx={{ mb: 0.2 }}>
            {l}
          </Typography>
        ))}
        <Button variant="outlined" sx={{ mt: 4 }} onClick={() => go(navigate, '/quando-onde')}>
          Ver Detalhes
        </Button>
      </Reveal>
    </Grid>
  );

  return (
    <Box sx={{ backgroundColor: COLORS.creamDeep, py: { xs: 11, md: 16 } }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 8, md: 4 }}
          alignItems="flex-start"
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '50%',
              top: '8%',
              bottom: '8%',
              width: '1px',
              background: COLORS.line,
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Col label="Quando" title={wedding.dateLong} lines={[wedding.ceremony, wedding.reception]} />
          <Col label="Onde" title={wedding.venue} lines={[wedding.address1, wedding.address2]} />
        </Grid>
      </Container>
    </Box>
  );
}

function Accommodations({ navigate }) {
  return (
    <Box sx={{ py: { xs: 11, md: 18 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Reveal>
              <FadeImage src={wedding.img.venue} alt="Local do evento" ratio="4 / 5" sx={{ boxShadow: '0 30px 60px -40px rgba(28,27,25,.5)' }} />
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <Reveal delay={120} sx={{ pl: { md: 4 } }}>
              <Eyebrow>Hospedagem</Eyebrow>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, color: COLORS.ink, mb: 3 }}>
                A ser definido
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Em breve divulgaremos as opções de hospedagem recomendadas para nossos convidados em São José dos Campos. Fique de olho — as informações serão atualizadas aqui.
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.ink, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.72rem', mb: 4 }}>
                São José dos Campos · São Paulo, Brasil
              </Typography>
              <Button variant="outlined" onClick={() => go(navigate, '/quando-onde')}>
                Mais Detalhes
              </Button>
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Registry({ navigate }) {
  return (
    <Box sx={{ backgroundColor: COLORS.creamDeep, py: { xs: 11, md: 18 }, textAlign: 'center' }}>
      <Container maxWidth="sm">
        <Reveal>
          <Eyebrow>Lista de Presentes</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, color: COLORS.ink, mb: 3 }}>
            Sua presença é o presente
          </Typography>
        </Reveal>
        <Reveal delay={140}>
          <Typography variant="body1" sx={{ maxWidth: 540, mx: 'auto', mb: 7 }}>
            Muitos de vocês virão de longe para celebrar conosco, e isso já é um presente enorme. Se ainda assim quiserem nos presentear, preparamos uma lista com muito carinho na Amazon.
          </Typography>
        </Reveal>
        <Reveal delay={200}>
          <Box component="a" href={wedding.registryUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', textDecoration: 'none' }}>
            <Box
              sx={{
                border: `1px solid ${COLORS.ink}`,
                px: { xs: 4, md: 7 },
                py: { xs: 1.8, md: 2.5 },
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.SANS,
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
                color: COLORS.ink,
                transition: 'all .4s ease',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                '&:hover': { backgroundColor: COLORS.ink, color: COLORS.cream },
              }}
            >
              Ver Lista na Amazon
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}

function ClosingCTA({ navigate }) {
  return (
    <Box sx={{ position: 'relative', py: { xs: 14, md: 22 }, textAlign: 'center', overflow: 'hidden' }}>
      <FadeImage src={wedding.img.cta} alt="" position="center 60%" sx={{ position: 'absolute', inset: 0 }} />
      <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,.5)' }} />
      <Container maxWidth="md" sx={{ position: 'relative', color: '#F7F2E9' }}>
        <Reveal>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.6rem', md: '4.2rem' }, fontWeight: 300, lineHeight: 1.12, mb: 5, textWrap: 'balance' }}>
            Esperamos muito celebrar esse dia especial com você.
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: '#F7F2E9', color: COLORS.ink, px: 6, '&:hover': { backgroundColor: '#fff' } }} onClick={() => go(navigate, '/rsvp')}>
            Confirmar Presença
          </Button>
        </Reveal>
      </Container>
    </Box>
  );
}

export function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <Hero navigate={navigate} />
      <Invitation />
      <WhenWhereStrip navigate={navigate} />
      <Accommodations navigate={navigate} />
      <Registry navigate={navigate} />
      <ClosingCTA navigate={navigate} />
    </Box>
  );
}
