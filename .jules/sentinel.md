## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-06-30 - Unhandled TypeErrors in Vercel API Endpoints (DoS Risk)
**Vulnerability:** Vercel API endpoints receive raw `req` objects. Directly destructuring `req.body` or calling string methods like `.includes()` on its properties without verifying their existence or type can cause an unhandled `TypeError`, leading to a 500 Server Crash (Denial of Service risk).
**Learning:** Raw request objects from serverless functions should be strictly validated before any properties are accessed or destructured. In this codebase, the lack of input validation could allow a malicious user to crash the endpoint by omitting the body or sending incorrect data types.
**Prevention:** Always check if `req.body` exists and validate the type of its properties (e.g., `typeof req.body.email === 'string'`) before attempting to use them.
