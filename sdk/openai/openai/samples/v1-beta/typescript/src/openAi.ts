// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @summary test getCompletions
 */

import { OpenAIClient } from "@azure/ai-openai";

// Load the .env file if it exists
import * as dotenv from "dotenv";
import { OpenAIKeyCredential } from "@azure/ai-openai";
dotenv.config();

// You will need to set these environment variables or edit the following values
const openApiKey = process.env["OPENAI_API_KEY"] || "<api key>";
const model = process.env["MODEL_NAME"] || "<model name>";

const doc = "Hello world!";

export async function main() {
  console.log("== Get completions Sample ==");

  const client = new OpenAIClient(new OpenAIKeyCredential(openApiKey));

  const result = await client.getCompletions(model, doc);

  console.log(result?.choices?.[0].text);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
