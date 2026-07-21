## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
## 2026-07-21 - Unhandled Errors in API Endpoints
**Vulnerability:** The API endpoint `api/subscribe.ts` destructured `req.body` and expected `email` to be a string without checking if `req.body` existed or the type of `email`, which could cause server crashes (500 errors).
**Learning:** API endpoints must rigorously validate request payloads before accessing them. Without validation, malformed requests can cause unhandled exceptions and potentially lead to denial of service or expose stack traces.
**Prevention:** Always validate the existence of `req.body` and verify the types of its properties using `typeof` or optional chaining before using them.
