---
name: Chiedozie Onyekwum
description: A portfolio drawn as a transit system; each flagship is a coloured line, each component a station named in plain words.
colors:
  signage-white: "oklch(0.985 0.002 250)"
  signage-ink: "oklch(0.19 0.012 262)"
  slate-muted: "oklch(0.43 0.014 262)"
  hairline-rule: "oklch(0.88 0.006 262)"
  signage-band: "oklch(0.17 0.008 262)"
  band-ink: "oklch(0.98 0.002 250)"
  band-muted: "oklch(0.78 0.01 262)"
  card-white: "oklch(1 0 0)"
  line-blue: "oklch(0.43 0.19 262)"
  line-green: "oklch(0.56 0.16 150)"
  line-orange: "oklch(0.68 0.19 45)"
  line-purple: "oklch(0.55 0.2 330)"
  line-yellow: "oklch(0.85 0.17 92)"
  line-brown: "oklch(0.52 0.08 60)"
  night-ground: "oklch(0.17 0.01 262)"
  night-ink: "oklch(0.96 0.004 250)"
  night-muted: "oklch(0.76 0.012 262)"
  night-rule: "oklch(0.33 0.012 262)"
  night-band: "oklch(0.25 0.014 262)"
  night-card: "oklch(0.21 0.012 262)"
  night-strip-ink: "oklch(0.15 0.01 262)"
  night-line-blue: "oklch(0.66 0.16 258)"
  night-line-green: "oklch(0.72 0.16 150)"
  night-line-orange: "oklch(0.74 0.17 48)"
  night-line-purple: "oklch(0.7 0.17 330)"
  night-line-yellow: "oklch(0.87 0.16 92)"
  night-line-brown: "oklch(0.66 0.08 62)"
typography:
  display:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.1vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  line-name:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  station-name:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.625
  code:
    fontFamily: "Overpass Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  sheet: "18px"
  full: "9999px"
spacing:
  gutter-phone: "16px"
  gutter: "32px"
  section-phone: "56px"
  section: "80px"
  measure: "88rem"
  notice-column: "23rem"
components:
  button-email:
    backgroundColor: "{colors.signage-ink}"
    textColor: "{colors.signage-white}"
    typography: "{typography.line-name}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "56px"
  button-email-md:
    backgroundColor: "{colors.signage-ink}"
    textColor: "{colors.signage-white}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "48px"
  signage-band:
    backgroundColor: "{colors.signage-band}"
    textColor: "{colors.band-ink}"
    padding: "8px 32px"
  nav-link:
    textColor: "{colors.band-muted}"
    height: "44px"
  nav-link-active:
    textColor: "{colors.band-ink}"
  line-strip-night:
    textColor: "{colors.night-strip-ink}"
    rounded: "{rounded.md}"
    height: "36px"
  station-dot:
    backgroundColor: "{colors.signage-white}"
    rounded: "{rounded.full}"
    size: "28px"
  station-notice:
    backgroundColor: "{colors.signage-white}"
    textColor: "{colors.signage-ink}"
    typography: "{typography.body}"
    width: "23rem"
  station-sheet:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.sheet}"
    padding: "0 20px 20px"
---

# Design System: Chiedozie Onyekwum

## Overview

**Creative North Star: "The Network Map"**

The portfolio is a transit system drawn with Vignelli and Beck discipline. Each flagship system is a coloured line; each component on it is a station named in plain words, carrying a short code (F1, D3) the way a real station does. A signage-white ground holds saturated line colours that own whole regions, black signage bands open and close the page, and one type family, Overpass from the Highway Gothic lineage, says every word. A night map is the dark variant: the same network, the ground gone dark and the lines brightened.

The density is that of a station sign: few words, large and certain, with the detail one tap away. The map is the hero. Tap a station and its notice docks beside the map while that station stays lit and the rest of the network dims to about a third. Depth comes from bands and hairline rules, not from cards or shadows.

Scope: this world is the design authority for the site, and it currently ships on Home (`/`) only. It lives inside the `.transit` scope, which redefines the shared tokens locally, so every other page still renders the incumbent olive/cream sidebar layout until its own redesign pass moves it into this world. That incumbent look is not documented here and is not a pattern for new work. The frontmatter tokens are the transit world's.

**Key Characteristics:**
- Signage-white ground, black signage bands top and bottom, 1px hairline rules between regions.
- Six line colours, each owning one system; `--lc` carries the current line's colour through its subtree.
- Overpass Variable for every word; Overpass Mono only for station codes, figures and addresses.
- Round station dots with ground-coloured cores on 8px track, drawn to 45/90-degree geometry.
- A yellow diamond marks a station with a "what was hard" story, and nothing else.
- A night-map dark variant that keeps the same structure.

## Colors

A near-neutral cool signage palette (hue 250 to 262, almost no chroma) carries six fully saturated line colours that do all of the colour work.

### Primary
- **Signage Ink** (signage-ink): every word on the white ground, the Email me button fill, the selected station's outer ring, the service-run train, and the 1px ink rule that heads a list.
- **Signage Band Black** (signage-band): the header and footer bands. On the night map the band lightens to night-band (oklch 0.25) so it still reads as a band against a dark ground.

### Secondary: the line colours
Each line colour belongs to exactly one system and is set on a subtree as `--lc` (`var(--line-<colour>)`), so the track, dot rings, strip, service-note squares and link underlines of that line all read one variable.
- **Line Blue** (line-blue): the FBT line. Also the world's focus ring and text selection tint (30% mix).
- **Line Green** (line-green): the DozLab line.
- **Line Orange, Line Purple, Line Brown** (line-orange, line-purple, line-brown): the further lines (Kafka strangler, AI inference lab, research), shown as line bullets until they are drawn.
- **Line Yellow** (line-yellow): the air-gapped portal line, and the "what was hard" diamond. Yellow always carries dark ink, never white.

### Neutral
- **Signage White** (signage-white): the ground. Station dot cores take the ground colour, so they read as holes punched in the track.
- **Card White** (card-white): the phone station sheet and other raised surfaces.
- **Slate Muted** (slate-muted): secondary text: station codes, origins of figures, the degree line. On the band it becomes band-muted.
- **Hairline Rule** (hairline-rule): every 1px divider, including the rule the docked station notice stands behind.

### Named Rules
**The Line Owns Its Colour Rule.** A line colour marks only its own line's track, dots, strip, bullet, service notes and links. The one other use in the build is the green availability lamp beside the availability line; do not add more.

**The Signage Letter Rule.** Letters on a line colour follow the strip: in daylight, white letters on the line colour mixed 84% with black; on the night map, dark letters (night-strip-ink) on the bright line colour. Yellow takes dark ink in both modes.

**The Night Map Rule.** The dark variant changes values, never structure: ground, ink, rules and band swap to their night tokens, line colours brighten, and everything else stays where it was.

## Typography

**Display Font:** Overpass Variable (with ui-sans-serif, system-ui)
**Body Font:** Overpass Variable
**Label/Mono Font:** Overpass Mono Variable (with ui-monospace), tabular figures on

**Character:** Highway-signage sans at heavy weights for anything a person reads from a distance, the same face at regular weight for reading, and its mono sibling for the codes and figures a sign prints small.

### Hierarchy
- **Display** (800, clamp(2rem, 4.1vw, 3.6rem), 1.02, -0.03em): the single outcome line at the top of the page, max 24ch.
- **Headline** (800, 1.875rem rising to 2.25rem from 640px, 1.25, -0.02em): section headings.
- **Title** (800, 1.5rem, 1.25, -0.015em): the station notice heading.
- **Line name** (800, 1.02rem, -0.01em): the line's name on its strip, and the Email me label at the lg size (1.125rem).
- **Station name** (600, 0.95rem to 0.98rem, 1.375): station labels on the map, balanced over two lines inside a 9.25rem label.
- **Body** (400, 1.02rem / 0.98rem, 1.625): summaries and station detail, capped at 60 to 68ch.
- **Code** (Overpass Mono 600, 0.75rem, tabular): station codes above station names, the technical label under a notice heading, and the email address (0.95rem).

### Named Rules
**The One Family Rule.** Overpass sets every word. Overpass Mono appears only where a sign prints a code or a figure: station codes, component labels, the email address.

## Layout

Content sits in a 88rem measure with 16px gutters on phones and 32px from 640px. Sections are separated by 1px hairline rules and padded 56px (phones) to 80px vertically. The header band is a single row (name and role left, navigation right, menu button under 1024px).

The network map is a full-width band. From 1024px it is a two-column grid: the map field on the left and a 23rem station notice column on the right, separated by a 1px rule on the notice's left edge; the notice is sticky within the viewport. The map itself is drawn in a fixed 960 x 540 coordinate field and scaled by aspect ratio, so geometry never reflows. Below the field, each line's summary and service notes sit in a two-column grid.

Under 1024px the drawing is not shrunk: each line becomes a vertical strip map (track on the left, code and station name to its right) headed by its line strip, and the station notice opens as a bottom sheet.

### Named Rules
**The Diagram Rules.** These bind every diagram in this world. Diagrams get full-width bands. Every system opens as an overview of at most 7 stations, with drill-in for detail. Every diagram reads at 390px as a vertical strip map, never a shrunken desktop drawing. Every diagram is drawn in this world's tokens.

**The 45/90 Rule.** Track runs horizontal, vertical, or at 45 degrees, with rounded joins. Lanes step down at 45 degrees where the real system changes lane; branches split off at 45 degrees.

## Elevation & Depth

The world is flat. Depth is carried by the black bands, a 4% ink tint on the closing section, 1px rules, and dimming: when a station is selected, other lines and stations drop to 30 to 35% opacity.

### Shadow Vocabulary
- **Selected station ring** (`box-shadow: 0 0 0 5px var(--t-ground), 0 0 0 8px var(--t-ink)`): a zero-offset double ring around the filled selected dot.
- **Availability lamp halo** (`box-shadow: 0 0 0 4px color-mix(in oklch, var(--line-green) 25%, transparent)`): the soft ring on the availability dot.
- **Sheet lift** (`box-shadow: 0 -16px 40px -16px rgb(0 0 0 / 0.35)`): the phone station sheet only.

### Named Rules
**The Flat Signage Rule.** Surfaces sit flat. The only blurred shadow is the phone sheet's lift; rings are zero-offset spreads; nothing casts a hard offset shadow.

## Shapes

Circles and straight track. Station dots, line bullets, the service-run train and the availability lamp are full circles or pills. Track is an 8px stroke with round caps and joins. Line strips and small controls use gently rounded 8px corners; the Email me button 10px; the phone sheet 18px top corners; the keyboard hint chip 4px. The diamond (a 12px square turned 45 degrees with a 2px ground-coloured border) is the one angular mark, reserved for "what was hard". Service-note bullets are small 10px squares in the line colour.

## Components

### Buttons
Heavy, plain, one per intent.
- **Shape:** gently rounded (10px).
- **Primary (Email me):** ink fill, ground-coloured text, mail icon, 800 weight label; 56px tall with 24px sides, or 48px tall with 20px sides at the md size. Always paired with the address in mono and a 44px copy button.
- **Hover / Focus:** lifts 1px on hover, presses to 0.98 scale; focus is the world's 3px line-blue outline at 3px offset.
- **Text links:** semibold with a 2px underline in hairline-rule (or the line colour inside a line) at 4px offset, darkening to ink on hover.

### Navigation
- **Style:** in the header band, semibold 0.95rem links at 44px minimum height in band-muted, turning band-ink on hover; the active page takes band-ink and a 2px underline bar in the current colour. The theme toggle is a pill segmented control.
- **Mobile:** under 1024px a Menu button opens a stacked list inside the band.

### Line Strip (signature)
The line's name on a strip of its own colour, the way stations sign their lines: 36px tall on the map, 8px corners, a 24px round mono bullet with the line letter in inverted colours at the left, the line name in 800 weight, and where the work happened at the right from 640px. Follows The Signage Letter Rule.

### Station Dot (signature)
A 28px circle with a 6px ring in the line colour and a ground-coloured core (24px with a 5px ring on branches and phone strips). Hover scales it to 1.1. Selected fills it with the line colour inside the double ink ring; unselected stations on any line then dim. A yellow diamond sits at its upper right when the station has a "what was hard" story. Arrow keys, Home and End step along the line.

### Line Bullet
A round badge in the line colour carrying the line letter in Overpass Mono bold, 44px in lists and 28px inline. Used for lines not yet drawn on the map and in the notice header.

### Station Notice
Desktop: docks in the 23rem column behind the 1px rule, sticky, showing line bullet and code, the station name as Title, the component label in mono, then Why it exists, How it works and, behind the yellow diamond, What was hard; links to the full story and the code; previous and next station at the foot. Before any selection it shows "Pick a station" with a legend. Phones: the same content in a bottom sheet (max 68svh, 18px top corners, card-white) that slides in, follows the thumb from its grab handle, and closes past 96px or on a fast flick.

### Service Run
On first view, when the track is half on screen, one ink train (a 34 x 12 pill) runs once along each line in 2.8s on `cubic-bezier(0.22, 1, 0.36, 1)`, fading in and out. Under reduced motion there is no train.

## Do's and Don'ts

### Do:
- **Do** give every line one colour token and pass it down as `--lc`, so track, dots, strip and links can't disagree.
- **Do** put white letters on the line colour mixed 84% with black in daylight, and dark letters on the bright line colour on the night map.
- **Do** name stations in plain words and give each a mono code; keep tool names to the notice's mono label.
- **Do** draw track at 45 and 90 degrees in a fixed coordinate field, and redraw it as a vertical strip map under 1024px.
- **Do** dock the station notice beside the map behind a 1px rule on desktop, and open it as a draggable bottom sheet on phones.
- **Do** run the service once per line on first view, and never under reduced motion.
- **Do** keep every touch target at least 44px.

### Don't:
- **Don't** put a bio sidebar beside a card grid; that is the layout this world replaces.
- **Don't** return to the cream ground and serif type this world was chosen against.
- **Don't** shrink a desktop diagram to fit a phone; redraw it as a strip map.
- **Don't** open a system with more than 7 stations before drill-in.
- **Don't** use the yellow diamond for anything but "what was hard".
- **Don't** use a line colour as decoration on something that isn't its line.
- **Don't** set any word in a face other than Overpass or Overpass Mono.
- **Don't** add offset or hard shadows; the world is flat signage.
