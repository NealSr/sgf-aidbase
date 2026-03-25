# SGF AidBase — Build Timeline (Revised)

## Monday Night (March 24) — COMPLETED ✅
- Chose problem statement (community resource navigator)
- Named team (Ctrl+Aid) and app (SGF AidBase)
- Designed full architecture
- Generated 8 blueprint documents
- Signed up for Traction Studio AI
- Created Supabase project + GitHub repo
- Initialized Next.js project
- Deployed to Vercel AND AWS Amplify
- Registered sgfaidbase.org, configured DNS + SSL
- Built placeholder homepage with Claude Code in VSCode

## Tuesday (March 25) — IN PROGRESS
### Completed ✅
- Email/web form outreach to 5 organizations
- Received email responses
- Library visit — interviewed Lisa at reference desk
- Collected 11-page "Where to get help in Springfield" directory
- Compiled 36 verified resources across 4 categories
- Loaded categories + resources into Supabase
- Updated all blueprint docs with current decisions

### Tonight (build sprint)
| Order | Task | Est. Time | Priority |
|---|---|---|---|
| 1 | Run geocoding script (populate lat/lon) | 5 min | Must |
| 2 | Set up Supabase client (lib/supabase.ts) | 15 min | Must |
| 3 | Wire homepage to real Supabase data | 45 min | Must |
| 4 | Build category browse page | 30 min | Must |
| 5 | Build resource detail page | 30 min | Must |
| 6 | Build search results page with distance labels | 45 min | Must |
| 7 | Build Claude API search endpoint | 45 min | Must |
| 8 | Git push → test on sgfaidbase.org | 10 min | Must |
| 9 | About page | 20 min | Should |
| 10 | Feedback page + API route | 30 min | Should |
| 11 | Layout polish (header, footer, meta tags) | 30 min | Should |
| 12 | Admin page (password-protected) | 45 min | Should |

**Must-haves: ~3.5 hours. Should-haves: +2 hours.**

## Wednesday (March 26) — Polish & Test
| Task | Priority |
|---|---|
| Mobile testing on real phone | Must |
| Fix any bugs from Tuesday build | Must |
| Add remaining should-haves not completed Tuesday | Should |
| Attend office hours (virtual or STC Squared) | Optional |
| Speech-to-text mic button | Nice to have |
| AI toggle (search with/without AI) | Nice to have |
| OG image for social sharing | Nice to have |
| Full end-to-end testing | Must |
| Final deploy to both Vercel and Amplify | Must |

## Thursday (March 27) — Demo Day
| Task | Priority |
|---|---|
| Final bug fixes and polish | Must |
| Write/refine demo script | Must |
| Record 5-minute demo video | Must |
| Submit to vibeathon portal | Must |
| Celebrate 🎉 | Must |

## Friday (March 28) — Judging
| Task | Priority |
|---|---|
| Demo presentations (per schedule) | Must |
| AI + human judging | 🤞 |
| Final task: reconcile /docs with actual implementation | Must |

## Priority Stack (If Running Low on Time)

### Must have (demo is broken without these):
1. Homepage with search bar and 4 category cards (real data)
2. Category browse page showing resources
3. Resource detail page with call/map links
4. Claude API smart matching on search
5. Search results with distance labels
6. Deployed at sgfaidbase.org

### Should have (significantly better demo):
7. About page
8. Feedback page
9. Admin page
10. Header/footer polish with crisis numbers
11. Mobile-responsive verified on real device

### Nice to have (wow factor):
12. Speech-to-text mic button
13. AI toggle
14. OG image for social sharing
15. Loading animations
16. "Open now" indicators

### Post-vibeathon:
17. Multilingual support
18. More categories (mental health, employment, etc.)
19. Proper auth for admin
20. Bus route integration
21. Structured hours for real "open now" filtering

## Emergency Fallbacks
- Claude API not working → Supabase full-text search still works
- Vercel down → Switch demo URL to Amplify
- Geolocation declined → Results without distance, no penalty
- Running out of Claude Pro tokens → Switch to Sonnet for chat
- You run out of energy → Sleep. A rested demo beats a buggy all-nighter.
