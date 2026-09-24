## 2026-08-25 - Data Exposure in Error Responses

**Vulnerability:** The waitlist component directly reflected raw backend error objects (`err.error?.error`, `err.error?.details`, `err.message`) onto the UI, potentially exposing sensitive database details, internal server errors, or stack traces to end users.
**Learning:** Error responses from HTTP requests or backend APIs must never be directly rendered to the user interface, as backend error objects can contain sensitive operational or infrastructure details.
**Prevention:** Always replace raw error objects and messages with generic, localized user-friendly messages on the client side, and log technical error details only to secure logging channels if required.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
