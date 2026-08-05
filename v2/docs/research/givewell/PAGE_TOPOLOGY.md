# GiveWell page topology

Measured at 1,440 × 1,000 after the entrance animation settled. Coordinates are document-space CSS pixels.

| Order | Source selector | Top | Height | Role |
| ---: | --- | ---: | ---: | --- |
| 1 | `.section_hero` | 72 | 904 | Navbar-adjacent full-width hero and primary CTA |
| 2 | `#mission.section_mission` | 976 | 781.797 | Centered mission statement and scroll-revealed copy |
| 3 | `#empower.section_empower` | 1,757.797 | 696 | Four-step tabbed impact story |
| 4 | `#team.section_team` | 2,453.797 | 644.297 | Editorial team statement with inline image words |
| 5 | `#vision.section_vision` | 3,098.094 | 1,856 | Pinned expanding image composition and overlay copy |
| 5a | `.section_marquee` | 3,098.094 | 116 | Horizontally translated headline/hand marquee |
| 6 | `#stats.section_stats` | 4,954.094 | 1,291.703 | Impact statistic cards with number scrambling |
| 7 | `#footer.footer_component` | 6,245.797 | 1,145.797 | Draggable hand CTA, subscription, brand wordmark, legal row |

Total desktop document height: 7,391 px.

## Visual system captured from source

- Typeface: `Inter Variablefont Opsz Wght`, falling back to Arial and sans-serif.
- Primary dark ink: `rgb(21, 58, 67)`.
- Hero and image typography: white.
- Main surface: warm off-white `rgb(245, 243, 238)`.
- Vision gradient: `linear-gradient(140deg, rgb(223, 199, 221), rgb(139, 167, 207))`.
- Footer gradient: `linear-gradient(rgb(219, 197, 220), rgb(143, 176, 214))`.
- Texture layers: the original light noise PNG and grain AVIF.
- Responsive layout and visibility rules are inherited unchanged from the source Webflow CSS.

## Content hierarchy

1. GiveWell wordmark and navigation.
2. Hero: fundraising proposition, supporting copy, CTA, and landscape image.
3. Mission statement.
4. Empowerment process in auto-cycling tabs.
5. Team/volunteer acknowledgement.
6. Vision image sequence and action statement.
7. Impact statistics.
8. Get-involved footer CTA, update form, oversized wordmark, and legal links.

