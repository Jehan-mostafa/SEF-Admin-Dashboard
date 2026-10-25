# SEF Admin Dashboard - Team Structure

This repository currently contains **folders only**. Do not add feature code until the team agrees on the API contract and task ownership.

```text
src/
  api/                 # API client and endpoint modules - assigned when API work starts
  app/                 # Application composition and providers
  components/
    layout/             # Shared shell: sidebar, header, page layout
    ui/                 # Generic reusable UI: Button, Input, Modal, Table
  contexts/             # Global state only: AuthContext (and CartContext only if needed)
  features/
    auth/pages/         # Login and access-related screens
    dashboard/pages/    # Statistics, charts, top products
    products/pages/     # Product list, create, edit
    orders/pages/       # Orders list, details, status updates
    users/pages/        # User management
    carts/pages/        # Cart administration
  hooks/                # Shared custom React hooks
  routes/               # Route definitions and access guards
  styles/               # Global styles, tokens, and shared CSS
  utils/                # Pure helpers: formatters, validators, constants
```

## Team rules

- Keep feature-specific files inside their matching `features/<feature>` folder.
- Move a component to `components/` only if more than one feature uses it.
- Do not put API calls directly in shared UI components.
- Keep global state limited to authentication. Page and form state stays local.
- Before creating a new shared component, confirm an existing component cannot be reused.

## Suggested work ownership

| Area                                  | Owner | Notes                                            |
| ------------------------------------- | ----- | ------------------------------------------------ |
| `features/auth`, `contexts`, `routes` | TBD   | Start here: login and protected admin routes.    |
| `features/dashboard`                  | TBD   | Stats and analytics after API contract is ready. |
| `features/products`                   | TBD   | CRUD and image upload.                           |
| `features/orders`                     | TBD   | Filters and status updates.                      |
| `features/users`, `features/carts`    | TBD   | Admin management views.                          |
| `components`, `styles`                | TBD   | Maintain shared visual consistency.              |

# SEF Admin Dashboard

## Libraries

The following libraries are used in this project:

| Library             | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `react-router-dom`  | Client-side routes and protected admin routes. |
| `axios`             | HTTP requests and authentication interceptors. |
| `recharts`          | Dashboard charts and analytics.                |
| `react-hook-form`   | Form handling and validation.                  |
| `react-toastify`    | Success and error notifications.               |
| `tailwindcss`       | Utility-first styling.                         |
| `@tailwindcss/vite` | Tailwind integration with Vite.                |

## Installation

```bash
npm install react-router-dom axios recharts react-hook-form react-toastify
npm install -D tailwindcss @tailwindcss/vite
```

> Run the commands after resolving the current npm installation issue. Do not add a new library without checking with the team first.
