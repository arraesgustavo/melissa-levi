/* global MaterialUI, React */
const {
  AppBar, Toolbar, Box, Container, Typography, Button, Stack, Drawer, IconButton, useScrollTrigger, useMediaQuery, Divider,
} = MaterialUI;

const W = window.WEDDING;
const { Icons } = window;

/* ----------------------------------------------------------------------
   Scroll reveal — adds .in when element enters viewport
---------------------------------------------------------------------- */
function Reveal({ children, delay = 0, sx = {}, as = Box }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); io.unobserve(el); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return React.createElement(as, { ref, className: "reveal", sx }, children);
}
window.Reveal = Reveal;

/* ----------------------------------------------------------------------
   Small primitives
---------------------------------------------------------------------- */
function Eyebrow({ children, sx = {}, color = "primary.main" }) {
  return (
    <Typography variant="overline" sx={{ color, display: "block", ...sx }}>
      {children}
    </Typography>
  );
}
window.Eyebrow = Eyebrow;

/* A thin centered rule with a small diamond — recurring section divider */
function Ornament({ sx = {}, color = "primary.main" }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, ...sx }}>
      <Box sx={{ width: 46, height: "1px", bgcolor: "divider" }} />
      <Box sx={{ width: 7, height: 7, transform: "rotate(45deg)", border: "1px solid", borderColor: color }} />
      <Box sx={{ width: 46, height: "1px", bgcolor: "divider" }} />
    </Box>
  );
}
window.Ornament = Ornament;

/* Section title block: eyebrow + serif heading + optional italic subtitle */
function SectionHead({ eyebrow, title, subtitle, align = "center", maxWidth = 720, sx = {}, titleSx = {} }) {
  return (
    <Box sx={{ textAlign: align, mx: align === "center" ? "auto" : 0, maxWidth, ...sx }}>
      {eyebrow && <Eyebrow sx={{ mb: 2.5 }}>{eyebrow}</Eyebrow>}
      <Typography variant="h3" sx={{ fontSize: { xs: "2.4rem", md: "3.2rem" }, ...titleSx }}>{title}</Typography>
      {subtitle && <Typography variant="subtitle1" sx={{ mt: 2.5 }}>{subtitle}</Typography>}
    </Box>
  );
}
window.SectionHead = SectionHead;

/* ----------------------------------------------------------------------
   Navigation — centered monogram logo, links flanking, mobile drawer
---------------------------------------------------------------------- */
const NAV = [
  { label: "When & Where", route: "#/when-where" },
  { label: "RSVP", route: "#/rsvp" },
];

function NavLink({ label, route, current, onClick }) {
  const active = current === route;
  return (
    <Box
      component="a"
      href={route}
      onClick={onClick}
      sx={{
        position: "relative", textDecoration: "none", color: "text.primary",
        fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.72rem",
        letterSpacing: "0.26em", textTransform: "uppercase", py: 1, cursor: "pointer",
        "&:after": { content: '""', position: "absolute", left: 0, right: 0, bottom: 2, height: "1px", bgcolor: "primary.main", transform: active ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform .45s cubic-bezier(.16,.84,.44,1)" },
        "&:hover:after": { transform: "scaleX(1)" },
      }}
    >
      {label}
    </Box>
  );
}

function NavBar({ current, navigate }) {
  const isMobile = useMediaQuery("(max-width:899px)");
  const [open, setOpen] = React.useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 40 });
  const onHome = current === "#/" || current === "" || current === "#";

  const go = (route) => (e) => { e.preventDefault(); setOpen(false); navigate(route); };

  // On the home page the bar floats transparent over the hero until scrolled.
  const floating = onHome && !trigger;
  const fg = floating ? "#fff" : "#26231b";

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: floating ? "transparent" : "rgba(247,243,234,0.92)",
          backdropFilter: floating ? "none" : "saturate(140%) blur(8px)",
          borderBottom: floating ? "1px solid transparent" : "1px solid",
          borderColor: "divider",
          color: fg,
          transition: "background-color .5s ease, color .5s ease, border-color .5s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 88 }, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
            {/* Left */}
            <Box sx={{ justifySelf: "start" }}>
              {isMobile ? (
                <IconButton onClick={() => setOpen(true)} sx={{ color: fg, ml: -1 }} aria-label="menu">
                  <Icons.Menu />
                </IconButton>
              ) : (
                <NavLink {...NAV[0]} current={current} onClick={go(NAV[0].route)} />
              )}
            </Box>

            {/* Center logo */}
            <Box
              component="a"
              href="#/"
              onClick={go("#/")}
              sx={{ justifySelf: "center", textDecoration: "none", color: "inherit", textAlign: "center", cursor: "pointer" }}
            >
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: { xs: "1.5rem", md: "1.9rem" }, lineHeight: 1, letterSpacing: "0.02em" }}>
                {W.names}
              </Typography>
            </Box>

            {/* Right */}
            <Box sx={{ justifySelf: "end" }}>
              {!isMobile && <NavLink {...NAV[1]} current={current} onClick={go(NAV[1].route)} />}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="top" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: "background.default", backgroundImage: "none" } }}>
        <Box sx={{ px: 3, py: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>{W.names}</Typography>
          <IconButton onClick={() => setOpen(false)} aria-label="close"><Icons.Close /></IconButton>
        </Box>
        <Stack sx={{ py: 4 }} alignItems="center" spacing={3}>
          <NavLink label="Home" route="#/" current={current} onClick={go("#/")} />
          {NAV.map((n) => <NavLink key={n.route} {...n} current={current} onClick={go(n.route)} />)}
          <Button variant="outlined" onClick={go("#/rsvp")} sx={{ mt: 1 }}>RSVP</Button>
        </Stack>
      </Drawer>
    </>
  );
}
window.NavBar = NavBar;

/* ----------------------------------------------------------------------
   Footer
---------------------------------------------------------------------- */
function Footer({ navigate }) {
  const go = (route) => (e) => { e.preventDefault(); navigate(route); };
  return (
    <Box component="footer" sx={{ bgcolor: "#26231b", color: "rgba(247,243,234,0.86)", py: { xs: 8, md: 11 } }}>
      <Container maxWidth="md">
        <Stack alignItems="center" spacing={3.5} textAlign="center">
          <Box sx={{ width: 7, height: 7, transform: "rotate(45deg)", border: "1px solid", borderColor: "rgba(247,243,234,0.5)" }} />
          <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: "2.4rem", md: "3rem" }, color: "#f7f3ea", lineHeight: 1 }}>
            {W.names}
          </Typography>
          <Typography variant="overline" sx={{ color: "rgba(247,243,234,0.62)" }}>{W.dateShort + " \u00B7 " + W.venue}</Typography>
          <Stack direction="row" spacing={4} sx={{ pt: 1 }}>
            {[{ l: "Home", r: "#/" }, { l: "When & Where", r: "#/when-where" }, { l: "RSVP", r: "#/rsvp" }].map((x) => (
              <Box key={x.r} component="a" href={x.r} onClick={go(x.r)} sx={{ color: "rgba(247,243,234,0.78)", textDecoration: "none", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", "&:hover": { color: "#fff" } }}>{x.l}</Box>
            ))}
          </Stack>
          <Typography variant="caption" sx={{ color: "rgba(247,243,234,0.4)", letterSpacing: "0.14em", pt: 2 }}>
            With love, {W.bride} &amp; {W.groom}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
window.Footer = Footer;

/* A reusable full-bleed page intro band used on subpages */
function PageHero({ photoId, eyebrow, title, label }) {
  const { Img } = window;
  return (
    <Box sx={{ position: "relative", height: { xs: "52vh", md: "62vh" }, minHeight: 360, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
      <Img id={photoId} label={label} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,18,12,0.28) 0%, rgba(20,18,12,0.08) 40%, rgba(20,18,12,0.62) 100%)" }} />
      <Container maxWidth="lg" sx={{ position: "relative", pb: { xs: 5, md: 8 } }}>
        <Eyebrow color="rgba(255,255,255,0.85)" sx={{ mb: 2 }}>{eyebrow}</Eyebrow>
        <Typography variant="h1" sx={{ color: "#fff", fontSize: { xs: "3rem", md: "5rem" } }}>{title}</Typography>
      </Container>
    </Box>
  );
}
window.PageHero = PageHero;
