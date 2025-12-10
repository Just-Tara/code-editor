# CodeEditor: Real-time Multi-language Web IDE 🚀

## Overview
CodeEditor is a modern, web-based integrated development environment (IDE) built with React and Vite. It offers a versatile platform for real-time code editing across multiple programming languages, featuring live web previews for frontend development and integrated execution for backend languages via the Piston API.

## Features
*   **Multi-language Support**: Seamlessly write and execute code in various languages including HTML, CSS, JavaScript, TypeScript, Python, Java, PHP, Ruby, Go, C, and C++.
*   **Real-time Code Editor**: Powered by Monaco Editor, providing syntax highlighting, auto-completion, and formatting for an enhanced coding experience.
*   **Live Web Preview**: Instantly visualize changes for HTML, CSS, and JavaScript/TypeScript projects in a dedicated preview panel, supporting responsive design modes (desktop, tablet, mobile).
*   **Backend Code Execution**: Execute code for supported backend languages directly within the editor using the Piston API, displaying output or errors in a console.
*   **Integrated Console**: A dynamic console for viewing JavaScript/TypeScript output, errors, and warnings from the live preview.
*   **File and Project Management**: Organize code efficiently with a file explorer that supports creating, deleting, and managing projects, folders, and individual files.
*   **Theme Toggle**: Switch between dark and light themes for personalized comfort.
*   **Font Size Adjustment**: Customize editor font size to suit individual preferences.
*   **Auto-Save Functionality**: Automatically saves project progress to local storage, ensuring work is never lost.
*   **Shareable Code URLs**: Generate and share unique URLs that encapsulate your project's code, making collaboration effortless.
*   **Code Formatting**: Automatically format code within the editor for consistency and readability.


## Usage

Once the application is running, you can start coding and experimenting with different languages.

### 🌐 Web Development (HTML, CSS, JavaScript/TypeScript)
*   **Create Files**: Use the "Add New File" button or context menu in the File Explorer to create `index.html`, `style.css`, and `script.js`  files.
*   **Write Code**: Edit your HTML, CSS, and JavaScript/TypeScript in the respective editor tabs.
*   **Live Preview**: The "Preview" panel will automatically update to reflect your changes for web projects.
*   **Console Output**: For JavaScript/TypeScript, any `console.log()`, `console.error()`, etc., will appear in the integrated console at the bottom of the screen.

### 💻 Backend Development (Python, Java, PHP, Go, C, C++, Ruby, Shell)
*   **Create Files**: Create a new file with the appropriate extension (e.g., `main.py` for Python).
*   **Write Code**: Enter your backend logic in the editor.
*   **Run Code**: Click the "Run Code" button in the header. The application will send your code to the Piston API for execution.
*   **View Output**: The result (stdout or stderr) will be displayed in the "Preview" panel, indicating success or any errors.

### 🗄️ File and Project Management
*   **File Explorer**: On the left, you'll find a file explorer. Click the folder icon in the editor tabs to toggle its visibility.
*   **Create Project**: Use the `+ Project` button to create new, independent coding environments.
*   **Create Folder/File**: Within a project, use the `+ Folder` or `+ File` buttons to organize your code. You can also right-click on projects or folders for these options.
*   **Delete**: Delete projects, folders, or files using the trashcan icon next to their names.
*   **Switch Files/Tabs**: Click on file names in the File Explorer or the Editor Tabs to switch between open files.

### ✨ Editor Features
*   **Theme Toggle**: Use the sun/moon icon in the header (or settings menu on mobile) to switch between dark and light themes.
*   **Font Size**: Adjust the font size with the `A⁺` and `A⁻` buttons in the header (or settings menu on mobile).
*   **Auto-Save**: Toggle auto-save functionality in the header to automatically save your projects to local storage.
*   **Format Code**: Click the "Format" button to automatically format the code in the active editor.
*   **Share Code**: Click "Share" to copy a unique URL to your clipboard that recreates your current project's state for sharing.

## Technologies Used

CodeEditor leverages a modern web development stack to provide a rich and responsive user experience.

| Category      | Technology                                                                                        | Description                                                                 |
| :------------ | :------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- |
| **Frontend**  | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)  | A JavaScript library for building user interfaces.                          |
|               | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)    | Next-generation frontend tooling for fast development.                      |
|               | ![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-000000?style=flat-square&logo=visualstudiocode&logoColor=blue) | The code editor that powers VS Code, embedded in the browser.               |
|               | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | A utility-first CSS framework for rapidly building custom designs.          |
| **UI/UX**     | ![Lucide React](https://img.shields.io/badge/Lucide_React-2C2C2C?style=flat-square&logo=lucide&logoColor=white) | Beautiful & consistent open-source icons.                                   |
|               | `@uiw/react-split`                                                                                | React component for resizable split views.                                  |
| **APIs**      | ![Piston API](https://img.shields.io/badge/Piston_API-556270?style=flat-square&logoColor=white)   | Remote code execution engine for various programming languages.             |
| **Tooling**   | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) | Pluggable JavaScript linter.                                                |

## Contributing

We welcome contributions to CodeEditor! If you have suggestions for improvements, new features, or bug fixes, please follow these guidelines:

1.  ✨ **Fork the repository**.
2.  🌱 **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
3.  ✏️ **Make your changes**. Ensure your code adheres to the project's coding style and conventions.
4.  🧪 **Test your changes** thoroughly.
5.  📚 **Update documentation** as necessary.
6.  💾 **Commit your changes** with clear and concise messages: `git commit -m "feat: Add new feature"`.
7.  ⬆️ **Push your branch** to your forked repository: `git push origin feature/your-feature-name`.
8.  📬 **Open a pull request** to the `main` branch of this repository, describing your changes in detail.

## Author Info

*   **Your Name:** [Tara]
*   **Twitter:** [[J_Tara_](https://x.com/J_Tara_)]

---

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
 