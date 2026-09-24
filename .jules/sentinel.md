## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2025-01-22 - Unhandled TypeErrors in Vercel Serverless Functions

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to unhandled TypeErrors because it assumed `req.body` and `req.body.email` existed and were of the expected type before destructuring and invoking string methods (`.includes()`). A malformed request (e.g., missing body or `email` as an object/array) could cause the serverless function to crash (500 error), leading to a potential Denial of Service (DoS) and application instability.
**Learning:** Vercel API endpoints in this project receive raw request objects. Missing input validation on these raw objects is a critical vulnerability pattern specific to this codebase's serverless functions.
**Prevention:** Always validate the existence and type of `req.body` and its fields (e.g., using `req.body || {}` and `typeof email === 'string'`) before destructuring or invoking methods.
