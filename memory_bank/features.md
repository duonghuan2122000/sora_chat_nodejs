# Sora Chat - Features List

## 🟢 Completed / In Progress

- **User Authentication**
  - [x] Login with username/password.
  - [x] JWT-based session management (Cookies/Token).
  - [x] Logout functionality (Clear cookies, redirection).
- **Messaging (Real-time)**
  - [x] Basic text messaging.
  - [x] Real-time message delivery via Socket.io.
  - [x] Message persistence in MongoDB.
  - [x] Conversation rooms (joining/leaving).
  - [x] Emoticons and Reactions (Unicode emoji, real-time).
    - [x] Improved UI: Reaction popup closes automatically after selection.
    - [x] Improved UI: Emojis displayed in a single row with 8px spacing.
  - [x] Message Reaction Details (View list of users, avatars, pagination).
  - [x] Message Reply (Hover icon, preview snippet in input, display in history).
    - [x] Improved: Backend populates replied message data, ensuring snippets display correctly even for messages outside the initial load batch.
- **Conversation Management**
  - [x] Fetching conversation lists.
  - [x] Creating/Getting conversations.
    - [x] Improved: Check for existing direct conversation before creating a new one.
- **User Profile**
  - [x] Basic user info retrieval.
- **Search (Users, Groups)**
  - [x] Search users by username, first name, last name.
  - [x] Search results separated into User and Group tabs.
  - [x] Client-side validation: 2-30 characters, no special characters, non-empty.
  - [x] Integration with Element Plus UI.
  - [x] **Enhanced**: Clicking a search result automatically redirects to the conversation (creating it if it doesn't exist) and clears search results.
  - [x] Backend placeholder for Group search.

## 🛠️ Internal Fixes

- [x] **API**: Fixed incorrect request body destructuring in `conversation.router.js` and `user.router.js`.
- [x] **Service**: Fixed use of non-existent `insertOne` method in Mongoose models, replaced with `create`.

## 🟡 To Be Implemented (Checklist)

- [ ] User Registration (Sign up).
- [ ] Multi-media messages (Images, Files).
- [ ] Message history (Scrolling to load more).
- [ ] Message status (Sent, Delivered, Read).
- [ ] User status (Online, Offline, Last seen).
- [ ] Group chats (Currently seems focused on 1-to-1 but structure supports members).
- [ ] Notifications (Browser/Push).
- [ ] End-to-end encryption (Optional).
- [ ] Search (Conversations, Messages).
