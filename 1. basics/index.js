import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a backend JSON generator.

Return strict JSON only.
Schema:
{
  "title": string,
  "summary": string,
  "points": string[]
}
`;

const USER_INPUT = "Explain REST APIs";

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: USER_INPUT,
        },
        { role: "assistant", content: "" },
      ],

      temperature: 0.2,
    });

    console.log("\nAI RESPONSE:\n");

    console.log(response);

    console.log(response.choices[0].message.content);

    console.log("\nTOKEN USAGE:\n");

    console.log(response.usage);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

main();

//? different roles

// | Role      | Meaning             |
// | --------- | ------------------- |
// | system    | Rules / behavior    |
// | user      | Request             |
// | assistant | AI response history |

//? role priority order

//* system > developer (if supported) > user > assistant

// So:

// If system says:

// Always output JSON only

// And user says:

// Write a poem

// Model SHOULD follow system instruction.

//? backend analogy

// system     = server configuration
// user       = API request body
// assistant  = stored response logs used for context
