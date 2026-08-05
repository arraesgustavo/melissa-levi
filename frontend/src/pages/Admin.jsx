import { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Button, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Eyebrow } from '../components';
import { COLORS } from '../theme';
import { supabase } from '../lib/supabaseClient';

const columns = [
  { field: 'name', headerName: 'Nome', flex: 1, minWidth: 160 },
  { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 200 },
  { field: 'attending', headerName: 'Comparece', width: 120, valueFormatter: (v) => (v === 'yes' ? 'Sim' : 'Não') },
  { field: 'guests', headerName: 'Convidados', width: 110, type: 'number' },
  { field: 'meal', headerName: 'Prato', flex: 1, minWidth: 160 },
  { field: 'dietary', headerName: 'Restrições', flex: 1, minWidth: 160 },
  { field: 'song', headerName: 'Música', flex: 1, minWidth: 160 },
  { field: 'note', headerName: 'Mensagem', flex: 1.5, minWidth: 200 },
  { field: 'created_at', headerName: 'Enviado em', width: 170, valueFormatter: (v) => (v ? new Date(v).toLocaleString('pt-BR') : '') },
];

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
              <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderLeft: `4px solid ${COLORS.accent}`, borderRadius: 1 }}>
                <Typography sx={{ color: COLORS.ink, fontSize: '0.9rem' }}>{error}</Typography>
              </Box>
            )}
            <TextField fullWidth label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 2, mt: 1 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export function Admin() {
  const [session, setSession] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: 6, px: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: COLORS.ink }}>
          Convidados
        </Typography>
        <Button variant="outlined" onClick={() => supabase.auth.signOut()}>
          Sair
        </Button>
      </Stack>
      {error && (
        <Box sx={{ p: 2, mb: 3, backgroundColor: '#fef2f2', borderLeft: `4px solid ${COLORS.accent}`, borderRadius: 1 }}>
          <Typography sx={{ color: COLORS.ink, fontSize: '0.9rem' }}>{error}</Typography>
        </Box>
      )}
      <Box sx={{ height: '70vh', backgroundColor: '#fff' }}>
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
    </Box>
  );
}
