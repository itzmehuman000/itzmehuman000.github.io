let fileSystem = {
    currentDirectory: '/home/user', // Starting from the home directory
    folders: {
        '/home/user': ['Desktop', 'Downloads', 'Documents', 'Projects'], // Common directories
        '/home/user/Desktop': [],
        '/home/user/Downloads': [],
        '/home/user/Documents': [],
    },
    files: {
        '/home/user': {
            'file1.txt': 'Hello World!',
            'file2.txt': 'This is file2.',
        },
        '/home/user/Desktop': {
            'project1.txt': 'Project 1 details.',
            'project2.txt': 'Project 2 details.',
        },
        '/home/user/Downloads': {
            'download1.zip': 'Download 1 content.',
            'download2.zip': 'Download 2 content.',
        },
        '/home/user/Documents': {
            'doc1.docx': 'Document 1 content.',
            'doc2.docx': 'Document 2 content.',
        },
    },
};

export function handleCommand(input) {
    let response = '';
    const parts = input.split(' ');
    const command = parts[0];
    const argument = parts[1] || '';

    switch (command) {
        case 'help':
            response = `
Usage: <command> [options]
-----------------------------
The following commands are available:

help          Show this help message
ls            List directory contents
pwd           Print working directory
clear         Clear the terminal
cd [dir]      Change directory to [dir]
mkdir [dir]   Create a new directory
touch [file]  Create a new empty file
rm [file]     Remove a specified file
rmdir [dir]   Remove an empty directory
cat [file]    Display the contents of a specified file
nano [file]   Open a file in a simple text editor
man [command] Display detailed information about a specific command

Type 'man <command>' for more information about a command.
            `;
            break;
        case 'man':
            response = handleManual(argument);
            break;
        case 'ls':
            response = listFilesAndFolders();
            break;
        case 'pwd':
            response = fileSystem.currentDirectory;
            break;
        case 'cd':
            if (argument) {
                response = changeDirectory(argument);
            } else {
                response = 'No directory specified';
            }
            break;
        case 'mkdir':
            if (argument) {
                response = createDirectory(argument);
            } else {
                response = 'No directory name specified';
            }
            break;
        case 'touch':
            if (argument) {
                response = createFile(argument);
            } else {
                response = 'No file name specified';
            }
            break;
        case 'rm':
            if (argument) {
                response = removeFile(argument);
            } else {
                response = 'No file name specified';
            }
            break;
        case 'rmdir':
            if (argument) {
                response = removeDirectory(argument);
            } else {
                response = 'No directory name specified';
            }
            break;
        case 'cat':
            if (argument) {
                response = displayFileContent(argument);
            } else {
                response = 'No file name specified';
            }
            break;
        case 'nano':
            if (argument) {
                response = editFile(argument);
            } else {
                response = 'No file name specified';
            }
            break;
        case 'clear':
            return 'clear';  // Signal to clear the terminal
        default:
            response = `<span class="error">Command not found: ${input}</span>`;
            break;
    }
    return response;
}

// Function to list files and folders based on the current directory
function listFilesAndFolders() {
    const currentDir = fileSystem.currentDirectory;
    const files = Object.keys(fileSystem.files[currentDir] || {});
    const folders = fileSystem.folders[currentDir] || [];
    return [...folders.map(folder => `${folder}/`), ...files].join(' ');
}

// Function to change the directory
function changeDirectory(dir) {
    const currentDir = fileSystem.currentDirectory;

    if (dir === '..') {
        // Move up one directory
        if (currentDir !== '/home/user') {
            fileSystem.currentDirectory = currentDir.substring(0, currentDir.lastIndexOf('/')) || '/home/user';
            return `Changed directory to ${fileSystem.currentDirectory}`;
        }
        return `Already in home directory`;
    }

    const newDir = `${currentDir}/${dir}`;
    if (fileSystem.folders[currentDir]?.includes(dir)) {
        fileSystem.currentDirectory = newDir;
        return `Changed directory to ${fileSystem.currentDirectory}`;
    }
    return `No such directory: ${dir}`;
}

// Function to create a new directory
function createDirectory(dir) {
    const currentDir = fileSystem.currentDirectory;

    if (!fileSystem.folders[currentDir]) {
        fileSystem.folders[currentDir] = [];
    }

    if (!fileSystem.folders[currentDir].includes(dir)) {
        fileSystem.folders[currentDir].push(dir);
        return `Directory '${dir}' created.`;
    } else {
        return `Directory '${dir}' already exists.`;
    }
}

// Function to create a new file
function createFile(file) {
    const currentDir = fileSystem.currentDirectory;

    if (!fileSystem.files[currentDir]) {
        fileSystem.files[currentDir] = {};
    }

    if (!fileSystem.files[currentDir][file]) {
        fileSystem.files[currentDir][file] = ''; // Initialize with empty content
        return `File '${file}' created.`;
    } else {
        return `File '${file}' already exists.`;
    }
}

// Function to remove a file
function removeFile(file) {
    const currentDir = fileSystem.currentDirectory;
    const files = fileSystem.files[currentDir] || {};

    if (files[file]) {
        delete fileSystem.files[currentDir][file];
        return `File '${file}' removed.`;
    }
    return `No such file: ${file}`;
}

// Function to remove a directory
function removeDirectory(dir) {
    const currentDir = fileSystem.currentDirectory;
    const index = fileSystem.folders[currentDir]?.indexOf(dir);

    if (index > -1) {
        fileSystem.folders[currentDir].splice(index, 1);
        return `Directory '${dir}' removed.`;
    }
    return `No such directory: ${dir}`;
}

// Function to display the content of a specified file
function displayFileContent(file) {
    const currentDir = fileSystem.currentDirectory;
    const fileContent = fileSystem.files[currentDir]?.[file];

    if (fileContent !== undefined) {
        return `Contents of '${file}': ${fileContent}`;
    }
    return `No such file: ${file}`;
}

// Function to edit a file using the nano command
function editFile(file) {
    const currentDir = fileSystem.currentDirectory;
    const fileContent = fileSystem.files[currentDir]?.[file];

    if (fileContent !== undefined) {
        // Simulate opening a file in the nano editor
        const newContent = prompt(`Editing '${file}'. Current content:\n${fileContent}\nEnter new content:`);
        if (newContent !== null) {
            fileSystem.files[currentDir][file] = newContent; // Update file content
            return `File '${file}' updated.`;
        }
        return `No changes made to '${file}'.`;
    }
    return `No such file: ${file}`;
}

// Function to handle manual pages for commands
function handleManual(command) {
    switch (command) {
        case 'help':
            return `
help
----
Display the available commands and their usage.

Usage: help

Description:
This command lists all available commands in the terminal emulator along with a brief description of each command. Use this to understand what commands you can execute.

Example:
> help
            `;
        case 'ls':
            return `
ls
----
List the contents of the current directory.

Usage: ls [options]

Description:
The 'ls' command lists all files and directories in the current working directory. It can be customized with various options to change the output format.

Example:
> ls
            `;
        case 'pwd':
            return `
pwd
----
Print the current working directory.

Usage: pwd

Description:
The 'pwd' command displays the full path of the current working directory. This is useful for identifying your location within the filesystem.

Example:
> pwd
            `;
        case 'cd':
            return `
cd [dir]
--------
Change the current directory to [dir].

Usage: cd <directory>

Description:
The 'cd' command allows you to navigate to a different directory. If no argument is provided, it will return you to your home directory.

Example:
> cd documents
> cd ..
            `;
        case 'mkdir':
            return `
mkdir [dir]
-----------
Create a new directory.

Usage: mkdir <directory_name>

Description:
The 'mkdir' command creates a new directory with the specified name. If a directory with that name already exists, an error will be returned.

Example:
> mkdir new_folder
            `;
        case 'touch':
            return `
touch [file]
-------------
Create a new empty file.

Usage: touch <file_name>

Description:
The 'touch' command creates a new empty file with the specified name. If a file with that name already exists, an error will be returned.

Example:
> touch new_file.txt
            `;
        case 'rm':
            return `
rm [file]
---------
Remove a specified file.

Usage: rm <file_name>

Description:
The 'rm' command deletes the specified file. If the file does not exist, an error will be returned.

Example:
> rm old_file.txt
            `;
        case 'rmdir':
            return `
rmdir [dir]
-----------
Remove an empty directory.

Usage: rmdir <directory_name>

Description:
The 'rmdir' command removes the specified directory if it is empty. If the directory contains files or does not exist, an error will be returned.

Example:
> rmdir empty_folder
            `;
        case 'clear':
            return `
clear
------
Clear the terminal output.

Usage: clear

Description:
The 'clear' command removes all previously displayed text from the terminal, providing a clean slate for further commands.

Example:
> clear
            `;
        case 'cat':
            return `
cat [file]
----------
Display the contents of a specified file.

Usage: cat <file_name>

Description:
The 'cat' command displays the contents of the specified file in the terminal. If the file does not exist, an error will be returned.

Example:
> cat my_file.txt
            `;
        case 'nano':
            return `
nano [file]
-----------
Open a file in a simple text editor.

Usage: nano <file_name>

Description:
The 'nano' command allows you to edit the contents of the specified file. If the file does not exist, an error will be returned.

Example:
> nano my_file.txt
            `;
        default:
            return `<span class="error">No manual entry for ${command}</span>`;
    }
}
