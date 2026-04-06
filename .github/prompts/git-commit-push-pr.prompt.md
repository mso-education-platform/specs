---
name: git-commit-push-pr
description: |
  Use when you want the agent to prepare a commit, push to a branch,
  and create a Pull Request. Always ask for explicit confirmation before executing.
---


Context:
- Show `git status --porcelain` and the list of modified/staged files.
- Suggest a branch name if the user does not provide one.

Expected information must be deduced from the files to be committed :
- `branch`: branch name to create/push (e.g. feature/add-x)
- `commit_message`: commit message
- `base`: target branch for the PR (default `main`)
- `pr_title`: PR title (defaults to `commit_message`)
- `pr_body`: PR description

Execution rules:
1. Always display a clear summary (modified files, target branch, commit message) and ask for explicit confirmation (`yes`) before taking any action.
Ask me just one confirmation.

2. Commit conventions: `feat|fix|chore` + SpecKit Issue reference. Example: "feat: add auth flow, closes #12".

3. Branch selection behavior:
   - If the current branch is `main` or `master`, always create a new branch (suggest a name if none provided).
   - Otherwise, use the current branch unless the user requests a different one.
4. On confirmation, run the following git commands, showing each command before execution:
   - If creating a new branch: `git checkout -b <branch>`; if the branch already exists: `git checkout <branch>`
   - `git add -A`
   - `git commit -m "<commit_message>"` (if there is nothing to commit, inform the user and stop)
   - `git push -u origin <branch>`
5. Create the PR using the `gh` CLI (preferred):
   - `gh pr create --base <base> --head <branch> --title "<pr_title>" --body "<pr_body>"`
   - Add reviewers if provided: `--reviewer user1,user2`
6. If `gh` is not available, inform the user and provide instructions to install `gh` or fall back to using the GitHub REST API with their token.
7. After creation, display the PR URL and a short summary.
8. Do not delete or force-push branches without an extra explicit confirmation.

Interactive behavior:
- If any step fails (e.g., empty commit, push rejected), show the error and offer options: `retry`, `abort`, `show diff`.
- Always return the history of executed commands and their outputs.

Security:
- Use available credentials (local `gh` auth), but never display secrets.
