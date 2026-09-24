## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-07-25 - Unhandled TypeError DoS in Serverless Function

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to an unhandled `TypeError` because it destructured `req.body` and called `.includes('@')` on `email` without verifying `req.body` exists or that `email` is a string. Sending an empty body or JSON with an array/object for the email field would crash the serverless execution.
**Learning:** Vercel API endpoints in this project receive raw request objects. Destructuring or calling string methods on unvalidated input can cause immediate 500 errors/crashes, which attackers could exploit for a simple DoS.
**Prevention:** Always validate the existence and type of `req.body` and its fields (e.g., using `typeof req.body === 'object'` and `typeof field === 'string'`) before destructuring or invoking methods.
