// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RequestParameters } from "@azure-rest/core-client";
import { ChatCompletionsOptions, CompletionsOptions, EmbeddingsOptions } from "./models.js";

export interface GetEmbeddingsBodyParam {
  body?: EmbeddingsOptions;
}

export interface GetCompletionsBodyParam {
  body?: CompletionsOptions;
}

export interface GetChatCompletionsBodyParam {
  body?: ChatCompletionsOptions;
}

export type GetEmbeddingsParameters = GetEmbeddingsBodyParam & RequestParameters;
export type GetCompletionsParameters = GetCompletionsBodyParam & RequestParameters;
export type GetChatCompletionsParameters = GetChatCompletionsBodyParam & RequestParameters;
