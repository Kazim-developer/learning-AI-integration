import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: "You are a backend engineering teacher.",
        },
        {
          role: "user",
          content: "Explain REST APIs simply.",
        },
      ],

      temperature: 0.2,
    });

    console.log("\nAI RESPONSE:\n");

    console.log(response.choices[0].message.content);

    console.log("\nTOKEN USAGE:\n");

    console.log(response.usage);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

main();
