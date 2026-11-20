import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { Eyebrow } from '../components';
import { COLORS, FONTS } from '../theme';
import { supabase } from '../lib/supabaseClient';

function formatGuestNames(guests, type) {
  if (!Array.isArray(guests) || guests.length === 0) return '—';
  const names = guests.filter((g) => (g.guest_type || 'adult') === type).map((g) => g.full_name);
  return names.length > 0 ? names.join(', ') : '—';
}

function LoginForm({ onLogin, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (ev) => {
    ev.preventDefault();
    onLogin(email.trim(), password);
  };

  return (
    <Box sx={{ pt: { xs: 17, md: 22 }, pb: { xs: 12, md: 18 } }}>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Eyebrow>Área Restrita</Eyebrow>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.6rem', md: '3.4rem' }, color: COLORS.ink }}>
            Admin
          </Typography>
        </Box>
        <Box component="form" onSubmit={submit} noValidate>
          <Stack spacing={3}>
            {error && (
              <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderLeft: `4px solid ${COLORS.accent}` }}>
                <Typography sx={{ color: COLORS.ink, fontSize: '0.9rem' }}>{error}</Typography>
              </Box>
            )}
            <TextField fullWidth label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 2, mt: 1 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function StatCard({ label, value }) {
  return (
    <Box sx={{ p: 2.2, backgroundColor: '#fff', border: `1px solid ${COLORS.line}` }}>
      <Typography sx={{ fontFamily: FONTS.SANS, fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.taupe }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: FONTS.DISPLAY, fontSize: '2rem', color: COLORS.ink, mt: 0.5, lineHeight: 1.1 }}>
        {value}
      </Typography>
    </Box>
  );
}

function ManageGuestsDialog({ rsvp, onClose, onRemoveGuest, removingId }) {
  if (!rsvp) return null;

  const allGuests = Array.isArray(rsvp.rsvp_guests) ? rsvp.rsvp_guests : [];
  const adults = allGuests.filter((g) => (g.guest_type || 'adult') === 'adult');
  const children = allGuests.filter((g) => g.guest_type === 'child');

  const renderSection = (title, items) => (
    <Box sx={{ mb: 2.5 }}>
      <Typography sx={{ fontFamily: FONTS.SANS, fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.accent, mb: 1.2 }}>
        {title} ({items.length})
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2">Nenhum nome cadastrado.</Typography>
      ) : (
        <Stack spacing={1}>
          {items.map((guest) => (
            <Box
              key={guest.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                px: 2,
                py: 1.2,
                border: `1px solid ${COLORS.line}`,
                backgroundColor: COLORS.cream,
              }}
            >
              <Typography sx={{ color: COLORS.ink, fontSize: '0.95rem' }}>{guest.full_name}</Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                disabled={removingId === guest.id}
                onClick={() => onRemoveGuest(rsvp.id, guest)}
                sx={{ px: 2, py: 0.6, minHeight: 36, fontSize: '0.68rem' }}
              >
                {removingId === guest.id ? 'Removendo...' : 'Remover'}
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: FONTS.DISPLAY, fontSize: '1.8rem', color: COLORS.ink }}>
        Gerenciar Convidados — {rsvp.name}
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: COLORS.line }}>
        <Typography variant="body2" sx={{ mb: 2.5 }}>
          {rsvp.email}{rsvp.phone ? ` · ${rsvp.phone}` : ''}
        </Typography>
        {renderSection('Convidados acima de 7 anos', adults)}
        <Divider sx={{ my: 2, borderColor: COLORS.line }} />
        {renderSection('Crianças (até 7 anos)', children)}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Admin() {
  const [session, setSession] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRsvpId, setSelectedRsvpId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/rsvps', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.status === 401) {
          await supabase.auth.signOut();
          if (!cancelled) setError('Sessão expirada. Faça login novamente.');
          return;
        }
        if (!res.ok) throw new Error('Falha ao carregar convidados.');
        const data = await res.json();
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) setError('Erro ao carregar convidados. Tente novamente.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const stats = useMemo(() => {
    let confirmed = 0;
    let declined = 0;
    let totalAdults = 0;
    let totalChildren = 0;
    for (const r of rows) {
      if (r.attending === 'yes') {
        confirmed += 1;
        totalAdults += Number(r.guests || 0);
        totalChildren += Number(r.children_count || 0);
      } else {
        declined += 1;
      }
    }
    return { confirmed, declined, totalAdults, totalChildren };
  }, [rows]);

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'Responsável', flex: 1, minWidth: 160 },
      { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 200 },
      { field: 'phone', headerName: 'Telefone', width: 150, valueFormatter: (v) => v || '—' },
      { field: 'attending', headerName: 'Comparece', width: 110, valueFormatter: (v) => (v === 'yes' ? 'Sim' : 'Não') },
      { field: 'guests', headerName: 'Qtd (>7a)', width: 95, type: 'number' },
      {
        field: 'adult_names',
        headerName: 'Convidados (>7 anos)',
        flex: 1.4,
        minWidth: 220,
        valueGetter: (_value, row) => formatGuestNames(row.rsvp_guests, 'adult'),
      },
      { field: 'children_count', headerName: 'Crianças', width: 95, type: 'number', valueGetter: (_v, row) => row.children_count || 0 },
      {
        field: 'children_names',
        headerName: 'Nomes das Crianças',
        flex: 1.2,
        minWidth: 180,
        valueGetter: (_value, row) => formatGuestNames(row.rsvp_guests, 'child'),
      },
      { field: 'note', headerName: 'Mensagem', flex: 1.2, minWidth: 180 },
      { field: 'created_at', headerName: 'Enviado em', width: 165, valueFormatter: (v) => (v ? new Date(v).toLocaleString('pt-BR') : '') },
      {
        field: 'actions',
        headerName: 'Ações',
        width: 135,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedRsvpId(params.row.id)}
            sx={{ px: 1.8, py: 0.5, minHeight: 32, fontSize: '0.66rem' }}
          >
            Gerenciar
          </Button>
        ),
      },
    ],
    [],
  );

  const selectedRsvp = useMemo(
    () => rows.find((r) => r.id === selectedRsvpId) || null,
    [rows, selectedRsvpId],
  );

  const handleAdminRemoveGuest = async (rsvpId, guest) => {
    if (!session) return;
    setRemovingId(guest.id);
    try {
      const res = await fetch(
        `/api/admin/rsvps/${encodeURIComponent(rsvpId)}/guests/${encodeURIComponent(guest.id)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );
      const data = res.headers.get('content-type')?.includes('application/json')
        ? await res.json().catch(() => null)
        : null;
      if (!res.ok || data?.status !== 'ok') {
        throw new Error(data?.detail || 'Erro ao remover convidado.');
      }
      setRows((prev) => prev.map((r) => (r.id === rsvpId ? data.rsvp : r)));
      setToast({
        open: true,
        severity: 'success',
        message: `${data.removed_guest_name} removido(a) com sucesso.`,
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

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError('E-mail ou senha inválidos.');
    setLoading(false);
  };

  if (session === undefined) return null;

  if (!session) return <LoginForm onLogin={login} error={error} loading={loading} />;

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 6, px: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: COLORS.ink }}>
          Convidados
        </Typography>
        <Button variant="outlined" onClick={() => supabase.auth.signOut()}>
          Sair
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Confirmações (Sim)" value={stats.confirmed} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Convidados (>7 anos)" value={stats.totalAdults} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Crianças (≤7 anos)" value={stats.totalChildren} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Não comparecem" value={stats.declined} />
        </Grid>
      </Grid>

      {error && (
        <Box sx={{ p: 2, mb: 3, backgroundColor: '#fef2f2', borderLeft: `4px solid ${COLORS.accent}` }}>
          <Typography sx={{ color: COLORS.ink, fontSize: '0.9rem' }}>{error}</Typography>
        </Box>
      )}
      <Box sx={{ height: '66vh', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          showToolbar
          disableRowSelectionOnClick
          initialState={{ sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] } }}
          sx={{ border: 'none', fontFamily: 'inherit' }}
        />
      </Box>

      <ManageGuestsDialog
        rsvp={selectedRsvp}
        onClose={() => setSelectedRsvpId(null)}
        onRemoveGuest={handleAdminRemoveGuest}
        removingId={removingId}
      />

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
  );
}
