/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { L2Network, NetworkCloud } from "@azure/arm-networkcloud";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to Create a new layer 2 (L2) network or update the properties of the existing network.
 *
 * @summary Create a new layer 2 (L2) network or update the properties of the existing network.
 * x-ms-original-file: specification/networkcloud/resource-manager/Microsoft.NetworkCloud/preview/2022-12-12-preview/examples/L2Networks_Create.json
 */
async function createOrUpdateL2Network() {
  const subscriptionId =
    process.env["NETWORKCLOUD_SUBSCRIPTION_ID"] || "subscriptionId";
  const resourceGroupName =
    process.env["NETWORKCLOUD_RESOURCE_GROUP"] || "resourceGroupName";
  const l2NetworkName = "l2NetworkName";
  const l2NetworkParameters: L2Network = {
    extendedLocation: {
      name:
        "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterExtendedLocationName",
      type: "CustomLocation"
    },
    hybridAksPluginType: "DPDK",
    interfaceName: "eth0",
    l2IsolationDomainId:
      "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedNetworkFabric/l2IsolationDomains/l2IsolationDomainName",
    location: "location",
    tags: { key1: "myvalue1", key2: "myvalue2" }
  };
  const credential = new DefaultAzureCredential();
  const client = new NetworkCloud(credential, subscriptionId);
  const result = await client.l2Networks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    l2NetworkName,
    l2NetworkParameters
  );
  console.log(result);
}

async function main() {
  createOrUpdateL2Network();
}

main().catch(console.error);
