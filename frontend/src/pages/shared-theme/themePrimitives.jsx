// src/pages/shared-theme/themePrimitives.jsx
//
// Paleta: blanco (fondos), morado (color principal) y verde (secundario / éxito).
// Solo modo claro. Se mantienen los nombres brand / gray / green / orange / red
// porque otros archivos de customizations los importan.

import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

// ---------- Morado (color principal) ----------
export const brand = {
  50: 'hsl(270, 100%, 97%)',
  100: 'hsl(270, 90%, 93%)',
  200: 'hsl(270, 85%, 85%)',
  300: 'hsl(268, 80%, 72%)',
  400: 'hsl(266, 70%, 58%)',
  500: 'hsl(266, 65%, 50%)',
  600: 'hsl(266, 68%, 42%)',
  700: 'hsl(266, 72%, 35%)',
  800: 'hsl(266, 75%, 22%)',
  900: 'hsl(266, 80%, 14%)',
};

// ---------- Grises con un leve tinte morado ----------
export const gray = {
  50: 'hsl(270, 20%, 97%)',
  100: 'hsl(270, 16%, 94%)',
  200: 'hsl(270, 12%, 88%)',
  300: 'hsl(270, 10%, 80%)',
  400: 'hsl(270, 10%, 65%)',
  500: 'hsl(270, 10%, 42%)',
  600: 'hsl(270, 12%, 35%)',
  700: 'hsl(270, 14%, 25%)',
  800: 'hsl(270, 25%, 8%)',
  900: 'hsl(270, 30%, 4%)',
};

// ---------- Verde (secundario / éxito) ----------
export const green = {
  50: 'hsl(145, 70%, 97%)',
  100: 'hsl(145, 65%, 92%)',
  200: 'hsl(145, 60%, 83%)',
  300: 'hsl(145, 55%, 68%)',
  400: 'hsl(145, 55%, 45%)',
  500: 'hsl(145, 65%, 36%)',
  600: 'hsl(145, 70%, 29%)',
  700: 'hsl(145, 75%, 22%)',
  800: 'hsl(145, 80%, 14%)',
  900: 'hsl(145, 85%, 8%)',
};

export const orange = {
  50: 'hsl(45, 100%, 97%)',
  100: 'hsl(45, 92%, 90%)',
  200: 'hsl(45, 94%, 80%)',
  300: 'hsl(45, 90%, 65%)',
  400: 'hsl(45, 90%, 40%)',
  500: 'hsl(45, 90%, 35%)',
  600: 'hsl(45, 91%, 25%)',
  700: 'hsl(45, 94%, 20%)',
  800: 'hsl(45, 95%, 16%)',
  900: 'hsl(45, 93%, 12%)',
};

export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 40%)',
  500: 'hsl(0, 90%, 30%)',
  600: 'hsl(0, 91%, 25%)',
  700: 'hsl(0, 94%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

// ---------- Esquema de color (solo claro) ----------
export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[300],
        main: brand[500],
        dark: brand[700],
        contrastText: '#ffffff',
      },
      secondary: {
        light: green[300],
        main: green[500],
        dark: green[700],
        contrastText: '#ffffff',
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[500],
        dark: green[800],
        contrastText: '#ffffff',
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.6),
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(brand[200], 0.2),
        selected: alpha(brand[200], 0.3),
      },
      baseShadow:
        'hsla(266, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(266, 25%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

const defaultShadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];

export const shadows = defaultShadows;
