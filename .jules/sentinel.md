## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-10-27 - Unhandled TypeError leading to Server Crash (DoS)
**Vulnerability:** The API endpoint `api/subscribe.ts` did not validate the existence of `req.body` or the type of `req.body.email`. A malformed request (e.g. empty body, or `email` as an array/object) would cause destructuring or `.includes('@')` to throw an unhandled `TypeError`, resulting in a 500 Internal Server Error (Server Crash).
**Learning:** Vercel API endpoints receive raw request objects. Destructuring or calling methods on unvalidated body fields can lead to application crashes, creating a Denial of Service (DoS) risk.
**Prevention:** Always validate the existence and type of `req.body` and its fields (e.g., using `typeof` checks) before processing to prevent unhandled exceptions and fail securely with a 400 Bad Request.
