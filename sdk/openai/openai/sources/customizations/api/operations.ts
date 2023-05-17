// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatCompletions, Completions } from "../../generated/api/models.js";
import { getCompletions as _getCompletions } from "../../generated/api/operations.js";

// export interface GetCompletionsOptions extends _GetCompletionsOptions {
//   // @azsdk-remove
//   prompt?: string;
// }

export function getCompletionsResult(body: Record<string, any>): Omit<Completions, "usage"> {
  return {
    id: body["id"],
    created: body["created"],
    choices: (body["choices"] ?? []).map((p: any) => ({
      text: p["text"],
      index: p["index"],
      logprobs: !p.logprobs
        ? undefined
        : {
            tokens: p.logprobs?.["tokens"],
            tokenLogprobs: p.logprobs?.["token_logprobs"],
            topLogprobs: p.logprobs?.["top_logprobs"],
            textOffset: p.logprobs?.["text_offset"],
          },
      finishReason: p["finish_reason"],
    })),
  };
}

export function getChatCompletionsResult(
  body: Record<string, any>
): Omit<ChatCompletions, "usage"> {
  return {
    id: body["id"],
    created: body["created"],
    choices: (body["choices"] ?? []).map((p: any) => ({
      message: !p.message
        ? undefined
        : { role: p.message?.["role"], content: p.message?.["content"] },
      index: p["index"],
      finishReason: p["finish_reason"],
      delta: !p.delta ? undefined : { role: p.delta?.["role"], content: p.delta?.["content"] },
    })),
  };
}
