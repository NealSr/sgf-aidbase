# SGF AidBase — Demo Script (5 Minutes)

## Video Strategy
This demo should optimize for the judging rubric:
- `Impact & Relevance` first
- `Demo Quality` second
- `Feasibility` and `Innovation` through concrete proof
- `User Experience` through a calm, clear walkthrough

Screen record the live app. Picture-in-picture is optional. A clean, human walkthrough matters more than flashy editing. This should feel more like a conversation about a real Springfield problem than a feature parade.

---

### 0:00 – 0:30 | The Hook

> "If you needed food for your family tonight, would you know who to call?
>
> In Springfield, we already have incredible organizations helping with food, housing, utility assistance, and transportation. The problem is not that help doesn't exist. The problem is that when you're stressed, scared, or out of options, you may not know where to start.
>
> I'm Neal Richardson. This is Ctrl+Aid+Shift. And this is SGF AidBase."

*[Show the homepage immediately]*

**Why this works**
- Opens on the problem, not the tech
- Frames the app as relevant and urgent
- Gets to the product fast

---

### 0:30 – 1:05 | The Validation

> "This problem was validated in the real world, not just imagined in a hackathon.
>
> I talked with community leaders and resource navigators here in Springfield, including people connected to CFO, the Solidarity Network, and the Library Station. I also visited the Springfield Public Library and looked through their 11-page community resource directory.
>
> The pattern was clear: the information exists, but it's scattered, it changes, and it gets hard to use right when someone is under pressure and needs help fast."

*[Briefly show the printed directory or a screenshot of it if available]*

> "And that has real consequences. When someone walks across town to a food pantry or shelter and finds out the details were wrong, that's not just frustrating. Sometimes it's dangerous.
>
> Today, SGF AidBase includes 36 verified local resources focused on the Four Walls: food, housing, utilities, and transportation."

**Why this works**
- Gives the judges evidence of market validation
- Gives you a concrete number to lead with
- Strengthens both `Impact` and `Feasibility`

---

### 1:05 – 2:20 | The Core Demo

> "The experience is intentionally simple. A person should be able to say what they need in their own words and get pointed in the right direction."

*[Type: `I can't afford groceries this week and need help fast`]*  
*[Show loading messages, then results]*

> "The app interprets the request, maps it to the right category, and returns real local organizations with contact details, hours, and location context."

*[Pause on results long enough for judges to read them]*

> "The distance and walking context matter. For many people, the closest realistic option is more useful than the most famous one."

*[Open one resource detail page]*

> "Each listing is actionable: address, hours, eligibility, phone number, website, and one-tap directions. The goal is not to impress people with AI. The goal is to reduce friction in a moment when even one extra step can feel overwhelming."

**Why this works**
- Shows the primary user journey end to end
- Makes the AI feel useful, not gimmicky
- Highlights the strongest UX differentiator: actionability

---

### 2:20 – 2:55 | The Reliability Story

> "Reliability mattered as much as matching. So the app does not depend on a perfect AI response to stay useful.
>
> Users can browse directly by category, and if AI is slow or unavailable, search degrades gracefully instead of breaking."

*[Click back and open a category browse flow]*  
*[Optionally toggle AI off and show that search still works]*

> "That matters for a real-world pilot. People in crisis cannot be blocked by a spinner."

**Why this works**
- Strong point for `Feasibility`
- Anticipates judge concerns about AI dependence
- Signals engineering judgment

---

### 2:55 – 3:25 | Crisis Flow

> "We also designed for the moments when search should not behave like normal search.
>
> If someone enters a crisis query, the app short-circuits to immediate crisis guidance instead of treating it like a normal resource search."

*[Show one crisis query and the short-circuit response]*

**Demo rule**
- Keep this short and deterministic
- Use a typed crisis query, not mic

---

### 3:30 – 4:10 | The Build

> "As part of this hackathon, I tried to follow a logical progression of ideation, discovery, evaluation, planning, and execution.
>
> The idea itself came from what community leaders were already telling us: people need a better way to connect with the help that already exists.
>
> I used Traction Studio AI by Codefi to pressure-test the problem statement, Claude Code to help shape the solution blueprint, and OpenAI Codex to help button up the final product.
>
> Under the hood, SGF AidBase is built with Next.js, Supabase, and OpenAI. Supabase stores the resource directory and feedback data. OpenAI powers the natural-language matching layer. The frontend is optimized for mobile because that is where this experience is most likely to matter."

*[If helpful, briefly show architecture slide, code, or database only for a few seconds]*

**Why this works**
- Covers `Innovation` without sounding like an AI toy
- Credits both tools cleanly
- Reinforces that the dataset and workflow are real

---

### 4:10 – 4:40 | Why It Can Be Piloted

> "This is pilot-ready because it is focused.
>
> It solves one narrow problem well: helping Springfield residents find verified community resources quickly. It already has real local data, a feedback loop for corrections, and a structure that can expand category-by-category with community partners."

*[Optionally flash the feedback page or admin flow briefly, but do not linger]*

> "This is not trying to replace nonprofits. It is a front door that helps people reach them faster."

**Why this works**
- Tight argument for `Feasibility`
- Keeps the roadmap grounded instead of speculative

---

### 4:40 – 5:00 | The Close

> "Springfield has the resources. SGF AidBase helps people find them when timing matters most.
>
> Thank you."

*[End on the homepage or results screen with `sgfaidbase.org` visible]*

---

## Recommended Demo Order
1. Homepage
2. Typed search
3. Resource detail page
4. Category browse fallback
5. Crisis query
6. Very brief tech/proof moment
7. Close on impact

## Red Flags To Avoid
- Do not lead with architecture or AI tooling
- Do not spend 30 seconds inside Supabase or code
- Do not demo an uncertain feature first
- Do not say "this could help people someday" when you already have verified local data
- Do not overclaim real-time freshness if updates still depend on admin/community input
- Do not let the tone get so polished that it stops sounding personal

## Recording Notes
- Pre-load the app before recording
- Keep a backup tab with successful search results ready
- Use one search query you know returns strong results
- Keep the crisis demo short and confident if you include it
- Pause slightly on results so judges can actually read the cards
- End with the URL on screen

## Recording Tools
- QuickTime on Mac for the simplest recording flow
- OBS if you want picture-in-picture
- Loom if you want fast retries and easy sharing
