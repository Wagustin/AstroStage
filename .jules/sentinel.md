## 2026-10-18 - Potential Data Exposure in Frontend Error Responses

**Vulnerability:** The waitlist component in `src/app/components/waitlist/waitlist.ts` directly formatted and displayed raw backend error objects (`err.error?.error`, `err.error?.details`, or `err.message`) in UI error messages, risking sensitive technical or system detail exposure.
**Learning:** Directly rendering raw HTTP/backend error payloads in the application UI can leak internal server paths, stack traces, or operational details to users.
**Prevention:** Always replace raw error details with generic user-friendly messages in client-facing UI components, while logging detailed errors securely for debugging.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
