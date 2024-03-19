#!/usr/bin/env node

// Import required modules
const { exec } = require("child_process");
const path = require("path");
const inquirer = require("inquirer");
const fse = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk");

/**
 * Main function to create a new GitHub Bot Auto Commit project.
 */
async function main() {
  try {
    // Display welcome message
    console.log(
      chalk.yellow.bold("🚀 Welcome to GitHub Bot Auto Commit Setup! 🚀")
    );
    console.log(chalk.yellow("Let's set up GitHub Bot Auto Commit together."));

    // Check if user is already connected to GitHub
    const isGitHubConnected = await checkGitHubConnection();

    if (isGitHubConnected) {
      // If connected, perform default commit and push
      await commitAndPushDefault();
    } else {
      // If not connected, create a new repository and push
      await createAndPushRepository();
    }

    // Prompt user for project details
    const { projectName, projectDirectory } = await promptProjectDetails();

    // Display loading message
    const loading = createLoading("🛠 Setting up project...");

    // Define directory paths
    const templatesDir = path.resolve(__dirname, "project-files");
    const destinationDir = path.resolve(process.cwd(), projectDirectory);

    // Copy template to specified directory
    copyTemplate(templatesDir, destinationDir);

    // Display success message
    loading.succeed(chalk.green("✅ Project setup completed successfully!"));
    console.log(
      chalk.yellow(
        `📁 Project '${projectName}' created successfully in ${destinationDir}`
      )
    );
    console.log(chalk.yellow("Next steps:"));
    console.log(chalk.yellow(`1. cd ${projectName}`));
    console.log(chalk.yellow("2. npm install"));
    console.log(chalk.yellow("3. npm start"));
    console.log(chalk.yellow("Happy coding with GitHub Bot Auto Commit! 😊"));
  } catch (error) {
    // Handle errors
    console.error(chalk.red("❌ An error occurred:"));
    console.error(chalk.red(error.message || error));
  }
}

/**
 * Function to check if the user is connected to GitHub.
 * @returns {boolean} True if connected to GitHub, otherwise false.
 */
async function checkGitHubConnection() {
  // Execute git config command to check if user is connected to GitHub
  return new Promise((resolve, reject) => {
    exec("git config --get remote.origin.url", (error, stdout, stderr) => {
      if (error || stderr) {
        // If error or stderr, user is not connected to GitHub
        resolve(false);
      } else {
        // If no error, user is connected to GitHub
        resolve(true);
      }
    });
  });
}

/**
 * Function to perform default commit and push.
 */
async function commitAndPushDefault() {
  // Execute default commit and push commands
  console.log(chalk.yellow("📝 Performing default commit and push..."));
  await execPromise('git add . && git commit -m "Initial commit" && git push');

  console.log(
    chalk.green("✅ Default commit and push completed successfully!")
  );
}

/**
 * Function to create a new repository and push.
 */
async function createAndPushRepository() {
  // Prompt user for GitHub username and password
  const { username, password } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "🔑 Enter your GitHub username:",
      validate: (input) => !!input.trim(),
    },
    {
      type: "password",
      name: "password",
      message: "🔑 Enter your GitHub password:",
      mask: "*",
      validate: (input) => !!input.trim(),
    },
  ]);

  // Execute commands to create a new repository and push
  console.log(
    chalk.yellow("🔄 Creating a new repository and pushing to GitHub...")
  );
  await execPromise(
    `echo "# New Project" >> README.md && git init && git add . && git commit -m 'Initial commit' && curl -u ${username}:${password} https://api.github.com/user/repos -d '{"name":"${destinationDir}"}' && git remote add origin https://github.com/${username}/${destinationDir}.git && git push -u origin master`
  );
  console.log(chalk.green("✅ Repository created and pushed successfully!"));
}

/**
 * Function to prompt user for project details.
 * @returns {Object} An object containing project name and directory.
 */
async function promptProjectDetails() {
  // Define questions for user input
  const questions = [
    {
      type: "input",
      name: "projectName",
      message: "📝 Enter project name:",
      validate: (input) => !!input.trim(),
    },
    {
      type: "input",
      name: "projectDirectory",
      message: "📁 Enter project directory:",
      default: (answers) => `./${answers.projectName}`,
    },
  ];

  // Prompt user for input and return the responses
  return inquirer.prompt(questions);
}

/**
 * Function to copy template to specified directory.
 * @param {string} templatesDir - Path to the template directory.
 * @param {string} destinationDir - Path to the destination directory.
 */
function copyTemplate(templatesDir, destinationDir) {
  // Copy template files to destination directory
  fse.copySync(templatesDir, destinationDir);
}

/**
 * Function to create a loading indicator.
 * @param {string} message - Loading message.
 * @returns {Object} Loading spinner instance.
 */
function createLoading(message) {
  // Create and start loading spinner
  return ora({ text: message, spinner: "dots" }).start();
}

/**
 * Function to execute a command asynchronously.
 * @param {string} command - Command to execute.
 * @returns {Promise<void>} A promise representing the command execution process.
 */
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Entry point: Call the main function
main();
