## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-11-06 - Potential Data Exposure in Client Error Handling

**Vulnerability:** The client-side waitlist component rendered backend error messages (`err.error?.error`, `err.error?.details`, or `err.message`) directly into the UI, risking exposure of database errors, stack traces, or internal server details to end users.
**Learning:** Even if the backend aims to sanitize errors, client applications must implement defense-in-depth by presenting generic, user-friendly error messages rather than reflecting raw backend payloads.
**Prevention:** Always use generic error messages in user-facing components when API calls fail.
