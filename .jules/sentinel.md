## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-07-16 - Server Crash from Unvalidated Request Body
**Vulnerability:** The API endpoint `api/subscribe.ts` destructured `req.body` and accessed `email.includes('@')` without checking if `req.body` existed or if `email` was a string. This allowed for unhandled TypeErrors leading to server crashes (Denial of Service risk) if an invalid or empty request body was sent.
**Learning:** Destructuring raw HTTP request payloads or calling string methods without prior type checking is dangerous in serverless environments.
**Prevention:** Always validate that `req.body` is a valid object and that expected fields are the correct primitive type (e.g., `typeof email === 'string'`) before processing them.
