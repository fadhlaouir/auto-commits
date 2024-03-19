const jsonfile = require("jsonfile");
const moment = require("moment");
const simpleGit = require("simple-git/promise"); // Import simple-git/promise
const random = require("random");

const FILE_PATH = "./data.json";
const TOTAL_COMMITS = 200;
const BRANCH_NAME = "main"; // Specify the branch name

// Function to display loading message
const showLoading = (message) => {
  process.stdout.write(`${message}...`);
};

// Function to generate commits and push them to the repository
const makeCommits = async () => {
  try {
    const commits = [];
    showLoading("🚀 Generating commits");

    // Generate commits
    for (let i = 0; i < TOTAL_COMMITS; i++) {
      const x = random.int(0, 54);
      const y = random.int(0, 6);
      const DATE = moment()
        .subtract(1, "y")
        .add(1, "d")
        .add(x, "w")
        .add(y, "d")
        .format();

      // Push each commit details to the array
      commits.push({
        date: DATE,
        "--date": DATE,
      });

      // Display progress
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      showLoading(`✅ Commit ${i + 1}/${TOTAL_COMMITS}`);
    }

    // Write commits to JSON file
    await jsonfile.writeFile(FILE_PATH, commits);
    console.log("\n✍️ Commits written to data.json");

    // Add changes to Git staging area
    showLoading("➕ Adding changes to staging area");
    await simpleGit().add("."); // Use git add . to add all changes
    console.log("\n✔️ Changes added to staging area");

    // Commit changes to the repository
    showLoading("📝 Committing changes to the repository");
    await simpleGit().commit(commits.map((commit) => commit.date));
    console.log("\n✔️ Changes committed to the repository");

    // Push changes to the remote repository (main branch)
    showLoading("🚀 Pushing changes to remote repository");
    await simpleGit().push(BRANCH_NAME);
    console.log("\n✔️ Changes pushed to remote repository");

    console.log("✅ All operations completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
};

// Generate and push commits
makeCommits();
