## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-10-08 - Frontend Information Exposure in Error Responses

**Vulnerability:** The waitlist component directly parsed and displayed detailed backend error payloads (`err.error?.error`, `err.error?.details`, `err.message`) in the UI, potentially leaking stack traces, database details, or internal server errors to users.
**Learning:** Error responses from backend endpoints or proxies can contain sensitive internal state. Displaying raw error objects or error messages directly in the user interface violates information leakage controls.
**Prevention:** Always substitute backend error details with a generic, user-friendly error message in client components while logging technical details only to internal/developer channels.
