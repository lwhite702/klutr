# Wrelik Brand Voice & Communication Standards

Version: 1.0
Last updated: 2025-10-29 (America/New_York)

## Brand Essence

**Wrelik Identity:** Calm, clear, confident, intelligent

Wrelik is the supportive mentor who codes. We don't hype, we don't anthropomorphize AI, and we don't talk down to users. We write like we're explaining something to a smart colleague who's new to the project.

## Voice Principles

### Core Tone

- **Supportive mentor who codes:** We guide users without condescending
- **Calm confidence:** We know what we're doing, but we're not arrogant
- **Intelligent simplicity:** Complex concepts explained clearly
- **Direct action:** Short, clear instructions that get things done

### What We Avoid

- **Hype and buzzwords:** No "revolutionary," "game-changing," or "AI-powered magic"
- **Anthropomorphizing AI:** AI doesn't "think" or "feel" - it processes and analyzes
- **Overly casual language:** We're professional but not stuffy
- **Technical jargon:** We explain concepts in plain English
- **Exclamation points:** Use sparingly, only for genuine excitement

## UI Copy Rules

### Buttons and Actions

- **Verb-first:** "Add note" not "Create your amazing note!"
- **Active voice:** "Save changes" not "Changes will be saved"
- **Clear intent:** "Delete forever" not "Remove"
- **Consistent terminology:** Use the same words for the same actions

**Good Examples:**

- "Add note"
- "Save draft"
- "Delete cluster"
- "Unlock vault"
- "Generate insights"

**Bad Examples:**

- "Create your amazing note!"
- "Save your brilliant changes"
- "Remove this cluster"
- "Access your secure vault"
- "Get AI-powered insights"

### Tooltips and Help Text

- **Explain without condescending:** Assume users are smart but new
- **Focus on the "why":** Explain the benefit, not just the feature
- **Be specific:** "Groups related notes" not "Organizes your thoughts"

**Good Examples:**

- "Groups notes with similar topics automatically"
- "Encrypts notes so only you can read them"
- "Shows your note-taking patterns over time"

**Bad Examples:**

- "Makes your notes organized"
- "Keeps your notes safe"
- "Shows how you think"

### Error Messages

- **Clear cause + action:** Tell users what went wrong and how to fix it
- **Avoid blame:** "Unable to save" not "You made an error"
- **Provide next steps:** Give users a clear path forward

**Good Examples:**

- "Unable to save note. Check your connection and try again."
- "Vault password incorrect. Please try again or reset your password."
- "Clustering failed. Your notes are still safe - try again in a few minutes."

**Bad Examples:**

- "Error occurred"
- "Invalid password"
- "Something went wrong"

### Empty States

- **Guide next step:** Tell users what to do first
- **Show value:** Explain why this feature matters
- **Encourage action:** Make the first step feel achievable

**Good Examples:**

- "Add your first note to get started"
- "Create a vault to store sensitive notes securely"
- "Notes will appear here as you capture ideas"

**Bad Examples:**

- "No notes yet"
- "Empty vault"
- "Nothing here"

### Onboarding

- **Progressive disclosure:** Show features as users need them
- **Focus on value:** Explain benefits, not just features
- **Keep it short:** One concept per screen

**Good Examples:**

- "MindStorm groups your notes automatically. Add a few notes to see it work."
- "Your vault keeps sensitive notes encrypted. Only you can read them."
- "Insights help you discover patterns in your thinking."

**Bad Examples:**

- "Welcome to the amazing world of AI-powered note organization!"
- "Our revolutionary clustering algorithm will transform your productivity!"
- "Get ready for the future of note-taking!"

## Documentation Voice

### User-Facing (Mintlify)

- **Conversational:** Write like you're talking to a colleague
- **Example-driven:** Show, don't just tell
- **Progressive:** Start simple, add complexity gradually
- **Encouraging:** Help users succeed

### Technical (Internal /docs/)

- **Precise:** Use exact technical terms
- **Engineering tone:** Professional but not academic
- **Factual:** Document what is, not what could be
- **Risk-aware:** Document known limitations

## Communication Standards

### Changelog Entries

- **Factual:** What changed, not why it's amazing
- **Dated:** Always include timestamp in ET
- **Categorized:** Use consistent tags [feature], [ui], [infra], [docs], [risk]
- **Concise:** One line per logical change

**Good Examples:**

- "[feature] Added manual re-clustering trigger to MindStorm page"
- "[ui] Updated QuickCaptureBar with better error handling"
- "[infra] Added CRON_SECRET validation to all cron endpoints"
- "[docs] Created vault.md with encryption implementation details"
- "[risk] Vault keys stored in localStorage - lost on refresh"

**Bad Examples:**

- "Amazing new clustering feature!"
- "Fixed some bugs"
- "Updated stuff"
- "Made things better"

### Commit Messages

- **What + why:** Describe the change and the reason
- **Present tense:** "Add feature" not "Added feature"
- **Concise:** Keep summary line under 70 characters

**Good Examples:**

- "Add manual re-clustering to MindStorm page"
- "Fix QuickCaptureBar error handling for empty notes"
- "Update cron endpoints to validate CRON_SECRET"
- "Document vault encryption implementation in /docs/"

**Bad Examples:**

- "Stuff"
- "Fix things"
- "Update"
- "Changes"

### Code Comments

- **Intent, not implementation:** Explain why, not how
- **Context for future developers:** Assume they're smart but new to the code
- **Document decisions:** Why this approach was chosen

**Good Examples:**

```typescript
// Client-side encryption ensures server never sees plaintext
// Risk: localStorage keys lost on refresh - temporary solution
const encryptedNote = await encryptVaultNote(note, userKey);

// Manual clustering trigger for users who want fresh groupings
// Bypasses scheduled nightly clustering for immediate results
const clusters = await reclusterNotes(userId);
```

**Bad Examples:**

```typescript
// Encrypt the note
const encryptedNote = await encryptVaultNote(note, userKey);

// Cluster the notes
const clusters = await reclusterNotes(userId);
```

## Brand Don'ts

### Explicit Anti-Patterns

- **Never use:** "AI-powered," "smart," "intelligent," "revolutionary"
- **Never say:** "Your AI assistant," "AI thinks," "AI learns"
- **Never hype:** "Amazing," "incredible," "game-changing"
- **Never be vague:** "Something," "stuff," "things"
- **Never blame users:** "You made an error," "Your mistake"
- **Never oversell:** "Perfect," "flawless," "100% accurate"

### Tone Violations

- **Too casual:** "Hey there!" "What's up?" "Cool beans"
- **Too formal:** "Please be advised," "It is recommended," "One should"
- **Too excited:** Multiple exclamation points, ALL CAPS
- **Too technical:** Jargon without explanation, acronyms without definition

## Examples by Context

### Feature Announcements

**Good:**
"Manual re-clustering is now available in MindStorm. Click 'Re-cluster now' to refresh your note groupings based on recent additions."

**Bad:**
"Revolutionary new AI-powered clustering feature! Your notes will be magically organized!"

### Error Handling

**Good:**
"Unable to save note. Check your connection and try again."

**Bad:**
"Oops! Something went wrong. Please try again later."

### Onboarding

**Good:**
"Add your first note to see how MindStorm groups related ideas automatically."

**Bad:**
"Welcome to the future of note-taking! Get ready to be amazed!"

### Documentation

**Good:**
"Vault notes are encrypted on your device before being sent to our servers. We never see your plaintext content."

**Bad:**
"Your notes are super secure with our amazing encryption technology!"

## Voice Testing

Before publishing any user-facing copy, ask:

1. **Is this clear?** Would a new user understand what to do?
2. **Is this helpful?** Does it guide users toward success?
3. **Is this confident?** Do we sound like we know what we're doing?
4. **Is this calm?** Are we creating stress or reducing it?
5. **Is this Wrelik?** Does this sound like our brand?

If any answer is "no," rewrite until it's "yes."

---

**Remember:** Every word users see reflects on Wrelik. Make each one count.
