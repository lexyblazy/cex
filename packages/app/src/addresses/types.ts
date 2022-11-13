interface GenerateNewAddress {
  action: "generateNewAddresses";
  payload?: {};
}

export type AddressJobPipeline = GenerateNewAddress;
