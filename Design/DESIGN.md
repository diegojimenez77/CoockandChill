---
name: Industrial Excellence
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#424656'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d7'
  primary: '#0050cd'
  on-primary: '#ffffff'
  primary-container: '#0866ff'
  on-primary-container: '#f9f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#5b5959'
  on-tertiary: '#ffffff'
  tertiary-container: '#737272'
  on-tertiary-container: '#fcf8f7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#00184a'
  on-primary-fixed-variant: '#003fa5'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  container-max: 1280px
---

## Brand & Style

The visual identity of the design system is anchored in the concepts of **Industrial Modernism** and **Technical Precision**. It is designed to evoke a sense of absolute reliability, mirroring the high-performance standards of commercial kitchen environments. The aesthetic balances the heat of high-volume cooking with the cool-headed precision of mechanical maintenance.

The UI avoids decorative flourishes in favor of utilitarian clarity. It utilizes a structured, grid-heavy layout that feels engineered rather than merely "designed." This approach builds trust with business owners and technicians by presenting information through a lens of professional expertise and operational efficiency. The result is a clean, high-contrast interface that feels as durable and high-quality as the stainless steel equipment it represents.

## Colors

The color palette is built on a high-contrast relationship between "Fire" and "Chill." 

- **Primary (Chill Blue):** Used for primary actions, navigation anchors, and status indicators related to cooling systems or standard operations. It represents stability and professional service.
- **Secondary (Fire Orange):** Reserved for technical alerts, "hot" maintenance tasks, and urgent calls to action. This color should be used sparingly to maintain its disruptive impact.
- **Surface & Neutrals:** The background utilizes the light gray `#F0F2F5` to reduce eye strain in bright kitchen environments, while `#050505` provides deep, industrial-strength contrast for typography and borders.

Color application should follow a 60-30-10 distribution to ensure the interface remains clean and focused on technical data.

## Typography

This design system employs a dual-font strategy to communicate both innovation and functionality.

**Space Grotesk** is used for headlines. Its geometric, slightly technical character reinforces the "engineering" aspect of the brand. It should be used in tighter tracking for a bold, impactful appearance.

**Inter** is the workhorse for all body copy, inputs, and technical data. It provides exceptional legibility across various screen sizes, which is critical for technicians viewing maintenance logs on the move. Labels should often be displayed in all-caps with increased letter spacing to mimic industrial equipment plaques and serial numbers.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop interfaces to maintain a rigorous, organized structure, transitioning to a fluid model for mobile devices. A 12-column grid provides the framework for all content, ensuring that technical specifications and equipment lists are aligned with mathematical precision.

Spacing is based on a 4px baseline grid to ensure consistent vertical rhythm. Large margins (32px) and generous gutters (24px) are used to prevent the UI from feeling cluttered, even when displaying complex data tables or maintenance schedules. High-density layouts are permissible only within "Data Sheets" or "Service Logs" where information density is a functional requirement.

## Elevation & Depth

To maintain an industrial and clean feel, this design system prioritizes **Tonal Layers** and **Low-contrast Outlines** over heavy shadows. 

Depth is primarily achieved through the use of surface color shifts (e.g., placing a white card on a `#F0F2F5` background). Where elevation is required to indicate interactivity (such as a floating action button or a modal), use a single, sharp "Industrial Shadow"—a low-blur, 15% opacity black shadow that suggests a physical object resting on a surface. Borders should be 1px wide in a muted neutral shade to define boundaries without adding visual weight.

## Shapes

The shape language is "Soft-Industrial." The choice of `0.25rem` (rounded-sm) for standard components ensures that the UI feels modern and approachable while retaining the sturdy, rectilinear feel of professional kitchen hardware. 

Buttons and input fields should use the standard 4px radius. Larger containers like cards may use the `rounded-lg` (8px) setting to subtly distinguish them from the background. Pill-shapes are strictly reserved for status "Chips" (e.g., "Active," "Fixed," "Pending") to provide a clear visual departure from the square-heavy layout.

## Components

### Buttons
Primary buttons use the Primary Blue with white text. For maintenance-related actions, use a "Fire Orange" variant. All buttons feature a 1px inset border on hover to simulate a tactile, mechanical press.

### Input Fields
Fields should have a solid 1px border and a subtle light-gray fill. Labels must always be visible (never placeholder-only) to ensure technical accuracy during data entry.

### Chips/Badges
Used for equipment status. Use high-saturation backgrounds for status (Green for Operational, Orange for Maintenance Required) with bold, all-caps Inter typography.

### Technical Data Tables
Tables are the heart of the service interface. Use zebra-striping with `#F0F2F5` and sticky headers. Borders should be used only for horizontal separation to maintain a clean vertical flow.

### Cards
Cards are used to group equipment by category. They should feature a "Header Strip" using the Secondary color to visually categorize "Hot" vs "Cold" equipment (e.g., Ovens vs. Refrigeration).