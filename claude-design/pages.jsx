
/* ==================== HOME ==================== */
;(function(){
/* global MaterialUI, React */
const { Box, Container, Typography, Button, Stack, Grid, Divider } = MaterialUI;

function HomePage({ navigate }) {
  const W = window.WEDDING;
  const P = window.PHOTOS;
  const { Img, Reveal, Eyebrow, Ornament, SectionHead, Icons } = window;
  const go = (route) => (e) => { e.preventDefault(); navigate(route); };

  const DetailCard = ({ icon: Icon, eyebrow, title, lines, cta }) => (
    <Reveal sx={{ height: "100%" }}>
      <Stack spacing={2.5} alignItems="center" textAlign="center" sx={{ px: { xs: 1, md: 4 }, py: { xs: 4, md: 2 } }}>
        <Box sx={{ width: 58, height: 58, borderRadius: "50%", border: "1px solid", borderColor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main" }}>
          <Icon sx={{ fontSize: 26 }} />
        </Box>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Typography variant="h4" sx={{ fontSize: { xs: "1.9rem", md: "2.2rem" } }}>{title}</Typography>
        <Box>
          {lines.map((l, i) => (
            <Typography key={i} variant="body1" sx={{ color: i === 0 ? "text.primary" : "text.secondary" }}>{l}</Typography>
          ))}
        </Box>
        {cta && (
          <Button variant="text" onClick={go("#/when-where")} sx={{ color: "primary.main", px: 0, "&:hover": { bgcolor: "transparent", color: "primary.dark" } }} endIcon={<Icons.Arrow sx={{ fontSize: 16 }} />}>
            {cta}
          </Button>
        )}
      </Stack>
    </Reveal>
  );

  return (
    <Box>
      {/* ---------------------------------------------------------------- HERO */}
      <Box sx={{ position: "relative", height: "100vh", minHeight: 620, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Img id={P.hero} label="hero — couple at golden hour" position="center 35%" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,18,12,0.42) 0%, rgba(20,18,12,0.18) 45%, rgba(20,18,12,0.52) 100%)" }} />
        <Box sx={{ position: "relative", textAlign: "center", color: "#fff", px: 3 }}>
          <Box className="reveal in" sx={{ animation: "none" }}>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.92)", fontSize: { xs: "0.7rem", md: "0.8rem" }, mb: { xs: 2, md: 3 }, display: "block" }}>
              {"\u2014  " + W.dateShort + "  \u2014"}
            </Typography>
            <Typography variant="h1" sx={{ color: "#fff", fontSize: "clamp(2.8rem, 9vw, 6.5rem)", whiteSpace: "nowrap", mb: { xs: 2, md: 3 } }}>
              {W.bride}<Box component="span" sx={{ fontStyle: "italic", fontWeight: 400, px: { xs: 0.8, md: 1.4 } }}>&amp;</Box>{W.groom}
            </Typography>
            <Typography sx={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, letterSpacing: "0.36em", textTransform: "uppercase", fontSize: { xs: "0.72rem", md: "0.92rem" }, color: "rgba(255,255,255,0.95)" }}>
              We&rsquo;re Getting Married
            </Typography>
          </Box>
        </Box>
        {/* Scroll cue */}
        <Box sx={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
          <Box sx={{ width: "1px", height: 46, bgcolor: "rgba(255,255,255,0.6)", mx: "auto", animation: "drop 2.4s ease-in-out infinite", "@keyframes drop": { "0%,100%": { opacity: 0.3, transform: "scaleY(0.6)" }, "50%": { opacity: 1, transform: "scaleY(1)" } }, transformOrigin: "top" }} />
        </Box>
      </Box>

      {/* ---------------------------------------------------------------- INVITATION */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 16 }, textAlign: "center" }}>
        <Reveal>
          <Eyebrow sx={{ mb: 3 }}>{W.tagline}</Eyebrow>
          <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" }, maxWidth: 860, mx: "auto", mb: 5 }}>
            {W.invitation}
          </Typography>
          <Ornament sx={{ my: 5 }} />
          <Typography variant="body1" sx={{ maxWidth: 560, mx: "auto", fontSize: "1.08rem" }}>
            {W.invitation2}
          </Typography>
        </Reveal>
      </Container>

      {/* ---------------------------------------------------------------- WHEN & WHERE */}
      <Box sx={{ bgcolor: "background.paper", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container alignItems="stretch" sx={{ "& > .MuiGrid-item": { borderRight: { md: "1px solid" }, borderColor: { md: "divider" }, "&:last-of-type": { borderRight: "none" } } }}>
            <Grid item xs={12} md={6}>
              <DetailCard icon={Icons.Event} eyebrow="When" title={W.dateLong} lines={[W.ceremony, W.reception]} cta="Full details" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Divider sx={{ display: { xs: "block", md: "none" }, my: 1 }} />
              <DetailCard icon={Icons.Place} eyebrow="Where" title={W.venue} lines={[W.venueLine1, W.venueLine2]} cta="Travel & map" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ---------------------------------------------------------------- ACCOMMODATIONS */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Reveal>
              <Img id={P.hotel} label="the venue — hudson valley estate" ratio="4/5" sx={{ boxShadow: "0 30px 60px -30px rgba(38,35,27,0.45)" }} />
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <Reveal delay={120}>
              <Eyebrow sx={{ mb: 2.5 }}>Accommodations</Eyebrow>
              <Typography variant="h3" sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, mb: 3 }}>{W.hotel}</Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 460 }}>{W.hotelDesc}</Typography>
              <Stack spacing={1.5} sx={{ mb: 5 }}>
                {[[Icons.Place, W.venueLine1 + ", " + W.venueLine2], [Icons.Phone, W.phone], [Icons.Email, W.email]].map(([Ic, txt], i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    <Ic sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="body2" sx={{ letterSpacing: "0.04em" }}>{txt}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button variant="outlined" onClick={go("#/when-where")} endIcon={<Icons.Arrow sx={{ fontSize: 16 }} />}>Book Online</Button>
            </Reveal>
          </Grid>
        </Grid>
      </Container>

      {/* ---------------------------------------------------------------- BRIDE & GROOM */}
      <Box sx={{ bgcolor: "creamDeep" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Reveal><SectionHead eyebrow="The Happy Couple" title="A little about us" sx={{ mb: { xs: 7, md: 11 } }} /></Reveal>
          <Grid container spacing={{ xs: 7, md: 10 }}>
            {[
              { who: "The Bride", name: W.bride, photo: P.bride, label: "the bride", bio: "Melissa grew up between the Bay Area and the Hudson Valley, chasing light with a film camera in hand. After studying photography in New York and Florence, she now runs a small studio shooting interiors and the occasional wedding \u2014 though never, she insists, her own." },
              { who: "The Groom", name: W.groom, photo: P.groom, label: "the groom", bio: "Levi was born in Chicago and spent a decade moving between Lisbon and Berlin building things that people actually use. A devoted maker of slow dinners and worse puns, he met Melissa in a rainstorm outside a bookshop and has been talking her ear off ever since." },
            ].map((p, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Reveal delay={i * 130}>
                  <Stack spacing={3.5} alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "left" }}>
                    <Img id={p.photo} label={p.label} ratio="1/1" sx={{ width: 200, height: 200, borderRadius: "50%", boxShadow: "0 24px 48px -24px rgba(38,35,27,0.4)" }} />
                    <Box>
                      <Eyebrow sx={{ mb: 1.5 }}>{p.who}</Eyebrow>
                      <Typography variant="h3" sx={{ fontSize: { xs: "2.4rem", md: "3rem" }, mb: 2.5 }}>{p.name}</Typography>
                      <Typography variant="body1" sx={{ maxWidth: 460 }}>{p.bio}</Typography>
                    </Box>
                  </Stack>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ---------------------------------------------------------------- REGISTRY */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Reveal>
          <SectionHead
            eyebrow="The Registry"
            title="Your presence is the present"
            subtitle="Many of you are traveling far to celebrate with us, so your company means the world. If you\u2019d still like to give, a few favorites are below."
            sx={{ mb: { xs: 7, md: 10 } }}
          />
        </Reveal>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {[
            { id: P.flowers, label: "registry — home & garden", caption: "Home & Garden" },
            { id: P.table, label: "registry — the table", caption: "The Table" },
            { id: P.travel, label: "registry — honeymoon fund", caption: "Honeymoon Fund" },
          ].map((g, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Reveal delay={i * 110}>
                <Box sx={{ position: "relative", overflow: "hidden", cursor: "pointer", "&:hover img": { transform: "scale(1.06)" }, "&:hover .reg-ov": { opacity: 1 } }}>
                  <Img id={g.id} label={g.label} ratio="3/4" sx={{ transition: "transform 1.1s cubic-bezier(.16,.84,.44,1)" }} />
                  <Box className="reg-ov" sx={{ position: "absolute", inset: 0, bgcolor: "rgba(20,18,12,0.32)", opacity: 0, transition: "opacity .5s ease" }} />
                  <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, p: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", color: "#fff", textShadow: "0 2px 18px rgba(0,0,0,0.4)" }}>{g.caption}</Typography>
                    <Icons.Arrow sx={{ color: "#fff", fontSize: 22 }} />
                  </Box>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ---------------------------------------------------------------- CLOSING CTA */}
      <Box sx={{ position: "relative", overflow: "hidden", color: "#fff" }}>
        <Img id={P.toast} label="closing — a toast" position="center 40%" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(20,18,12,0.58)" }} />
        <Container maxWidth="md" sx={{ position: "relative", py: { xs: 12, md: 20 }, textAlign: "center" }}>
          <Reveal>
            <Ornament color="rgba(255,255,255,0.7)" sx={{ mb: 5 }} />
            <Typography variant="h2" sx={{ color: "#fff", fontSize: { xs: "2.6rem", md: "4.4rem" }, mb: 5, maxWidth: 760, mx: "auto" }}>
              We hope you&rsquo;ll join us on this special day.
            </Typography>
            <Button
              variant="contained"
              onClick={go("#/rsvp")}
              sx={{ bgcolor: "#fff", color: "#26231b", px: 6, py: 1.8, "&:hover": { bgcolor: "primary.main", color: "#fff" } }}
            >
              RSVP
            </Button>
            <Typography variant="overline" sx={{ display: "block", mt: 4, color: "rgba(255,255,255,0.75)" }}>{W.rsvpDeadline}</Typography>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}
window.HomePage = HomePage;

})();

/* ==================== WHEN & WHERE ==================== */
;(function(){
/* global MaterialUI, React */
const { Box, Container, Typography, Button, Stack, Grid, Divider } = MaterialUI;

function WhenWherePage({ navigate }) {
  const W = window.WEDDING;
  const P = window.PHOTOS;
  const { Img, Reveal, Eyebrow, Ornament, SectionHead, PageHero, Icons } = window;
  const go = (route) => (e) => { e.preventDefault(); navigate(route); };

  const schedule = [
    { time: "3:30 pm", title: "Guests Arrive", desc: "Welcome drinks on the east lawn as the quartet plays." },
    { time: "4:00 pm", title: "The Ceremony", desc: "We say our vows beneath the old oak in the walled garden." },
    { time: "5:00 pm", title: "Cocktail Hour", desc: "Canap\u00E9s, a signature spritz, and lawn games by the orchard." },
    { time: "6:00 pm", title: "Dinner", desc: "A family-style feast under the lights of the great barn." },
    { time: "8:00 pm", title: "Dancing", desc: "First dance, toasts, and the floor stays open till late." },
    { time: "11:00 pm", title: "Send-Off", desc: "A sparkler farewell down the orchard path." },
  ];

  const travel = [
    { icon: Icons.Car, title: "By Car", lines: ["Two hours north of Manhattan via the Taconic Parkway.", "Complimentary valet and on-site parking."] },
    { icon: Icons.Hotel, title: "Where to Stay", lines: ["A block of rooms is held at The Hartwell Estate.", "Mention the Hartwell\u2013Levi wedding to book."] },
    { icon: Icons.Place, title: "Getting Around", lines: ["Metro-North to Rhinecliff, then a 12-minute taxi.", "A shuttle runs from the hotel from 3:00 pm."] },
  ];

  return (
    <Box>
      <PageHero photoId={P.venue} eyebrow={W.dateLong} title="When & Where" label="venue exterior" />

      {/* INTRO */}
      <Container maxWidth="md" sx={{ py: { xs: 9, md: 14 }, textAlign: "center" }}>
        <Reveal>
          <Eyebrow sx={{ mb: 3 }}>The Celebration</Eyebrow>
          <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.2rem" }, mb: 4 }}>
            One long, golden evening in the Hudson Valley.
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 560, mx: "auto" }}>
            Everything happens at {W.venue} \u2014 from the garden ceremony to the last dance in the barn. Here&rsquo;s how the day will unfold and everything you&rsquo;ll need to get there.
          </Typography>
        </Reveal>
      </Container>

      {/* SCHEDULE TIMELINE */}
      <Box sx={{ bgcolor: "background.paper", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="md" sx={{ py: { xs: 9, md: 14 } }}>
          <Reveal><SectionHead eyebrow="The Schedule" title="Order of the Day" sx={{ mb: { xs: 7, md: 10 } }} /></Reveal>
          <Box sx={{ position: "relative", maxWidth: 640, mx: "auto" }}>
            {/* vertical line */}
            <Box sx={{ position: "absolute", left: { xs: 86, md: 150 }, top: 8, bottom: 8, width: "1px", bgcolor: "divider" }} />
            <Stack spacing={{ xs: 4.5, md: 6 }}>
              {schedule.map((s, i) => (
                <Reveal key={i} delay={i * 70}>
                  <Stack direction="row" spacing={{ xs: 3, md: 5 }} alignItems="flex-start">
                    <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: { xs: "1.1rem", md: "1.35rem" }, color: "primary.main", width: { xs: 70, md: 120 }, flexShrink: 0, textAlign: "right", pt: 0.5 }}>
                      {s.time}
                    </Typography>
                    <Box sx={{ position: "relative", flexShrink: 0, mt: 1 }}>
                      <Box sx={{ width: 9, height: 9, transform: "rotate(45deg)", bgcolor: "primary.main", outline: "5px solid", outlineColor: "background.paper" }} />
                    </Box>
                    <Box sx={{ pb: 0.5 }}>
                      <Typography variant="h5" sx={{ fontSize: { xs: "1.5rem", md: "1.9rem" }, mb: 0.5 }}>{s.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{s.desc}</Typography>
                    </Box>
                  </Stack>
                </Reveal>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* VENUE + MAP */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid container spacing={{ xs: 5, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Reveal delay={120}>
              <Eyebrow sx={{ mb: 2.5 }}>The Venue</Eyebrow>
              <Typography variant="h3" sx={{ fontSize: { xs: "2.6rem", md: "3.6rem" }, mb: 3 }}>{W.venue}</Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: 460 }}>
                A restored 1840s farmstead set on forty acres of orchard and walled gardens, with a stone great-barn at its heart. Black tie optional; the lawns are best enjoyed in block heels.
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 5 }}>
                {[[Icons.Place, W.venueLine1 + ", " + W.venueLine2], [Icons.Phone, W.phone], [Icons.Email, W.email]].map(([Ic, txt], i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="center">
                    <Ic sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="body2" sx={{ letterSpacing: "0.04em" }}>{txt}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button variant="outlined" href="https://maps.google.com" target="_blank" rel="noreferrer" endIcon={<Icons.Arrow sx={{ fontSize: 16 }} />}>Open in Maps</Button>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <Reveal>
              {/* Stylized map placeholder */}
              <Box sx={{ position: "relative", aspectRatio: "1/1", bgcolor: "creamDeep", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(38,35,27,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(38,35,27,0.06) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
                <Box sx={{ position: "absolute", top: "30%", left: "-10%", width: "130%", height: 26, bgcolor: "rgba(138,122,87,0.18)", transform: "rotate(-14deg)" }} />
                <Box sx={{ position: "absolute", top: "62%", left: "-10%", width: "130%", height: 14, bgcolor: "rgba(138,122,87,0.12)", transform: "rotate(8deg)" }} />
                <Stack alignItems="center" spacing={1.5} sx={{ position: "absolute", inset: 0, justifyContent: "center" }}>
                  <Box sx={{ color: "primary.main" }}><Icons.Place sx={{ fontSize: 44 }} /></Box>
                  <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem" }}>{W.venue}</Typography>
                  <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary", letterSpacing: "0.1em" }}>41.9265&deg; N, 73.9123&deg; W</Typography>
                </Stack>
              </Box>
            </Reveal>
          </Grid>
        </Grid>
      </Container>

      {/* TRAVEL */}
      <Box sx={{ bgcolor: "creamDeep" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Reveal><SectionHead eyebrow="Travel & Stay" title="Getting There" sx={{ mb: { xs: 7, md: 11 } }} /></Reveal>
          <Grid container spacing={{ xs: 5, md: 6 }}>
            {travel.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Reveal delay={i * 110}>
                  <Stack spacing={2.5} alignItems="center" textAlign="center" sx={{ px: 2 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid", borderColor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main" }}>
                      <t.icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontSize: "1.7rem" }}>{t.title}</Typography>
                    <Box>{t.lines.map((l, j) => <Typography key={j} variant="body2" sx={{ color: "text.secondary", maxWidth: 280 }}>{l}</Typography>)}</Box>
                  </Stack>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA strip */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 15 }, textAlign: "center" }}>
        <Reveal>
          <Ornament sx={{ mb: 4 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: "2.4rem", md: "3.4rem" }, mb: 4 }}>Will we see you there?</Typography>
          <Button variant="contained" onClick={go("#/rsvp")} sx={{ px: 6, py: 1.8 }}>RSVP</Button>
          <Typography variant="overline" sx={{ display: "block", mt: 4, color: "text.secondary" }}>{W.rsvpDeadline}</Typography>
        </Reveal>
      </Container>
    </Box>
  );
}
window.WhenWherePage = WhenWherePage;

})();

/* ==================== RSVP ==================== */
;(function(){
/* global MaterialUI, React */
const {
  Box, Container, Typography, Button, Stack, Grid, Divider,
  TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Select, MenuItem, InputLabel, FormHelperText, Collapse, Fade, Grow,
} = MaterialUI;

function RsvpPage({ navigate }) {
  const W = window.WEDDING;
  const P = window.PHOTOS;
  const { Img, Reveal, Eyebrow, Ornament, Icons } = window;
  const go = (route) => (e) => { e.preventDefault(); navigate(route); };

  const blank = { name: "", email: "", attending: "", guests: "1", meal: "", song: "", notes: "" };
  const [form, setForm] = React.useState(blank);
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const attending = form.attending === "yes";

  const set = (key) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [key]: v }));
    if (errors[key]) setErrors((er) => { const n = { ...er }; delete n[key]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please tell us your name.";
    if (!form.email.trim()) e.email = "We\u2019ll need an email to reach you.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "That email doesn\u2019t look quite right.";
    if (!form.attending) e.attending = "Let us know if you can make it.";
    if (form.attending === "yes" && !form.meal) e.meal = "Pick a meal so we can plan the menu.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSubmitted(true);
    } else {
      // focus first error field
      const first = document.querySelector(`[name="${Object.keys(e)[0]}"]`);
      if (first && first.focus) first.focus();
    }
  };

  const reset = () => { setForm(blank); setErrors({}); setSubmitted(false); };

  /* ----------------------------------------------------- CONFIRMATION VIEW */
  if (submitted) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", py: 16 }}>
        <Img id={P.flowers} label="thank you — flowers" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.16 }} />
        <Container maxWidth="sm" sx={{ position: "relative", textAlign: "center" }}>
          <Grow in timeout={700}>
            <Box>
              {/* Animated check seal */}
              <Box sx={{ width: 96, height: 96, mx: "auto", mb: 4, borderRadius: "50%", border: "1px solid", borderColor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", animation: "seal 0.9s cubic-bezier(.16,.84,.44,1)", "@keyframes seal": { "0%": { transform: "scale(.4)", opacity: 0 }, "60%": { transform: "scale(1.12)" }, "100%": { transform: "scale(1)", opacity: 1 } } }}>
                <Box component="svg" viewBox="0 0 24 24" sx={{ width: 40, height: 40, fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round", "& path": { strokeDasharray: 30, strokeDashoffset: 30, animation: "draw .6s .35s cubic-bezier(.16,.84,.44,1) forwards" }, "@keyframes draw": { to: { strokeDashoffset: 0 } } }}>
                  <path d="M4 12.5l5 5 11-11" />
                </Box>
              </Box>
              <Fade in timeout={900} style={{ transitionDelay: "250ms" }}>
                <Box>
                  <Eyebrow sx={{ mb: 2.5 }}>{attending ? "We can\u2019t wait" : "Thank you"}</Eyebrow>
                  <Typography variant="h2" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, mb: 3 }}>
                    {attending ? "You\u2019re on the list!" : "We\u2019ll miss you."}
                  </Typography>
                  <Typography variant="body1" sx={{ maxWidth: 440, mx: "auto", mb: 1 }}>
                    {attending
                      ? `Thank you, ${form.name.split(" ")[0]}. Your RSVP for ${form.guests} ${form.guests === "1" ? "guest" : "guests"} is confirmed. We\u2019ll send full details closer to the day.`
                      : `Thank you for letting us know, ${form.name.split(" ")[0]}. You\u2019ll be missed \u2014 we\u2019ll raise a glass to you.`}
                  </Typography>
                  {attending && form.song && (
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>We&rsquo;ll add &ldquo;{form.song}&rdquo; to the playlist.</Typography>
                  )}
                  <Ornament sx={{ my: 5 }} />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                    <Button variant="outlined" onClick={go("#/")}>Back Home</Button>
                    <Button variant="text" onClick={reset} sx={{ color: "primary.main" }}>Edit response</Button>
                  </Stack>
                </Box>
              </Fade>
            </Box>
          </Grow>
        </Container>
      </Box>
    );
  }

  /* ----------------------------------------------------- FORM VIEW */
  const fieldSx = { mb: 0.5 };
  return (
    <Box>
      <Container maxWidth="sm" sx={{ pt: { xs: 16, md: 22 }, pb: { xs: 10, md: 16 } }}>
        <Reveal>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Eyebrow sx={{ mb: 2.5 }}>{W.dateShort}</Eyebrow>
            <Typography variant="h1" sx={{ fontSize: { xs: "3.4rem", md: "5rem" }, mb: 2.5 }}>RSVP</Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>{W.rsvpDeadline}</Typography>
            <Ornament sx={{ mt: 5 }} />
          </Box>
        </Reveal>

        <Reveal delay={120}>
          <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={4.5}>
              <TextField name="name" label="Full Name" value={form.name} onChange={set("name")} error={!!errors.name} helperText={errors.name || " "} fullWidth sx={fieldSx} />

              <TextField name="email" label="Email Address" type="email" value={form.email} onChange={set("email")} error={!!errors.email} helperText={errors.email || " "} fullWidth sx={fieldSx} />

              <FormControl error={!!errors.attending} component="fieldset" variant="standard">
                <FormLabel sx={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.7rem", color: "text.secondary", mb: 1.5, "&.Mui-focused": { color: "primary.main" } }}>
                  Will you be attending?
                </FormLabel>
                <RadioGroup name="attending" value={form.attending} onChange={set("attending")} sx={{ gap: 0.5 }}>
                  {[["yes", "Joyfully accepts"], ["no", "Regretfully declines"]].map(([val, lbl]) => (
                    <FormControlLabel
                      key={val}
                      value={val}
                      control={<Radio sx={{ color: "rgba(38,35,27,0.4)", "&.Mui-checked": { color: "primary.main" } }} />}
                      label={<Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.4rem" }}>{lbl}</Typography>}
                    />
                  ))}
                </RadioGroup>
                <FormHelperText>{errors.attending || " "}</FormHelperText>
              </FormControl>

              {/* Attending-only fields */}
              <Collapse in={attending} unmountOnExit>
                <Stack spacing={4.5} sx={{ pt: 0.5 }}>
                  <Divider><Typography variant="overline" sx={{ color: "text.secondary", px: 1 }}>A few details</Typography></Divider>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel>Guests</InputLabel>
                        <Select name="guests" value={form.guests} onChange={set("guests")} label="Guests">
                          {["1", "2", "3", "4"].map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="standard" error={!!errors.meal}>
                        <InputLabel>Meal</InputLabel>
                        <Select name="meal" value={form.meal} onChange={set("meal")} label="Meal">
                          {["Beef", "Fish", "Vegetarian", "Vegan"].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </Select>
                        <FormHelperText>{errors.meal || " "}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <TextField name="song" label="Song Request (optional)" value={form.song} onChange={set("song")} fullWidth helperText="What will get you on the dance floor?" />

                  <TextField name="notes" label="Dietary Notes or a Message (optional)" value={form.notes} onChange={set("notes")} fullWidth multiline minRows={3} />
                </Stack>
              </Collapse>

              <Box sx={{ textAlign: "center", pt: 1 }}>
                <Button type="submit" variant="contained" sx={{ px: 7, py: 1.8, minWidth: 220 }}>Send RSVP</Button>
              </Box>
            </Stack>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
window.RsvpPage = RsvpPage;

})();
