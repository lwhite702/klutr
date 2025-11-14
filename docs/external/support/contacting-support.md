---
title: Contact Support
summary: How to reach Klutr support, use the live chat widget, and what information helps us resolve issues fastest.
tags: ["support","contact","help"]
author: Ops
updated: 2025-11-12
---

# Contact Support

If you need help, use one of the methods below.

## Live chat (recommended)

Click the "Contact Support" button displayed on this page or the website footer to open our live chat. The chat uses our support provider, Tawk.to.

- On marketing pages the chat widget loads automatically.

- If you are a logged-in user, the chat will be connected to your account so agents will see your verified name and email.

- If the widget is not visible, click the button below to attempt to open the widget:

[Contact Support](#) 

<script>
// This script is safe to include in Mintlify-marked pages that also load the Tawk widget.
// It toggles the widget if available. It falls back to the Support docs page when not loaded.

document.addEventListener('click', function (e) {
  const target = e.target;
  if (!target) return;
  if (target.tagName === 'A' && target.getAttribute('href') === '#') {
    e.preventDefault();
    if (window.Tawk_API && typeof window.Tawk_API.toggle === 'function') {
      window.Tawk_API.toggle();
    } else if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.maximize();
    } else {
      window.open('/docs/external/support', '_blank');
    }
  }
});
</script>

## What to include in your message

When opening a support chat, include:

- Your account email

- A brief description of the issue

- Steps to reproduce (if applicable)

- A screenshot or recording (recommended)

## When to use email

For billing or account-sensitive requests, contact billing@wrelik.com. Use chat for quick help and status updates.

## Security and privacy

- For authenticated users we provide verified name and email to agents through a secure integration. This data is provided only when you are logged in and after a secure server-side handshake.

- Never share full credit card numbers in chat.

## Troubleshooting if chat does not appear

1. Ensure your browser allows third-party scripts.

2. Try an incognito/private window.

3. If you are on a corporate network that blocks external embeds, open the support link above or email billing@wrelik.com.

