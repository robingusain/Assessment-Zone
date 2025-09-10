# Assessment Zone

A single platform for both recruiters and students.  

## Features

### For Recruiters/HR
- Create online assessments (like HackerEarth).
- Conduct live interviews with:
  - Collaborative Code Editor (real-time).
  - Chat + Video Call.
  - Whiteboard (draw diagrams, explain logic).

### For Students
- Solve practice problems (DSA, SQL, etc.).
- AI-based mock interviews:
  - Upload resume → AI asks questions.
  - AI listens (voice/text) → gives feedback.

---

## Tech Stack

- **Collaborative Code Editor**: Monaco Editor + Socket.io, Judge0 API
- **Video Call + Chat**: WebRTC, Socket.io (or Twilio/Daily.co)
- **Whiteboard**: Canvas (HTML5) + WebSockets
- **Problem Practice**: Node.js, Express, MongoDB
- **AI Interviewer**: OpenAI API / Gemini API + Speech-to-Text (Google Cloud Speech API)
- **Authentication**: JWT (Node.js + Firebase/Auth0)

---

## Project Structure (Planned)

