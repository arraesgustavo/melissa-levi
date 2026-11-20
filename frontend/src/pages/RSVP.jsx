import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Eyebrow, Ornament, Reveal } from '../components';
import { COLORS, FONTS } from '../theme';
import { wedding } from '../data/wedding';

const GUEST_OPTIONS = ['1', '2', '3', '4'];
const CHILD_OPTIONS = ['0', '1', '2', '3', '4'];

function Field(props) {
  return <TextField fullWidth variant="outlined" slotProps={{ inputLabel: { shrink: true } }} {...props} />;
}

function formatPhoneBR(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

async function copyLink(url) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(url);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = url;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function resizeNameList(prev, count) {
  const next = prev.slice(0, count);
  while (next.length < count) next.push('');
  return next;
}

function GuestRemovalList({ guestsList, onRemove, removingId }) {
  const [confirmingId, setConfirmingId] = useState(null);

  const adults = guestsList.filter((g) => g.guest_type === 'adult');
  const children = guestsList.filter((g) => g.guest_type === 'child');

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: FONTS.SANS,
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: COLORS.accent,
            mb: 1.5,
          }}
        >
          {title} ({items.length})
        </Typography>
        <Stack spacing={1.2}>
          {items.map((guest) => {
            const isConfirming = confirmingId === guest.id;
            const isRemoving = removingId === guest.id;
            return (
              <Box
                key={guest.id}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  px: 2.2,
                  py: 1.5,
                  border: `1px solid ${COLORS.line}`,
                  backgroundColor: COLORS.cream,
                }}
              >
                <Typography sx={{ fontFamily: FONTS.SANS, color: COLORS.ink, fontSize: '0.98rem' }}>
                  {guest.full_name}
                </Typography>

                {isConfirming ? (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={isRemoving}
                      onClick={async () => {
                        await onRemove(guest);
                        setConfirmingId(null);
                      }}
                      sx={{ px: 2, py: 0.8, minHeight: 36, fontSize: '0.68rem', backgroundColor: '#8c2f2f', '&:hover': { backgroundColor: '#6f2222' } }}
                    >
                      {isRemoving ? 'Removendo...' : 'Confirmar'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isRemoving}
                      onClick={() => setConfirmingId(null)}
                      sx={{ px: 2, py: 0.8, minHeight: 36, fontSize: '0.68rem' }}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                    disabled={!!removingId}
                    onClick={() => setConfirmingId(guest.id)}
                    sx={{ px: 2, py: 0.8, minHeight: 36, fontSize: '0.68rem' }}
                  >
                    Remover
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    );
  };

  if (guestsList.length === 0) {
    return (
      <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
        Nenhum convidado ativo nesta confirmação no momento.
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: 'left' }}>
      {renderGroup('Convidados (acima de 7 anos)', adults)}
      {renderGroup('Crianças (até 7 anos)', children)}
    </Box>
  );
}

function ManageConfirmationView({ token, onBackToNew }) {
  const [rsvp, setRsvp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/rsvp/manage/${encodeURIComponent(token)}`);
        const data = res.headers.get('content-type')?.includes('application/json')
          ? await res.json().catch(() => null)
          : null;
        if (!res.ok || !data) {
          throw new Error(data?.detail || 'Não foi possível localizar esta confirmação.');
        }
        if (!cancelled) setRsvp(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Erro ao carregar confirmação.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleRemoveGuest = async (guest) => {
    setRemovingId(guest.id);
    try {
      const res = await fetch(
        `/api/rsvp/manage/${encodeURIComponent(token)}/guests/${encodeURIComponent(guest.id)}`,
        { method: 'DELETE' },
      );
      const data = res.headers.get('content-type')?.includes('application/json')
        ? await res.json().catch(() => null)
        : null;
      if (!res.ok || data?.status !== 'ok') {
        throw new Error(data?.detail || 'Erro ao remover convidado.');
      }
      setRsvp(data.rsvp);
      setToast({
        open: true,
        severity: 'success',
        message: `${data.removed_guest_name} foi removido(a) da confirmação.`,
      });
    } catch (err) {
      setToast({
        open: true,
        severity: 'error',
        message: err.message || 'Erro ao remover convidado.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <CircularProgress size={32} sx={{ color: COLORS.ink }} />
      </Box>
    );
  }

  if (error || !rsvp) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Eyebrow>Gerenciar Confirmação</Eyebrow>
        <Typography variant="h3" sx={{ color: COLORS.ink, mb: 2 }}>
          Link não encontrado
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {error || 'Verifique se o link utilizado está completo e tente novamente.'}
        </Typography>
        <Button variant="outlined" onClick={onBackToNew}>
          Voltar para RSVP
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Eyebrow>Gerenciar Confirmação</Eyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: '2.3rem', md: '3.2rem' }, color: COLORS.ink, mb: 1.5 }}>
          {rsvp.name}
        </Typography>
        <Typography variant="body2">
          {rsvp.email}{rsvp.phone ? ` · ${rsvp.phone}` : ''}
        </Typography>
        <Ornament sx={{ my: 3 }} />
        <Typography variant="body1" sx={{ maxWidth: 480, mx: 'auto' }}>
          Você pode remover o nome de um convidado individualmente abaixo sem excluir o restante da sua confirmação.
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2.5, md: 4 }, backgroundColor: COLORS.creamDeep, border: `1px solid ${COLORS.line}` }}>
        <GuestRemovalList
          guestsList={rsvp.guests_list || []}
          onRemove={handleRemoveGuest}
          removingId={removingId}
        />
      </Box>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Button variant="outlined" onClick={onBackToNew}>
          Voltar para a página de RSVP
        </Button>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          sx={{
            borderRadius: 0,
            backgroundColor: toast.severity === 'success' ? COLORS.ink : '#8c2f2f',
            color: COLORS.cream,
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function ConfirmCard({ attending, name, email, emailSent, manageToken, guestsList, onGuestsUpdated }) {
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const manageUrl = `${window.location.origin}/rsvp?token=${manageToken}`;

  const handleRemove = async (guest) => {
    setRemovingId(guest.id);
    try {
      const res = await fetch(
        `/api/rsvp/manage/${encodeURIComponent(manageToken)}/guests/${encodeURIComponent(guest.id)}`,
        { method: 'DELETE' },
      );
      const data = res.headers.get('content-type')?.includes('application/json')
        ? await res.json().catch(() => null)
        : null;
      if (!res.ok || data?.status !== 'ok') {
        throw new Error(data?.detail || 'Erro ao remover convidado.');
      }
      onGuestsUpdated(data.rsvp.guests_list || []);
      setToast({
        open: true,
        severity: 'success',
        message: `${data.removed_guest_name} foi removido(a) da confirmação.`,
      });
    } catch (err) {
      setToast({
        open: true,
        severity: 'error',
        message: err.message || 'Erro ao remover convidado.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleCopyManageUrl = async () => {
    try {
      await copyLink(manageUrl);
      setToast({
        open: true,
        severity: 'success',
        message: 'Link de gerenciamento copiado!',
      });
    } catch {
      setToast({
        open: true,
        severity: 'error',
        message: 'Não foi possível copiar o link.',
      });
    }
  };

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
        <Typography variant="body1" sx={{ maxWidth: 480, mx: 'auto', mb: 3 }}>
          {attending === 'yes'
            ? emailSent
              ? `Sua confirmação foi recebida e enviamos um e-mail de confirmação para ${email} com os detalhes do evento e o link para gerenciar seus convidados.`
              : `Sua confirmação foi recebida com sucesso! Guarde o link abaixo caso precise remover algum convidado posteriormente.`
            : 'Obrigado por nos avisar. Sua ausência será sentida, mas levaremos seu carinho conosco nesse dia especial.'}
        </Typography>

        {attending === 'yes' && (
          <Box sx={{ mt: 5, p: { xs: 2.5, md: 3.5 }, backgroundColor: COLORS.creamDeep, border: `1px solid ${COLORS.line}` }}>
            <Typography
              sx={{
                fontFamily: FONTS.DISPLAY,
                fontSize: '1.6rem',
                color: COLORS.ink,
                mb: 0.5,
              }}
            >
              Convidados Confirmados
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Precisa remover algum nome? Você pode fazer isso individualmente abaixo sem cancelar toda a confirmação.
            </Typography>
            <GuestRemovalList guestsList={guestsList} onRemove={handleRemove} removingId={removingId} />
            <Divider sx={{ my: 3, borderColor: COLORS.line }} />
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
              onClick={handleCopyManageUrl}
            >
              Copiar Link para Gerenciar Depois
            </Button>
          </Box>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={3500}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast((p) => ({ ...p, open: false }))}
            sx={{
              borderRadius: 0,
              backgroundColor: toast.severity === 'success' ? COLORS.ink : '#8c2f2f',
              color: COLORS.cream,
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Grow>
  );
}

export function RSVP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const manageTokenParam = searchParams.get('token');

  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    attending: '',
    guests: '1',
    guestNames: [''],
    childrenCount: '0',
    childrenNames: [],
    note: '',
  });
  const [primaryGuestEdited, setPrimaryGuestEdited] = useState(false);
  const [err, setErr] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (manageTokenParam) {
    return (
      <Box sx={{ pt: { xs: 17, md: 22 }, pb: { xs: 12, md: 18 } }}>
        <Container maxWidth="sm">
          <ManageConfirmationView
            token={manageTokenParam}
            onBackToNew={() => setSearchParams({})}
          />
        </Container>
      </Box>
    );
  }

  const handleNameChange = (e) => {
    const val = e.target.value;
    setF((prev) => {
      const nextGuestNames = [...prev.guestNames];
      if (!primaryGuestEdited && nextGuestNames.length > 0) {
        nextGuestNames[0] = val;
      }
      return { ...prev, name: val, guestNames: nextGuestNames };
    });
    setErr((p) => ({ ...p, name: undefined, guestName_0: undefined }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneBR(e.target.value);
    setF((p) => ({ ...p, phone: formatted }));
    setErr((p) => ({ ...p, phone: undefined }));
  };

  const handleGuestsCountChange = (e) => {
    const nextVal = e.target.value;
    const count = parseInt(nextVal, 10) || 1;
    setF((prev) => {
      const resized = resizeNameList(prev.guestNames, count);
      if (!primaryGuestEdited && !resized[0] && prev.name.trim()) {
        resized[0] = prev.name;
      }
      return { ...prev, guests: nextVal, guestNames: resized };
    });
    setErr((p) => ({ ...p, guests: undefined }));
  };

  const handleGuestNameChange = (index) => (e) => {
    const val = e.target.value;
    if (index === 0) setPrimaryGuestEdited(true);
    setF((prev) => {
      const next = [...prev.guestNames];
      next[index] = val;
      return { ...prev, guestNames: next };
    });
    setErr((p) => ({ ...p, [`guestName_${index}`]: undefined }));
  };

  const handleChildrenCountChange = (e) => {
    const nextVal = e.target.value;
    const count = parseInt(nextVal, 10) || 0;
    setF((prev) => ({
      ...prev,
      childrenCount: nextVal,
      childrenNames: resizeNameList(prev.childrenNames, count),
    }));
    setErr((p) => ({ ...p, childrenCount: undefined }));
  };

  const handleChildNameChange = (index) => (e) => {
    const val = e.target.value;
    setF((prev) => {
      const next = [...prev.childrenNames];
      next[index] = val;
      return { ...prev, childrenNames: next };
    });
    setErr((p) => ({ ...p, [`childName_${index}`]: undefined }));
  };

  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErr((p) => ({ ...p, [k]: undefined }));
    if (k === 'email') setApiError(null);
  };

  const validate = () => {
    const e = {};
    if (f.name.trim().length < 2) {
      e.name = 'Por favor, informe o nome completo do responsável pela confirmação.';
    }
    if (!f.email.trim()) {
      e.email = 'Precisamos do seu e-mail para enviar a confirmação.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
      e.email = 'Esse e-mail não parece válido.';
    }
    const phoneDigits = f.phone.replace(/\D/g, '');
    if (!phoneDigits) {
      e.phone = 'Por favor, informe seu número de telefone com DDD.';
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      e.phone = 'Informe um telefone válido com DDD (10 ou 11 dígitos).';
    }
    if (!f.attending) {
      e.attending = 'Por favor, nos avise se você poderá comparecer.';
    }

    if (f.attending === 'yes') {
      const guestsNum = parseInt(f.guests, 10);
      if (!guestsNum || guestsNum < 1 || guestsNum > 4) {
        e.guests = 'Selecione entre 1 e 4 convidados acima de 7 anos.';
      } else {
        for (let i = 0; i < guestsNum; i += 1) {
          if (!f.guestNames[i] || !f.guestNames[i].trim()) {
            e[`guestName_${i}`] = `Informe o nome completo do ${i + 1}º convidado.`;
          }
        }
      }

      const childrenNum = parseInt(f.childrenCount, 10) || 0;
      if (childrenNum < 0 || childrenNum > 4) {
        e.childrenCount = 'O limite é de até 4 crianças por confirmação.';
      } else {
        for (let i = 0; i < childrenNum; i += 1) {
          if (!f.childrenNames[i] || !f.childrenNames[i].trim()) {
            e[`childName_${i}`] = `Informe o nome da ${i + 1}ª criança.`;
          }
        }
      }
    }

    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErr(e);

    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      const first = document.querySelector(`[name="${firstKey}"]`);
      if (first) first.focus();
      return;
    }

    setLoading(true);
    setApiError(null);

    const going = f.attending === 'yes';
    const guestsCount = going ? parseInt(f.guests, 10) : 0;
    const childrenCount = going ? parseInt(f.childrenCount, 10) || 0 : 0;

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.trim().toLowerCase(),
          phone: f.phone.trim(),
          attending: f.attending,
          guests: guestsCount,
          guest_names: going ? f.guestNames.slice(0, guestsCount).map((n) => n.trim()) : [],
          children_count: childrenCount,
          children_names: going ? f.childrenNames.slice(0, childrenCount).map((n) => n.trim()) : [],
          note: f.note.trim() || null,
        }),
      });

      const data = response.headers.get('content-type')?.includes('application/json')
        ? await response.json().catch(() => null)
        : null;

      if (response.ok && data?.status === 'ok') {
        setSubmissionResult({
          id: data.id,
          manageToken: data.manage_token,
          emailSent: Boolean(data.email_sent),
          guestsList: data.guests_list || [],
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (response.status === 409) {
        const msg =
          data?.detail ||
          'Este e-mail já possui uma confirmação cadastrada. Utilize o link enviado para o seu e-mail para gerenciar os convidados.';
        setErr((prev) => ({ ...prev, email: msg }));
        setApiError(msg);
      } else if (response.status === 422 && Array.isArray(data?.detail) && data.detail[0]?.msg) {
        setApiError(data.detail[0].msg.replace(/^Value error,\s*/i, ''));
      } else {
        setApiError(data?.detail || 'Erro ao salvar RSVP. Por favor, tente novamente.');
      }
    } catch {
      setApiError('Erro de conexão. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const going = f.attending === 'yes';
  const guestsCountNum = parseInt(f.guests, 10) || 1;
  const childrenCountNum = parseInt(f.childrenCount, 10) || 0;

  return (
    <Box sx={{ pt: { xs: 17, md: 22 }, pb: { xs: 12, md: 18 } }}>
      <Container maxWidth="sm">
        {!submissionResult && (
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
                Será uma honra celebrar esse momento com você. Preencha os dados abaixo para confirmar sua presença e identificar individualmente cada convidado.
              </Typography>
              <Ornament sx={{ my: 3 }} />
              <Typography sx={{ fontFamily: FONTS.SANS, fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: '0.74rem', color: COLORS.accent }}>
                Confirme até {wedding.rsvpBy}
              </Typography>
            </Reveal>
          </Box>
        )}

        {submissionResult ? (
          <ConfirmCard
            attending={f.attending}
            name={f.name.trim().split(' ')[0]}
            email={f.email.trim().toLowerCase()}
            emailSent={submissionResult.emailSent}
            manageToken={submissionResult.manageToken}
            guestsList={submissionResult.guestsList}
            onGuestsUpdated={(updatedList) =>
              setSubmissionResult((prev) => ({ ...prev, guestsList: updatedList }))
            }
          />
        ) : (
          <Reveal delay={180}>
            <Box component="form" onSubmit={submit} noValidate sx={{ '& .MuiTextField-root': { mb: 0 } }}>
              <Stack spacing={3.5}>
                {apiError && (
                  <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderLeft: `4px solid ${COLORS.accent}` }}>
                    <Typography sx={{ color: COLORS.ink, fontSize: '0.92rem' }}>{apiError}</Typography>
                  </Box>
                )}

                <Field
                  required
                  label="Nome do Responsável pela Confirmação"
                  name="name"
                  value={f.name}
                  onChange={handleNameChange}
                  error={!!err.name}
                  helperText={err.name}
                  placeholder="Seu nome completo"
                />

                <Field
                  required
                  label="E-mail"
                  name="email"
                  type="email"
                  value={f.email}
                  onChange={set('email')}
                  error={!!err.email}
                  helperText={err.email || 'Permitida apenas uma confirmação por endereço de e-mail.'}
                  placeholder="seu@email.com"
                />

                <Field
                  required
                  label="Número de Telefone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  value={f.phone}
                  onChange={handlePhoneChange}
                  error={!!err.phone}
                  helperText={err.phone}
                  placeholder="(12) 99999-9999"
                />

                <FormControl error={!!err.attending} component="fieldset" required>
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
                      <Box
                        sx={{
                          p: 2.2,
                          backgroundColor: COLORS.creamDeep,
                          borderLeft: `3px solid ${COLORS.accent}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: 20, color: COLORS.accent, mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: COLORS.ink, lineHeight: 1.6 }}>
                          <strong>Atenção:</strong> no campo de número de convidados abaixo, contabilize{' '}
                          <strong>apenas convidados com mais de 7 anos</strong>. Crianças de até 7 anos devem ser cadastradas no campo específico logo abaixo.
                        </Typography>
                      </Box>

                      <Field
                        select
                        required
                        label="Número de Convidados (acima de 7 anos)"
                        name="guests"
                        value={f.guests}
                        onChange={handleGuestsCountChange}
                        error={!!err.guests}
                        helperText={err.guests || 'Informe apenas pessoas com mais de 7 anos (máximo de 4 por confirmação).'}
                      >
                        {GUEST_OPTIONS.map((n) => (
                          <MenuItem key={n} value={n}>
                            {n} {n === '1' ? 'convidado (acima de 7 anos)' : 'convidados (acima de 7 anos)'}
                          </MenuItem>
                        ))}
                      </Field>

                      <Stack spacing={2.5}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.SANS,
                            fontSize: '0.72rem',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: COLORS.accent,
                          }}
                        >
                          Nome individual dos convidados (acima de 7 anos)
                        </Typography>
                        {Array.from({ length: guestsCountNum }, (_, idx) => (
                          <Field
                            key={idx}
                            required
                            label={`Nome completo — Convidado ${idx + 1}`}
                            name={`guestName_${idx}`}
                            value={f.guestNames[idx] || ''}
                            onChange={handleGuestNameChange(idx)}
                            error={!!err[`guestName_${idx}`]}
                            helperText={err[`guestName_${idx}`]}
                            placeholder={idx === 0 ? 'Nome completo do 1º convidado' : `Nome completo do ${idx + 1}º convidado`}
                          />
                        ))}
                      </Stack>

                      <Divider sx={{ borderColor: COLORS.line }} />

                      <Stack spacing={2.5}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.SANS,
                            fontSize: '0.72rem',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: COLORS.accent,
                          }}
                        >
                          Cadastro de Crianças (até 7 anos)
                        </Typography>

                        <Field
                          select
                          label="Quantidade de Crianças (até 7 anos)"
                          name="childrenCount"
                          value={f.childrenCount}
                          onChange={handleChildrenCountChange}
                          error={!!err.childrenCount}
                          helperText={err.childrenCount || 'Contagem independente dos convidados acima de 7 anos (máximo de 4 por confirmação).'}
                        >
                          {CHILD_OPTIONS.map((n) => (
                            <MenuItem key={n} value={n}>
                              {n === '0'
                                ? 'Nenhuma criança'
                                : `${n} ${n === '1' ? 'criança' : 'crianças'}`}
                            </MenuItem>
                          ))}
                        </Field>

                        {childrenCountNum > 0 &&
                          Array.from({ length: childrenCountNum }, (_, idx) => (
                            <Field
                              key={idx}
                              required
                              label={`Nome da ${idx + 1}ª Criança`}
                              name={`childName_${idx}`}
                              value={f.childrenNames[idx] || ''}
                              onChange={handleChildNameChange(idx)}
                              error={!!err[`childName_${idx}`]}
                              helperText={err[`childName_${idx}`]}
                              placeholder={`Nome completo da ${idx + 1}ª criança`}
                            />
                          ))}
                      </Stack>
                    </Stack>
                  </Box>
                </Fade>

                <Field
                  label="Uma Mensagem para o Casal"
                  name="note"
                  value={f.note}
                  onChange={set('note')}
                  multiline
                  minRows={3}
                  placeholder="Opcional — deixe algumas palavras de carinho"
                />

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
