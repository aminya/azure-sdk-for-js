// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { KeyCredential, TokenCredential, isTokenCredential } from "@azure/core-auth";
import {
  ChatCompletions,
  ChatMessage,
  Completions,
  Embeddings,
  GetEmbeddingsOptions,
  OpenAIContext,
  createOpenAI,
  getChatCompletions,
  getCompletions,
  getEmbeddings,
} from "./api/index.js";
import {
  GetChatCompletionsOptions,
  GetCompletionsOptions,
  _getChatCompletionsSend,
  _getCompletionsSend,
  getChatCompletionsResult,
  getCompletionsResult,
} from "./api/operations.js";
import { getSSEs } from "./api/sse.js";
import { ClientOptions } from "./common/interfaces.js";

export type CompletionsStream = AsyncIterable<Omit<Completions, "usage">>;
export type ChatCompletionsStream = AsyncIterable<Omit<ChatCompletions, "usage">>;

export type GetCompletionsOptionsNoStream = Omit<GetCompletionsOptions, "stream">;

export type GetChatCompletionsOptionsNoStream = Omit<GetChatCompletionsOptions, "stream">;

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

  getEmbeddings(
    deploymentOrModelName: string,
    input: string | string[],
    options?: GetEmbeddingsOptions
  ): Promise<Embeddings>;
  getEmbeddings(
    deploymentOrModelName: string,
    input: string | string[],
    options: GetEmbeddingsOptions = { requestOptions: {} }
  ): Promise<Embeddings> {
    this.setModel(deploymentOrModelName, options);
    return getEmbeddings(this._client, input, deploymentOrModelName, options);
  }

  getChatCompletions(
    deploymentOrModelName: string,
    messages: ChatMessage[],
    options: GetChatCompletionsOptionsNoStream = { requestOptions: {} }
  ): Promise<ChatCompletions> {
    this.setModel(deploymentOrModelName, options);
    return getChatCompletions(this._client, messages, deploymentOrModelName, options);
  }

  getCompletions(
    deploymentOrModelName: string,
    prompt: string | string[],
    options: GetCompletionsOptionsNoStream = { requestOptions: {} }
  ): Promise<Completions> {
    this.setModel(deploymentOrModelName, options);
    return getCompletions(this._client, createPrompt(prompt), deploymentOrModelName, options);
  }

  getCompletionsStreaming(
    deploymentOrModelName: string,
    prompt: string | string[],
    options: GetCompletionsOptionsNoStream = {}
  ): Promise<CompletionsStream> {
    this.setModel(deploymentOrModelName, options);
    const response = _getCompletionsSend(
      this._client,
      createPrompt(prompt),
      deploymentOrModelName,
      { ...options, stream: true }
    );
    return getSSEs(response, getCompletionsResult);
  }

  getChatCompletionsStreaming(
    deploymentOrModelName: string,
    messages: ChatMessage[],
    options: GetChatCompletionsOptionsNoStream = { requestOptions: {} }
  ): Promise<ChatCompletionsStream> {
    this.setModel(deploymentOrModelName, options);
    const response = _getChatCompletionsSend(this._client, messages, deploymentOrModelName, {
      ...options,
      stream: true,
    });
    return getSSEs(response, getChatCompletionsResult);
  }

  private setModel(model: string, options: { model?: string }): void {
    if (!this._isAzure) {
      options.model = model;
    }
  }
}

function createOpenAIEndpoint(version: number): string {
  return `https://api.openai.com/v${version}`;
}

function isCred(cred: Record<string, any>): cred is TokenCredential | KeyCredential {
  return isTokenCredential(cred) || cred.key !== undefined;
}

function createPrompt(prompt: string | string[]): string[] {
  return !Array.isArray(prompt) ? [prompt] : prompt;
}
