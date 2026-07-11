## 2024-07-02 - Unhandled TypeErrors on Vercel API Endpoints
**Vulnerability:** The Vercel API endpoint `api/subscribe.ts` was not validating the existence or type of `req.body` or `req.body.email`. This could lead to a Server Crash (500 error) when destructuring or calling methods like `.includes()` on undefined variables, resulting in Denial of Service (DoS) risks and unhandled exceptions.
**Learning:** Vercel API endpoints receive raw request objects. Destructuring or calling methods on `req.body` without verifying its type and existence can cause unhandled TypeErrors.
**Prevention:** Always validate `req.body` and its expected fields (e.g., using `typeof` checks) before processing to ensure fail-safe behavior.

## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
