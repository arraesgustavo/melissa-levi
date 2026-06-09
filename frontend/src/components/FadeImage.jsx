import { Box } from '@mui/material';
import { useState } from 'react';
import { COLORS, FONTS } from '../theme';

export function FadeImage({ src, alt, ratio, sx, position }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: COLORS.creamDeep,
        ...(ratio ? { aspectRatio: ratio } : {}),
        ...sx,
      }}
    >
      {!failed && (
        <Box
          component="img"
          src={src}
          alt={alt || ''}
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: position || 'center',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'scale(1.04)',
            transition: 'opacity 1.2s ease, transform 1.6s ease',
          }}
        />
      )}
      {failed && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${COLORS.creamDeep}, ${COLORS.line})`,
          }}
        >
          <Box sx={{ fontFamily: FONTS.DISPLAY, fontStyle: 'italic', color: COLORS.taupe, fontSize: 22 }}>
            M &amp; L
          </Box>
        </Box>
      )}
    </Box>
  );
}
