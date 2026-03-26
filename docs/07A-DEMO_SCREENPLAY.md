# SGF AidBase — Demo Screenplay (5 Minutes)

This version is meant to be read aloud during recording or handed to a voice model. It is written to sound natural, clear, and human.

## Delivery Notes
- Speak slightly slower than normal conversation
- Pause for 1-2 seconds when search results appear
- Do not rush the first 20 seconds
- If a screen takes an extra beat to load, keep talking calmly
- Treat this like a discussion with judges, not a performance

---

## 0:00 – 0:30 | Open Strong

**On screen**
- Homepage already loaded
- Cursor idle near the search box

**Voiceover**

"If you needed food for your family tonight, would you know who to call?

In Springfield, we already have incredible organizations helping with food, housing, utility assistance, and transportation. The problem is not that help doesn't exist. The problem is that when you're stressed, scared, or out of options, you may not know where to start.

I'm Neal Richardson from the Ctrl+Aid+Shift team. And this is SGF AidBase."

---

## 0:30 – 1:05 | Prove It Is Real

**On screen**
- Briefly show the printed directory or a photo of it
- Return to the app quickly

**Voiceover**

"This problem was validated in the real world, not just imagined in a hackathon.

I talked with community leaders and resource navigators here in Springfield, including people connected to CFO, the Solidarity Network, and the Library Station. I also visited the Springfield Public Library and reviewed their community resource directory.

The pattern was clear: help exists, but the information is scattered, it changes often, and it becomes difficult to use at exactly the moment someone needs it most.

Today, SGF AidBase includes 36 verified local resources across food, housing, utilities, and transportation."

**Optional extra line if timing allows**

"And when someone spends time or energy getting to a resource only to discover the details were wrong, that's not just frustrating. Sometimes it's dangerous."

---

## 1:05 – 2:20 | Main Search Demo

**On screen**
- Click the search box
- Type: `I can't afford groceries this week and need help fast`
- Submit
- Let the loading messages appear
- Pause on results

**Voiceover**

"The experience is intentionally simple. A person should be able to say what they need in their own words and get pointed in the right direction.

Here, I’m searching for food help the way a real person might actually ask for it.

The app interprets the request, maps it to the right category, and returns real local organizations with actionable details.

You can see the location context, the contact information, and the hours right in the results. That matters because the best answer is not just a matching answer. It is the option someone can realistically reach and use."

---

## 2:20 – 2:45 | Show Actionability

**On screen**
- Open one strong resource detail page
- Hover over phone, directions, website, hours

**Voiceover**

"Each listing is designed to help someone take the next step immediately.

There is an address, a phone number, hours, eligibility notes, and one-tap directions. The goal is not to impress someone with AI. The goal is to reduce friction in a moment when even one extra step can feel overwhelming."

---

## 2:45 – 3:15 | Reliability and Fallback

**On screen**
- Go back
- Click a category card such as Food
- Optionally show AI toggle if it is clean in the current UI

**Voiceover**

"Reliability mattered as much as matching.

So the app does not depend on a perfect AI response to stay useful. Users can browse directly by category, and the experience still works even if someone prefers not to use AI at all.

People in crisis cannot be blocked by a spinner."

---

## 3:15 – 3:40 | Crisis Flow

**On screen**
- Use a crisis query from the homepage or search page
- Let the short-circuit response appear

**Voiceover**

"We also designed for the moments when search should not behave like normal search.

If someone enters a crisis query, the app short-circuits to immediate crisis guidance instead of treating it like an ordinary resource search."

---

## 3:45 – 4:20 | Build and AI Story

**On screen**
- Very brief architecture slide, code snippet, or Supabase table view
- Keep this under 20 seconds

**Voiceover**

"As part of this hackathon, I tried to follow a logical progression of ideation, discovery, evaluation, planning, and execution.

The idea itself came from what community leaders were already telling us: Springfield has resources, but people need a better way to connect to them.

I used Traction Studio AI by Codefi to pressure-test the problem statement, Claude Code to help shape the solution blueprint, and OpenAI Codex to help button up the final product.

Under the hood, SGF AidBase is built with Next.js, Supabase, and OpenAI. Supabase stores the resource and feedback data. OpenAI powers the natural-language matching layer. The frontend is optimized for mobile because that is where this experience is most likely to matter."

---

## 4:20 – 4:45 | Why It Can Be Piloted

**On screen**
- Show feedback page briefly or return to search/results

**Voiceover**

"This is pilot-ready because it is focused.

It solves one narrow, important problem well: helping Springfield residents find verified community resources quickly.

It already has real local data, a feedback loop for corrections, and a structure that can expand category by category with community partners.

We're not trying to replace nonprofits. We're trying to make them easier to reach."

---

## 4:45 – 5:00 | Close

**On screen**
- End on homepage or search results with `sgfaidbase.org` visible

**Voiceover**

"Springfield has the resources. SGF AidBase helps people find them when timing matters most.

Thank you."

---

## Short Version for Rehearsal

"If you needed food for your family tonight, would you know who to call?

Springfield already has help. The problem is that people do not always know where to start when they need it most.

SGF AidBase helps people describe what they need in plain language and quickly find verified local resources for food, housing, utilities, and transportation.

It is built for real use: mobile-friendly, actionable, and resilient even when AI is slow because category browsing and fallback search still work.

We validated the problem locally, loaded 36 verified Springfield resources, and designed the app to help people take the next step quickly.

Springfield has the resources. SGF AidBase helps people find them."
