// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Client, StreamableMethod } from "@azure-rest/core-client";
import {
  GetChatCompletionsParameters,
  GetCompletionsParameters,
  GetEmbeddingsParameters,
} from "./parameters.js";
import {
  GetChatCompletions200Response,
  GetChatCompletionsDefaultResponse,
  GetCompletions200Response,
  GetCompletionsDefaultResponse,
  GetEmbeddings200Response,
  GetEmbeddingsDefaultResponse,
} from "./responses.js";

export interface GetEmbeddings {
  /** Return the embeddings for a given prompt. */
  post(
    options?: GetEmbeddingsParameters
  ): StreamableMethod<GetEmbeddings200Response | GetEmbeddingsDefaultResponse>;
}

export interface GetCompletions {
  /**
   * Gets completions for the provided input prompts.
   * Completions support a wide variety of tasks and generate text that continues from or "completes"
   * provided prompt data.
   */
  post(
    options?: GetCompletionsParameters
  ): StreamableMethod<GetCompletions200Response | GetCompletionsDefaultResponse>;
}

export interface GetChatCompletions {
  /**
   * Gets chat completions for the provided chat messages.
   * Completions support a wide variety of tasks and generate text that continues from or "completes"
   * provided prompt data.
   */
  post(
    options?: GetChatCompletionsParameters
  ): StreamableMethod<GetChatCompletions200Response | GetChatCompletionsDefaultResponse>;
}

export interface Routes {
  /** Resource for '/deployments/\{deploymentId\}/embeddings' has methods for the following verbs: post */
  (path: "/deployments/{deploymentId}/embeddings", deploymentId: string): GetEmbeddings;
  /** Resource for '/deployments/\{deploymentId\}/completions' has methods for the following verbs: post */
  (path: "/deployments/{deploymentId}/completions", deploymentId: string): GetCompletions;
  /** Resource for '/deployments/\{deploymentId\}/chat/completions' has methods for the following verbs: post */
  (path: "/deployments/{deploymentId}/chat/completions", deploymentId: string): GetChatCompletions;
}

export type OpenAIContext = Client & {
  path: Routes;
};
