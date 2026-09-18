## 2026-09-18 - Waitlist Component Backend Error Response Exposure

**Vulnerability:** The Waitlist Angular component rendered `err.error?.error`, `err.error?.details`, or `err.message` directly in the UI error state, exposing raw backend error details and potentially sensitive application internals to end users.
**Learning:** Returning or displaying detailed error object parameters from API calls on client UI interfaces violates information disclosure protections and provides potential attackers with actionable internal stack or implementation details.
**Prevention:** Always sanitize or map backend errors to generic user-friendly messages in client-facing components while keeping detailed error logs restricted to internal debugging contexts.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
