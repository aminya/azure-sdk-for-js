/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 */

import { env, Recorder, RecorderStartOptions, isPlaybackMode } from "@azure-tools/test-recorder";
import { assert } from "@azure/test-utils";
import { Context } from "mocha";
import { OpenAIClient } from "../src/OpenAIClient.js";
import { AzureKeyCredential } from "@azure/core-auth";

const replaceableVariables: Record<string, string> = {
  AZURE_CLIENT_ID: "azure_client_id",
  AZURE_CLIENT_SECRET: "azure_client_secret",
  AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
  SUBSCRIPTION_ID: "azure_subscription_id",
  ENDPOINT: "https://your-namespace-here.openai.azure.com/",
  MODEL_NAME: "model_name",
  AZURE_API_KEY: "azure_api_key",
};

const recorderOptions: RecorderStartOptions = {
  envSetupForPlayback: replaceableVariables,
};

export const testPollingOptions = {
  updateIntervalInMs: isPlaybackMode() ? 0 : undefined,
};

describe("openaiclient test", () => {
  let recorder: Recorder;
  let endpoint: string;
  let modelName: string;
  let azureApiKey: string;
  let client: OpenAIClient;

  beforeEach(async function (this: Context) {
    recorder = new Recorder(this.currentTest);
    await recorder.start(recorderOptions);
    endpoint = env.ENDPOINT || "";
    modelName = env.MODEL_NAME || "";
    azureApiKey = env.AZURE_API_KEY || "";
    // This is an example of how the environment variables are used
    client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(azureApiKey),
      recorder.configureClientOptions({})
    );
  });

  afterEach(async function () {
    await recorder.stop();
  });

  it("completions test", async function () {
    const prompt = "This is a test";
    const completions = await client.getCompletions(modelName, prompt);
    assert.isNotNull(completions.choices);
    assert.equal(completions.choices?.length, 1);
  });
});
