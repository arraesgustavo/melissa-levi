
/* ==================== THEME ==================== */
;(function(){
/* global MaterialUI, React */
const { createTheme } = MaterialUI;

/* ----------------------------------------------------------------------
   Wedding content — single source of truth (editable)
---------------------------------------------------------------------- */
const WEDDING = {
  bride: "Melissa",
  groom: "Levi",
  names: "Melissa & Levi",
  monogram: "M\u00A0&\u00A0L",
  dateShort: "09.19.2026",
  dateLong: "Saturday, September 19, 2026",
  ceremony: "Ceremony \u00B7 4:00 pm",
  reception: "Reception \u00B7 6:00 \u2013 11:00 pm",
  tagline: "A Match Made In Heaven",
  invitation:
    "Melissa and Levi joyfully request the pleasure of your company as we speak our vows and join in marriage, in the presence of family and friends.",
  invitation2:
    "We\u2019ll begin with a garden ceremony at golden hour, then gather for dinner and dancing beneath the orchard lights. Dress code is black tie optional.",
  venue: "The Hartwell Estate",
  venueLine1: "412 Orchard Lane",
  venueLine2: "Rhinebeck, NY 12572",
  phone: "(555) 014\u20132980",
  email: "hello@melissaandlevi.com",
  hotel: "The Hartwell Estate",
  hotelDesc:
    "We\u2019ve reserved a block of rooms at The Hartwell Estate in the Hudson Valley. Just mention the Hartwell\u2013Levi wedding when you reserve.",
  rsvpDeadline: "Kindly respond by August 15, 2026",
};
window.WEDDING = WEDDING;

/* Palette tokens */
const CREAM = "#f7f3ea";
const CREAM_DEEP = "#efe8d8";
const PAPER = "#fbf8f1";
const INK = "#26231b";
const INK_SOFT = "#6b6453";
const GOLD = "#8a7a57";
const GOLD_DEEP = "#6f6243";

/* ----------------------------------------------------------------------
   MUI theme — Rey editorial: high-contrast serif display, cream tones
---------------------------------------------------------------------- */
const reyTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: GOLD, dark: GOLD_DEEP, contrastText: "#fff" },
    background: { default: CREAM, paper: PAPER },
    text: { primary: INK, secondary: INK_SOFT },
    divider: "rgba(38,35,27,0.16)",
    cream: CREAM,
    creamDeep: CREAM_DEEP,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: "'Jost', system-ui, sans-serif",
    h1: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.01em" },
    h2: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.005em" },
    h3: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, lineHeight: 1.08 },
    h4: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, lineHeight: 1.15 },
    h5: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 },
    h6: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 },
    subtitle1: { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.5rem", lineHeight: 1.4, color: INK_SOFT },
    body1: { fontWeight: 300, fontSize: "1.02rem", lineHeight: 1.85, letterSpacing: "0.005em" },
    body2: { fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 },
    overline: { fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.72rem", letterSpacing: "0.42em", lineHeight: 2, textTransform: "uppercase" },
    button: { fontFamily: "'Jost', sans-serif", fontWeight: 400, letterSpacing: "0.26em", textTransform: "uppercase", fontSize: "0.74rem" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: { borderRadius: 0, paddingTop: 14, paddingBottom: 14, paddingLeft: 34, paddingRight: 34, whiteSpace: "nowrap", transition: "all .45s cubic-bezier(.16,.84,.44,1)" },
        outlined: { borderColor: INK, color: INK, "&:hover": { backgroundColor: INK, color: CREAM, borderColor: INK } },
        contained: { backgroundColor: INK, "&:hover": { backgroundColor: GOLD } },
      },
    },
    MuiTextField: { defaultProps: { variant: "standard" } },
    MuiInput: {
      styleOverrides: {
        root: { fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "1.05rem", "&:before": { borderColor: "rgba(38,35,27,0.28)" }, "&:hover:not(.Mui-disabled):before": { borderColor: GOLD }, "&:after": { borderColor: GOLD } },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontFamily: "'Jost', sans-serif", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.7rem", color: INK_SOFT, "&.Mui-focused": { color: GOLD } } },
    },
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: CREAM } },
    },
  },
});
window.reyTheme = reyTheme;

/* ----------------------------------------------------------------------
   Icons — slim SvgIcon set (no external icon package needed)
---------------------------------------------------------------------- */
const { SvgIcon } = MaterialUI;
function mkIcon(path, viewBox) {
  return function Icon(props) {
    const { sx, ...rest } = props || {};
    return React.createElement(SvgIcon, Object.assign({
      viewBox: viewBox || "0 0 24 24",
      sx: Object.assign({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }, sx),
    }, rest),
      React.createElement("path", { d: path }));
  };
}
const Icons = {
  Menu: mkIcon("M3 7h18M3 12h18M3 17h18"),
  Close: mkIcon("M5 5l14 14M19 5L5 19"),
  Place: mkIcon("M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM15 10a3 3 0 11-6 0 3 3 0 016 0z"),
  Event: mkIcon("M7 2v3M17 2v3M3.5 8.5h17M5 5h14a1.5 1.5 0 011.5 1.5V19A1.5 1.5 0 0119 20.5H5A1.5 1.5 0 013.5 19V6.5A1.5 1.5 0 015 5z"),
  Email: mkIcon("M3.5 6h17a1 1 0 011 1v10a1 1 0 01-1 1h-17a1 1 0 01-1-1V7a1 1 0 011-1zm.4 1.2L12 12.5l8.1-5.3"),
  Phone: mkIcon("M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"),
  Hotel: mkIcon("M3 20V7M3 11h13a4 4 0 014 4v5M3 20h18M7 11V9a1 1 0 011-1h4a1 1 0 011 1v2"),
  Arrow: mkIcon("M4 12h15M13 6l6 6-6 6"),
  Heart: mkIcon("M12 20s-7-4.5-9.2-9C1.5 8.4 2.8 5 6 5c1.9 0 3.2 1.1 4 2.3C10.8 6.1 12.1 5 14 5c3.2 0 4.5 3.4 3.2 6C16 15.5 12 20 12 20z"),
  Car: mkIcon("M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11M5 11h14a1 1 0 011 1v5h-3v-2H7v2H4v-5a1 1 0 011-1zm2 4h.01M17 15h.01"),
  Gift: mkIcon("M4 9h16v3H4zM5 12v8h14v-8M12 9v11M12 9S9 4 6.5 5.5 9 9 12 9zm0 0s3-5 5.5-3.5S15 9 12 9z"),
  Check: mkIcon("M4 12.5l5 5 11-11"),
};
window.Icons = Icons;

/* ----------------------------------------------------------------------
   Image helper — Unsplash with graceful editorial fallback
---------------------------------------------------------------------- */
function placeholderURI(label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
    <defs><pattern id='s' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
      <rect width='14' height='14' fill='#efe8d8'/><line x1='0' y1='0' x2='0' y2='14' stroke='#e2d8bf' stroke-width='7'/></pattern></defs>
    <rect width='800' height='800' fill='#f1ead9'/><rect width='800' height='800' fill='url(#s)'/>
    <text x='50%' y='50%' font-family='monospace' font-size='26' fill='#a99c7c' text-anchor='middle'>${label}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const { Box } = MaterialUI;
/* props: id (unsplash photo id), label, alt, ratio (e.g. '3/4'), sx, w */
function Img({ id, label = "photo", alt = "", ratio, sx = {}, w = 1400, position = "center" }) {
  const src = id
    ? `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
    : placeholderURI(label);
  const ratioSx = ratio ? { aspectRatio: ratio } : {};
  return React.createElement(Box, {
    component: "img",
    src,
    alt: alt || label,
    loading: "lazy",
    onError: (e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderURI(label); },
    sx: Object.assign({ width: "100%", height: ratio ? "auto" : "100%", objectFit: "cover", objectPosition: position, display: "block", backgroundColor: CREAM_DEEP }, ratioSx, sx),
  });
}
window.Img = Img;
window.placeholderURI = placeholderURI;

/* Curated Unsplash photo ids (editorial wedding set) */
window.PHOTOS = {
  hero: "1519225421980-715cb0215aed",
  couple: "1522673607200-164d1b6ce486",
  bride: "1487412720507-e7ab37603c6f",
  groom: "1507003211169-0a1dd7228f2d",
  venue: "1464366400600-7168b8af9bc3",
  ceremony: "1519741497674-611481863552",
  reception: "1511285560929-80b456fea0bc",
  hotel: "1551882547-ff40c63fe5fa",
  rings: "1583939003579-730e3918a45a",
  flowers: "1606800052052-a08af7148866",
  table: "1478146896981-b80fe463b330",
  toast: "1530103862676-de8c9debad1d",
  rsvp: "1469371670807-013ccf25f16a",
  travel: "1502920917128-1aa500764cbd",
};

})();

/* ==================== COMPONENTS ==================== */
;(function(){
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
              <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: { xs: "1.5rem", md: "1.9rem" }, lineHeight: 1, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
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

})();
