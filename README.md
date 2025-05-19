# MemoryWhole

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Version](https://img.shields.io/badge/react-v19.0.0-61DAFB)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v3.4.17-38B2AC)

> A memory training application to improve your memorization skills through active recall practice.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [The Science Behind MemoryWhole](#the-science-behind-memorywhole)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

MemoryWhole is a memory training application designed to help users improve their memorization skills through practice and repetition. The app presents users with passages of text that they can select, study, and then attempt to reproduce from memory with real-time feedback on their progress.

The application provides a clean, minimalist interface that helps users focus on the memory task at hand, with smooth transitions between different stages of the memory training process. Whether you're looking to sharpen your memory for academic purposes, professional development, or personal growth, MemoryWhole offers an effective and engaging way to practice and enhance your memorization abilities.

## Features

### Interactive Learning Flow

1. **Tutorial Guide**: New users are greeted with a tutorial that explains how to use the application.
2. **Reference Selection**: Users can choose from a variety of thought-provoking passages on topics like Ancient Wisdom, Cosmic Perspective, Technological Revolution, Neural Plasticity, Information Theory, and Memory Palaces.
3. **Reference Confirmation**: Before beginning the memorization exercise, users can review their selected passage.
4. **Memory Challenge**: Users type the passage from memory, with real-time feedback on their progress.
5. **Completion Tracking**: Upon successful completion, users receive feedback on their performance, including the time taken to complete the challenge.

### Responsive Design

- The application is built with a responsive design that works across different device sizes.
- Clean, minimalist interface that helps users focus on the memory task at hand.
- Smooth transitions between different stages of the application using animation.

### Assisted Learning Options

- **Easy Mode**: A setting that can be enabled to make the memory challenge more accessible.
- **Ghost Text**: Provides users with a cue for the next characters when they're struggling.
- **Reference Toggle**: Option to show the original reference during practice for more challenging material.

## The Science Behind MemoryWhole

The application is built on established memory techniques and cognitive science principles:

- **Active Recall**: By challenging users to reproduce text from memory, the app leverages the proven technique of active recall, which strengthens memory pathways more effectively than passive review.
- **Instant Feedback**: Through color coding the text that they input they can know that they are on the right track. Green characters indicate that the user has typed the correct character, while red characters indicate that the user has typed an incorrect character. This allows users to quickly identify and correct mistakes. 
- **Ghost Text as a Cue**: The application uses ghost text to provide users with a cue for the next characters they need to type when they are struggling (stall for more than some time). This helps users focus on continuing inplace rather than pulling up the passage again.

## Technology Stack

MemoryWhole is built using:
- **React.js** for the user interface
- **Framer Motion** for animations
- **Tailwind CSS** for styling

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaxiom13/MemoryWhole.git
   cd MemoryWhole
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```
   This builds the app for production to the `build` folder, optimizing the build for the best performance.

## Usage

1. When you first open MemoryWhole, you'll be presented with a tutorial that explains how to use the application.
2. From the home page, select a passage that interests you from the available options, or create your own custom card.
3. Review your selected passage on the confirmation screen. You can also adjust settings like Easy Mode or Ghost Text here.
4. When you're ready, click "Begin" to start the memory challenge.
5. Type the passage from memory. The text will be color-coded to provide instant feedback:
   - Green: Correct characters
   - Red: Incorrect characters
6. Upon successful completion, you'll see your completion time and have the option to try again or return to the menu.
7. Track your improvement over time as you become more proficient at memorizing complex information.

## Future Enhancements

Planned features for future releases include:
- User accounts to track progress over time
- Customizable difficulty levels
- User-submitted passages
- Memory games and additional exercises
- Performance analytics and insights
- Mobile app versions

## Contributing

Contributions are welcome! If you'd like to contribute to MemoryWhole:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <sub>Built with ❤️ for better memory</sub>
</div>
