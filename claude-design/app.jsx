/* global React, ReactDOM, MaterialUI, window */
const {
  Box: ABox, Container: AContainer, Typography: AType, Stack: AStack, Button: AButton,
  ThemeProvider, CssBaseline, Drawer: ADrawer, IconButton: AIconButton, useMediaQuery,
} = MaterialUI;

const NAV = [
  { label: "Quando & Onde", hash: "#/when-where" },
  { label: "Confirmar Presença", hash: "#/rsvp" },
];

function useRoute() {
  const [route, setRoute] = React.useState(window.location.hash || "#/");
  React.useEffect(() => {
    const on = () => { setRoute(window.location.hash || "#/"); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

function Burger({ open }) {
  const C = window.COLORS;
  const bar = (t) => ({ position: "absolute", left: 0, width: 22, height: "1.4px", background: "currentColor",
    transition: "transform .35s ease, opacity .35s ease", ...t });
  return (
    <ABox sx={{ position: "relative", width: 22, height: 14 }}>
      <ABox sx={bar({ top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "none" })} />
      <ABox sx={bar({ top: 6, opacity: open ? 0 : 1 })} />
      <ABox sx={bar({ top: open ? 6 : 12, transform: open ? "rotate(-45deg)" : "none" })} />
    </ABox>
  );
}

function NavBar({ route }) {
  const D = window.DATA, C = window.COLORS, F = window.FONTS;
  const isHome = route === "#/" || route === "" || route === "#";
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:899px)");

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Over hero (home + not scrolled) -> light text on transparent. Otherwise dark on cream.
  const overHero = isHome && !scrolled;
  const fg = overHero ? "#F7F2E9" : C.ink;
  const go = (h) => () => { setOpen(false); window.location.hash = h; };

  const NavLink = ({ item, active }) => (
    <ABox component="button" onClick={go(item.hash)}
      sx={{ background: "none", border: "none", cursor: "pointer", color: fg, p: 0,
        fontFamily: F.SANS, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase",
        fontSize: "0.72rem", position: "relative", transition: "color .3s ease", whiteSpace: "nowrap",
        minHeight: 44, display: "inline-flex", alignItems: "center",
        WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
        "&::after": { content: '""', position: "absolute", left: 0, bottom: -6, height: "1px",
          width: active ? "100%" : 0, background: "currentColor", transition: "width .4s ease" },
        "&:hover::after": { width: "100%" } }}>
      {item.label}
    </ABox>
  );

  return (
    <>
      <ABox sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1200,
        transition: "background .5s ease, box-shadow .5s ease, padding .4s ease",
        backgroundColor: overHero ? "transparent" : "rgba(244,238,227,.92)",
        backdropFilter: overHero ? "none" : "saturate(140%) blur(8px)",
        boxShadow: overHero ? "none" : "0 1px 0 rgba(205,194,174,.6)",
        py: overHero ? { xs: 2.5, md: 3.5 } : { xs: 1.8, md: 2.2 } }}>
        <AContainer maxWidth="lg">
          <ABox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: fg }}>
            {/* Left: first nav link (desktop) / burger (mobile) */}
            <ABox sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
              {isMobile
                ? <AIconButton onClick={() => setOpen(true)} sx={{ color: fg, ml: -1 }}><Burger open={open} /></AIconButton>
                : <NavLink item={NAV[0]} active={route === NAV[0].hash} />}
            </ABox>
            {/* Center: monogram / couple name */}
            <ABox component="button" onClick={go("/")}
              sx={{ background: "none", border: "none", cursor: "pointer", color: fg, px: 2,
                fontFamily: F.DISPLAY, fontWeight: 400, whiteSpace: "nowrap",
                fontSize: { xs: "1.4rem", md: "1.85rem" }, letterSpacing: "0.04em",
                lineHeight: 1, minHeight: 44, display: "inline-flex", alignItems: "center",
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
              {D.couple}
            </ABox>
            {/* Right: second nav link (desktop) / spacer (mobile) */}
            <ABox sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              {isMobile
                ? <ABox sx={{ width: 40 }} />
                : <NavLink item={NAV[1]} active={route === NAV[1].hash} />}
            </ABox>
          </ABox>
        </AContainer>
      </ABox>

      <ADrawer anchor="top" open={open} onClose={() => setOpen(false)}
        PaperProps={{ sx: { backgroundColor: C.cream, backgroundImage: "none", pt: 12, pb: 6 } }}>
        <AStack spacing={1} alignItems="center" sx={{ position: "relative" }}>
          <AIconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: -64, right: 16, color: C.ink }}>
            <Burger open />
          </AIconButton>
          {[{ label: "Início", hash: "#/" }, ...NAV].map((item) => (
            <AButton key={item.hash} onClick={go(item.hash)}
              sx={{ fontFamily: F.DISPLAY, textTransform: "none", letterSpacing: "0.02em",
                fontSize: "2rem", color: C.ink, py: 1.2, minHeight: 56,
                WebkitTapHighlightColor: "transparent" }}>
              {item.label}
            </AButton>
          ))}
        </AStack>
      </ADrawer>
    </>
  );
}

function Footer() {
  const D = window.DATA, C = window.COLORS, F = window.FONTS;
  const go = (h) => () => { window.location.hash = h; };
  return (
    <ABox component="footer" sx={{ backgroundColor: C.ink, color: "#E9E0CF", py: { xs: 9, md: 12 }, textAlign: "center" }}>
      <AContainer maxWidth="md">
        <AType sx={{ fontFamily: F.SANS, fontWeight: 400, letterSpacing: "0.42em", textTransform: "uppercase",
          fontSize: "0.66rem", color: C.accent, mb: 2.5, pl: "0.42em" }}>
          — {D.dateShort} —
        </AType>
        <AType sx={{ fontFamily: F.DISPLAY, fontSize: { xs: "2.6rem", md: "3.6rem" }, fontWeight: 300, mb: 1, color: "#F7F2E9" }}>
          {D.couple}
        </AType>
        <AType variant="body2" sx={{ color: "#A99F8C", mb: 4 }}>{D.venue} · {D.address2}</AType>
        <AStack direction="row" spacing={4} justifyContent="center" sx={{ mb: 5 }}>
          {[{ label: "Início", hash: "#/" }, ...NAV].map((item) => (
            <ABox key={item.hash} component="button" onClick={go(item.hash)}
              sx={{ background: "none", border: "none", cursor: "pointer", color: "#E9E0CF",
                fontFamily: F.SANS, fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase",
                fontSize: "0.68rem", opacity: 0.85, "&:hover": { opacity: 1 },
                minHeight: 44, minWidth: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation", px: 1 }}>
              {item.label}
            </ABox>
          ))}
        </AStack>
        <AType sx={{ fontFamily: F.SANS, fontWeight: 300, fontSize: "0.64rem", letterSpacing: "0.14em",
          color: "#7E7565", textTransform: "uppercase" }}>
          Com amor, em São José dos Campos
        </AType>
      </AContainer>
    </ABox>
  );
}

function App() {
  const route = useRoute();
  let Page;
  if (route === "#/when-where") Page = window.WhenWhere;
  else if (route === "#/rsvp") Page = window.RSVP;
  else Page = window.Home;

  return (
    <ThemeProvider theme={window.AppTheme}>
      <CssBaseline />
      <ABox sx={{ backgroundColor: window.COLORS.cream, minHeight: "100vh", overflowX: "hidden" }}>
        <NavBar route={route} />
        <ABox key={route}><Page /></ABox>
        <Footer />
      </ABox>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
