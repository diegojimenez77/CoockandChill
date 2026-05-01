---
name: Technical Service Design System
colors:
  surface: '#fff8f5'
  surface-dim: '#e9d7cb'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e9'
  surface-container: '#fdeadf'
  surface-container-high: '#f7e5d9'
  surface-container-highest: '#f1dfd4'
  on-surface: '#231a13'
  on-surface-variant: '#554336'
  inverse-surface: '#392e27'
  inverse-on-surface: '#ffede3'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#914d00'
  primary: '#914d00'
  on-primary: '#ffffff'
  primary-container: '#f28c28'
  on-primary-container: '#5d2f00'
  inverse-primary: '#ffb77d'
  secondary: '#455f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5882'
  tertiary: '#00658b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00b1f0'
  on-tertiary-container: '#004059'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#adc7f7'
  on-secondary-fixed: '#001b3c'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#7ed0ff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6a'
  background: '#fff8f5'
  on-background: '#231a13'
  surface-variant: '#f1dfd4'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-entry:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 12px
  form-row-height: 48px
---

## Brand & Style

The design system is built on the pillars of **Utility, Precision, and Trust**. It is tailored for high-stakes technical environments where clarity of information is paramount. The visual language adopts a **Corporate/Modern** aesthetic with subtle technical flourishes, ensuring that field technicians can input data quickly and accurately while clients receive a document that feels authoritative and professional.

The style avoids unnecessary decoration, focusing instead on structural integrity and clear information hierarchy. It communicates reliability through a balanced use of high-visibility accents and a stable, neutral foundation.

## Colors

The palette is led by a vibrant **Primary Orange (#F28C28)**, used strategically for headers, primary actions, and brand identification to ensure high visibility in industrial settings. A **Deep Technical Blue (#1A365D)** provides a professional counterpoint, used for secondary accents and body text to enhance readability.

The system utilizes a semantic color logic for status badges: 
- **Revision:** Calm blue for assessment.
- **Reparacion:** High-attention red for active fixes.
- **Mantenimiento:** Trustworthy green for preventative care.

Backgrounds are kept off-white to reduce glare, while borders use a precise light grey to define structure without adding visual noise.

## Typography

This design system uses a dual-font strategy to balance technical character with extreme legibility. 

**Space Grotesk** is used for headlines and section titles. Its geometric, slightly futuristic construction echoes the "technical" nature of the service. **Inter** is the workhorse for all functional data, labels, and form inputs. Its neutral tone and high x-height ensure that service notes remain readable even in poor lighting or on mobile devices. 

Labels should predominantly use the `label-caps` style to distinguish instructions from the user-generated `data-entry` content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy, optimized for standard document ratios (A4/Letter) to ensure print-to-digital parity. A strict 8px rhythmic grid governs all vertical spacing.

Form fields are organized in a multi-column modular grid (typically 2 or 3 columns) to maximize space efficiency. Information density is high, but legibility is maintained through consistent 12px gutters and 16px internal padding within containers. Logical groupings (e.g., Client Info, Equipment Specs, Signatures) are separated by clear 24px vertical margins.

## Elevation & Depth

To maintain a "high-trust" and stable feel, this design system utilizes **Low-Contrast Outlines** rather than aggressive shadows. 

- **Surface Level:** The main form background is flat.
- **Form Containers:** Defined by 1px solid borders (#E2E8F0).
- **Interactive States:** When a field is focused, it transitions to a 2px Primary Orange border with a very subtle, transparent orange glow (20% opacity) to provide clear feedback without breaking the professional aesthetic.
- **Section Headers:** Use solid color blocks (Primary Orange) to create depth through color weight rather than physical elevation.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding of corners on form fields and containers mitigates the clinical harshness of technical forms while retaining a modern, engineered feel. 

- **Form Inputs:** 4px radius.
- **Status Badges:** 4px radius (matching the fields).
- **Signature Pads:** 8px radius to clearly define them as unique interaction zones.
- **Buttons:** 4px radius to maintain consistency across the UI.

## Components

### Form Fields
Inputs consist of a top-aligned label in `label-caps` style. The input container has a 1px border. In "Review" mode, borders are removed and text is displayed in a subtle grey box to prevent accidental editing.

### Status Badges
Badges use a "Tinted" style: a high-saturation background of the semantic color with white text. They should be sized consistently to allow for easy scanning. 
- **Revision:** Blue background.
- **Reparacion:** Red background.
- **Mantenimiento:** Green background.

### Signature Pads
The signature pad is a large, defined area with a light grey background (#F1F5F9) and a 1px dashed border to indicate a touch-sensitive zone. A clear "Date/Time" stamp should automatically appear in the bottom right corner of the pad once a signature is captured.

### Technical Data Tables
For "Refacciones" (Spare Parts), use a striped table layout with subtle alternating row colors to help eye-tracking across multiple columns of technical data.

### Buttons
Primary buttons use a solid Primary Orange background. Secondary buttons use an outlined Technical Blue style. Text within buttons is always bold and uppercase.