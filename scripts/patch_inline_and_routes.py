from pathlib import Path

root = Path('/home/ubuntu/sharp-growth-co-repo')

# Keep Work With Me accessibility labels consistent anywhere inline scripts still contain stale wording.
for rel in ['index.html', '404.html']:
    p = root / rel
    text = p.read_text()
    text = text.replace("a.setAttribute('aria-label', 'Open the Sharp Growth Co. contact page');", "a.setAttribute('aria-label', 'Work with Me — Contact');")
    text = text.replace("button.setAttribute('aria-label', 'Open the Sharp Growth Co. contact page');", "button.setAttribute('aria-label', 'Work with Me — Contact');")

    # In the Home inline emergency block, a previous emergency pass accidentally routed booking-label buttons to Contact.
    # Restore booking labels to Calendly while leaving Work With Me in the contactLabels branch.
    text = text.replace(
"""    if (bookingLabels.has(label)) {
      button.type = 'button';
      button.style.cursor = 'pointer';
      button.setAttribute('aria-label', 'Work with Me — Contact');
      if (button.dataset.sgcContactFinal !== 'true') {
        button.dataset.sgcContactFinal = 'true';
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.location.href = ROUTES.contact;
        }, true);
      }
    }""",
"""    if (bookingLabels.has(label)) {
      button.type = 'button';
      button.style.cursor = 'pointer';
      button.setAttribute('aria-label', 'Book a consultation with Sharp Growth Co.');
      if (button.dataset.sgcCalendlyFinal !== 'true') {
        button.dataset.sgcCalendlyFinal = 'true';
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.open(CALENDLY, '_blank', 'noopener,noreferrer');
        }, true);
      }
    }""")
    text = text.replace(
"""    if (bookingLabels.has(label)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = ROUTES.contact;
    }""",
"""    if (bookingLabels.has(label)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.open(CALENDLY, '_blank', 'noopener,noreferrer');
    }""")
    p.write_text(text)

# Add an explicit final Work With Me override to both shared route scripts, after their own mutating logic has run.
final_override = r'''

  function finalWorkWithMeContactOverride() {
    document.querySelectorAll('a,button').forEach((node) => {
      const label = normalize(node.textContent || node.innerText || node.getAttribute('aria-label'));
      if (label === 'work with me') {
        node.setAttribute('aria-label', 'Work with Me — Contact');
        if (node.tagName && node.tagName.toLowerCase() === 'a') {
          node.setAttribute('href', CONTACT || (ROUTES && ROUTES.contact) || '/contact/');
          node.removeAttribute('target');
          node.removeAttribute('rel');
        }
      }
    });
  }
'''

p = root / 'assets' / 'sgc-button-route-hotfix.js'
text = p.read_text()
if 'finalWorkWithMeContactOverride' not in text:
    text = text.replace("  function wireButtons() {\n", final_override + "\n  function wireButtons() {\n")
    text = text.replace("    document.querySelectorAll('button').forEach((button) => {", "    finalWorkWithMeContactOverride();\n\n    document.querySelectorAll('button').forEach((button) => {")
    text = text.replace("    });\n  }\n", "    });\n\n    finalWorkWithMeContactOverride();\n  }\n", 1)
p.write_text(text)

p = root / 'assets' / 'sgc-emergency-final-link-fix.js'
text = p.read_text()
if 'finalWorkWithMeContactOverride' not in text:
    override = final_override.replace("CONTACT || (ROUTES && ROUTES.contact) || '/contact/'", "ROUTES.contact")
    text = text.replace("  function fixEverything() {\n", override + "\n  function fixEverything() {\n")
    text = text.replace("    document.querySelectorAll('button').forEach(applyButton);", "    document.querySelectorAll('button').forEach(applyButton);\n    finalWorkWithMeContactOverride();")
p.write_text(text)