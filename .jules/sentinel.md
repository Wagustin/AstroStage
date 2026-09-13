## 2026-09-13 - Data Exposure in Frontend Error Responses
**Vulnerability:** In `src/app/components/waitlist/waitlist.ts`, HTTP error responses were processed by directly extracting `err.error?.error`, `err.error?.details`, or `err.message` and rendering them in the UI string `errorMessage`. If a backend endpoint returned sensitive technical details or internal exception messages, these details would be displayed directly to the end user.
**Learning:** Displaying raw backend or exception error messages in client-side UIs risks leaking internal infrastructure details, database connection errors, or backend state to potential attackers.
**Prevention:** Client-side components must show generic, user-friendly error messages upon failure while logging technical details internally or to console for debugging purposes.

## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
