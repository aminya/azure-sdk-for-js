/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { Consoles } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { NetworkCloud } from "../networkCloud";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl";
import {
  Console,
  ConsolesListByResourceGroupNextOptionalParams,
  ConsolesListByResourceGroupOptionalParams,
  ConsolesListByResourceGroupResponse,
  ConsolesGetOptionalParams,
  ConsolesGetResponse,
  ConsolesCreateOrUpdateOptionalParams,
  ConsolesCreateOrUpdateResponse,
  ConsolesDeleteOptionalParams,
  ConsolesUpdateOptionalParams,
  ConsolesUpdateResponse,
  ConsolesListByResourceGroupNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing Consoles operations. */
export class ConsolesImpl implements Consoles {
  private readonly client: NetworkCloud;

  /**
   * Initialize a new instance of the class Consoles class.
   * @param client Reference to the service client
   */
  constructor(client: NetworkCloud) {
    this.client = client;
  }

  /**
   * Get a list of virtual machine consoles in the provided resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param options The options parameters.
   */
  public listByResourceGroup(
    resourceGroupName: string,
    virtualMachineName: string,
    options?: ConsolesListByResourceGroupOptionalParams
  ): PagedAsyncIterableIterator<Console> {
    const iter = this.listByResourceGroupPagingAll(
      resourceGroupName,
      virtualMachineName,
      options
    );
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listByResourceGroupPagingPage(
          resourceGroupName,
          virtualMachineName,
          options,
          settings
        );
      }
    };
  }

  private async *listByResourceGroupPagingPage(
    resourceGroupName: string,
    virtualMachineName: string,
    options?: ConsolesListByResourceGroupOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<Console[]> {
    let result: ConsolesListByResourceGroupResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._listByResourceGroup(
        resourceGroupName,
        virtualMachineName,
        options
      );
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listByResourceGroupNext(
        resourceGroupName,
        virtualMachineName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listByResourceGroupPagingAll(
    resourceGroupName: string,
    virtualMachineName: string,
    options?: ConsolesListByResourceGroupOptionalParams
  ): AsyncIterableIterator<Console> {
    for await (const page of this.listByResourceGroupPagingPage(
      resourceGroupName,
      virtualMachineName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Get a list of virtual machine consoles in the provided resource group.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param options The options parameters.
   */
  private _listByResourceGroup(
    resourceGroupName: string,
    virtualMachineName: string,
    options?: ConsolesListByResourceGroupOptionalParams
  ): Promise<ConsolesListByResourceGroupResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, virtualMachineName, options },
      listByResourceGroupOperationSpec
    );
  }

  /**
   * Get properties of the provided virtual machine console.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    options?: ConsolesGetOptionalParams
  ): Promise<ConsolesGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, virtualMachineName, consoleName, options },
      getOperationSpec
    );
  }

  /**
   * Create a new virtual machine console or update the properties of the existing virtual machine
   * console.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param consoleParameters The request body.
   * @param options The options parameters.
   */
  async beginCreateOrUpdate(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    consoleParameters: Console,
    options?: ConsolesCreateOrUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<ConsolesCreateOrUpdateResponse>,
      ConsolesCreateOrUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<ConsolesCreateOrUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: {
        resourceGroupName,
        virtualMachineName,
        consoleName,
        consoleParameters,
        options
      },
      spec: createOrUpdateOperationSpec
    });
    const poller = await createHttpPoller<
      ConsolesCreateOrUpdateResponse,
      OperationState<ConsolesCreateOrUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "azure-async-operation"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Create a new virtual machine console or update the properties of the existing virtual machine
   * console.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param consoleParameters The request body.
   * @param options The options parameters.
   */
  async beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    consoleParameters: Console,
    options?: ConsolesCreateOrUpdateOptionalParams
  ): Promise<ConsolesCreateOrUpdateResponse> {
    const poller = await this.beginCreateOrUpdate(
      resourceGroupName,
      virtualMachineName,
      consoleName,
      consoleParameters,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Delete the provided virtual machine console.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    options?: ConsolesDeleteOptionalParams
  ): Promise<SimplePollerLike<OperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, virtualMachineName, consoleName, options },
      spec: deleteOperationSpec
    });
    const poller = await createHttpPoller<void, OperationState<void>>(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Delete the provided virtual machine console.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    options?: ConsolesDeleteOptionalParams
  ): Promise<void> {
    const poller = await this.beginDelete(
      resourceGroupName,
      virtualMachineName,
      consoleName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Patch the properties of the provided virtual machine console, or update the tags associated with the
   * virtual machine console. Properties and tag updates can be done independently.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param options The options parameters.
   */
  async beginUpdate(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    options?: ConsolesUpdateOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<ConsolesUpdateResponse>,
      ConsolesUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<ConsolesUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { resourceGroupName, virtualMachineName, consoleName, options },
      spec: updateOperationSpec
    });
    const poller = await createHttpPoller<
      ConsolesUpdateResponse,
      OperationState<ConsolesUpdateResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Patch the properties of the provided virtual machine console, or update the tags associated with the
   * virtual machine console. Properties and tag updates can be done independently.
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param consoleName The name of the virtual machine console.
   * @param options The options parameters.
   */
  async beginUpdateAndWait(
    resourceGroupName: string,
    virtualMachineName: string,
    consoleName: string,
    options?: ConsolesUpdateOptionalParams
  ): Promise<ConsolesUpdateResponse> {
    const poller = await this.beginUpdate(
      resourceGroupName,
      virtualMachineName,
      consoleName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * ListByResourceGroupNext
   * @param resourceGroupName The name of the resource group. The name is case insensitive.
   * @param virtualMachineName The name of the virtual machine.
   * @param nextLink The nextLink from the previous successful call to the ListByResourceGroup method.
   * @param options The options parameters.
   */
  private _listByResourceGroupNext(
    resourceGroupName: string,
    virtualMachineName: string,
    nextLink: string,
    options?: ConsolesListByResourceGroupNextOptionalParams
  ): Promise<ConsolesListByResourceGroupNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, virtualMachineName, nextLink, options },
      listByResourceGroupNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listByResourceGroupOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/virtualMachines/{virtualMachineName}/consoles",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ConsoleList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.virtualMachineName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/virtualMachines/{virtualMachineName}/consoles/{consoleName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.Console
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.virtualMachineName,
    Parameters.consoleName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/virtualMachines/{virtualMachineName}/consoles/{consoleName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.Console
    },
    201: {
      bodyMapper: Mappers.Console
    },
    202: {
      bodyMapper: Mappers.Console
    },
    204: {
      bodyMapper: Mappers.Console
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.consoleParameters,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.virtualMachineName,
    Parameters.consoleName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/virtualMachines/{virtualMachineName}/consoles/{consoleName}",
  httpMethod: "DELETE",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.virtualMachineName,
    Parameters.consoleName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const updateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetworkCloud/virtualMachines/{virtualMachineName}/consoles/{consoleName}",
  httpMethod: "PATCH",
  responses: {
    200: {
      bodyMapper: Mappers.Console
    },
    201: {
      bodyMapper: Mappers.Console
    },
    202: {
      bodyMapper: Mappers.Console
    },
    204: {
      bodyMapper: Mappers.Console
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.consoleUpdateParameters,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.virtualMachineName,
    Parameters.consoleName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const listByResourceGroupNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ConsoleList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  urlParameters: [
    Parameters.$host,
    Parameters.nextLink,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.virtualMachineName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
