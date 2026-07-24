## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-07-24 - Unhandled TypeErrors in Vercel API (DoS Risk)
**Vulnerability:** The API endpoint `api/subscribe.ts` was destructurizing `req.body` and calling string methods (`.includes()`) on `email` without verifying their existence or type. This allowed unhandled `TypeError` exceptions if the body was missing or if `email` was an unexpected type (e.g., an array), leading to a 500 Server Error (server crash).
**Learning:** Vercel API routes receive raw request objects from clients. Destructuring or calling methods on unchecked input from `req.body` can easily lead to runtime exceptions.
**Prevention:** Always use optional chaining (e.g., `req.body?.email`) and explicitly validate data types (e.g., `typeof email === 'string'`) before processing user input in API endpoints.
