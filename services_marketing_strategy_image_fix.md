

Marketing Strategy image correction notes:

The existing Services-page Marketing Strategy card points to `./assets/images/local-business-marketing-dashboard-alberta-growth-analytics.webp`, which matches the user's complaint that the image is wrong. I compared two available replacement candidates. `alberta-marketing-agency-strategy-chart-business-growth.webp` is a chart graphic with large visible text and metrics; it is relevant but may conflict with the overlay checklist text in the service card. `calgary-marketing-consultant-boardroom-strategy-meeting.webp` shows a strategy consultation scene with Jenna and clients, has a premium/luxury feel, and is more suitable for a Marketing Strategy service card because it communicates consultation and planning without adding competing chart text under the overlay.


## Live verification — 2026-06-01

The live Services page at `https://www.sharpgrowthco.com/services/?v=marketing-strategy-boardroom-live-209fc17` loaded successfully after deployment. The extracted live page content shows the Marketing Strategy card image as `/assets/images/calgary-marketing-consultant-boardroom-strategy-meeting.webp` with the boardroom/strategy alt text, not the old `alberta-marketing-agency-strategy-chart-business-growth.webp` chart image.

A direct live DOM check confirmed that the Services page scripts are loaded with `?v=marketing-strategy-boardroom-fix-20260601`, and the rendered strategy-related image list includes `/assets/images/calgary-marketing-consultant-boardroom-strategy-meeting.webp` with the alt text `Calgary marketing consultant planning a strategic brand and website project in a professional boardroom setting.`
