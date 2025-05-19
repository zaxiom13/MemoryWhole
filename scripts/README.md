# MemoryWhole Scripts

## Issue Generator

The `generateIssues.js` script automatically creates GitHub issues from the "Future Enhancements" section in the About.md file.

### How to Use

1. Make sure you have Node.js installed
2. Run the script from the project root:

```bash
node scripts/generateIssues.js
```

### Command-Line Options

The script supports the following command-line options:

```
--help, -h     Show help message
--quiet, -q    Suppress console output except for errors
--json         Output only JSON to stdout (useful for piping to another process)
```

Examples:

```bash
# Show help
node scripts/generateIssues.js --help

# Generate issues quietly (only create files, no console output)
node scripts/generateIssues.js --quiet

# Output only JSON (useful for piping to other tools)
node scripts/generateIssues.js --json > issues.json
```

### What It Does

The script:

1. Reads the `src/About.md` file
2. Extracts the "Future Enhancements" section
3. Parses each bullet point as a feature
4. Generates detailed issue content for each feature
5. Outputs the issues as JSON to the console
6. Creates individual issue files in the `scripts/issues` directory

### Generated Issues

The following issues are generated:

1. **Implement user accounts to track progress over time**
2. **Add customizable difficulty levels for memory challenges**
3. **Enable user-submitted passages for memorization**
4. **Develop memory games and additional exercises**
5. **Add performance analytics and insights for users**
6. **Develop native mobile app versions**

Each issue includes:
- A descriptive title
- Detailed description
- Background information
- Requirements
- Implementation suggestions

### Manual Issue Creation

To manually create these issues in GitHub:

1. Go to the GitHub repository
2. Click on the "Issues" tab
3. Click the "New Issue" button
4. Copy the title and content from each generated issue file in `scripts/issues/`
5. Submit the issue

### Programmatic Issue Creation

An example script for creating issues programmatically is provided in `createIssuesViaAPI.js`. This script uses the GitHub API to create issues from the generated files.

To use this script:

1. Install the required dependency:
   ```bash
   npm install @octokit/rest
   ```

2. Set your GitHub access token as an environment variable:
   ```bash
   export GITHUB_TOKEN=your_personal_access_token
   ```

3. Run the script:
   ```bash
   node scripts/createIssuesViaAPI.js
   ```

Note: The GitHub token needs to have permissions to create issues in the repository.

## Adding New Future Enhancements

If new planned features are added to the "Future Enhancements" section in About.md, simply run the script again to generate issues for the new features.