const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git/promise");
const random = require("random");
const chalk = require("chalk");

const FILE_PATH = "./data.json";
const TOTAL_COMMITS = 200;
const BRANCH_NAME = "master";

const showLoading = (message) => {
  process.stdout.write(`${message}...`);
};

const createGitHubRepo = () => {
  console.log(chalk.yellow("To make this script work:"));
  console.log(chalk.yellow("1. Connect to GitHub."));
  console.log(chalk.yellow("2. Create a new repository on GitHub."));
  console.log(
    chalk.yellow("3. Push this project's files to your GitHub repository.")
  );
  console.log(chalk.yellow("4. Re-run the script."));
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

const main = async () => {
  try {
    createGitHubRepo();
    await makeCommits();
  } catch (error) {
    console.error(chalk.red("❌ An error occurred:"), error);
  }
};

main();
