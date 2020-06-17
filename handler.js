const axios = require("axios");
const Discord = require("discord.js");

exports.getProblems = async (getHandles, fromHandles, rating, msg) => {
  // console.log(getHandles);
  // console.log(fromHandles);
  // console.log(rating);
  try {
    var getSolved = new Set();
    var fromSolved = new Set();
    let toSolve = new Set();
    let toSolveArr = [];
    let res;

    for (getHandle of getHandles) {
      res = await axios({
        method: "get",
        url: `https://codeforces.com/api/user.status?handle=${getHandle}`,
      });
      if (res.data.status === "OK") {
        for (submission of res.data.result) {
          if (
            submission.verdict === "OK" &&
            submission.problem.rating >= rating
          ) {
            // console.log(submission.problem);
            getSolved.add(JSON.stringify(submission.problem));
          }
        }
      }
    }

    for (fromHandle of fromHandles) {
      res = await axios({
        method: "get",
        url: `https://codeforces.com/api/user.status?handle=${fromHandle}`,
      });
      if (res.data.status === "OK") {
        for (submission of res.data.result) {
          if (
            submission.verdict === "OK" &&
            submission.problem.rating >= rating
          ) {
            // console.log(submission.problem);
            fromSolved.add(JSON.stringify(submission.problem));
          }
        }
      }
    }
    // console.log(getSolved);
    // console.log(fromSolved);
    fromSolved.forEach((value) => {
      if (!getSolved.has(value)) toSolve.add(JSON.parse(value));
    });
    toSolveArr = [...toSolve].sort((a, b) => a.rating - b.rating);
    // console.log(toSolveArr);
    let problems = [];
    let problemRatings = [];
    let x = 1;
    for (i in toSolveArr) {
      if (i >= 10) break;
      problems.push(
        `[${x}. ${toSolveArr[i].name}](https://codeforces.com/contest/${toSolveArr[i].contestId}/problem/${toSolveArr[i].index})`
      );
      problemRatings.push(`${toSolveArr[i].rating}`);
      x += 1;
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#45ff30")
      .addFields(
        { name: "Problem", value: problems.join("\n"), inline: true },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "Rating", value: problemRatings.join("\n"), inline: true }
      )
      .setTitle(
        `List of problems solved (${toSolveArr.length}) by ${fromHandles.join(
          ", "
        )} and not by ${getHandles.join(", ")}.`
      )
      .setFooter(`Total Problems: ${toSolveArr.length}`);
    msg.channel.send(embed);
  } catch (err) {
    console.log(err);
    const embederror = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(err.response.data.comment);
    msg.channel.send(embederror);
  }
};
