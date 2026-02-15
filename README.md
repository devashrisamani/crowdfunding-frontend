# Leaf a Mark — Crowdfunding Frontend

A React frontend for **Leaf a Mark**, a crowdfunding platform for sustainability and community projects. Users can browse fundraisers, create campaigns, and make pledges. The app talks to a Django REST API (separate repo) for auth, fundraisers, and pledges.

**Target audience:** People who want to support or start environmental and community fundraisers.

---

## Deployed project

- **Frontend:** `https://6991a6f02b908e00081c70a3--leafamark.netlify.app`
- **Backend API:** `https://crowdfundingapp-6177aeba64e5.herokuapp.com` SS

### Page links (Netlify)

| Page               | Path                   | Link                                                                       |
| ------------------ | ---------------------- | -------------------------------------------------------------------------- |
| About / Welcome    | `/welcome`             | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/welcome            |
| Home (Fundraisers) | `/`                    | https://6991a6f02b908e00081c70a3--leafamark.netlify.app                    |
| Login              | `/login`               | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/login              |
| Sign Up            | `/register`            | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/register           |
| Create fundraiser  | `/create`              | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/create             |
| Profile            | `/profile`             | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/profile            |
| Fundraiser detail  | `/fundraiser/:id`      | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/fundraiser/1       |
| Edit fundraiser    | `/fundraiser/:id/edit` | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/fundraiser/38/edit |
| 404                | (any unknown path)     | https://6991a6f02b908e00081c70a3--leafamark.netlify.app/hello              |

---

## Screenshots

| Title                | Screenshot                                        |
| -------------------- | ------------------------------------------------- |
| Homepage             | ![Homepage](./docs/screenshot-homepage.png)       |
| Fundraisers          | ![Fundraisers](./docs/screenshot-fundraisers.png) |
| Create fundraiser    | ![Create](./docs/screenshot-createfundraiser.png) |
| Fundraiser + pledges | ![Detail](./docs/fundraiser-detail.png)           |
| Login                | ![Login](./docs/screenshot-login.png)             |
| Sign Up              | ![Sign Up](./docs/screenshot-signup.png)          |

---

## API endpoints (backend)

| Method          | Endpoint             | Description                                                                                           |
| --------------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Auth**        |                      |                                                                                                       |
| POST            | `/api-token-auth/`   | Login. Body: `{ "username", "password" }`. Returns `{ "token" }`.                                     |
| **Users**       |                      |                                                                                                       |
| POST            | `/users/`            | Register. Body: `{ "username", "password", "email?" }`.                                               |
| GET             | `/users/me/`         | Current user (requires `Authorization: Token <token>`). Returns `{ id, username, email, ... }`.       |
| GET             | `/users/<id>/`       | User detail by id.                                                                                    |
| **Fundraisers** |                      |                                                                                                       |
| GET             | `/fundraisers/`      | List all fundraisers.                                                                                 |
| POST            | `/fundraisers/`      | Create fundraiser (auth). Body: `{ title, description, image, goal, is_open }`.                       |
| GET             | `/fundraisers/<id>/` | Single fundraiser with nested pledges.                                                                |
| PUT             | `/fundraisers/<id>/` | Update fundraiser (owner only).                                                                       |
| DELETE          | `/fundraisers/<id>/` | Delete fundraiser (owner only).                                                                       |
| **Pledges**     |                      |                                                                                                       |
| GET             | `/pledges/`          | List pledges.                                                                                         |
| POST            | `/pledges/`          | Create pledge (auth). Body: `{ fundraiser, amount, comment?, anonymous? }`. Supporter set from token. |
| GET             | `/pledges/<id>/`     | Single pledge.                                                                                        |
| PUT             | `/pledges/<id>/`     | Update pledge (supporter only). Body: `{ comment?, anonymous? }`.                                     |
