import { Box, Container, Typography, Grid, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Eyebrow, FadeImage, Reveal } from '../components';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

function PageHeader({ eyebrow, title, sub }) {
  return (
    <Box sx={{ textAlign: 'center', pt: { xs: 18, md: 22 }, mt: { xs: 0, md: 6 }, pb: { xs: 2, md: 4 } }}>
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
    </Box>
  );
}

function DetailBlock({ label, title, lines, body, action, reverse, img, pos }) {
  return (
    <Grid
      container
      spacing={{ xs: 5, md: 10 }}
      alignItems="center"
      direction={{ xs: 'column-reverse', md: reverse ? 'row-reverse' : 'row' }}
    >
      <Grid item xs={12} md={6}>
        <Reveal sx={{ px: { md: reverse ? 0 : 2 } }}>
          <Eyebrow>{label}</Eyebrow>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3.1rem' }, color: COLORS.ink, mb: 2 }}>
            {title}
          </Typography>
          {lines && (
            <Stack spacing={0.3} sx={{ mb: 3 }}>
              {lines.map((l, i) => (
                <Typography key={i} variant="body2" sx={{ color: COLORS.ink, letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  {l}
                </Typography>
              ))}
            </Stack>
          )}
          <Typography variant="body1" sx={{ maxWidth: 480 }}>
            {body}
          </Typography>
          {action && (
            <Button variant="outlined" sx={{ mt: 4 }} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </Reveal>
      </Grid>
      <Grid item xs={12} md={6}>
        <Reveal delay={120}>
          <FadeImage src={img} alt={title} ratio="4 / 3" position={pos} sx={{ boxShadow: '0 30px 60px -42px rgba(28,27,25,.55)' }} />
        </Reveal>
      </Grid>
    </Grid>
  );
}

function Schedule() {
  const items = [
    { time: '15h30', name: 'Chegada dos Convidados', note: 'Boas-vindas e drinques no jardim' },
    { time: '16h00', name: 'Cerimônia', note: 'No jardim' },
    { time: '17h00', name: 'Coquetel', note: 'Terraço e áreas externas' },
    { time: '18h00', name: 'Jantar & Brindes', note: 'Salão principal' },
    { time: '20h00', name: 'Pista de Dança', note: 'Até às 23h' },
  ];

  return (
    <Box sx={{ backgroundColor: COLORS.creamDeep, py: { xs: 11, md: 16 } }}>
      <Container maxWidth="sm">
        <Reveal sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Eyebrow>A Programação</Eyebrow>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, color: COLORS.ink }}>
            Ordem dos Eventos
          </Typography>
        </Reveal>
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 70}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: { xs: 2.5, md: 4 },
                py: 2.6,
                borderTop: `1px solid ${COLORS.line}`,
                ...(i === items.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : {}),
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.SANS,
                  fontWeight: 400,
                  letterSpacing: '0.14em',
                  color: COLORS.accent,
                  fontSize: '0.82rem',
                  width: { xs: 78, md: 96 },
                  flexShrink: 0,
                }}
              >
                {it.time}
              </Typography>
              <Box>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, color: COLORS.ink, lineHeight: 1.2 }}>
                  {it.name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.2 }}>
                  {it.note}
                </Typography>
              </Box>
            </Box>
          </Reveal>
        ))}
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
        sub="Tudo o que você precisa saber para nos acompanhar em São José dos Campos."
      />
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <DetailBlock
          label="Quando"
          title={wedding.dateLong}
          lines={[wedding.ceremony, wedding.reception]}
          img={wedding.img.cta}
          pos="center 55%"
          body="Junte-se a nós nessa noite especial de julho enquanto declaramos nossos votos. A cerimônia começa pontualmente às 16h — sugerimos chegar às 15h30 para se acomodar e tomar uma bebida de boas-vindas."
        />
        <Box sx={{ height: { xs: 64, md: 120 } }} />
        <DetailBlock
          reverse
          label="Onde"
          title="A ser definido"
          lines={['São José dos Campos · São Paulo, Brasil']}
          img={wedding.img.venue}
          pos="center"
          body="O local está sendo cuidadosamente escolhido para que a noite seja inesquecível. Em breve divulgaremos o endereço completo e todas as informações de acesso para os convidados."
          action={{ label: 'Confirmar Presença', onClick: () => go('/rsvp') }}
        />
      </Container>

      <Schedule />

      <Box sx={{ py: { xs: 11, md: 16 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Reveal>
            <Eyebrow>Hospedagem</Eyebrow>
            <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, color: COLORS.ink, mb: 3 }}>
              A ser definido
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Em breve compartilharemos opções de hospedagem recomendadas em São José dos Campos. Fique de olho — as informações serão divulgadas aqui assim que estiverem confirmadas.
            </Typography>
            <Stack spacing={0.4} sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: COLORS.ink }}>
                São José dos Campos · São Paulo, Brasil
              </Typography>
            </Stack>
            <Button variant="outlined" onClick={() => go('/rsvp')}>
              Confirmar Presença
            </Button>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}
