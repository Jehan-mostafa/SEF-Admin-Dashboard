# Source folder guide for the team

This is the working agreement for the frontend team. The folders are intentionally empty; add code only when the corresponding feature task starts.

## Where should a new file go?

| File purpose | Location |
| --- | --- |
| A page used only by Products | `features/products/pages/` |
| A component used only by Orders | `features/orders/` (create `components/` there when needed) |
| A component shared by two or more features | `components/ui/` or `components/layout/` |
| API endpoint wrapper | `api/` or the relevant feature folder, once the team chooses one convention |
| Authentication state | `contexts/` |
| Reusable non-UI helper | `utils/` |
| Shared hook | `hooks/` |

## Before opening a pull request

- Keep names clear and consistent with the folder's feature.
- Avoid unrelated formatting or refactoring changes.
- Add loading, empty, error, and mobile states when implementing a screen.
- Ask the team before introducing a new dependency or global state.
