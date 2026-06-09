/* global React, MaterialUI, window */
const {
  Box: RBox, Container: RContainer, Typography: RType, Grid: RGrid, Stack: RStack, Button: RButton,
  TextField: RText, FormControl: RFormControl, FormLabel: RFormLabel, RadioGroup: RRadioGroup,
  FormControlLabel: RFormCtl, Radio: RRadio, MenuItem: RMenuItem, Fade: RFade, Grow: RGrow, FormHelperText: RHelp,
} = MaterialUI;

function Field(props) {
  return <RText fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...props} />;
}

function ConfirmCard({ attending, name, onReset }) {
  const C = window.COLORS, F = window.FONTS;
  return (
    <RGrow in timeout={700}>
      <RBox sx={{ textAlign: "center", py: { xs: 4, md: 6 } }}>
        <RBox sx={{ width: 84, height: 84, mx: "auto", mb: 4, borderRadius: "50%",
          border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center",
          animation: "popIn .8s cubic-bezier(.16,1,.3,1)" }}>
          <RBox component="svg" viewBox="0 0 24 24" sx={{ width: 34, height: 34 }}>
            <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={C.accent} strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "draw .9s .25s forwards ease" }} />
          </RBox>
        </RBox>
        <window.Eyebrow>{attending === "yes" ? "Mal podemos esperar" : "Vamos sentir sua falta"}</window.Eyebrow>
        <RType variant="h2" sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, color: C.ink, mb: 2.5 }}>
          Obrigado, {name || "amigo(a)"}.
        </RType>
        <RType variant="body1" sx={{ maxWidth: 460, mx: "auto", mb: 5 }}>
          {attending === "yes"
            ? "Sua confirmação foi recebida — ficamos muito felizes em saber que você estará conosco! Fique de olho no seu e-mail para informações sobre o evento."
            : "Obrigado por nos avisar. Sua ausência será sentida, mas brindaremos a você com muito carinho nessa noite."}
        </RType>
        <RButton variant="outlined" onClick={onReset}>Editar Resposta</RButton>
        <style>{`
          @keyframes draw { to { stroke-dashoffset: 0; } }
          @keyframes popIn { 0%{ transform: scale(.6); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }
        `}</style>
      </RBox>
    </RGrow>
  );
}

function RSVP() {
  const D = window.DATA, C = window.COLORS, F = window.FONTS;
  const [f, setF] = React.useState({
    name: "", email: "", attending: "", guests: "1", meal: "", dietary: "", song: "", note: "",
  });
  const [err, setErr] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k) => (e) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErr((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Por favor, informe seu nome.";
    if (!f.email.trim()) e.email = "Precisamos do seu e-mail para enviar os detalhes.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Esse e-mail não parece válido.";
    if (!f.attending) e.attending = "Por favor, nos avise se você poderá comparecer.";
    if (f.attending === "yes" && !f.meal) e.meal = "Escolha uma opção de prato.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErr(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const first = document.querySelector(`[name="${Object.keys(e)[0]}"]`);
      if (first) first.focus();
    }
  };

  const reset = () => setSubmitted(false);
  const going = f.attending === "yes";

  return (
    <RBox sx={{ pt: { xs: 17, md: 22 }, pb: { xs: 12, md: 18 } }}>
      <RContainer maxWidth="sm">
        {!submitted && (
          <RBox sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <window.Reveal><window.Eyebrow>Confirmação de Presença</window.Eyebrow></window.Reveal>
            <window.Reveal delay={80}>
              <RType variant="h1" sx={{ fontSize: { xs: "3.2rem", md: "4.8rem" }, color: C.ink }}>RSVP</RType>
            </window.Reveal>
            <window.Reveal delay={140}>
              <RType variant="body1" sx={{ maxWidth: 480, mx: "auto", mt: 3 }}>
                Será uma honra ter você conosco. Se trouxer acompanhante ou tiver restrições alimentares,
                por favor informe abaixo.
              </RType>
              <window.Ornament sx={{ my: 3 }} />
              <RType sx={{ fontFamily: F.SANS, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase",
                fontSize: "0.74rem", color: C.accent }}>
                Confirme até {D.rsvpBy}
              </RType>
            </window.Reveal>
          </RBox>
        )}

        {submitted ? (
          <ConfirmCard attending={f.attending} name={f.name.trim().split(" ")[0]} onReset={reset} />
        ) : (
          <window.Reveal delay={180} as="form">
            <RBox component="form" onSubmit={submit} noValidate sx={{ "& .MuiTextField-root": { mb: 0 } }}>
              <RStack spacing={3.5}>
                <Field label="Nome Completo" name="name" value={f.name} onChange={set("name")}
                  error={!!err.name} helperText={err.name} placeholder="Seu nome completo" />
                <Field label="E-mail" name="email" value={f.email} onChange={set("email")}
                  error={!!err.email} helperText={err.email} placeholder="seu@email.com" />

                <RFormControl error={!!err.attending} component="fieldset">
                  <RFormLabel sx={{ fontFamily: F.SANS, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase",
                    fontSize: "0.7rem", color: C.taupe, mb: 1.5, "&.Mui-focused": { color: C.taupe } }}>
                    Você poderá comparecer?
                  </RFormLabel>
                  <RRadioGroup name="attending" value={f.attending} onChange={set("attending")}>
                    {[["yes", "Confirmo presença com alegria"], ["no", "Infelizmente não poderei comparecer"]].map(([v, l]) => (
                      <RFormCtl key={v} value={v}
                        control={<RRadio disableRipple sx={{ color: C.line, "&.Mui-checked": { color: C.ink } }} />}
                        label={<RType sx={{ fontFamily: F.DISPLAY, fontSize: "1.5rem", color: C.ink }}>{l}</RType>} />
                    ))}
                  </RRadioGroup>
                  {err.attending && <RHelp sx={{ ml: 0 }}>{err.attending}</RHelp>}
                </RFormControl>

                <RFade in={going} unmountOnExit>
                  <RBox>
                    <RStack spacing={3.5}>
                      <Field select label="Número de Convidados" name="guests" value={f.guests} onChange={set("guests")}>
                        {["1", "2", "3", "4"].map((n) => (
                          <RMenuItem key={n} value={n}>{n} {n === "1" ? "convidado" : "convidados"}</RMenuItem>
                        ))}
                      </Field>
                      <Field select label="Preferência de Prato" name="meal" value={f.meal} onChange={set("meal")}
                        error={!!err.meal} helperText={err.meal}>
                        {["Filé mignon ao molho", "Salmão grelhado", "Risoto de cogumelos (v)", "Prato infantil"].map((m) => (
                          <RMenuItem key={m} value={m}>{m}</RMenuItem>
                        ))}
                      </Field>
                      <Field label="Restrições Alimentares" name="dietary" value={f.dietary} onChange={set("dietary")}
                        placeholder="Alergias, intolerâncias ou algo que devemos saber" />
                      <Field label="Pedido Musical" name="song" value={f.song} onChange={set("song")}
                        placeholder="A música que vai te levar à pista" />
                    </RStack>
                  </RBox>
                </RFade>

                <Field label="Uma Mensagem para o Casal" name="note" value={f.note} onChange={set("note")}
                  multiline minRows={3} placeholder="Opcional — deixe algumas palavras de carinho" />

                <RButton type="submit" variant="contained" fullWidth sx={{ py: 2, mt: 1 }}>
                  Enviar Confirmação
                </RButton>
              </RStack>
            </RBox>
          </window.Reveal>
        )}
      </RContainer>
    </RBox>
  );
}
window.RSVP = RSVP;
