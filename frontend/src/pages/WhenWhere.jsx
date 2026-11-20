import { Box, Container, Typography, Grid, Stack, Button } from '@mui/material';
import LocalParkingOutlinedIcon from '@mui/icons-material/LocalParkingOutlined';
import { useNavigate } from 'react-router-dom';
import { Eyebrow, Ornament, FadeImage, Reveal } from '../components';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

function PageHeader({ eyebrow, title, sub }) {
  return (
    <Box sx={{ textAlign: 'center', pt: { xs: 18, md: 22 }, mt: { xs: 0, md: 4 }, pb: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.6rem' }, color: COLORS.ink }}>
            {title}
          </Typography>
        </Reveal>
        {sub && (
          <Reveal delay={140}>
            <Typography variant="body1" sx={{ maxWidth: 560, mx: 'auto', mt: 3 }}>
              {sub}
            </Typography>
          </Reveal>
        )}
      </Container>
    </Box>
  );
}

function VenueHighlightBanner() {
  return (
    <Box sx={{ pb: { xs: 8, md: 10 }, px: 2 }}>
      <Container maxWidth="md">
        <Reveal delay={160}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, md: 5 },
              px: { xs: 3, md: 6 },
              backgroundColor: COLORS.creamDeep,
              borderTop: `1px solid ${COLORS.line}`,
              borderBottom: `1px solid ${COLORS.line}`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.65rem', md: '2.25rem' },
                color: COLORS.ink,
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.35,
                textWrap: 'balance',
              }}
            >
              {wedding.venueHighlight}
            </Typography>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}

function WhenWhereDetails() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 8, md: 6 }}
          alignItems="flex-start"
          justifyContent="center"
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '50%',
              top: '6%',
              bottom: '6%',
              width: '1px',
              background: COLORS.line,
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal
              sx={{
                textAlign: 'center',
                px: { xs: 1, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Eyebrow>Quando</Eyebrow>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.1rem', md: '2.9rem' }, color: COLORS.ink, mb: 2, textWrap: 'balance' }}>
                {wedding.dateLong}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: COLORS.ink,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontSize: '0.78rem',
                  fontWeight: 400,
                  mb: 3,
                }}
              >
                {wedding.ceremony}
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 440 }}>
                Celebraremos nossa união nessa tarde especial de domingo. Sugerimos chegar com alguns minutos de antecedência para se acomodar com tranquilidade antes do início da cerimônia às 15h.
              </Typography>
            </Reveal>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal
              delay={100}
              sx={{
                textAlign: 'center',
                px: { xs: 1, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Eyebrow>Onde</Eyebrow>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.1rem', md: '2.9rem' }, color: COLORS.ink, mb: 2 }}>
                {wedding.venue}
              </Typography>
              <Stack spacing={0.4} sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.ink,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                  }}
                >
                  {wedding.address1}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.taupe,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                  }}
                >
                  {wedding.address2}
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ maxWidth: 440, mb: 3 }}>
                {wedding.venueHighlight}
              </Typography>
              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                justifyContent="center"
                sx={{
                  px: 2.5,
                  py: 1.2,
                  border: `1px solid ${COLORS.line}`,
                  backgroundColor: COLORS.creamDeep,
                }}
              >
                <LocalParkingOutlinedIcon sx={{ fontSize: 18, color: COLORS.accent }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.SANS,
                    fontWeight: 400,
                    fontSize: '0.82rem',
                    letterSpacing: '0.08em',
                    color: COLORS.ink,
                  }}
                >
                  {wedding.parkingInfo}
                </Typography>
              </Stack>
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function VenueGallery({ onConfirm }) {
  return (
    <Box sx={{ backgroundColor: COLORS.creamDeep, py: { xs: 10, md: 15 }, mt: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Reveal sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Eyebrow>O Local</Eyebrow>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' }, color: COLORS.ink, mb: 2 }}>
            {wedding.venue}
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 560, mx: 'auto' }}>
            {wedding.venueHighlight} {wedding.parkingInfo}
          </Typography>
        </Reveal>

        <Grid container spacing={{ xs: 3.5, md: 5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal delay={80}>
              <FadeImage
                src={wedding.img.venue1}
                alt="Bassi Eventos — área externa e salão principal"
                ratio="4 / 3"
                position="center"
                sx={{ boxShadow: '0 30px 60px -42px rgba(28,27,25,.55)' }}
              />
            </Reveal>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal delay={160}>
              <FadeImage
                src={wedding.img.venue2}
                alt="Bassi Eventos — jardim arborizado e fachada"
                ratio="4 / 3"
                position="center"
                sx={{ boxShadow: '0 30px 60px -42px rgba(28,27,25,.55)' }}
              />
            </Reveal>
          </Grid>
        </Grid>

        <Reveal delay={200} sx={{ textAlign: 'center', mt: { xs: 7, md: 9 } }}>
          <Ornament sx={{ mb: 4 }} />
          <Button variant="contained" onClick={onConfirm} sx={{ px: 6 }}>
            Confirmar Presença
          </Button>
        </Reveal>
      </Container>
    </Box>
  );
}

export function WhenWhere() {
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Quando & Onde"
        title="A Celebração"
        sub="Tudo o que você precisa saber sobre a data, o horário e o local do nosso casamento em São José dos Campos."
      />
      <VenueHighlightBanner />
      <WhenWhereDetails />
      <VenueGallery onConfirm={() => go('/rsvp')} />
    </Box>
  );
}
