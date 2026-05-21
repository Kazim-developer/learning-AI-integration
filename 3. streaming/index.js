import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "user", content: "explain REST APIs in simple words" },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0].delta.content;

      if (text) {
        process.stdout.write(text);
      }
    } //* this for loop will write each token sent by LLM and write it on the spot.
  } catch (error) {
    console.log("error message", error.message);
  }
}

main();

//* code is generated and send to your backend chunk by chunk or token by token.

//! remember, function calling should always be non-streaming. but when we send the function result back to LLM then only add stream:true.
