import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

const USER_INPUT = "what is the weather in karachi";

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "get current weather for a city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "Name of the city",
          },
        },
        required: ["city"],
      },
    },
  },
];
//* this is like a schema for tools to let the openai know what functions are available with name, description, and properties.

function getWeather(city) {
  return `The weather in ${city} is 32°C and sunny`;
}

async function main() {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_INPUT },
    ];
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.2,
      tools,
    });

    const toolCall = response.choices[0].message.tool_calls[0];
    //* this line is Extracting tool call from LLM response

    const args = JSON.parse(toolCall.function.arguments);
    //* this line is Parsing function arguments(which is a string) into object

    const result = getWeather(args.city);
    //* passing the parsed arguments into function

    messages.push(response.choices[0].message);
    //* this line is Saving assistant’s tool request into conversation

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: result,
    });
    //* this line is Send tool execution result back to LLM, so that LLM generate human-like response.

    const finalResponse = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.2,
      tools,
    });

    console.log(finalResponse.choices[0].message.content);
  } catch (error) {
    console.error("error message", error.message);
  }
}

main();

//? complete function calling working flow

// 1. User → "What is weather in Karachi?"

// 2. Backend → OpenAI
//    (with tool schema)

// 3. OpenAI → tool call:
//    get_weather(city="Karachi")

// 4. Backend executes:
//    getWeather("Karachi")

// 5. Backend → OpenAI
//    sends tool result

// 6. OpenAI → final response:
//    "The weather in Karachi is 32°C and sunny"

//? REAL-WORLD ANALOGY

// Imagine:

// LLM is a manager:
// “Send an email”
// “Check weather”
// “Fetch user data”
// Backend is staff:
// email service
// weather API
// database

// Manager DOES NOT do work.

// Manager ONLY assigns tasks.
