import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

const revealStyles = `
  .reveal { }
  .reveal.in { animation: revealUp 0.9s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal.in { animation: none; }
  }
`;

export function Reveal({ children, delay = 0, sx, as }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.animationDelay = delay + 'ms';

    const show = () => el.classList.add('in');
    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.94 && r.bottom > 0;
    };

    if (inView()) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show();
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' }
    );
    io.observe(el);

    const onScroll = () => {
      if (inView()) {
        show();
        cleanup();
      }
    };

    const cleanup = () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return cleanup;
  }, [delay]);

  return (
    <>
      <style>{revealStyles}</style>
      <Box ref={ref} component={as || 'div'} className="reveal" sx={sx}>
        {children}
      </Box>
    </>
  );
}
