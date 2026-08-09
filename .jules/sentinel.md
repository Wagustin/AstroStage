## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-08-09 - Unhandled Exceptions via Missing Request Validation
**Vulnerability:** The API endpoint `api/subscribe.ts` destructured `req.body` and used `.includes()` on the `email` field without validating that `req.body` exists, is an object, or that `email` is a string. This could lead to unhandled TypeErrors and 500 server errors/crashes when receiving malformed payloads.
**Learning:** In Vercel serverless functions, the `req.body` is raw and its schema/existence cannot be inherently trusted. Operations on the request payload without validation will cause unhandled exceptions.
**Prevention:** Always perform type checking (e.g., `typeof req.body === 'object'`, `typeof email === 'string'`) and validate the existence of required properties before operating on them.
