## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-10-03 - Client-Side Error Response Information Exposure

**Vulnerability:** The waitlist component rendered raw backend error payloads (`err.error?.error`, `err.error?.details`, or `err.message`) directly in user-facing UI messages when subscription requests failed.
**Learning:** Rendering raw backend error objects or HTTP failure messages directly on the client frontend can expose sensitive internal server architecture details, internal exception trace snippets, or database information to end users and attackers.
**Prevention:** Always handle HTTP error responses by setting generic, user-friendly error messages on the client side while logging technical details only to console or server logging systems.
