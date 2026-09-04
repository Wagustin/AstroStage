## 2026-09-04 - Client-side Error Message Data Exposure
**Vulnerability:** The Angular `Waitlist` component directly stringified and displayed backend error payloads (`err.error?.error`, `err.error?.details`, or `err.message`) to end users in `this.errorMessage`, potentially exposing database connection strings, stack traces, or API keys.
**Learning:** Raw HTTP error responses from backend endpoints must never be rendered directly in the user interface. Even if the backend aims to return sanitized error objects, unexpected exceptions or proxy errors can return sensitive information.
**Prevention:** Display generic, user-friendly error messages on the client side during HTTP request failures, and log the detailed error only on server logs or developer consoles.

## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
