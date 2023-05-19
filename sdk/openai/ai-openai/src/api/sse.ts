// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamableMethod } from "@azure-rest/core-client";
import { getStream } from "./getStream.js";

export async function getSSEs<TResponse, TEvent>(
  response: StreamableMethod<TResponse>,
  toEvent: (obj: Record<string, any>) => TEvent
): Promise<AsyncIterable<TEvent>> {
  const stream = getStream(response);
  let prevLineIfIncomplete = "";
  let started = false;
  return streamToEvents(stream, (chunk) => {
    if (!chunk.startsWith("data: ") && !started) {
      throw new Error(chunk);
    }
    started = true;
    return chunk.split("\n\n").reduce((events, str) => {
      let event: Record<string, any> | undefined;
      if (str.startsWith("data: ")) {
        str = str.slice(6);
      }
      if (["", "[DONE]", "[DONE]\n"].includes(str)) {
        return events;
      }
      if (prevLineIfIncomplete) {
        event = JSON.parse(prevLineIfIncomplete + str);
        prevLineIfIncomplete = "";
      } else {
        try {
          event = JSON.parse(str);
        } catch (e) {
          prevLineIfIncomplete = str;
        }
      }
      return event !== undefined ? [...events, toEvent(event)] : events;
    }, [] as TEvent[]);
  });
}

async function* streamToEvents<T>(
  stream: AsyncIterable<string>,
  processChunk: (chunk: string) => T[]
): AsyncIterable<T> {
  for await (const chunk of stream) {
    yield* processChunk(chunk);
  }
}
