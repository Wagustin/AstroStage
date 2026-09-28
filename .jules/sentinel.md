## 2026-09-28 - Information Disclosure in UI Error Responses

**Vulnerability:** The `Waitlist` frontend component displayed raw backend error objects and HTTP error messages (`err.error?.error`, `err.error?.details`, or `err.message`) directly in `this.errorMessage`, potentially exposing sensitive internal application or infrastructure details to users.
**Learning:** Error responses from backend or HTTP clients should never be reflected verbatim to users in the UI, as they might contain internal stack traces, system paths, or infrastructure details (CWE-209).
**Prevention:** Always display generic, user-friendly error messages on the client side when API calls fail, while keeping detailed error logging restricted to secure server logs or developer tools.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
