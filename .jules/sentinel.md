## 2026-10-29 - Client-Side Error Response Data Exposure

**Vulnerability:** `Waitlist` component directly extracted `err.error?.error`, `err.error?.details`, or `err.message` from HTTP error responses and rendered them in the UI.
**Learning:** Frontend application components must never render raw backend error objects or server exception strings received from API requests into user interface elements, as they can reveal database connection strings, internal service endpoints, or sensitive system details.
**Prevention:** Always display generic user-facing error messages in the UI upon HTTP failures, keeping sensitive error details in internal log streams only.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
