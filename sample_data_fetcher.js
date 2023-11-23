const axios = require("axios").default;
const dotenv = require("dotenv");
const fs = require("fs/promises");
const color = require("colors").enable();
const readLine = require("readline/promises").createInterface({
  input: process.stdin,
  output: process.stdout,
});
dotenv.config({ path: "./.env" });
// load sample posts data
const load_sample_data = async (url, toFile) => {
  try {
    const resp = await axios.get(url);

    //write posts to a file
    if (resp) {
      await fs.writeFile(toFile, JSON.stringify(resp.data), "utf-8");
      return resp.data;
    }
  } catch (err) {
    console.log("there is some problem in loading posts data".red, err.message);
    throw new Error(err);
  }
};

if (process.argv[2] == "-i") {
  (async () => {
    const [posts, users] = await Promise.all([
      load_sample_data(process.env.SAMPLE_POSTS_URL, "posts.json"),
      load_sample_data(process.env.SAMPLE_USERS_URL, "users.json"),
    ]);

    if (posts && users) {
      console.log("sample posts and users data have been imported".bgYellow);
    }
    process.exit();
  })();
}

if (process.argv[2] == "-d") {
  (async () => {
    const executeDelete = async () => {
      try {
        await fs.unlink("posts.json");
        await fs.unlink("users.json");
        console.info("File has been deleted".bgGreen);
      } catch (err) {
        if (err && err.code == "ENOENT") {
          console.info("File doesn't exist, won't remove it.".red);
        } else {
          console.error("Error occurred while trying to remove file".red);
        }
      }
    };
    const user_input = await readLine.question(
      "Do you want to delete the file? "
    );
    if (user_input && user_input.toLowerCase() === "y") {
      await executeDelete();
      readLine.close();
      process.exit();
    } else {
      let user_data = "";
      do {
        user_data = await readLine.question(
          "Please enter 'y' || 'Y', if you want to delete:"
        );
      } while (user_data.toLowerCase() !== "y");
      await executeDelete();

      readLine.close();
      process.exit();
    }
  })();
}
