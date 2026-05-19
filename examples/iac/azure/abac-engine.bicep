// ARCH-IAM-RBAC-ABAC-ENGINE — Azure reference pattern (Bicep).
//
// Cerbos PDP runs as a Container App. APIM policies invoke the PDP for
// every API call before the backend handler. Policy bundles stored in
// Azure Storage with immutable blob policy.
//
// Authority crosswalk: ISO 27001 A.5.15-18, SOC 2 CC6.3, GDPR Art. 25,
//                      EU AI Act Art. 14.
// Apache-2.0.

param location string = resourceGroup().location
param policyBundleStorageAccountName string
param containerAppEnvId string

resource policyStorage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: policyBundleStorageAccountName
  location: location
  sku: { name: 'Standard_GRS' }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
    encryption: {
      services: { blob: { enabled: true, keyType: 'Account' } }
      keySource: 'Microsoft.Storage'
    }
  }
}

resource policyContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${policyStorage.name}/default/policies'
  properties: { publicAccess: 'None' }
}

// Immutable blob lock — policy bundle becomes WORM after upload.
resource policyImmutability 'Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies@2023-01-01' = {
  name: '${policyContainer.name}/default'
  properties: {
    immutabilityPeriodSinceCreationInDays: 365
    allowProtectedAppendWrites: false
  }
}

resource cerbosPdp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'cta-cerbos-pdp'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnvId
    configuration: {
      ingress: {
        external: false
        targetPort: 3593
        transport: 'http'
      }
    }
    template: {
      containers: [{
        name: 'cerbos'
        image: 'ghcr.io/cerbos/cerbos:latest'
        resources: { cpu: 1, memory: '2Gi' }
      }]
      scale: { minReplicas: 2, maxReplicas: 10 }
    }
  }
}

output evidenceConfigurationId string = 'EV-CFG-${cerbosPdp.name}'
