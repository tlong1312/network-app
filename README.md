---

### 2. README cho Repository Frontend (Dành cho repo FE)

Ông copy đoạn này bỏ vào repo Frontend. Bản này tập trung vào UI/UX, cách giao tiếp với API và xử lý state real-time.

```markdown
# Social Network UI

The client-side web application for the social networking platform. This frontend provides a responsive interface for user interactions, media sharing, and real-time updates.

**Backend Repository:** [Insert Link to Backend Repo Here]

## Key Features & Implementations

* **Responsive UI:** Built dynamic and responsive components for the news feed, user profiles, and friend management interfaces.
* **Real-time Client:** Established WebSocket connections (via STOMP) to receive and render real-time notifications for likes, comments, and incoming friend requests without page reloads.
* **Secure Data Fetching:** Implemented seamless client-server communication using the Fetch API, including automated JWT attachment in HTTP headers for protected routes.
* **Media Upload Handling:** Created optimized forms and components to handle direct image/media uploads, interfacing with the backend's Cloudinary integration.

## Tech Stack

* **Core:** ReactJS
* **Network & API:** Fetch API, WebSocket / STOMP Client
* **Styling:** CSS / Tailwind CSS (Update based on your actual styling tool)
* **State Management:** React Context API / Redux (Update if used)

## Local Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tlong1312/network-app-be.git
   cd network-app-be
