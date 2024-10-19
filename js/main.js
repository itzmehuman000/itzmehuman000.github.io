import { handleCommand } from './commands.js';

document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.getElementById('terminal-input');
    const outputDiv = document.getElementById('terminal-output');
    const prompt = document.getElementById('prompt');

    // Initialize the file system
    let fileSystem = {
        currentDirectory: '/home/user', // Start in the home directory
        folders: {
            '/home/user': ['Desktop', 'Downloads', 'Documents', 'Projects'],
            '/home/user/Desktop': [],
            '/home/user/Downloads': [],
            '/home/user/Documents': [],
        },
        files: {
            '/home/user': ['file1.txt', 'file2.txt'],
            '/home/user/Desktop': ['project1.txt', 'project2.txt'],
            '/home/user/Downloads': ['download1.zip', 'download2.zip'],
            '/home/user/Documents': ['doc1.docx', 'doc2.docx'],
        },
    };

    // Function to update the prompt based on the current directory
    function updatePrompt() {
        prompt.innerText = `guest@itzmehuman:~${fileSystem.currentDirectory}$ `;
    }

    // Initialize the prompt
    updatePrompt();

    inputField.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const input = this.value.trim(); // Get input value and trim any spaces

            // Clear the input field
            this.value = '';

            // Don't proceed if the input is empty
            if (input === '') return;

            // Get the command response
            const response = handleCommand(input, fileSystem); // Pass fileSystem to the command handler

            // Handle 'clear' command: If response is 'clear', clear the terminal
            if (response === 'clear') {
                outputDiv.innerHTML = '';
                return;
            }

            // Append the user's input and the command output
            outputDiv.innerHTML += `<div class="guest">${prompt.innerText} ${input}</div>`;
            outputDiv.innerHTML += `<div class="command-output">${response}</div>`;

            // Scroll to the bottom of the terminal
            outputDiv.scrollTop = outputDiv.scrollHeight;

            // Update the prompt to show the current directory
            updatePrompt();
        }
    });

    // Automatically focus on the input field when the page loads
    inputField.focus();
});
