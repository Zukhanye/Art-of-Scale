# Art of Scale Contract 001: Data partner tracker
Owner: Zukhanye (founder, Geo-Q) · Date: 2026-11-11 · Status: approved (2026-11-11) · Risk tier: High (login and per-user permissions)
<!-- The Owner approves this file. Plain English only. No technical detail. -->

## The problem
Geo-Q decides who to fund from patients' record of collecting and completing treatment. That needs data partners: hospital groups, pharmacy chains, pathology labs and clinic networks. The founder tracks these partnership conversations by hand today, so it is hard to see at a glance who is at which stage and who needs a follow-up this week.

## The outcome
The founder logs in, sees every data partner and its stage in one list, and knows which follow-ups are due.
**How we'll know (in 2 weeks):** every live partner conversation is in the tracker, and no follow-up date passes without the founder seeing it.

## Users and the moment they use it
- Main user: the founder (only user) · trigger: after a partner meeting or call, and when planning the week.
- Other users: none in version 1.

## Version 1 stories (4)
1. As the founder, I can log in and see only my own partner list, so that nobody else can see Geo-Q's pipeline.
2. As the founder, I can add a data partner (organisation name, type, data it could share, number of sites, stage), so that every conversation is recorded in one place.
3. As the founder, I can change a partner's stage and set a next follow-up date, so that the list always shows where each deal stands.
4. As the founder, I can see my partners sorted by follow-up date, with overdue ones highlighted, and filter by stage, so that I know who to chase this week.

## Scenario tests ("When this, then that")
- **Story 1:** When a stranger opens the live link without logging in, then they see only the login screen.
- **Story 1:** When I log in for the first time and have no partners yet, then I see an empty list with an invitation to add my first partner.
- **Story 1:** When a second person logs in with their own account, then they see none of my partners and cannot change them.
- **Story 2:** When I add a partner with name "Example Hospital Group", type "Hospital group", data "Dispensing records" and "Lab results", 40 sites and stage "Identified", then it appears in my list with those details.
- **Story 2:** When I try to add a partner without a name, then the app tells me the name is needed and saves nothing.
- **Story 3:** When I change a partner's stage from "Identified" to "In talks" and set a follow-up date, then the list shows the new stage and date after I refresh the page.
- **Story 4:** When a partner's follow-up date is before today, then it is highlighted as overdue at the top of the list.
- **Story 4:** When I filter by stage "In talks", then I see only partners at that stage.

## Rules and data
- App class: **P (Personal)**: one user, the founder's own non-sensitive work data or made-up data.
- Stored per partner: organisation name, type (Hospital group · Pharmacy chain · Pathology lab · Clinic network · Other), data it could share, picked from a list (Dispensing records · Claims and billing · Lab results · Visit and attendance · Other), number of sites, stage (Identified · In talks · Agreement drafting · Signed · Data flowing · Lost), next follow-up date.
- **Organisation details only.** No patient data, no names, phone numbers or emails of people at partners, and no free-text notes. The actual data partners share never enters this app.
- Each user sees and changes only their own partners. Nobody can delete; a dead deal moves to "Lost".
- The app never sends emails or messages and never writes into Geo-Q's lending, payment or clinical systems.

## Out of scope
- Later: more users (team access), deleting partners, a history of stage changes, reminders.
- Never: patient data, contact details of people, sending messages, links to Geo-Q's core systems.

## Open questions
- None. (Answered: partner conversations live in the founder's email today. They are retyped by hand as organisation, type and stage; emails are never copied or connected.)

## Decision log
| # | Question | Decision |
|---|---|---|
| 1 | Which app first? | Partner tracker (Opportunity Filter 22/25), then refined to data partners, not individual clinics |
| 2 | Who uses it? | Just the founder → Class P |
| 3 | Clinical data? | Business-level facts only; patient-level data is a hard stop |
| 4 | Done today | Log in, add a data partner with type, data and stage, see it in my list; nobody else sees it |
| 6 | Where tracked today? | Email. Move each conversation in by hand; no inbox connection |
| 5 | Must never | Send emails or messages (plus factory rules: no personal data about others, no core systems) |
