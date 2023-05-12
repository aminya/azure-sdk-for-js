/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 */

import { Recorder, isPlaybackMode } from "@azure-tools/test-recorder";
import { assert } from "@azure/test-utils";
import { Context } from "mocha";
import { OpenAIClient } from "../../src/OpenAIClient.js";
import { createClient, startRecorder } from "./utils/recordedClient.js";

export const testPollingOptions = {
  updateIntervalInMs: isPlaybackMode() ? 0 : undefined,
};

describe("openaiclient test", () => {
  let recorder: Recorder;
  let client: OpenAIClient;

  beforeEach(async function (this: Context) {
    recorder = new Recorder(this.currentTest);
    recorder = await startRecorder(this.currentTest);
    client = createClient("AzureAPIKey", { recorder });
  });

  afterEach(async function () {
    await recorder.stop();
  });

  it("completions test", async function () {
    const prompt = "This is a test";
    const modelName = "text-davinci-003";
    const completions = await client.getCompletions(modelName, prompt);
    assert.isNotNull(completions.choices);
    assert.equal(completions.choices?.length, 1);
  });
});
