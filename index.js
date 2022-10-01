import "dotenv/config.js";
import Snoowrap from "snoowrap";
import { CommentStream } from "snoostorm";
import Sentiment from "sentiment";
import allowedSymbols from "./allowedSymbols.js";
import bannedWords from "./bannedWords.js";

const client = new Snoowrap({
  userAgent: `wsb/${process.env.USERNAME}`,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

export const subreddit = "wallstreetbets";

const sentiment = new Sentiment();
console.log(`starting with subreddit: ${subreddit}`);

const comments = new CommentStream(client, {
  subreddit: subreddit,
  limit: 2,
  pollTime: 4000,
});

comments.on("item", async (item) => {
  const invalidItem = item && item.body && item.body.length > 1000;
  if (!invalidItem) {
    const words = item.body.split(" ");
    const invalidPost = words.some((word) =>
      bannedWords.includes(word.toUpperCase())
    );
    if (invalidPost) {
      return;
    }
    const symbols = words.filter((word) =>
      allowedSymbols.includes(word.toUpperCase())
    );
    if (symbols.length > 0) {
      const buying = sentiment.analyze(item.body).score > 0;
      const selling = sentiment.analyze(item.body).score < 0;

      console.log("************************************************");
      if (buying) {
        console.log("buying");
      }
      if (selling) {
        console.log("selling");
      }
      console.log(symbols.join(","));
      console.log(item.body);
      console.log("************************************************");
    }
  }
});
