/* global React, MaterialUI, window */
const { Box: HBox, Container: HContainer, Typography: HType, Grid: HGrid, Stack: HStack, Button: HButton } = MaterialUI;

function go(hash) { window.location.hash = hash; }

/* ===== HERO ================================================================ */
function Hero() {
  const D = window.DATA, C = window.COLORS, F = window.FONTS;
  return (
    <HBox sx={{ position: "relative", height: { xs: "92vh", md: "100vh" }, minHeight: 560,
      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" }}>
      <window.FadeImage src={D.img.hero} alt="Melissa e Levi" position="center 40%"
        sx={{ position: "absolute", inset: 0 }} />
      <HBox sx={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(20,18,16,.46) 0%, rgba(20,18,16,.12) 32%, rgba(20,18,16,.22) 70%, rgba(20,18,16,.5) 100%)" }} />
      <HBox sx={{ position: "relative", color: "#F7F2E9", px: 3, animation: "revealUp 1.1s cubic-bezier(.16,1,.3,1) .1s both" }}>
        <HType component="div" sx={{ fontFamily: F.SANS, fontWeight: 400, textTransform: "uppercase",
          letterSpacing: "0.5em", fontSize: { xs: "0.66rem", md: "0.78rem" }, color: "#ffffff", opacity: 0.92,
          mb: { xs: 2.5, md: 3.5 }, pl: "0.5em", textShadow: "0 1px 18px rgba(0,0,0,.4)" }}>
          — {D.dateShort} —
        </HType>
        <HType variant="h1" sx={{ fontSize: { xs: "4.1rem", sm: "5.5rem", md: "8rem" }, fontWeight: 300,
          lineHeight: 0.98, textShadow: "0 2px 40px rgba(0,0,0,.25)" }}>
          {D.bride}
          <HBox component="span" sx={{ display: "block", fontStyle: "italic", fontSize: "0.62em", fontWeight: 300, my: { xs: 0.2, md: 0.4 } }}>&amp;</HBox>
          {D.groom}
        </HType>
        <HType component="div" sx={{ fontFamily: F.SANS, fontWeight: 300, letterSpacing: "0.34em",
          textTransform: "uppercase", fontSize: { xs: "0.7rem", md: "0.8rem" }, color: "#ffffff", mt: { xs: 3, md: 4 }, opacity: 0.95, pl: "0.34em" }}>
          Vamos nos casar
        </HType>
      </HBox>
      <HBox sx={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
        width: "1px", height: 56, background: "linear-gradient(#F7F2E9, transparent)", opacity: 0.7 }} />
    </HBox>
  );
}

/* ===== INVITATION ========================================================= */
function Invitation() {
  const C = window.COLORS;
  return (
    <HBox sx={{ py: { xs: 11, md: 18 }, textAlign: "center" }}>
      <HContainer maxWidth="md">
        <window.Reveal><window.Eyebrow>Uma União Abençoada</window.Eyebrow></window.Reveal>
        <window.Reveal delay={80}>
          <HType variant="h3" sx={{ fontSize: { xs: "1.9rem", md: "2.9rem" }, color: C.ink, fontWeight: 400,
            maxWidth: 880, mx: "auto", lineHeight: 1.28, textWrap: "balance" }}>
            Melissa e Levi têm a alegria de convidar você para celebrar o casamento deles,
            na presença de família e amigos queridos.
          </HType>
        </window.Reveal>
        <window.Reveal delay={160}><window.Ornament /></window.Reveal>
        <window.Reveal delay={200}>
          <HType variant="body1" sx={{ maxWidth: 560, mx: "auto" }}>
            Começaremos com uma cerimônia no jardim, e em seguida reuniremos todos para uma noite
            de jantar, dança e muita celebração.
          </HType>
        </window.Reveal>
      </HContainer>
    </HBox>
  );
}

/* ===== QUANDO & ONDE (two columns) ======================================== */
function WhenWhereStrip() {
  const D = window.DATA, C = window.COLORS;
  const Col = ({ label, title, lines, href }) => (
    <HGrid item xs={12} md={6}>
      <window.Reveal sx={{ textAlign: "center", px: { xs: 0, md: 4 } }}>
        <window.Eyebrow>{label}</window.Eyebrow>
        <HType variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, color: C.ink, mb: 2 }}>{title}</HType>
        {lines.map((l, i) => (
          <HType key={i} variant="body1" sx={{ mb: 0.2 }}>{l}</HType>
        ))}
        <HButton variant="outlined" sx={{ mt: 4 }} onClick={() => go("#/when-where")}>Ver Detalhes</HButton>
      </window.Reveal>
    </HGrid>
  );
  return (
    <HBox sx={{ backgroundColor: C.creamDeep, py: { xs: 11, md: 16 } }}>
      <HContainer maxWidth="lg">
        <HGrid container spacing={{ xs: 8, md: 4 }} alignItems="flex-start"
          sx={{ position: "relative",
            "&::before": { content: '""', position: "absolute", left: "50%", top: "8%", bottom: "8%",
              width: "1px", background: C.line, display: { xs: "none", md: "block" } } }}>
          <Col label="Quando" title={D.dateLong} lines={[D.ceremony, D.reception]} />
          <Col label="Onde" title={D.venue} lines={[D.address1, D.address2]} />
        </HGrid>
      </HContainer>
    </HBox>
  );
}

/* ===== HOSPEDAGEM ========================================================= */
function Accommodations() {
  const D = window.DATA, C = window.COLORS;
  return (
    <HBox sx={{ py: { xs: 11, md: 18 } }}>
      <HContainer maxWidth="lg">
        <HGrid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <HGrid item xs={12} md={6}>
            <window.Reveal>
              <window.FadeImage src={D.img.venue} alt="Local do evento" ratio="4 / 5"
                sx={{ boxShadow: "0 30px 60px -40px rgba(28,27,25,.5)" }} />
            </window.Reveal>
          </HGrid>
          <HGrid item xs={12} md={6}>
            <window.Reveal delay={120} sx={{ pl: { md: 4 } }}>
              <window.Eyebrow>Hospedagem</window.Eyebrow>
              <HType variant="h2" sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, color: C.ink, mb: 3 }}>
                A ser definido
              </HType>
              <HType variant="body1" sx={{ mb: 3 }}>
                Em breve divulgaremos as opções de hospedagem recomendadas para nossos convidados
                em São José dos Campos. Fique de olho — as informações serão atualizadas aqui.
              </HType>
              <HType variant="body2" sx={{ color: C.ink, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.72rem", mb: 4 }}>
                São José dos Campos · São Paulo, Brasil
              </HType>
              <HButton variant="outlined" onClick={() => go("#/when-where")}>Mais Detalhes</HButton>
            </window.Reveal>
          </HGrid>
        </HGrid>
      </HContainer>
    </HBox>
  );
}

/* ===== LISTA DE PRESENTES ================================================= */
function Registry() {
  const C = window.COLORS, F = window.FONTS;
  return (
    <HBox sx={{ backgroundColor: C.creamDeep, py: { xs: 11, md: 18 }, textAlign: "center" }}>
      <HContainer maxWidth="sm">
        <window.Reveal><window.Eyebrow>Lista de Presentes</window.Eyebrow></window.Reveal>
        <window.Reveal delay={80}>
          <HType variant="h2" sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, color: C.ink, mb: 3 }}>
            Sua presença é o presente
          </HType>
        </window.Reveal>
        <window.Reveal delay={140}>
          <HType variant="body1" sx={{ maxWidth: 540, mx: "auto", mb: 7 }}>
            Muitos de vocês virão de longe para celebrar conosco, e isso já é um presente enorme.
            Se ainda assim quiserem nos presentear, preparamos uma lista com muito carinho na Amazon.
          </HType>
        </window.Reveal>
          <window.Reveal delay={200}>
          <HBox component="a" href="https://www.amazon.com.br" target="_blank" rel="noopener noreferrer"
            sx={{ display: "inline-block", textDecoration: "none" }}>
            <HBox sx={{
              border: `1px solid ${C.ink}`, px: { xs: 4, md: 7 }, py: { xs: 1.8, md: 2.5 },
              minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F.SANS, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase",
              fontSize: "0.72rem", color: C.ink, transition: "all .4s ease",
              WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
              "&:hover": { backgroundColor: C.ink, color: C.cream },
            }}>
              Ver Lista na Amazon
            </HBox>
          </HBox>
        </window.Reveal>
      </HContainer>
    </HBox>
  );
}

/* ===== CLOSING CTA ======================================================== */
function ClosingCTA() {
  const D = window.DATA, C = window.COLORS;
  return (
    <HBox sx={{ position: "relative", py: { xs: 14, md: 22 }, textAlign: "center", overflow: "hidden" }}>
      <window.FadeImage src={D.img.cta} alt="" position="center 60%" sx={{ position: "absolute", inset: 0 }} />
      <HBox sx={{ position: "absolute", inset: 0, background: "rgba(20,18,16,.5)" }} />
      <HContainer maxWidth="md" sx={{ position: "relative", color: "#F7F2E9" }}>
        <window.Reveal>
          <HType variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4.2rem" }, fontWeight: 300, lineHeight: 1.12, mb: 5, textWrap: "balance" }}>
            Esperamos muito celebrar esse dia especial com você.
          </HType>
          <HButton variant="contained"
            sx={{ backgroundColor: "#F7F2E9", color: C.ink, px: 6, "&:hover": { backgroundColor: "#fff" } }}
            onClick={() => go("#/rsvp")}>
            Confirmar Presença
          </HButton>
        </window.Reveal>
      </HContainer>
    </HBox>
  );
}

function Home() {
  return (
    <HBox>
      <Hero />
      <Invitation />
      <WhenWhereStrip />
      <Accommodations />
      <Registry />
      <ClosingCTA />
    </HBox>
  );
}
window.Home = Home;
