// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 *
 *
 * @summary test getCompletions
 * @azsdk-weight 100
 */

import { OpenAIClient } from "@azure/ai-openai";

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

// You will need to set these environment variables or edit the following values
const openApiKey = process.env["OPENAI_API_KEY"] || "<api key>";
const model = process.env["MODEL_NAME"] || "<model name>";

const doc = "Hello world!";

export async function main() {
  console.log("== Get completions Sample ==");

  const client = new OpenAIClient(openApiKey);

  const result = await client.getCompletionsStreaming(model, doc);

  console.log(result?.choices?.[0].text);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
