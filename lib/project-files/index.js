const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git/promise");
const random = require("random");
const inquirer = require("inquirer");
const chalk = require("chalk");

const FILE_PATH = "./data.json";
const TOTAL_COMMITS = 200;
const BRANCH_NAME = "master";

const showLoading = (message) => {
  process.stdout.write(`${message}...`);
};

const createGitHubRepo = async () => {
  const { createRepo } = await inquirer.prompt({
    type: "confirm",
    name: "createRepo",
    message:
      "You are not connected to GitHub. Do you want to create a new repository?",
    default: true,
  });

  if (createRepo) {
    // Implement GitHub repository creation process here
    console.log(chalk.yellow("Creating a new repository on GitHub..."));
    // Provide instructions to the user
    console.log(
      chalk.yellow(
        "Please create a new repository on GitHub and then re-run the script."
      )
    );
  } else {
    console.log(
      chalk.yellow("Please connect to GitHub and re-run the script.")
    );
  }
};

const makeCommits = async () => {
  try {
    const commits = [];
    showLoading("🚀 Generating commits");

    for (let i = 0; i < TOTAL_COMMITS; i++) {
      const x = random.int(0, 54);
      const y = random.int(0, 6);
      const DATE = moment()
        .subtract(1, "y")
        .add(1, "d")
        .add(x, "w")
        .add(y, "d")
        .format();

      commits.push({
        date: DATE,
        "--date": DATE,
      });

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      showLoading(`✅ Commit ${i + 1}/${TOTAL_COMMITS}`);
    }

    await jsonfile.writeFile(FILE_PATH, commits);
    console.log("\n✍️ Commits written to data.json");

    showLoading("➕ Adding changes to staging area");
    const git = simpleGit();
    await git.add(".");
    console.log("\n✔️ Changes added to staging area");

    showLoading("📝 Committing changes to the repository");
    await git.commit(commits.map((commit) => commit.date));
    console.log("\n✔️ Changes committed to the repository");

    showLoading("🚀 Pushing changes to remote repository");
    await git.push(BRANCH_NAME);
    console.log("\n✔️ Changes pushed to remote repository");

    console.log(chalk.green("✅ All operations completed successfully!"));
  } catch (error) {
    console.error(chalk.red("❌ An error occurred:"), error);
  }
};

const checkGitHubConnection = async () => {
  try {
    // Check if the user is already authenticated
    await simpleGit().silent(true).fetch();

    return true; // User is authenticated
  } catch (error) {
    if (error.message.includes("not found")) {
      // User is not authenticated, prompt for credentials
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

      // Try authenticating with the provided credentials
      await simpleGit()
        .silent(true)
        .addConfig("user.username", username)
        .addConfig("user.password", password)
        .fetch();

      return true; // User is authenticated
    } else {
      console.error(chalk.red("❌ Failed to check GitHub connection:"), error);
      return false; // Unknown error
    }
  }
};

const main = async () => {
  try {
    const isConnected = await checkGitHubConnection();

    if (!isConnected) {
      await createGitHubRepo();
      return;
    }

    await makeCommits();
  } catch (error) {
    console.error(chalk.red("❌ An error occurred:"), error);
  }
};

main();
