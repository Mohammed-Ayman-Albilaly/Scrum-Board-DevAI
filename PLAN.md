# Implementation Plan: ScrumBoard (Professional Architecture)

## 1. Overview
ScrumBoard is a role-enforced project management tool designed to prevent "process drift" by strictly adhering to Scrum methodology. The system implements a per-project Role-Based Access Control (RBAC) system and automates the lifecycle of User Stories from the Product Backlog through Sprints to a Global Deployed List.

**Development Model:** Commit-as-Contract (Page-by-Page pipeline: Frontend $\rightarrow$ Backend $\rightarrow$ Security $\rightarrow$ QA $\rightarrow$ CI).

---

## 2. Technical Architecture

### Stack
- **Backend:** Java 17+, Spring Boot 3.x
- **Frontend:** React 18+, TypeScript, Tailwind CSS
- **Database:** PostgreSQL (Relational data for strict consistency)
- **Security:** Spring Security, JWT (Stateless Authentication)
- **API:** RESTful API with OpenAPI/Swagger documentation

### Database Schema (PostgreSQL)
- **`users`**: `id` (UUID), `username`, `email`, `password_hash`, `specialization`
- **`projects`**: `id` (UUID), `name`, `description`, `created_at`
- **`project_members`**: `project_id`, `user_id`, `role` (Enum: `PRODUCT_OWNER`, `SCRUM_MASTER`, `TEAM_MEMBER`)
- **`user_stories`**: `id` (UUID), `project_id`, `title`, `description`, `story_points`, `priority`, `status` (`UNREFINED`, `READY`), `current_sprint_id` (nullable), `column_status` (`SPRINT_BACKLOG`, `UNDER_DEVELOPMENT`, `UNDER_TESTING`, `DEPLOYED`)
- **`sprints`**: `id` (UUID), `project_id`, `name`, `goal`, `start_date`, `end_date`, `is_closed` (boolean)
- **`ceremonies`**:
    - **`daily_standups`**: `id`, `sprint_id`, `date`, `user_id`, `yesterday`, `today`, `blockers`
    - **`sprint_planning`**: `id`, `sprint_id`, `committed_points`, `capacity_notes`
    - **`sprint_reviews`**: `id`, `sprint_id`, `demo_summary`, `stakeholder_feedback`
    - **`retrospectives`**: `id`, `sprint_id`, `column` (`WENT_WELL`, `NEEDS_IMPROVEMENT`, `ACTION_ITEM`), `content`

---

## 3. Implementation Roadmap (Page-by-Page)

Each phase must complete the full pipeline (**Frontend $\rightarrow$ Backend $\rightarrow$ Security $\rightarrow$ QA $\rightarrow$ CI**) before proceeding.

### Page 1: Authentication & Onboarding
- **UI**: React-based Login and Sign-Up pages with form validation.
- **Logic**: Spring Boot Auth controllers, JWT generation/validation, User registration.
- **Security**: Password encoding via `BCryptPasswordEncoder`, JWT expiration and refresh logic.

### Page 2: Project Dashboard & Membership
- **UI**: Project gallery view; "Create Project" modal; Member management table.
- **Logic**: Project CRUD; Project-User mapping (assigning roles).
- **Security**: Ensure users can only access projects where they have an entry in `project_members`.

### Page 3: Product Backlog (The PO's Domain)
- **UI**: Prioritized list of stories. PO sees "Add/Edit/Delete/Reorder" controls. Others see read-only.
- **Logic**: Story CRUD; Priority sorting logic; Status transitions (`UNREFINED` $\rightarrow$ `READY`).
- **Security**: Method-level security (`@PreAuthorize`) ensuring only `PRODUCT_OWNER` for the specific `projectId` can mutate.

### Page 4: Sprint Management & Planning
- **UI**: Scrum Master's "Create Sprint" form. PO's "Move to Sprint" interface.
- **Logic**: Sprint lifecycle management. Moving stories from Backlog $\rightarrow$ Sprint Backlog.
- **Security**: `SCRUM_MASTER` for sprint creation; `PRODUCT_OWNER` for story assignment to sprints.

### Page 5: The Scrum Board (Execution)
- **UI**: 4-column Kanban-style view (`Sprint Backlog` $\rightarrow$ `Under Development` $\rightarrow$ `Under Testing` $\rightarrow$ `Deployed`).
- **Logic**: State transition API for stories. Real-time status updates.
- **Security**: Only `TEAM_MEMBER` (and other roles) can move stories within an active sprint.

### Page 6: Sprint Closure & Global Deployed List
- **UI**: "Close Sprint" action for SM. A global "Deployed" archive grouping stories by sprint.
- **Logic**: Sprint closure logic: lock sprint $\rightarrow$ move non-deployed stories back to Product Backlog.
- **Security**: Only `SCRUM_MASTER` can trigger the closure process.

### Page 7: Ceremony Logs
- **UI**: Tabbed interface for Daily Standup, Planning, Review, and Retro.
- **Logic**: Submission of standup reports; Retro card management.
- **Security**: `SCRUM_MASTER` manages logs; `TEAM_MEMBER` submits their own standups.

---

## 4. Test & Quality Assurance Plan

### Functional Test Cases
- **RBAC Leak**: Attempt to delete a backlog story as a `TEAM_MEMBER` $\rightarrow$ Expect `403 Forbidden`.
- **Sprint Leak**: Attempt to move a story in a *closed* sprint $\rightarrow$ Expect `403 Forbidden`.
- **Standard Flow**: Backlog $\rightarrow$ Sprint $\rightarrow$ Deployed $\rightarrow$ Global Deployed List.
- **Closure Logic**: Close a sprint with 2 stories in "Under Testing" $\rightarrow$ Verify they return to Product Backlog.
- **Multi-Project**: User is PO in Project A and Member in Project B $\rightarrow$ Verify permissions switch correctly.

### Security Review Points
- **JWT Validation**: Every request must be authenticated via JWT and the user's role must be verified against the `project_id` in the request path/body.
- **SQL Injection**: Use Spring Data JPA / Hibernate (parameterized queries by default).
- **XSS/CSRF**: React's default escaping for XSS; Spring Security CSRF protection (or stateless JWT configuration).

---

## 5. Constraints & Assumptions
- **UI**: No drag-and-drop for initial version; movement via buttons/dropdowns.
- **Sync**: No WebSockets; state is updated via API calls and React state management.
- **Data**: No file attachments or comment threads.
- **Pipeline**: Strict adherence to the 5-step "Commit-as-Contract" pipeline per page.
