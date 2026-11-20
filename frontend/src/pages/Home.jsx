import { useState } from 'react';
import { Box, Container, Typography, Grid, Button, Stack, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import { Eyebrow, Ornament, FadeImage, Reveal } from '../components';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

function go(navigate, path) {
  navigate(path);
  window.scrollTo({ top: 0 });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) {
    throw new Error('Clipboard copy failed');
  }
}

function Hero() {
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
        backgroundColor: '#FAF7F1',
      }}
    >
      <FadeImage
        src={wedding.img.hero}
        alt="Melissa e Levi"
        position="center"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'transparent',
          mixBlendMode: 'multiply',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 68% 54% at 50% 50%, rgba(250,247,241,.92) 0%, rgba(250,247,241,.76) 46%, rgba(250,247,241,.22) 80%, rgba(250,247,241,0) 100%)',
            'linear-gradient(180deg, rgba(250,247,241,.84) 0%, rgba(250,247,241,.28) 16%, rgba(250,247,241,0) 30%)',
            `linear-gradient(0deg, ${COLORS.cream} 0%, rgba(244,238,227,.55) 9%, rgba(244,238,227,0) 22%)`,
          ].join(', '),
        }}
      />
      <Box sx={{ position: 'relative', color: COLORS.ink, px: 3, animation: 'revealUp 1.1s cubic-bezier(.16,1,.3,1) .1s both' }}>
        <Typography
          component="div"
          sx={{
            fontFamily: FONTS.SANS,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
            fontSize: { xs: '0.66rem', md: '0.78rem' },
            color: COLORS.ink,
            opacity: 0.78,
            mb: { xs: 2.5, md: 3.5 },
            pl: '0.5em',
            textShadow: '0 1px 16px rgba(250,247,241,.9)',
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
            color: COLORS.ink,
            textShadow: '0 2px 28px rgba(250,247,241,.95)',
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
            fontWeight: 400,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            color: COLORS.ink,
            mt: { xs: 3, md: 4 },
            opacity: 0.82,
            pl: '0.34em',
            textShadow: '0 1px 16px rgba(250,247,241,.9)',
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
          background: `linear-gradient(${COLORS.ink}, transparent)`,
          opacity: 0.45,
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
      </Container>
    </Box>
  );
}

function InfoColumn({ label, title, lines, onAction }) {
  return (
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
        <Eyebrow>{label}</Eyebrow>
        <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, color: COLORS.ink, mb: 2, textWrap: 'balance' }}>
          {title}
        </Typography>
        {lines.map((line, i) => (
          <Typography key={i} variant="body1" sx={{ mb: 0.25, maxWidth: 420 }}>
            {line}
          </Typography>
        ))}
        <Button variant="outlined" sx={{ mt: 4 }} onClick={onAction}>
          Ver Detalhes
        </Button>
      </Reveal>
    </Grid>
  );
}

function WhenWhereStrip({ navigate }) {
  const goToDetails = () => go(navigate, '/quando-onde');

  return (
    <Box sx={{ backgroundColor: COLORS.creamDeep, py: { xs: 11, md: 16 } }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 8, md: 4 }}
          alignItems="flex-start"
          justifyContent="center"
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
          <InfoColumn
            label="Quando"
            title={wedding.dateLong}
            lines={[wedding.ceremony]}
            onAction={goToDetails}
          />
          <InfoColumn
            label="Onde"
            title={wedding.venue}
            lines={[wedding.address1, wedding.address2]}
            onAction={goToDetails}
          />
        </Grid>
      </Container>
    </Box>
  );
}

const registryActionSx = {
  border: `1px solid ${COLORS.ink}`,
  px: { xs: 3.5, md: 5 },
  py: { xs: 1.8, md: 2.2 },
  minHeight: 48,
  minWidth: { xs: '100%', sm: 240 },
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1.2,
  fontFamily: FONTS.SANS,
  fontWeight: 400,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  fontSize: '0.72rem',
  color: COLORS.ink,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all .35s ease',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  '&:hover': { backgroundColor: COLORS.ink, color: COLORS.cream },
};

function Registry() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const handleCopyPix = async () => {
    try {
      await copyTextToClipboard(wedding.pixKey);
      setCopied(true);
      setToast({
        open: true,
        severity: 'success',
        message: 'Chave PIX copiada com sucesso!',
      });
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setToast({
        open: true,
        severity: 'error',
        message: 'Não foi possível copiar a chave PIX automaticamente.',
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: COLORS.cream, py: { xs: 11, md: 18 }, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Reveal>
          <Eyebrow>Lista de Presentes</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, color: COLORS.ink, mb: 3 }}>
            Sua presença é o nosso maior presente
          </Typography>
        </Reveal>
        <Reveal delay={140}>
          <Typography variant="body1" sx={{ maxWidth: 580, mx: 'auto', mb: 6 }}>
            Celebrar esse momento ao lado de quem amamos já significa tudo para nós. Se desejar nos abençoar com um presente, preparamos nossa lista na Amazon e também disponibilizamos a opção de contribuição via PIX.
          </Typography>
        </Reveal>
        <Reveal delay={200}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2.5}
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: 560, mx: 'auto' }}
          >
            <Box
              component="a"
              href={wedding.registryUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={registryActionSx}
            >
              Ver Lista na Amazon
            </Box>
            <Box
              component="button"
              type="button"
              onClick={handleCopyPix}
              sx={{
                ...registryActionSx,
                backgroundColor: copied ? COLORS.ink : 'transparent',
                color: copied ? COLORS.cream : COLORS.ink,
              }}
            >
              {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
              {copied ? 'Chave PIX Copiada' : 'Presentear via PIX'}
            </Box>
          </Stack>
        </Reveal>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: 0,
            backgroundColor: toast.severity === 'success' ? COLORS.ink : '#8c2f2f',
            color: COLORS.cream,
            fontFamily: FONTS.SANS,
            letterSpacing: '0.04em',
            '& .MuiAlert-icon': { color: COLORS.cream },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
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
      <Hero />
      <Invitation />
      <WhenWhereStrip navigate={navigate} />
      <Registry />
      <ClosingCTA navigate={navigate} />
    </Box>
  );
}
