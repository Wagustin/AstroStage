## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-09-29 - Prevent Backend Error Exposure in UI Responses

**Vulnerability:** The Waitlist component rendered raw backend error objects and HTTP error messages (`err.error?.error`, `err.error?.details`, `err.message`) directly into user-facing UI messages, leading to potential disclosure of internal system architecture and error details.
**Learning:** Returning detailed backend error strings or stringified error objects directly to end users in frontend error states violates the principle of safe error handling and can leak sensitive information.
**Prevention:** Always sanitize or replace raw backend error responses with safe, generic, user-friendly messages on the frontend, while logging detailed errors internally or to secure monitoring systems if necessary.
