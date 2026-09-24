## 2026-08-21 - Client-Side Error Response Information Exposure

**Vulnerability:** The waitlist component directly assigned raw error response objects (`err.error?.error`, `err.error?.details`, `err.message`) to user-facing UI component state (`errorMessage`), potentially exposing backend implementation details, stack traces, or internal server error messages to end-users.
**Learning:** Client applications should never render raw backend error strings or object properties directly in the user interface. Even if the API returns internal details on errors, the UI should handle errors by displaying safe, predefined generic messages.
**Prevention:** Always use generic user-friendly error messages on the UI when API requests fail, and only log detailed errors to console or telemetry securely.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
