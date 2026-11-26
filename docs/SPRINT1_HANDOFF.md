# GeekText API — Group 4 Sprint 1 handoff

Updated: September 22, 2026

This is the continuity record for Manuel Diaz and the next chat or coding agent. It consolidates the assignment, decisions, completed work, final document package, Mac setup, and subsequent instructor clarification. It is not a verbatim transcript or proof that a Canvas upload occurred. This handoff is project documentation, not a sixth course submission document.

## 1. Current state and immediate priority

- Project: CEN 4010, Group 4, Geek Text bookstore REST API.
- Repository: https://github.com/LichaWeComeThere/geektext-api
- Sprint 1 scope: feature ownership, architecture, shared starter, tools, GitHub access, learning, and Scrum records. Bookstore feature endpoints have not been implemented.
- Manuel confirmed that the team's required tutorials, meetings, demonstrations, and Stephanie's acceptance were completed. The latest document package records all six stories Done, the sprint goal achieved, and 48 estimated hours of completed velocity.
- AI disclosures are filled for all six members. The earlier instruction to leave them blank was superseded; preserve the supplied disclosures.
- Manuel's Mac installation and starter/database checks were independently performed in his local Codex session on September 13. A cloud chat does not thereby have live access to his Mac.
- **The instructor's latest announcement, supplied in this chat on September 21, says all five Sprint 1 documents are due September 22 in the group's Sprint 1 discussion forum. Use this latest instruction for submission.**
- No Canvas submission receipt has been seen. Do not claim the team submitted, received a grade, or was granted an extension.
- **Known remaining document issue:** the latest checked ZIP predates the new announcement. `TeamPlanning.docx` still calls September 13 at 11:59 p.m. the submission deadline. Update or clarify that deadline reference to reflect the September 22 announcement before using the package for the current submission. Preserve actual meeting dates and the historical Canvas availability window. This handoff creation does not modify the ZIP.

## 2. Source priority and calendar corrections

Use the latest explicit instructor instruction for the current submission, the actual files for their present contents, and Manuel's confirmations for the team's reported history. If newer evidence appears, update this handoff rather than silently carrying old assumptions forward.

The calendar developed in three stages:

1. `TeamProject.pdf`, page 6, gives a general Sprint 1 schedule of September 7–20 with review/documents September 22. Early drafts applied that schedule too rigidly to this team's checkpoint and meeting records.
2. Manuel supplied Canvas screenshots of “Sprint 1 Placeholder”: available August 31 through September 13, with a displayed Sunday September 13 deadline at 11:59 p.m. The documents were corrected to label this an assignment/checkpoint availability window, not independent proof of an official sprint-start rule. The local final package reflects that evidence.
3. The newer instructor announcement explicitly says the four Scrum documents plus the Features and Architecture document are due **September 22** in the group's Sprint 1 discussion. It also says Sprint 2 starts Monday September 21. This is the latest submission direction and supersedes using September 13 as the current deadline.

The new announcement does not specify a cutoff time. Do not carry the older checkpoint's 11:59 p.m. time over to September 22 without checking Canvas. Do not reintroduce an earlier separate September 20 architecture deadline: the new announcement groups all five documents under September 22.

Manuel supplied these actual meeting dates:

| Event | Date in the latest documents |
| --- | --- |
| Standup 1 | September 1, 2026 |
| Standup 2 | September 3, 2026 |
| Standup 3 | September 8, 2026 |
| Standup 4 | September 10, 2026 |
| Review | September 11, 2026 |
| Retrospective | September 11, 2026 |
| Completion/acceptance confirmation recorded in documents | September 13, 2026 |
| Independent follow-up verification on Manuel's Mac | September 13, 2026 |

The standups are grouped as two in the week of August 31 and two in the week of September 7. Do not change these reported dates merely to match the general schedule or the submission deadline. Do not backdate the September 13 technical verification to a meeting date. Earlier September 15/17 proposed standups and “pre-sprint preparation” objections belong to superseded drafts.

## 3. Exactly what is submitted, where, and by whom

Sprint 1 requires five filled documents:

1. Standup — `TeamStandup.docx`
2. Planning — `TeamPlanning.docx`
3. Retrospective — `TeamRetro.docx`
4. Review — `TeamReview.docx`
5. Features and Architecture — `Sprint1_FeaturesAndArchitectureSumB.docx`

`TeamProject.pdf`, page 7, assigns the Scrum Master responsibility for keeping ceremony notes and uploading them to the team's sprint discussion forum. The new instructor announcement confirms that the five documents belong in the group's Sprint 1 discussion. For this team, the identified discussion is **“Sprint 1 Deliverables - Group 4.”**

The working interpretation is **one team submission containing five documents**, normally posted by Michael Duran as Sprint 1 Scrum Master. Six identical individual uploads are not required by these instructions. Michael can post a reply in the appropriate discussion with the documents attached. A separate acknowledgment reply to the instructor's announcement is not requested.

The announcement does not establish whether Canvas accepts one ZIP, multiple Word attachments in one post, or imposes attachment restrictions. Use the actual discussion controls; attaching the five individual Word documents is appropriate when supported. Use the ZIP if permitted. Do not confuse five documents with five required separate posts.

Separate individual-submission settings for “Sprint 1 Placeholder” were never verified. The new announcement does not instruct an additional upload there. Do not claim those settings were inspected or invent a second required submission.

No routine Sprint 1 recording is required by the general course PDF. Later-sprint demonstration requirements should not be applied automatically to Sprint 1. The PDF separately describes an absent member recording their progress; do not turn that conditional rule into a new recording requirement for everyone.

There is no identified requirement to store the submission ZIP in GitHub. The repository holds the shared source code. This handoff, setup notes, launcher, learning checklist, and reference archives are supporting materials, not additional course deliverables.

## 4. Team roles, feature ownership, and six accepted stories

| Member | Sprint 1 role | Feature owner | Story |
| --- | --- | --- | --- |
| Manuel Diaz | Developer | Book Browsing and Sorting | S1-01: Set up the shared project |
| Carlos Encalada | Developer | Profile Management | S1-02: Prepare the database environment |
| Herlin Guirado Fuentes | Developer | Book Details | S1-03: Learn Express and Postman |
| Mateo Garcia | Developer | Shopping Cart | S1-04: Learn the team Git workflow |
| Michael Duran | Scrum Master and Developer | Book Rating and Commenting | S1-05: Organize Sprint 1 collaboration |
| Stephanie Garcia, also called Stefi | Product Owner and Developer | Wish List Management | S1-06: Confirm ownership and architecture |

Each story is estimated at 8 hours. The accepted plan contains **six stories**, not the superseded 12-story example in earlier archives. Each story originally budgets 4 hours for setup, 2 for introductory learning, and 2 for its shared team responsibility. Product Owner and Scrum Master duties are included. The course rotates those two roles in later sprints; no Sprint 2 role assignment has been agreed in this chat. Feature ownership remains as recorded unless the team changes it.

All six stories have these common acceptance checks:

- TC1: local tools, team repository access/clone, MongoDB ping, and successful starter request in Postman.
- TC2: course REST API material, Express Hello World and GitHub Hello World exercises, and explanation/demonstration to a teammate.

TC3 is specific to the owner:

| Story | Individual TC3 / shared responsibility |
| --- | --- |
| S1-01 | Shared starter, lockfile, ignored local files and README; clean-clone `npm ci`, startup, and expected GET response. |
| S1-02 | MongoDB ping and explanation of API-only database access and local configuration kept out of Git. |
| S1-03 | Postman GET response, HTTP 200, JSON, and explanation of GET versus POST. |
| S1-04 | Practice branch, commit and diff; correct team repository origin. |
| S1-05 | Four actual standup records and completed planning/review/retrospective records. |
| S1-06 | Ownership and architecture checked against all six features; story acceptance by the Product Owner. |

The latest documents record S1-01 through S1-06 as Done, accepted by Stephanie, with no unfinished Sprint 1 stories and all TC1/TC2/TC3 checks passed. Completed velocity is **6 × 8 = 48 estimated hours of accepted story value**, not measured elapsed working time.

Retrospective actions retained in the final package:

| Action | Owner | Recorded deadline |
| --- | --- | --- |
| Keep accepted story results and supporting setup/learning evidence together | Stephanie Garcia | Before Sprint 2 planning |
| Archive completed Sprint 1 ceremony records and share their location | Michael Duran | Before Sprint 2 planning |
| Clarify shared database-design scope and reconcile earlier ERD references | Carlos Encalada and Stephanie Garcia | Before database-design work begins |
| Share the next sprint meeting schedule and use story IDs in updates | Michael Duran | At Sprint 2 planning |

Completion of those follow-up actions has not been separately reported. Do not silently mark them complete just because the Sprint 1 stories are accepted.

## 5. Current submission ZIP and how to identify it

Manuel's Mac:

```text
/Users/mdiaz/Downloads/Sprint 1/Deliverables/Sprint1_Group4.zip
```

Editable copies:

```text
/Users/mdiaz/Downloads/Sprint 1/Deliverables/Sprint1_Group4/
```

Known package identity:

```text
Filename: Sprint1_Group4.zip
Size: 87,243 bytes
SHA-256: 57b7c26064b8132a6a1826edab80c1764e98cd40faeda814c106f821f406c802
```

The local session checked it on September 15. The matching ZIP was subsequently uploaded into this chat; its bytes and ZIP integrity were verified here, and the same hash and document contents were rechecked while preparing this handoff on September 22. It contains exactly the five DOCX files listed above under `Sprint1_Group4/`.

The local session rendered and inspected the documents: architecture 1 page, planning 4, standup 4, review 2, retrospective 1. It repaired a broken review table and an almost-empty page introduced by manual edits, aligned acceptance-test labels with the plan, removed erroneous TC4/duplicate labels, and restored retrospective action items, owners, and deadlines. That layout verification is a recorded local-session result, not a new rendering in this handoff task.

This remains the latest checked document package, but its Planning deadline sentence now needs the September 22 clarification described in section 1. If the documents are changed, rebuild the ZIP and record a new hash; the hash above identifies the unchanged earlier package, not a future revision.

Version distinctions:

- `Sprint1_Group4(1).zip` is an older draft, not this package.
- A similarly named generated ZIP of 86,806 bytes is also an earlier draft. Do not choose a file by name alone.
- Earlier `files.zip`, `Demo_01`, and documents under `References/group4/` are historical sources.
- `Archive.zip` is a supporting archive containing the starter repository, installed JavaScript dependencies, course materials and older drafts. Its contents were checked; it does not contain the latest final submission ZIP or the complete Mac setup tools/scripts.
- The submission ZIP is not in the repository as of the pre-handoff inspection. Adding this handoff does not add the ZIP.

## 6. AI disclosure and evidence boundaries

Manuel first asked to leave AI disclosure blank for discussion with the team. He later supplied edited documents with entries and asked to preserve them. That later instruction controls.

The latest Review includes this Manuel entry:

> Manuel Diaz: ChatGPT/Codex was used to help understand the assignment, prepare and revise the Sprint 1 documents, configure development tools, set up the GitHub repository, and test the starter API and MongoDB.

Carlos Encalada, Herlin Guirado Fuentes, Mateo Garcia, Michael Duran, and Stephanie Garcia each have their own entry using Manuel's supplied description:

> AI was used to help format the files, understand the assignment, and set up the GitHub repository.

Preserve all six entries. They are the team's supplied descriptions, not independently verified accounts of each person's usage. The course permits AI but requires disclosure and understanding of the architecture and all generated code used.

Evidence must be described accurately:

| Information | Basis |
| --- | --- |
| Team tutorials, meetings, demonstrations, and Stephanie's acceptance | Manuel explicitly confirmed: “They have now been completed and approved.” |
| Historical meeting dates | Supplied by Manuel and recorded in the final documents. |
| Each member's AI usage | Entries supplied by Manuel in the edited documents. |
| Manuel's installed tools, authenticated clone, API response and MongoDB ping | Independently checked in the local Codex session on September 13. |
| ZIP identity and integrity | Checked against the uploaded file in this chat; rechecked September 22. |
| Actual Canvas submission | Not verified; no receipt seen. |

Do not revert the accepted stories to pending merely because the new chat did not attend the meetings. Equally, do not describe every teammate's machine or demonstrations as independently observed by Codex. Do not invent attendance, hours, approvals, submissions, or feature implementation.

## 7. Architecture and repository implementation

The agreed design is one shared Node.js/Express REST API and one common MongoDB database. Postman is the development/testing client. Only the API should access the shared database in the implemented application. JavaScript is used for application code; JSON for requests/responses; MongoDB query syntax for database operations. VS Code is the IDE. Mongoose is planned for future data modeling, not currently installed. The completed API must use HTTPS; the local Sprint 1 starter uses loopback HTTP.

Repository: `LichaWeComeThere/geektext-api` (private in the established project context).

The original starter commit, independently used in the Mac verification and still the main head immediately before this handoff was added:

```text
3156d82df1bc1a04eb29f4fb4c37ae5f552c7b38
```

Publishing this handoff creates a later documentation commit. Do not assume the starter commit remains the current branch head; inspect Git when continuing.

The code at that base consists of `.gitignore`, `README.md`, `package.json`, `package-lock.json`, and `server.js`. `package.json` specifies Node `24.x`, Express `5.2.1`, and `npm start` runs `node server.js`.

`server.js` runs a single GET `/` route on `127.0.0.1:3000`. Expected response:

```json
{"message":"Hello, GeekText!"}
```

Expected status is HTTP 200 with a JSON content type. There are no bookstore routes, database models, seed data, frontend, or API-to-MongoDB connection yet. MongoDB's successful ping checks the separate service, not persistence through the starter.

Manuel reported that all teammates have repository access. Access is distinct from their individual clone/setup checks. No new invitations or external team messages are part of this handoff task.

## 8. Manuel's Mac setup: recorded September 13 verification

Workspace:

```text
/Users/mdiaz/Downloads/Sprint 1
```

Actual authenticated clone:

```text
/Users/mdiaz/Downloads/Sprint 1/geektext-api
```

Machine recorded by the local session: macOS 26.6.2, Apple M5, arm64, 24 GB RAM.

| Tool | Verified installed version |
| --- | --- |
| Node.js | 24.21.0 |
| npm | 11.19.0 |
| Git | 2.50.1 (Apple Git-155) |
| Visual Studio Code | 1.137.0 |
| MongoDB Community Server | 8.0.32 |
| mongosh | 2.10.0 |
| Postman | 12.27.7 |
| GitHub CLI | 2.100.0 |

These are recorded installed versions, not recommendations to upgrade to today's latest releases. VS Code and Postman are in `/Applications` and were launched successfully. Command-line tool distributions are under the project-level `.setup/tools`, linked from `.setup/bin`. `~/.zprofile` sources the project-level `.setup/env.sh`. Existing scripts/configuration use absolute paths, so moving the workspace requires checking those references.

GitHub CLI authenticated as `LichaWeComeThere` through the macOS keyring. No credentials or tokens belong in this handoff or repository.

The actual clone used branch `main`, correct origin `https://github.com/LichaWeComeThere/geektext-api.git`, and the starter commit above. Its working tree was clean at verification. `npm ci` installed 68 packages with zero reported audit vulnerabilities at that time. `npm start` succeeded. A request in Postman returned HTTP 200 and the expected JSON. A separate `mongosh` ping returned `{ ok: 1 }`.

The final technical check used the real authenticated Git clone, replacing an earlier temporary starter copy. The temporary snapshot is historical; use `geektext-api` for ongoing work. Do not assume either the API or MongoDB is still running today.

## 9. Running the existing setup on Manuel's Mac

These commands are for the existing local Mac setup, not for a cloud Linux workspace or a teammate who lacks the helper files.

```sh
cd "/Users/mdiaz/Downloads/Sprint 1"
source .setup/env.sh
./.setup/start-mongodb.sh
cd geektext-api
npm start
```

Alternatively, double-click `Start GeekText.command` in the workspace. It loads the project environment, checks for the Git clone, starts MongoDB, installs npm dependencies if `node_modules` is missing, and starts the API. Run only one API instance on port 3000. Control+C stops the API; the launcher leaves MongoDB running.

In Postman:

```text
GET http://127.0.0.1:3000/
Expected: HTTP 200, application/json, {"message":"Hello, GeekText!"}
```

Separate database check from another Terminal:

```sh
source "/Users/mdiaz/Downloads/Sprint 1/.setup/env.sh"
mongosh 'mongodb://127.0.0.1:27017/admin' --quiet --eval 'db.runCommand({ping:1})'
```

Stop this project's MongoDB gracefully:

```sh
"/Users/mdiaz/Downloads/Sprint 1/.setup/stop-mongodb.sh"
```

MongoDB is bound to `127.0.0.1:27017` and does not automatically start after a Mac restart in this setup. Its data/logs are under `.setup/mongodb/`.

For a teammate's new clone, follow the repository README after installing the required tools. Do not assume Manuel's `.setup` scripts are available from GitHub. For an existing clone, inspect `git status` and `git remote -v` before pulling; preserve any local edits.

## 10. Supporting files and assignment references

These support files are located at Manuel's workspace root, outside the source repository:

| File or folder | Purpose and status |
| --- | --- |
| `SETUP.md` | Recorded installations, verification, and run instructions. Some statements about processes running or untouched AI disclosure describe the earlier setup session only. |
| `Start GeekText.command` | Mac launcher; requires the local `.setup` scripts and actual clone. |
| `SPRINT1_REVIEW.md` | Has a Canvas correction at the top; the older audit beneath it is explicitly historical. The September 22 announcement is newer than that correction. |
| `LEARNING_AND_DEMO.md` | Tutorial and demo guidance; earlier pending-learning and general-schedule statements are superseded as current status. |
| `.setup/env.sh` | Loads locally installed command-line tools. |
| `.setup/start-mongodb.sh` and `.setup/stop-mongodb.sh` | Project-local MongoDB lifecycle helpers. |
| `.setup/logs/` | September 13 verification evidence, including clone/API, npm, Postman, and MongoDB results. |
| `.setup/finalize/canvas-calendar-correction/package-verification.json` | Final-package verification manifest from the local session. |
| `References/` and internal backups | Original course material and preserved older archives/documents. |

Course sources considered:

- `TeamProject.pdf`: project rules, AI disclosure, roles, velocity, ceremonies, and submission location; pages 5–7 are especially relevant, and page 9 gives the getting-started checklist.
- `CEN4010_ProjectSequence.pdf`: staged implementation; database modeling/seeding and an example feature GET are placed in Sprint 2.
- `StarterStoriesForSprint1.docx`: suggested starter stories, including earlier database-design/schema work.
- `Feature Checklist.pdf`, `REST API Expectations.pdf`, and `Recommended Frameworks.pdf`.
- Module 1 Scrum templates for planning, standup, review, and retrospective; the Sprint 1 ownership/architecture template.
- `Sprint Demo Guidelines.pdf`, Scrum lectures, Canvas screenshots, and the latest instructor announcement supplied as text.

There was a database-design timing ambiguity between the starter suggestions and project sequence. Preserve the retrospective action to clarify scope. Do not silently expand Sprint 1 to add schemas, ERDs, feature implementation, UML, or extra deliverables.

The learning plan uses the course REST API material and the official Express and GitHub Hello World tutorials linked by the README. A working starter alone is not evidence that a tutorial was completed; the final learning status rests on Manuel's later explicit confirmation.

## 11. Continuing in a new chat

1. Read this handoff first, especially the latest deadline and package-version distinction. Treat the repeatedly displayed old “SPRINT 1 TEAM UPDATE” writing block as a historical draft: its blank AI disclosure, pending stories, and earlier dates are not current state.
2. Confirm the user's requested next task. This handoff request authorizes continuity documentation; it does not ask to implement Sprint 2 or rewrite the submission automatically.
3. If editing the submission, obtain the latest matching ZIP or its editable files. Correct the Planning deadline reference using the newer announcement, retain user-confirmed meeting/completion dates and AI entries, render the changed document, and rebuild/verify the five-document ZIP. Preserve a prior copy and record a new identity for the changed package.
4. If helping with submission, use the group Sprint 1 discussion and check the actual attachment controls and cutoff time. Do not assert a successful upload without a visible receipt or other direct confirmation. Only one group submission is indicated by the supplied instructions.
5. If working with the code, inspect the repository's current branch, status, and instructions before changing it. Scope the work to what Manuel asks next. The starter verification does not imply bookstore features exist.
6. If working on Manuel's laptop, verify the execution environment really is his Mac and that the correct folder is accessible. A cloud path such as `/workspace/scratch/...` is not `/Users/mdiaz/...`. Opening a desktop app alone does not establish local command access. A local Codex session can use the selected project directory; screenshots, paths, and historical logs alone cannot establish a live connection.
7. Keep files for this project in the requested Sprint 1 workspace when operating locally. Use normal macOS installation locations where required. Existing setup is complete according to the recorded checks; inspect before reinstalling or changing global tools.

Manuel prefers direct action within the agreed scope, clear status, and simple copy/paste-friendly communication. He originally requested only Sprint 1's required submission, with no extra coursework. The current additional request is this comprehensive handoff in GitHub and an identical downloadable copy for moving to a new chat. Keep unrelated investing-app and game-project history out of GeekText work.

## 12. How this handoff was checked

On September 22, the repository tree, README, and package configuration were read; the source remained at the original five-file starter immediately before this document was added. The matching submission ZIP was recovered and its SHA-256, integrity, document list, calendar references, acceptance results, retrospective actions, and filled disclosures were checked. The course PDF's upload responsibility was reread in the preceding discussion. Historical local Mac checks are carried forward from Manuel's supplied local-session record and supporting files; they were not rerun on the Mac during this task.

No Canvas upload, team message, new software installation, or application feature implementation is performed by creating this handoff.
