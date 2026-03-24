# SGF AidBase — Build Timeline

## Monday Night (Tonight) — Foundation
| Time | Task | Tool |
|---|---|---|
| NOW | ✅ Lock in architecture decisions | Claude (this chat) |
| NOW | ✅ Generate blueprint files | Claude (this chat) |
| Next | Sign up for Traction Studio AI | tractionstudio.ai |
| Next | Run through Wave 1 idea validation | Traction Studio AI |
| Next | Set up Supabase project | supabase.com |
| Next | Create GitHub repo | github.com |
| Next | Initialize Next.js project locally | Terminal |
| Next | Push first commit, connect Vercel + Amplify | Vercel + AWS |
| Before bed | Have a live (blank) app deployed at a real URL | 🎉 |

## Tuesday Morning — Research & Data
| Time | Task | Tool |
|---|---|---|
| 8:00 AM | Review market research questions | Blueprint doc 05 |
| 8:30 AM | Finish Traction Studio Wave 1 if needed | Traction Studio AI |
| 9:00 AM | Start calling/visiting organizations | Phone + notepad |
| 12:00 PM | Lunch — compile research notes | Google Sheets |
| 1:00 PM | Afternoon visits — more orgs + social workers | Phone + notepad |
| 3:00 PM | Call 211 for additional data | Phone |
| 4:00 PM | Return home — organize all collected data | Google Sheets |

## Tuesday Evening — Build Sprint 1
| Time | Task | Tool |
|---|---|---|
| 5:00 PM | Enter real resource data into Supabase | Supabase dashboard |
| 5:30 PM | Build homepage (search bar + category cards) | VSCode + Claude |
| 7:00 PM | Build search results page | VSCode + Claude |
| 8:30 PM | Wire up Supabase client + resource fetching | VSCode + Claude |
| 9:30 PM | Build category browse page | VSCode + Claude |
| 10:30 PM | Build resource detail page | VSCode + Claude |
| 11:30 PM | Deploy to Vercel — test live | Git push |
| Midnight | Review, fix bugs, polish | VSCode + Claude |

## Wednesday — AI Integration + Polish
| Time | Task | Tool |
|---|---|---|
| Morning | Wire up Claude API matching (/api/search) | VSCode + Claude |
| Mid-day | Test search with real queries | Live app |
| Afternoon | Office hours at STC Squared (if attending) | In-person |
| Afternoon | Apply any feedback from office hours | VSCode + Claude |
| Evening | Build About page | VSCode + Claude |
| Evening | Polish: loading states, error handling, mobile responsive | VSCode + Claude |
| Evening | Add meta tags, OG image for social sharing | VSCode + Claude |
| Night | Full end-to-end testing on mobile + desktop | Phone + laptop |
| Night | Deploy final build to both Vercel and Amplify | Git push |
| Night | Pick winner: Vercel or Amplify for demo URL | Browser |

## Thursday — Demo Day
| Time | Task | Tool |
|---|---|---|
| Morning | Final bug fixes and polish | VSCode + Claude |
| Morning | Set up custom domain (if time allows) | Vercel/Amplify |
| Midday | Write demo script (see doc 07) | Claude (this chat) |
| Afternoon | Record 5-minute demo video | Screen recorder + camera |
| Afternoon | Edit video if needed (keep it raw and authentic) | Simple editor |
| Evening | Submit! | Vibeathon submission portal |
| Evening | 🎉 | Monster Energy |

## Friday — Demos + Judging
| Time | Task | Tool |
|---|---|---|
| Per schedule | Demo presentations | Your voice + charm |
| Per schedule | AI + human judging | 🤞 |
| Per schedule | Closing event for winners | 🏆 |

## Priority Stack (If You Run Out of Time)

Must have (Thursday demo is broken without these):
1. ✅ Homepage with search bar and category cards
2. ✅ Search results page that shows real resources
3. ✅ Category browse page
4. ✅ At least 5 real resources per category in the database
5. ✅ Deployed and accessible via a public URL

Should have (makes the demo significantly better):
6. Claude API smart matching on search
7. Resource detail page
8. Mobile-responsive design
9. About page with credits

Nice to have (wow factor but not critical):
10. Animated placeholder in search bar
11. "Was this helpful?" feedback buttons
12. Social sharing meta tags / OG image
13. Loading animations
14. Secondary category suggestions ("You might also need...")

## Emergency Fallbacks
- **Claude API not working?** → Fall back to Supabase full-text search. Still works, just less magical.
- **Vercel deploy broken?** → Switch demo URL to Amplify deployment.
- **Supabase down?** → Extremely unlikely, but you could hardcode a JSON file as last resort.
- **Running out of Claude Pro tokens?** → Switch to Sonnet for chat, save Opus for complex architecture questions.
- **Teammate flakes?** → You were prepared to go solo anyway. You've got this.
- **YOU run out of energy?** → Sleep. Seriously. A well-rested demo beats a buggy all-nighter every time.
