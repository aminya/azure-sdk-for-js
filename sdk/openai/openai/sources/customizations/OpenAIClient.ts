// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TokenCredential, KeyCredential, isTokenCredential } from "@azure/core-auth";
import { ClientOptions } from "../generated/common/interfaces.js";
import {
  ChatMessage,
  createOpenAI,
  OpenAIContext,
  getEmbeddings,
  getCompletions,
  getChatCompletions,
  GetEmbeddingsOptions,
  GetCompletionsOptions as GeneratedGetCompletionsOptions,
  GetChatCompletionsOptions as GeneratedGetChatCompletionsOptions,
} from "../generated/api/index.js";
import { getChatCompletionsResult, getCompletionsResult } from "./api/operations.js";
import { getSSEs } from "./api/sse.js";
import { ChatCompletions, Completions, Embeddings } from "../generated/api/models.js";
import { _getChatCompletionsSend, _getCompletionsSend } from "../generated/api/operations.js";

function createOpenAIEndpoint(version: number): string {
  return `https://api.openai.com/v${version}`;
}

function isCred(cred: Record<string, any>): cred is TokenCredential | KeyCredential {
  return isTokenCredential(cred) || cred.key !== undefined;
}

export type CompletionsStream = AsyncIterable<Omit<Completions, "usage">>;
export type ChatCompletionsStream = AsyncIterable<Omit<ChatCompletions, "usage">>;

export type GetCompletionsOptions = Omit<GeneratedGetCompletionsOptions, "stream">;

export type GetChatCompletionsOptions = Omit<GeneratedGetChatCompletionsOptions, "stream">;

export class OpenAIClient {
  private _client: OpenAIContext;
  private _isAzure = false;

  /** Azure OpenAI APIs for completions and search */
  constructor(openAiKey: KeyCredential, options?: ClientOptions);
  constructor(
    endpoint: string,
    credential: KeyCredential | TokenCredential,
    options?: ClientOptions
  );
  constructor(
    endpointOrOpenAiKey: string | KeyCredential,
    credOrOptions: KeyCredential | TokenCredential | ClientOptions = {},
    options: ClientOptions = {}
  ) {
    let opts: ClientOptions;
    let endpoint: string;
    let cred: KeyCredential | TokenCredential;
    if (isCred(credOrOptions)) {
      endpoint = endpointOrOpenAiKey as string;
      cred = credOrOptions;
      opts = options;
      this._isAzure = true;
    } else {
      endpoint = createOpenAIEndpoint(1);
      cred = endpointOrOpenAiKey as KeyCredential;
      const { credentials, ...restOpts } = credOrOptions;
      opts = {
        credentials: {
          apiKeyHeaderName: credentials?.apiKeyHeaderName ?? "Authorization",
          scopes: credentials?.scopes,
        },
        ...restOpts,
      };
    }
    this._client = createOpenAI(endpoint, cred, {
      ...opts,
      ...(this._isAzure
        ? {}
        : {
            additionalPolicies: [
              ...(opts.additionalPolicies ?? []),
              {
                position: "perCall",
                policy: {
                  name: "openAiEndpoint",
                  sendRequest: (request, next) => {
                    const obj = new URL(request.url);
                    const parts = obj.pathname.split("/");
                    obj.pathname = `/${parts[1]}/${parts.slice(5).join("/")}`;
                    obj.searchParams.delete("api-version");
                    request.url = obj.toString();
                    return next(request);
                  },
                },
              },
            ],
          }),
    });
  }

  private setModel(model: string, options: { model?: string }): void {
    if (!this._isAzure) {
      options.model = model;
    }
  }

  getEmbeddings(
    deploymentOrModelName: string,
    input: string[],
    options?: GetEmbeddingsOptions
  ): Promise<Embeddings>;
  getEmbeddings(
    deploymentOrModelName: string,
    input: string[],
    options: GetEmbeddingsOptions = { requestOptions: {} }
  ): Promise<Embeddings> {
    this.setModel(deploymentOrModelName, options);
    return getEmbeddings(this._client, input, deploymentOrModelName, options);
  }

  getChatCompletions(
    deploymentOrModelName: string,
    messages: ChatMessage[],
    options: GetChatCompletionsOptions = { requestOptions: {} }
  ): Promise<ChatCompletions> {
    this.setModel(deploymentOrModelName, options);
    return getChatCompletions(this._client, messages, deploymentOrModelName, options);
  }

  getCompletions(
    deploymentOrModelName: string,
    prompt: string[],
    options: GetCompletionsOptions = { requestOptions: {} }
  ): Promise<Completions> {
    this.setModel(deploymentOrModelName, options);
    return getCompletions(this._client, prompt, deploymentOrModelName, options);
  }

  getCompletionsStreaming(
    deploymentOrModelName: string,
    prompt: string[],
    options: GetCompletionsOptions = {}
  ): Promise<CompletionsStream> {
    this.setModel(deploymentOrModelName, options);
    const response = _getCompletionsSend(this._client, prompt, deploymentOrModelName, {
      ...options,
      stream: true,
    });
    return getSSEs(response, getCompletionsResult);
  }

  getChatCompletionsStreaming(
    deploymentOrModelName: string,
    messages: ChatMessage[],
    options: GetChatCompletionsOptions = { requestOptions: {} }
  ): Promise<ChatCompletionsStream> {
    this.setModel(deploymentOrModelName, options);
    const response = _getChatCompletionsSend(this._client, messages, deploymentOrModelName, {
      ...options,
      stream: true,
    });
    return getSSEs(response, getChatCompletionsResult);
  }
}
