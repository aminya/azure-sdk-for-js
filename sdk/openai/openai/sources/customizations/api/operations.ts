// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OpenAIContext as Client, GetCompletions200Response, GetCompletionsDefaultResponse } from "../rest/index.js";
import {
  DeploymentCompletionsOptionsCompletions,
} from "./models.js";
import { getCompletions as _getCompletions, GetCompletionsOptions } from "../../generated/api/operations.js"
import { StreamableMethod } from "@azure-rest/core-client";

// export interface GetCompletionsOptions extends _GetCompletionsOptions {
//   // @azsdk-remove
//   prompt?: string;
// }

export async function getCompletions(
  context: Client,
  deploymentId: string,
  options?: GetCompletionsOptions
): Promise<DeploymentCompletionsOptionsCompletions>
export async function getCompletions(
  context: Client,
  deploymentId: string,
  prompt: string,
  options?: GetCompletionsOptions
): Promise<DeploymentCompletionsOptionsCompletions>
export async function getCompletions(
  context: Client,
  deploymentId: string,
  prompt: string[],
  options?: GetCompletionsOptions
): Promise<DeploymentCompletionsOptionsCompletions>
/**
 * Gets completions for the provided input prompts.
 * Completions support a wide variety of tasks and generate text that continues from or "completes"
 * provided prompt data.
 */
export async function getCompletions(
  context: Client,
  deploymentId: string,
  inputPromptOrOptions?: string | string[] | GetCompletionsOptions,
  options: GetCompletionsOptions = { requestOptions: {} }
): Promise<DeploymentCompletionsOptionsCompletions> {
  if (typeof inputPromptOrOptions === "object" && !Array.isArray(inputPromptOrOptions)) {
    return _getCompletions(context, deploymentId, inputPromptOrOptions);
  } else {
    return _getCompletions(context, deploymentId, { ...options, prompt: inputPromptOrOptions });
  }
}

export function getCompletionsResponse(
  context: Client,
  deploymentId: string,
  options: GetCompletionsOptions = { requestOptions: {} }
): StreamableMethod<GetCompletions200Response | GetCompletionsDefaultResponse> {
  return context
    .path("/deployments/{deploymentId}/completions", deploymentId)
    .post({
      contentType: (options.content_type as any) ?? "application/json",
      headers: {
        Accept: "application/json",
        ...options.requestOptions?.headers,
      },
      body: {
        ...(options.prompt && { prompt: options.prompt }),
        ...(options.maxTokens && { max_tokens: options.maxTokens }),
        ...(options.temperature && { temperature: options.temperature }),
        ...(options.topP && { top_p: options.topP }),
        ...(options.logitBias && { logit_bias: options.logitBias }),
        ...(options.user && { user: options.user }),
        ...(options.n && { n: options.n }),
        ...(options.logprobs && { logprobs: options.logprobs }),
        ...(options.echo && { echo: options.echo }),
        ...(options.stop && { stop: options.stop }),
        ...(options.presencePenalty && {
          presence_penalty: options.presencePenalty,
        }),
        ...(options.frequencyPenalty && {
          frequency_penalty: options.frequencyPenalty,
        }),
        ...(options.bestOf && { best_of: options.bestOf }),
        ...(options.stream && { stream: options.stream }),
        ...(options.model && { model: options.model }),
      },
    });
}