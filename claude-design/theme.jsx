/* global React, MaterialUI */
const { createTheme } = MaterialUI;

/* ---------------------------------------------------------------------------
   Palette — warm ivory + near-black, the minimal editorial Rey aesthetic
--------------------------------------------------------------------------- */
const COLORS = {
  cream: "#F4EEE3",       // page background
  creamDeep: "#ECE3D4",   // alternating section
  ink: "#1C1B19",         // near-black text
  taupe: "#7A6F60",       // secondary text
  line: "#CDC2AE",        // hairline rules
  accent: "#8A6F52",      // restrained warm bronze for tiny accents
};
window.COLORS = COLORS;

const DISPLAY = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Jost", "Helvetica Neue", Arial, sans-serif';

const AppTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: COLORS.cream, paper: COLORS.cream },
    text: { primary: COLORS.ink, secondary: COLORS.taupe },
    primary: { main: COLORS.ink },
    divider: COLORS.line,
  },
  typography: {
    fontFamily: SANS,
    h1: { fontFamily: DISPLAY, fontWeight: 400, letterSpacing: "0.005em", lineHeight: 1.02 },
    h2: { fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.08 },
    h3: { fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.12 },
    h4: { fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.2 },
    h5: { fontFamily: DISPLAY, fontWeight: 400, lineHeight: 1.3 },
    body1: { fontFamily: SANS, fontWeight: 300, fontSize: "1.0625rem", lineHeight: 1.95, letterSpacing: "0.01em", color: COLORS.taupe },
    body2: { fontFamily: SANS, fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.9, letterSpacing: "0.01em", color: COLORS.taupe },
    button: { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: "0.72rem" },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: COLORS.cream } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 0,
          paddingTop: 14, paddingBottom: 14, paddingLeft: 30, paddingRight: 30,
          minHeight: 44, // iOS tap target
          transition: "all .4s ease",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        },
        outlined: {
          borderColor: COLORS.ink, color: COLORS.ink, borderWidth: 1,
          "&:hover": { backgroundColor: COLORS.ink, color: COLORS.cream, borderColor: COLORS.ink },
        },
        contained: {
          backgroundColor: COLORS.ink, color: COLORS.cream,
          "&:hover": { backgroundColor: "#000" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0, backgroundColor: "transparent",
          "& fieldset": { borderColor: COLORS.line },
          "&:hover fieldset": { borderColor: COLORS.taupe },
          "&.Mui-focused fieldset": { borderColor: COLORS.ink, borderWidth: 1 },
        },
        input: { fontFamily: SANS, fontWeight: 300, color: COLORS.ink, fontSize: "1rem" }, // 16px prevents iOS zoom
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: SANS, fontWeight: 300, color: COLORS.taupe } } },
    MuiSelect: {
      styleOverrides: { select: { fontSize: "1rem" } }, // 16px prevents iOS zoom
    },
    MuiMenuItem: {
      styleOverrides: { root: { minHeight: 44 } }, // comfortable tap targets in dropdowns
    },
    MuiRadio: {
      defaultProps: { disableRipple: true },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: { minHeight: 44, alignItems: "center" }, // tap target
        label: { paddingTop: 2, paddingBottom: 2 },
      },
    },
  },
});
window.AppTheme = AppTheme;
window.FONTS = { DISPLAY, SANS };

/* ---------------------------------------------------------------------------
   Eyebrow — the spaced uppercase label used above every section
--------------------------------------------------------------------------- */
function Eyebrow({ children, sx, color }) {
  const { Typography } = MaterialUI;
  return (
    <Typography
      component="div"
      sx={{
        fontFamily: SANS, fontWeight: 400, textTransform: "uppercase",
        letterSpacing: "0.42em", fontSize: { xs: "0.66rem", md: "0.72rem" },
        color: color || COLORS.accent, mb: 3, pl: "0.42em",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
window.Eyebrow = Eyebrow;

/* A short centered hairline ornament */
function Ornament({ sx }) {
  const { Box } = MaterialUI;
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, my: 4, ...sx }}>
      <Box sx={{ width: 46, height: "1px", background: COLORS.line }} />
      <Box sx={{ width: 5, height: 5, transform: "rotate(45deg)", border: `1px solid ${COLORS.accent}` }} />
      <Box sx={{ width: 46, height: "1px", background: COLORS.line }} />
    </Box>
  );
}
window.Ornament = Ornament;

/* ---------------------------------------------------------------------------
   FadeImage — object-fit cover, fades in on load, graceful fallback block
--------------------------------------------------------------------------- */
function FadeImage({ src, alt, ratio, sx, position }) {
  const { Box } = MaterialUI;
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  return (
    <Box sx={{ position: "relative", overflow: "hidden", backgroundColor: COLORS.creamDeep,
      ...(ratio ? { aspectRatio: ratio } : {}), ...sx }}>
      {!failed && (
        <Box
          component="img"
          src={src}
          alt={alt || ""}
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          sx={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: position || "center",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "scale(1.04)",
            transition: "opacity 1.2s ease, transform 1.6s ease",
          }}
        />
      )}
      {failed && (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(135deg, ${COLORS.creamDeep}, ${COLORS.line})` }}>
          <Box sx={{ fontFamily: DISPLAY, fontStyle: "italic", color: COLORS.taupe, fontSize: 22 }}>M &amp; L</Box>
        </Box>
      )}
    </Box>
  );
}
window.FadeImage = FadeImage;

/* ---------------------------------------------------------------------------
   Reveal — scroll-triggered fade-up wrapper (IntersectionObserver)
--------------------------------------------------------------------------- */
function Reveal({ children, delay = 0, sx, as }) {
  const { Box } = MaterialUI;
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Set animation-delay so staggered items feel sequential
    el.style.animationDelay = delay + "ms";
    const show = () => el.classList.add("in");
    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.94 && r.bottom > 0;
    };
    // Show immediately if already in viewport
    if (inView()) { show(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { show(); io.unobserve(el); } });
    }, { threshold: 0.06, rootMargin: "0px 0px -4% 0px" });
    io.observe(el);
    const onScroll = () => { if (inView()) { show(); cleanup(); } };
    const cleanup = () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [delay]);
  return <Box ref={ref} component={as || "div"} className="reveal" sx={sx}>{children}</Box>;
}
window.Reveal = Reveal;

/* ---------------------------------------------------------------------------
   Wedding data — single source of truth (also used by exported App.jsx)
--------------------------------------------------------------------------- */
window.DATA = {
  bride: "Melissa",
  groom: "Levi",
  couple: "Melissa & Levi",
  dateShort: "07.XX.2027",
  dateLong: "Sábado, XX de Julho de 2027",
  rsvpBy: "1 de Maio de 2027",
  ceremony: "Cerimônia · 16h",
  reception: "Recepção · 18h — 23h",
  venue: "A ser definido",
  address1: "São José dos Campos",
  address2: "São Paulo, Brasil",
  phone: "A confirmar",
  email: "contato@melissaelevi.com.br",
  img: {
    hero: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=2000&q=80&auto=format&fit=crop",
    venue: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80&auto=format&fit=crop",
    bride: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1100&q=80&auto=format&fit=crop",
    groom: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1100&q=80&auto=format&fit=crop",
    cta: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=2000&q=80&auto=format&fit=crop",
  },
};
