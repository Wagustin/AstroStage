## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-08-10 - Unhandled TypeError / DoS in Serverless Endpoints
**Vulnerability:** API endpoints relying on `req.body` directly accessed properties and called methods (like `email.includes('@')`) without validating the existence or type of the object and its properties. If `req.body` is missing or `email` is not a string, this causes an unhandled `TypeError` crashing the request handling, causing a 500 server error instead of a graceful 400 rejection (potential DoS vector).
**Learning:** Vercel API endpoints receive raw HTTP requests and do not strictly enforce body structure. Never trust the shape of `req.body` or its properties.
**Prevention:** Always validate that `req.body` is an object and explicitly check the `typeof` fields before destructuring or invoking methods on them.
