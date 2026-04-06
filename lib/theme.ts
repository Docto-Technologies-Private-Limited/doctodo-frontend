/**
 * ╔══════════════════════════════════════════╗
 * ║            THEME CONFIG                  ║
 * ║  Change colors here → updates entire app ║
 * ╚══════════════════════════════════════════╝
 *
 * PRIMARY   — main action color (buttons, accents)
 * SECONDARY — brand color (header logo, footer, nav)
 * LIGHT_BG  — light tinted backgrounds
 */
export const theme = {
  colors: {
    primary:       '#ED1C24',
    secondary:     '#0A3458',
    lightBg:       '#84BCDA',
    textPrimary:   '#212121',
    textSecondary: '#3D3D3D',
    textDisabled:  '#AAAAAA',
    divider:       '#D9D9D9',
    warning:       '#FF9800',
    warningLight:  '#FFF3E0',
    alert:         '#CC0000',
    success:       '#009B62',
    welcome:       '#0088FF',
  },
} as const

export type ThemeColors = typeof theme.colors
