# SGF AidBase — Demo Voice Track

If you needed food for your family tonight, would you know who to call?

Would you know where to start if you were already exhausted, stressed, or scared?


That is the problem SGF AidBase is trying to solve.

Springfield is full of people who care.

But help can still be hard to reach when someone needs it most.


I'm Neal Richardson from the Ctrl+Aid+Shift team.

And this is SGF AidBase.


This idea did not come from a whiteboard.

It came from listening.

I talked with community leaders and resource navigators here in Springfield, including people who volunteer at shelters, members of the local solidarity network, and librarians.

I also read through the eleven page community resource directory at the Springfield Public Library.

The message I kept hearing was simple.

The resources are here, and they are powerful, but the information is scattered, occasionally outdated, and hard to find.

And at the exact moment someone needs help, even one wrong turn can matter.

For this demo, I gathered 36 verified local resources across food, housing, utilities, and transportation - the "Four Walls" that everyone needs to feel safe and secure. And that matters.


When someone spends time and energy trying to get support, but the details are wrong, that is not just frustrating and ineffective...

Sometimes it is dangerous.

One of the most common concerns I heard from the community is that because of a lack of reliable transportation, people in need frequently have to walk from place to place in search of help. Springfield happens to be one of the most dangerous places to be a pedestrian in America, based on its size, so we made walking distance to support a key priority.


The experience also had to be simple.

A person should be able to say what they need in plain language and get pointed in the right direction.

No jargon.

No guessing.

No digging through pages of listings while life is already hard enough.


This is our homepage, open to anyone with a computer or mobile device. Right away, I can type what I need in my own words.

Not a keyword.

Just a real need, in real words.

The point of AI here is not to feel impressive.

The point is to reduce friction in a moment when even one extra step can feel overwhelming.

The app interprets that request, maps it to the right category, and returns real, local organizations with actionable details.

You can see the location context, the contact information, and the hours right in the results.

Because the best answer is not just the one that sounds right.

It is the one someone can actually use.


And when you open a resource, everything is designed to help someone take the next step immediately.

Address and phone number with a one-click call or directions link.

Operating Hours even if they're unique or complex.

Eligibility notes for resources that have specific requirements.



We also cared a lot about reliability.

Because people in crisis cannot be blocked by a spinner.

So the app does not depend on a perfect AI response to stay useful.

Users can still browse directly by category.

Users can still search without AI if they want to.

The experience still needs to help, even when the smart part is slow.

Here, I can turn off the AI integration and the app will simply do a keyword search against the directory and quickly come back with results.



And for moments that are more serious, the app should not behave like casual search.

If someone enters a phrase that indicates they might be in an emergency or crisis, it short-circuits any AI or API calls to provide immediate crisis guidance.



As part of this hackathon, I tried to follow a logical progression of ideation, discovery, evaluation, planning, and execution.

I came up with the problem statement by considering the needs of my community.  Then I used Traction Studio AI by Codefi to pressure-test the problem statement.

I used Claude Code to help shape the solution blueprint and prompts.

I used VS Code to edit and develop the solution, and lastly I used OpenAI Codex to help button up the final product and demo.


Under the hood, SGF AidBase is built with Next.js, Supabase, and OpenAI.

Next.js is optimized for mobile, because that is where the experience is most likely to matter.

Supabase stores the resource and feedback data.

OpenAI powers the natural-language matching layer.

The entire solution is available live at sgfaidbase.org, and the source code is visible on GitHub. The hosting is even set up for a clean CI/CD pipeline so that as users provide feedback, we can quickly improve the product over time.

At the end of the day... we are not trying to compete with or replace nonprofits.

We are trying to make them easier to reach.


This is pilot-ready because it is focused.

It solves one narrow, important problem well, which is helping Springfield residents find verified community resources quickly.

It already has real local data, a feedback loop for corrections, and a structure that can grow category by category with community partners.


Springfield has the resources.

Springfield has the heart.

SGF AidBase helps connect the two.

Thank you.
