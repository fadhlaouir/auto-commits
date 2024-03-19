#!/usr/bin/env node

// Import required modules
const { exec } = require("child_process");
const path = require("path");
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

    // Display loading message
    const loading = createLoading("Setting up project...");

    // Define directory paths
    const templatesDir = path.resolve(__dirname, "project-files");

    // Copy template to current directory
    copyTemplate(templatesDir, process.cwd());

    // Display success message
    loading.succeed(chalk.green("✅ Project setup completed successfully!"));
    console.log(chalk.yellow("Happy coding with GitHub Bot Auto Commit! 😊"));
  } catch (error) {
    // Handle errors
    console.error(chalk.red("❌ An error occurred:"));
    console.error(chalk.red(error.message || error));
  }
}

/**
 * Function to copy template to current directory.
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

// Entry point: Call the main function
main();
