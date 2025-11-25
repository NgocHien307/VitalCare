# Branch Protection Rules Setup

This document describes how to configure branch protection rules for the Health Tracker DSS repository.

## Prerequisites

- Repository admin access
- CI/CD workflow must be pushed first (`.github/workflows/ci.yml`)

## Setting Up Branch Protection

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add branch protection rule**

### Step 2: Configure Protection for `main` Branch

Enter the following settings:

#### Branch name pattern

```
main
```

#### Protect matching branches

✅ **Require a pull request before merging**

- ✅ Require approvals: `1` (or more for larger teams)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (optional)

✅ **Require status checks to pass before merging**

- ✅ Require branches to be up to date before merging
- Search and add these status checks:
  - `Backend CI (Java 21)`
  - `Frontend CI (Node 18)`
  - `Build Summary`

✅ **Require conversation resolution before merging**

✅ **Require signed commits** (optional, recommended for security)

✅ **Require linear history** (optional, keeps history clean)

✅ **Do not allow bypassing the above settings** (for admins too)

❌ **Allow force pushes** - Keep disabled

❌ **Allow deletions** - Keep disabled

### Step 3: Save Changes

Click **Create** or **Save changes** button.

## Required Status Checks

The CI workflow creates the following status checks:

| Status Check Name       | Description                                 |
| ----------------------- | ------------------------------------------- |
| `Backend CI (Java 21)`  | Runs Maven tests and builds JAR             |
| `Frontend CI (Node 18)` | Runs npm build and optional linting         |
| `Frontend CI (Node 20)` | Same as above but with Node 20              |
| `Integration Tests`     | Runs integration tests with MongoDB & Redis |
| `Security Scan`         | OWASP dependency vulnerability scan         |
| `Build Summary`         | Final check that all jobs passed            |

## Recommended Checks to Require

At minimum, require these checks before merging:

- `Backend CI (Java 21)`
- `Frontend CI (Node 18)`
- `Build Summary`

## Setting Up CODEOWNERS (Optional)

Create `.github/CODEOWNERS` file:

```
# Default owners for everything
* @your-username

# Backend code owners
/src/ @backend-team-member

# Frontend code owners
/frontend/ @frontend-team-member

# CI/CD configuration
/.github/ @devops-team-member
```

## Verifying Setup

1. Create a test branch: `git checkout -b test/branch-protection`
2. Make a small change
3. Push and create a PR
4. Verify that:
   - CI jobs run automatically
   - PR cannot be merged until CI passes
   - PR requires at least one approval (if configured)

## Troubleshooting

### Status checks not appearing?

- Ensure the workflow file is on the `main` branch
- Push a commit to trigger the workflow
- Wait for the workflow to complete at least once

### Workflow not running?

- Check that the `on:` triggers include your branch
- Verify workflow file syntax is valid YAML

### CI failing due to missing secrets?

- The CI workflow uses environment variables, not GitHub secrets
- Test configuration uses hardcoded test values
- Production deployments would need actual secrets configured

## Additional Resources

- [GitHub Docs: Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs: Required Status Checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
- [GitHub Docs: CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
