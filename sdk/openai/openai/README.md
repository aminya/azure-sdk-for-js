# OpenAI REST client library for JavaScript

The Azure OpenAI client library for JavaScript is an adaptation of OpenAI's REST APIs that provides an idiomatic interface
and rich integration with the rest of the Azure SDK ecosystem. It can connect to Azure OpenAI resources *or* to the
non-Azure OpenAI inference endpoint, making it a great choice for even non-Azure OpenAI development.

Use the client library for Azure OpenAI to:

* [Create a completion for text][msdocs_openai_completion]
* [Create a chat completion with ChatGPT][msdocs_openai_chat_completion]
* [Create a text embedding for comparisons][msdocs_openai_embedding]

Azure OpenAI is a managed service that allows developers to deploy, tune, and generate content from OpenAI models on Azure resources.

**Please rely heavily on our [REST client docs](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/rest-clients.md) to use this library**

Key links:

- [Package (NPM)](https://www.npmjs.com/package/@azure/ai-openai)

## Getting started

```javascript
const { OpenAIClient } = require("@azure/ai-openai");
const { AzureKeyCredential } = require("@azure/core-auth");

const client = new OpenAIClient(
  "https://<resource name>.openai.azure.com/", 
  new AzureKeyCredential("<Azure API key>")
);
const { id, created, choices, usage } = await client.getCompletions("<deployment ID>", "YOUR PROMPT HERE");
```

### Currently supported environments

- LTS versions of Node.js

### Prerequisites

- You must have an [Azure subscription](https://azure.microsoft.com/free/) to use this package.

### Install the `@azure/ai-openai` package

Install the OpenAI REST client REST client library for JavaScript with `npm`:

```bash
npm install @azure/ai-openai
```

### Create and authenticate a `OpenAIClient`

To use an [Azure Active Directory (AAD) token credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-with-a-pre-fetched-access-token),
provide an instance of the desired credential type obtained from the
[@azure/identity](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#credentials) library.

To authenticate with AAD, you must first `npm` install [`@azure/identity`](https://www.npmjs.com/package/@azure/identity) 

After setup, you can choose which type of [credential](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#credentials) from `@azure/identity` to use.
As an example, [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential)
can be used to authenticate the client.

Set the values of the client ID, tenant ID, and client secret of the AAD application as environment variables:
AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET

```js
const { OpenAIClient } = require("@azure/ai-openai");
const { DefaultAzureCredential } = require("@azure/identity");

const client = new OpenAIClient("<endpoint>", new DefaultAzureCredential());
```

## Key concepts

The main concept to understand is [Completions][azure_openai_completions_docs]. Briefly explained, completions provides its functionality in the form of a text prompt, which by using a specific [model](https://learn.microsoft.com/azure/cognitive-services/openai/concepts/models), will then attempt to match the context and patterns, providing an output text. The following code snippet provides a rough overview:

```javascript
const client = new OpenAIClient(
        "https://your-azure-openai-resource.com/",
        new AzureKeyCredential("your-azure-openai-resource-api-key"));

const { id, created, choices, usage } = await client.getCompletions(
    "text-davinci-003", // assumes a matching model deployment or model name
    "Hello, world!");

for (const choice of choices)
{
    console.log(choice.text);
}
```

## Examples

You can familiarize yourself with different APIs using [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai/samples/v1-beta).

### Generate Chatbot Response

The `GenerateChatbotResponse` method authenticates using a DefaultAzureCredential, then generates text responses to input prompts.

```javascript
const endpoint = "https://myaccount.openai.azure.com/";
const client = new OpenAIClient(endpoint, new DefaultAzureCredential());

const deploymentName = "text-davinci-003";
const prompt = "What is Azure OpenAI?";
console.log(`Input: ${prompt}`);

const { id, created, choices, usage } = await client.getCompletions(deploymentName, prompt);
const completion = choices?.[0].text;
console.log(`Chatbot: ${completion}\n`);
```

## Troubleshooting

### Logging

Enabling logging may help uncover useful information about failures. In order to see a log of HTTP requests and responses, set the `AZURE_LOG_LEVEL` environment variable to `info`. Alternatively, logging can be enabled at runtime by calling `setLogLevel` in the `@azure/logger`:

```javascript
const { setLogLevel } = require("@azure/logger");

setLogLevel("info");
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).


<!-- LINKS -->
[msdocs_openai_completion]: https://learn.microsoft.com/azure/cognitive-services/openai/how-to/completions
[msdocs_openai_chat_completion]: https://learn.microsoft.com/azure/cognitive-services/openai/how-to/chatgpt
[msdocs_openai_embedding]: https://learn.microsoft.com/azure/cognitive-services/openai/concepts/understand-embeddings
[azure_openai_completions_docs]: https://learn.microsoft.com/azure/cognitive-services/openai/how-to/completions
[azure_openai_embeddings_docs]: https://learn.microsoft.com/azure/cognitive-services/openai/concepts/understand-embeddings
