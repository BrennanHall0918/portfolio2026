# Brennan Hall - Portfolio

A single-page portolio built with React and Vite, styled as an interactive Windows 98 desktop. Icons, taskbar, and Start Menu open draggable, resizable, and minimizable windows for each section of the site - while the browser's URL stays fully in sync with client-side routing.

## Live Site
portfolio2026-ecru-omega.vercel.app

## Stack
- React + Vite
- react-router-dom
- react-rnd (window drag/resize)
- GitHub REST API (for live project data)

## Architecture Overview

### Component Structure
src/
components/
 - Desktop.jsx: top-level layout
 - Navbar.jsx: taskbar, Start Menu, clock
 - DesktopIcons.jsx: desktop shortcuts
 - Window.jsx: draggable/resizable window (using react-rnd)
 - WindowManager.jsx: maps opon windows to their page components
 - RouteWatcher.jsx: connects the <Route> matches and windows state
hooks/
 - useFetch.js: simple data/loading/error handling
windows/
 - Home.jsx
 - Projects.jsx
 - ProjectDetail.jsx
 - Experience.jsx
 - Contact.jsx
styles/
 - one CSS file per component, using shared CSS variables (global.css) for the palette/bevels

### Routing + Window State
The biggest architectural decision was mixing two things that don't normally coexist: URL-based routing (required for the assignment) and a desktop-style multi-window UI (where several "pages" can be opened at the same time).

- `App.jsx` defins the real `<Routes>` tree. Each route's `element` is a `RoutWatcher`, not the actual page component.
- `RouteWatcher` calls `useParams()` (so `/projects/:id` resloves through React Router) and reports "this route matches" to `Desktop.jsx` via `DesktopSyncContext`.
- `Desktop.jsx` renders `<Outlet />` in a hidden container specifically so these `RouteWatcher`s mount when their route matches - nothing in the container is ever shown visually.
- The visible windows are rendered seperately by `WindowManager`, driven by a `windows` array in `Desktop.jsx`'s state (position, size, z-index, minimized).
- Opening a window (via a desktop icon, taskbar button, or Start Menu item) calls `navigate()` to change the URL. The matching `RouteWatcher` then adds/focuses the corresponding window. This means the URL is always the source of turth: refreshing on `/projects` reopens the window, meaning that links work correctly.

### Data Fetching (`useFetch`)
`src/hooks/useFetch.js` is a reusable custom hook that takes a URL and returns `{ data, isLoading, error }`. It's used in two places:
- `Projects.jsx`: fetches the publlic repo list from `https://api.github.com/users/BrennanHall0918/repos`
- `ProjectDetail.jsx`: fetches a single repo via ID from `httpsL//api.github.com/repositories/:id` using the `:id` from `useParams()`

The hook guards against race conditions with an `isCancelled` flag in its `useEffect` cleanup, so a stale in-flight request can't overwrite fresher data or set state after unmount.

### Controlled Forms
`Contact.jsx` uses controlled inputs bound to a single `formValues` state object, with `handleInputChange`/`handleBlur`/`handleSubit` naming. Validation (`validate()`) is a function of current state, recalculated each render. Errors only display once a field has been blurred (`touchedFileds`), so the form doesn't show errors before the user has interacted with it. Submission is blocked both by disabling the submit button (`disabled={hasErrors}`) and by an early return in `handleSubmit` after `e.preventDefault()`.

### Styling approach
All Windows 98 style colors and bevel shadows are defined once as CSS custom properties in `global.css`, then reused across every component's stylesheet. The visual style stays consistent and any adjustment only needs to happen in one place.

### Known Limitations
- The File Explorer-style toobar's Back/Forward/Up buttons are purely decorative. I may implement them later.
- Github's public API is rate-limited to 60 unauthenticated requests per hour per IP; repeated testing in a short window may surface a rate-limit error (which the app will display rather than crashing)