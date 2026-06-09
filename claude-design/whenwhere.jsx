/* global React, MaterialUI, window */
const { Box: WBox, Container: WContainer, Typography: WType, Grid: WGrid, Stack: WStack, Button: WButton } = MaterialUI;

function PageHeader({ eyebrow, title, sub }) {
  const C = window.COLORS;
  return (
    <WBox sx={{ textAlign: "center", pt: { xs: 18, md: 22 }, mt: { xs: 0, md: 6 }, pb: { xs: 2, md: 4 } }}>
      <window.Reveal><window.Eyebrow>{eyebrow}</window.Eyebrow></window.Reveal>
      <window.Reveal delay={80}>
        <WType variant="h1" sx={{ fontSize: { xs: "3rem", md: "4.6rem" }, color: C.ink }}>{title}</WType>
      </window.Reveal>
      {sub && (
        <window.Reveal delay={140}>
          <WType variant="body1" sx={{ maxWidth: 560, mx: "auto", mt: 3 }}>{sub}</WType>
        </window.Reveal>
      )}
    </WBox>
  );
}

function DetailBlock({ label, title, lines, body, action, reverse, img, pos }) {
  const C = window.COLORS;
  return (
    <WGrid container spacing={{ xs: 5, md: 10 }} alignItems="center"
      direction={{ xs: "column-reverse", md: reverse ? "row-reverse" : "row" }}>
      <WGrid item xs={12} md={6}>
        <window.Reveal sx={{ px: { md: reverse ? 0 : 2 } }}>
          <window.Eyebrow>{label}</window.Eyebrow>
          <WType variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.1rem" }, color: C.ink, mb: 2 }}>{title}</WType>
          {lines && (
            <WStack spacing={0.3} sx={{ mb: 3 }}>
              {lines.map((l, i) => (
                <WType key={i} variant="body2" sx={{ color: C.ink, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.72rem" }}>{l}</WType>
              ))}
            </WStack>
          )}
          <WType variant="body1" sx={{ maxWidth: 480 }}>{body}</WType>
          {action && <WButton variant="outlined" sx={{ mt: 4 }} onClick={action.onClick}>{action.label}</WButton>}
        </window.Reveal>
      </WGrid>
      <WGrid item xs={12} md={6}>
        <window.Reveal delay={120}>
          <window.FadeImage src={img} alt={title} ratio="4 / 3" position={pos}
            sx={{ boxShadow: "0 30px 60px -42px rgba(28,27,25,.55)" }} />
        </window.Reveal>
      </WGrid>
    </WGrid>
  );
}

function Schedule() {
  const C = window.COLORS;
  const items = [
    { time: "15h30", name: "Chegada dos Convidados", note: "Boas-vindas e drinques no jardim" },
    { time: "16h00", name: "Cerimônia", note: "No jardim" },
    { time: "17h00", name: "Coquetel", note: "Terraço e áreas externas" },
    { time: "18h00", name: "Jantar & Brindes", note: "Salão principal" },
    { time: "20h00", name: "Pista de Dança", note: "Até às 23h" },
  ];
  return (
    <WBox sx={{ backgroundColor: C.creamDeep, py: { xs: 11, md: 16 } }}>
      <WContainer maxWidth="sm">
        <window.Reveal sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <window.Eyebrow>A Programação</window.Eyebrow>
          <WType variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, color: C.ink }}>Ordem dos Eventos</WType>
        </window.Reveal>
        {items.map((it, i) => (
          <window.Reveal key={i} delay={i * 70}>
            <WBox sx={{ display: "flex", alignItems: "baseline", gap: { xs: 2.5, md: 4 }, py: 2.6,
              borderTop: `1px solid ${C.line}`, ...(i === items.length - 1 ? { borderBottom: `1px solid ${C.line}` } : {}) }}>
              <WType sx={{ fontFamily: window.FONTS.SANS, fontWeight: 400, letterSpacing: "0.14em", color: C.accent,
                fontSize: "0.82rem", width: { xs: 78, md: 96 }, flexShrink: 0 }}>{it.time}</WType>
              <WBox>
                <WType variant="h5" sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, color: C.ink, lineHeight: 1.2 }}>{it.name}</WType>
                <WType variant="body2" sx={{ mt: 0.2 }}>{it.note}</WType>
              </WBox>
            </WBox>
          </window.Reveal>
        ))}
      </WContainer>
    </WBox>
  );
}

function WhenWhere() {
  const D = window.DATA, C = window.COLORS;
  const go = (h) => () => { window.location.hash = h; };
  return (
    <WBox>
      <PageHeader eyebrow="Quando & Onde" title="A Celebração"
        sub="Tudo o que você precisa saber para nos acompanhar em São José dos Campos." />
      <WContainer maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <DetailBlock
          label="Quando"
          title={D.dateLong}
          lines={[D.ceremony, D.reception]}
          img={D.img.cta} pos="center 55%"
          body="Junte-se a nós nessa noite especial de julho enquanto declaramos nossos votos. A cerimônia começa pontualmente às 16h — sugerimos chegar às 15h30 para se acomodar e tomar uma bebida de boas-vindas." />
        <WBox sx={{ height: { xs: 64, md: 120 } }} />
        <DetailBlock
          reverse
          label="Onde"
          title="A ser definido"
          lines={["São José dos Campos · São Paulo, Brasil"]}
          img={D.img.venue} pos="center"
          body="O local está sendo cuidadosamente escolhido para que a noite seja inesquecível. Em breve divulgaremos o endereço completo e todas as informações de acesso para os convidados."
          action={{ label: "Confirmar Presença", onClick: go("#/rsvp") }} />
      </WContainer>

      <Schedule />

      <WBox sx={{ py: { xs: 11, md: 16 }, textAlign: "center" }}>
        <WContainer maxWidth="sm">
          <window.Reveal>
            <window.Eyebrow>Hospedagem</window.Eyebrow>
            <WType variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, color: C.ink, mb: 3 }}>A ser definido</WType>
            <WType variant="body1" sx={{ mb: 1 }}>
              Em breve compartilharemos opções de hospedagem recomendadas em São José dos Campos.
              Fique de olho — as informações serão divulgadas aqui assim que estiverem confirmadas.
            </WType>
            <WStack spacing={0.4} sx={{ my: 3 }}>
              <WType variant="body2" sx={{ color: C.ink }}>São José dos Campos · São Paulo, Brasil</WType>
            </WStack>
            <WButton variant="outlined" onClick={go("#/rsvp")}>Confirmar Presença</WButton>
          </window.Reveal>
        </WContainer>
      </WBox>
    </WBox>
  );
}
window.WhenWhere = WhenWhere;
