# CTA inner rectangle debug notes — 2026-06-01

The user-provided screenshots correctly show a double-rectangle treatment across the gold CTA buttons. Live DOM inspection confirmed the cause: many CTA links are styled twice. The outer `<a class="sgc-luxury-cta">` receives the global gold button styling, while the nested child `<span class="btn-primary">` or `<span class="btn-gold">` also receives the same gold button styling. This creates a large outer gold rectangle and a smaller inner bordered gold rectangle.

Example live finding from the homepage hero:

| Element | Live class | Width x height | Relevant styling |
|---|---:|---:|---|
| Outer link | `sgc-luxury-cta` | about 251 x 84 | gold gradient background, 1px border, shadow |
| Inner span | `btn-primary` | about 197 x 52 | gold gradient background, 1px border, shadow |

Therefore, disabling pseudo-elements was not enough. The production fix must neutralize CTA child elements inside `.sgc-luxury-cta` so they behave as plain inline text/icons, and only the outer CTA receives the gold block treatment. Header buttons where the clickable element wraps a single child button/span also need the same normalization so only one layer is styled.


## 2026-06-01 final local validation after user screenshot feedback

Local homepage loaded at `http://localhost:4178/?v=final-clean-nav-cta-local`. Visual viewport shows the top navigation no longer uses the heavy gold underline treatment. The CTAs in the hero area render as a single gold block rather than an outer block plus inner rectangle.

Computed DOM check on the first nested CTA confirms the outer `.sgc-luxury-cta` keeps the gold gradient, one border, and shadow, while the direct child `.btn-primary` computes to `background-image: none`, `border: 0px none`, `padding: 0px`, and `box-shadow: none`. This removes the double-rectangle issue caused by `#root .btn-primary` overriding the earlier child-span reset.

Navigation computed checks confirm each `header nav a` underline child is hidden: `display: none`, `width: 0px`, and `opacity: 0`. Nav text is cream by default and uses the subtle hover/click transform from the final override.

Local About page loaded at `http://localhost:4178/about/?v=final-clean-nav-cta-local`. The visible CTA text is now `WORK WITH ME` and `VIEW SERVICES`; no `Work With Jenna` text appears in deployed HTML, JS, or CSS files. The About top navigation appears refined and no longer has the bulky underline treatment from the rejected version.


Local Packages page loaded at `http://localhost:4178/packages/?v=final-clean-nav-cta-local`. Visual viewport shows the refined header navigation without the rejected underline treatment. DOM measurement of all `.sgc-luxury-cta` elements confirms package CTAs without nested children are unaffected, while nested footer/section CTAs now have child `.btn-primary` or `.btn-gold` elements computing to `background-image: none`, `border: 0px none`, `padding: 0px`, and `box-shadow: none`. This confirms the global nested-button reset applies beyond the homepage and About page.


Production verification after commit `d495660`:

- Live homepage loaded at `https://www.sharpgrowthco.com/?v=final-clean-nav-cta-202606012258` and is serving `assets/luxury-button-enhancements.css?v=prod-final-clean-nav-cta-202606012258`.
- Live homepage first nested CTA child now computes to `background-image: none`, `border: 0px none`, `padding: 0px`, and `box-shadow: none`, while the outer CTA keeps the single bronze-gold gradient, one border, and shadow.
- Live homepage header navigation links compute to subtle off-white text with hidden underline spans (`display: none`, `width: 0px`, `opacity: 0`), confirming the rejected heavy underline style is removed.
- Live About page loaded at `https://www.sharpgrowthco.com/about/?v=final-clean-nav-cta-202606012258`; the visible CTA text is now `Work With Me`, not `Work With Jenna`.
- Live About page CTA measurements confirm nested `.btn-primary`, `.btn-outline`, `.btn-gold`, and footer `.btn-gold text-xs mt-2 inline-flex` children compute to `background-image: none`, `border: 0px none`, `padding: 0px`, and `box-shadow: none`, so those child spans cannot draw the second rectangle.


Live Packages page verification at `https://www.sharpgrowthco.com/packages/?v=final-clean-nav-cta-202606012258` confirmed the global fix on the page with the highest CTA density. Plain package card CTAs have no nested child button layer. The nested section/footer CTAs that do contain child spans now compute those children to `background-image: none`, `border: 0px none`, `padding: 0px`, and `box-shadow: none`, preventing the child span from drawing a second inner rectangle. The header navigation remains the refined understated style rather than the rejected heavy underline treatment.
