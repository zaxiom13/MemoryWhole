/**
 * Example script for creating GitHub issues programmatically using the GitHub API
 * 
 * Note: This script is provided as an example and requires:
 * 1. A GitHub access token with appropriate permissions
 * 2. The 'octokit' npm package: npm install @octokit/rest
 */

const { Octokit } = require('@octokit/rest');

// You'll need to provide your own personal access token with appropriate permissions
// NEVER commit your token to version control!
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'your_token_here';
const REPO_OWNER = 'zaxiom13'; // Replace with the repository owner
const REPO_NAME = 'MemoryWhole'; // Replace with the repository name

// Initialize Octokit with your token
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// Import the generated issues
const fs = require('fs');
const path = require('path');

// Function to read all issue files
const readIssueFiles = () => {
  const issuesDir = path.join(__dirname, 'issues');
  const issueFiles = fs.readdirSync(issuesDir).filter(file => file.startsWith('issue_') && file.endsWith('.md'));
  
  return issueFiles.map(file => {
    const content = fs.readFileSync(path.join(issuesDir, file), 'utf-8');
    const titleMatch = content.match(/^# (.*)$/m);
    const title = titleMatch ? titleMatch[1] : 'Unknown issue';
    const body = content.replace(/^# .*$/m, '').trim();
    
    return { title, body };
  });
};

// Function to create an issue
const createIssue = async (title, body) => {
  try {
    const response = await octokit.issues.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title,
      body
    });
    
    console.log(`Created issue #${response.data.number}: ${title}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating issue "${title}":`, error.message);
    return null;
  }
};

// Main function to create all issues
const createAllIssues = async () => {
  const issues = readIssueFiles();
  console.log(`Found ${issues.length} issues to create.`);
  
  for (const issue of issues) {
    await createIssue(issue.title, issue.body);
    // Add a slight delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('All issues created successfully!');
};

// Execute the main function if this script is run directly
if (require.main === module) {
  if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_token_here') {
    console.error('Error: GitHub token not provided. Set the GITHUB_TOKEN environment variable.');
    process.exit(1);
  }
  
  createAllIssues().catch(error => {
    console.error('Error creating issues:', error);
    process.exit(1);
  });
}

module.exports = {
  createIssue,
  createAllIssues
};