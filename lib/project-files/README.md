# GitHub Bot Auto Commit

A commit a day keeps the bugs away! But with GitHub Bot Auto Commit, we'll be doing 200 commits in no time!

## Description

GitHub Bot Auto Commit is a Node.js script that generates and pushes commits to a GitHub repository automatically. It utilizes random commit dates within the past year to simulate regular activity on the repository.

## Installation

Ensure you have Node.js installed on your system. You can install this package globally using npm:

```bash
npm install -g github-bot-auto-commit
```

Alternatively, you can use npx to run the script without installing it globally:

```bash
npx github-bot-auto-commit
```

## Usage

Once installed, you can simply run the following command in your terminal:

```bash
github-bot-auto-commit
```

This command will start the script, which will generate commits and push them to your specified GitHub repository.

## Configuration

Before running the script, you need to configure it with your GitHub repository information:

1. **Clone**: Clone this repository to your local machine.

2. **Navigate**: Navigate to the project directory in your terminal.

3. **Install Dependencies**: Install dependencies using npm:

   ```bash
   npm install
   ```

4. **Configure**: Update the `FILE_PATH`, `TOTAL_COMMITS`, and `BRANCH_NAME` constants in `index.js` according to your preferences.

5. **Run**: Run the script by using npm:

   ```bash
   npm start
   ```

## Customization

You can customize the behavior of the script by modifying the constants in the `index.js` file:

- `FILE_PATH`: Specify the path where you want to store the generated commits.
- `TOTAL_COMMITS`: Set the number of commits you want to generate.
- `BRANCH_NAME`: Specify the name of the branch in your repository where you want to push the commits.

## Feedback

If you encounter any issues or have suggestions for improvements, please feel free to open an issue [here](https://github.com/fadhlaouir/github-bot-auto-commit/issues).

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## About the Author

This project is maintained by [Raed FADHLAOUI](https://github.com/fadhlaouir).
