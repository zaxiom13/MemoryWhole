/**
 * This script generates GitHub issues based on the Future Enhancements section
 * from the About.md file in the MemoryWhole project.
 */

const fs = require('fs');
const path = require('path');

// Process command line arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const quietMode = args.includes('--quiet') || args.includes('-q');
const jsonOnly = args.includes('--json');

if (showHelp) {
  console.log(`
Usage: node generateIssues.js [options]

Options:
  --help, -h     Show this help message
  --quiet, -q    Suppress console output except for errors
  --json         Output only JSON to stdout (useful for piping to another process)

Description:
  This script generates GitHub issues from the Future Enhancements section in About.md.
  It creates detailed issue content files in the scripts/issues directory.
`);
  process.exit(0);
}

// Read the About.md file
const aboutFilePath = path.join(__dirname, '..', 'src', 'About.md');
const aboutContent = fs.readFileSync(aboutFilePath, 'utf-8');

// Extract the Future Enhancements section
const futureEnhancementsSection = aboutContent
  .split('## Future Enhancements')[1]
  .split('##')[0]
  .trim();

// Extract the list of planned features
const featuresRegex = /- (.*?)$/gm;
const features = [];
let match;

while ((match = featuresRegex.exec(futureEnhancementsSection)) !== null) {
  features.push(match[1].trim());
}

// Generate detailed issues for each feature
const issues = features.map(feature => {
  let title = feature;
  let description = '';
  let implementation = '';

  // Customize each issue based on the feature
  switch (feature) {
    case 'User accounts to track progress over time':
      title = 'Implement user accounts to track progress over time';
      description = `
## Description
Add user account functionality to allow users to create profiles and track their memorization progress over time.

## Background
Currently, MemoryWhole does not have persistent user profiles. Adding user accounts will enable users to:
- Save their progress across sessions
- Track improvement over time
- Compare their performance with previous attempts
- Access their history of memorized passages

## Requirements
- User registration and login system
- Secure authentication
- Profile management
- Progress tracking and history
- Session persistence across devices
`;
      implementation = `
## Implementation Suggestions
- Consider using Firebase Authentication for a quick implementation
- Store user progress data in a database (Firebase Firestore or similar)
- Add a user profile page showing statistics and history
- Implement secure password handling and account recovery options
`;
      break;

    case 'Customizable difficulty levels':
      title = 'Add customizable difficulty levels for memory challenges';
      description = `
## Description
Implement adjustable difficulty levels for the memory challenges to accommodate users of different skill levels.

## Background
The current application has a fixed difficulty for memory challenges. Adding customizable difficulty levels will:
- Make the app more accessible to beginners
- Provide appropriate challenges for advanced users
- Create a better progression path for users as they improve

## Requirements
- Multiple predefined difficulty levels (Easy, Medium, Hard, etc.)
- Custom difficulty settings (time limits, hints allowed, etc.)
- Difficulty-appropriate scoring
- Visual indication of the current difficulty level
`;
      implementation = `
## Implementation Suggestions
- Add difficulty selection in the UI before starting a challenge
- Implement different hint frequencies based on difficulty
- Adjust scoring based on difficulty level
- Consider adding time constraints for higher difficulties
- Add difficulty badges or achievements
`;
      break;

    case 'User-submitted passages':
      title = 'Enable user-submitted passages for memorization';
      description = `
## Description
Allow users to submit their own passages for memorization, expanding the content available beyond the pre-defined passages.

## Background
Currently, MemoryWhole offers a selection of pre-defined passages. Allowing users to submit their own would:
- Significantly expand the content library
- Personalize the learning experience
- Allow users to practice with content relevant to their interests or studies
- Create a community-driven aspect to the application

## Requirements
- Interface for users to submit passages
- Content moderation system or guidelines
- Categorization for user-submitted content
- Option to share passages with other users
- Personal library of user-submitted passages
`;
      implementation = `
## Implementation Suggestions
- Create a "Submit Passage" form with title, text, and category fields
- Implement content validation to ensure quality (length limits, content guidelines)
- Add a "My Passages" section in the user profile
- Consider implementing a community rating system for shared passages
- Add search and filter capabilities for the expanded content library
`;
      break;

    case 'Memory games and additional exercises':
      title = 'Develop memory games and additional exercises';
      description = `
## Description
Expand beyond passage memorization by adding various memory games and exercises that target different aspects of memory.

## Background
Currently, MemoryWhole focuses on passage memorization. Adding different types of memory exercises would:
- Provide variety in the learning experience
- Target different aspects of memory (visual, spatial, numerical, etc.)
- Make the application more engaging and fun
- Appeal to a wider audience

## Requirements
- Multiple game types targeting different memory skills
- Progressive difficulty in games
- Instructions and tutorials for each game
- Performance tracking across different game types
- Recommendations based on user performance
`;
      implementation = `
## Implementation Suggestions
- Implement classic memory games like "Pairs" (matching cards)
- Add number sequence memorization
- Create image-based memory exercises
- Develop timed challenges
- Consider adding competitive or multiplayer elements
- Include gamification elements like points, badges, and leaderboards
`;
      break;

    case 'Performance analytics and insights':
      title = 'Add performance analytics and insights for users';
      description = `
## Description
Implement detailed performance analytics and personalized insights to help users understand their progress and improve their memorization skills.

## Background
The app currently provides basic completion time feedback. Expanding this with detailed analytics would:
- Help users identify their strengths and weaknesses
- Provide personalized recommendations for improvement
- Make progress more visible and motivating
- Enable data-driven learning strategies

## Requirements
- Detailed metrics (accuracy, speed, retention over time, etc.)
- Visual representation of progress (graphs, charts)
- Performance trends over time
- Personalized insights and recommendations
- Comparison with previous attempts
`;
      implementation = `
## Implementation Suggestions
- Create a dashboard showing key metrics
- Implement data visualization using a library like Chart.js or D3.js
- Track metrics like typing speed, error rate, completion time
- Use algorithms to generate personalized insights based on performance patterns
- Add exportable reports for users who want to track progress externally
`;
      break;

    case 'Mobile app versions':
      title = 'Develop native mobile app versions';
      description = `
## Description
Create native mobile applications for iOS and Android to provide a better experience for mobile users.

## Background
While the web application has responsive design, native mobile apps would:
- Provide a more optimized experience on mobile devices
- Enable offline functionality
- Allow for mobile-specific features (notifications, widgets, etc.)
- Expand the potential user base

## Requirements
- Native iOS application
- Native Android application
- Feature parity with the web version
- Mobile-optimized UI/UX
- Offline capability
- Sync between web and mobile versions
`;
      implementation = `
## Implementation Suggestions
- Consider using React Native to leverage existing React components
- Implement offline storage for passages and user data
- Create mobile-specific UI components for better touch interaction
- Add push notifications for practice reminders
- Optimize animations and transitions for mobile performance
- Implement account sync between platforms
`;
      break;

    default:
      description = `
## Description
Implement "${feature}" as described in the Future Enhancements section of About.md.

## Background
This feature is listed as a planned enhancement for MemoryWhole.

## Requirements
- Full implementation of the ${feature} feature
- Integration with existing application functionality
- User-friendly interface
`;
      implementation = `
## Implementation Suggestions
- Review current application architecture before implementation
- Ensure consistent design with existing features
- Add appropriate documentation
`;
  }

  return {
    title,
    body: `${description}\n${implementation}\n\nThis issue is created from the Future Enhancements section in About.md.`,
  };
});

// Output the issues as JSON if requested
if (jsonOnly) {
  console.log(JSON.stringify(issues, null, 2));
  process.exit(0);
}

// Output the issues as JSON
if (!quietMode) {
  console.log(JSON.stringify(issues, null, 2));
  
  // Also output instructions for creating the issues
  console.log('\n\n=== Instructions for Creating Issues ===');
  console.log('1. Copy each issue separately from the generated JSON.');
  console.log('2. Create a new issue in the GitHub repository.');
  console.log('3. Paste the title and body into the respective fields.');
  console.log('4. Submit the issue.');
  console.log('\nAlternatively, you can use the GitHub API to create these issues programmatically.');
}

// Create individual issue files for easy access
const issuesDir = path.join(__dirname, 'issues');
if (!fs.existsSync(issuesDir)) {
  fs.mkdirSync(issuesDir);
}

issues.forEach((issue, index) => {
  const issueFile = path.join(issuesDir, `issue_${index + 1}.md`);
  const content = `# ${issue.title}\n\n${issue.body}`;
  fs.writeFileSync(issueFile, content);
  if (!quietMode) {
    console.log(`Created issue file: ${issueFile}`);
  }
});

// Export issues for potential programmatic use
module.exports = {
  issues,
  featuresCount: issues.length
};