import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Fade,
  Grow,
  FormHelperText,
} from '@mui/material';
import { Eyebrow, Ornament, Reveal } from '../components';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

const API_URL = import.meta.env.VITE_API_URL || '';

function Field(props) {
  return <TextField fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...props} />;
}

function ConfirmCard({ attending, name, onReset }) {
  return (
    <Grow in timeout={700}>
      <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            width: 84,
            height: 84,
            mx: 'auto',
            mb: 4,
            borderRadius: '50%',
            border: `1px solid ${COLORS.accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'popIn .8s cubic-bezier(.16,1,.3,1)',
          }}
        >
          <Box component="svg" viewBox="0 0 24 24" sx={{ width: 34, height: 34 }}>
            <path
              d="M5 12.5l4.2 4.2L19 7"
              fill="none"
              stroke={COLORS.accent}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: 'draw .9s .25s forwards ease' }}
            />
          </Box>
        </Box>
        <Eyebrow>{attending === 'yes' ? 'Mal podemos esperar' : 'Vamos sentir sua falta'}</Eyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, color: COLORS.ink, mb: 2.5 }}>
          Obrigado, {name || 'amigo(a)'}.
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 460, mx: 'auto', mb: 5 }}>
          {attending === 'yes'
            ? 'Sua confirmação foi recebida — ficamos muito felizes em saber que você estará conosco! Fique de olho no seu e-mail para informações sobre o evento.'
            : 'Obrigado por nos avisar. Sua ausência será sentida, mas brindaremos a você com muito carinho nessa noite.'}
        </Typography>
        <Button variant="outlined" onClick={onReset}>
          Editar Resposta
        </Button>
        <style>{`
          @keyframes draw { to { stroke-dashoffset: 0; } }
          @keyframes popIn { 0%{ transform: scale(.6); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }
        `}</style>
      </Box>
    </Grow>
  );
}

export function RSVP() {
  const [f, setF] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    meal: '',
    dietary: '',
    song: '',
    note: '',
  });
  const [err, setErr] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErr((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = 'Por favor, informe seu nome.';
    if (!f.email.trim()) e.email = 'Precisamos do seu e-mail para enviar os detalhes.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Esse e-mail não parece válido.';
    if (!f.attending) e.attending = 'Por favor, nos avise se você poderá comparecer.';
    if (f.attending === 'yes' && !f.meal) e.meal = 'Escolha uma opção de prato.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErr(e);

    if (Object.keys(e).length === 0) {
      setLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`${API_URL}/api/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: f.name.trim(),
            email: f.email.trim(),
            attending: f.attending,
            guests: parseInt(f.guests),
            meal: f.meal || null,
            dietary: f.dietary || null,
            song: f.song || null,
            note: f.note || null,
          }),
        });

        if (response.ok) {
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setApiError('Erro ao salvar RSVP. Por favor, tente novamente.');
        }
      } catch (error) {
        setApiError('Erro de conexão. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      const first = document.querySelector(`[name="${Object.keys(e)[0]}"]`);
      if (first) first.focus();
    }
  };

  const reset = () => setSubmitted(false);
  const going = f.attending === 'yes';

  return (
    <Box sx={{ pt: { xs: 17, md: 22 }, pb: { xs: 12, md: 18 } }}>
      <Container maxWidth="sm">
        {!submitted && (
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Reveal>
              <Eyebrow>Confirmação de Presença</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <Typography variant="h1" sx={{ fontSize: { xs: '3.2rem', md: '4.8rem' }, color: COLORS.ink }}>
                RSVP
              </Typography>
            </Reveal>
            <Reveal delay={140}>
              <Typography variant="body1" sx={{ maxWidth: 480, mx: 'auto', mt: 3 }}>
                Será uma honra ter você conosco. Se trouxer acompanhante ou tiver restrições alimentares, por favor informe abaixo.
              </Typography>
              <Ornament sx={{ my: 3 }} />
              <Typography sx={{ fontFamily: FONTS.SANS, fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: '0.74rem', color: COLORS.accent }}>
                Confirme até {wedding.rsvpBy}
              </Typography>
            </Reveal>
          </Box>
        )}

        {submitted ? (
          <ConfirmCard attending={f.attending} name={f.name.trim().split(' ')[0]} onReset={reset} />
        ) : (
          <Reveal delay={180} as="form">
            <Box component="form" onSubmit={submit} noValidate sx={{ '& .MuiTextField-root': { mb: 0 } }}>
              <Stack spacing={3.5}>
                {apiError && (
                  <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderLeft: `4px solid ${COLORS.accent}`, borderRadius: 1 }}>
                    <Typography sx={{ color: COLORS.ink, fontSize: '0.9rem' }}>{apiError}</Typography>
                  </Box>
                )}

                <Field label="Nome Completo" name="name" value={f.name} onChange={set('name')} error={!!err.name} helperText={err.name} placeholder="Seu nome completo" />

                <Field label="E-mail" name="email" value={f.email} onChange={set('email')} error={!!err.email} helperText={err.email} placeholder="seu@email.com" />

                <FormControl error={!!err.attending} component="fieldset">
                  <FormLabel
                    sx={{
                      fontFamily: FONTS.SANS,
                      fontWeight: 400,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      color: COLORS.taupe,
                      mb: 1.5,
                      '&.Mui-focused': { color: COLORS.taupe },
                    }}
                  >
                    Você poderá comparecer?
                  </FormLabel>
                  <RadioGroup name="attending" value={f.attending} onChange={set('attending')}>
                    {[
                      ['yes', 'Confirmo presença com alegria'],
                      ['no', 'Infelizmente não poderei comparecer'],
                    ].map(([v, l]) => (
                      <FormControlLabel
                        key={v}
                        value={v}
                        control={<Radio disableRipple sx={{ color: COLORS.line, '&.Mui-checked': { color: COLORS.ink } }} />}
                        label={<Typography sx={{ fontFamily: FONTS.DISPLAY, fontSize: '1.5rem', color: COLORS.ink }}>{l}</Typography>}
                      />
                    ))}
                  </RadioGroup>
                  {err.attending && <FormHelperText sx={{ ml: 0 }}>{err.attending}</FormHelperText>}
                </FormControl>

                <Fade in={going} unmountOnExit>
                  <Box>
                    <Stack spacing={3.5}>
                      <Field select label="Número de Convidados" name="guests" value={f.guests} onChange={set('guests')}>
                        {['1', '2', '3', '4'].map((n) => (
                          <MenuItem key={n} value={n}>
                            {n} {n === '1' ? 'convidado' : 'convidados'}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field select label="Preferência de Prato" name="meal" value={f.meal} onChange={set('meal')} error={!!err.meal} helperText={err.meal}>
                        {['Filé mignon ao molho', 'Salmão grelhado', 'Risoto de cogumelos (v)', 'Prato infantil'].map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field label="Restrições Alimentares" name="dietary" value={f.dietary} onChange={set('dietary')} placeholder="Alergias, intolerâncias ou algo que devemos saber" />
                      <Field label="Pedido Musical" name="song" value={f.song} onChange={set('song')} placeholder="A música que vai te levar à pista" />
                    </Stack>
                  </Box>
                </Fade>

                <Field label="Uma Mensagem para o Casal" name="note" value={f.note} onChange={set('note')} multiline minRows={3} placeholder="Opcional — deixe algumas palavras de carinho" />

                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 2, mt: 1 }}>
                  {loading ? 'Enviando...' : 'Enviar Confirmação'}
                </Button>
              </Stack>
            </Box>
          </Reveal>
        )}
      </Container>
    </Box>
  );
}
