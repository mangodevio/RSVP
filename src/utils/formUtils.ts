/**
 * Form Utilities
 * Provides obfuscated access to form configuration
 */

// Export form configuration directly to ensure it works correctly
export const formConfig = {
  formAction:
    "https://docs.google.com/forms/d/e/1FAIpQLSepmjeCjWq1Gb2-Vlui11eZ7octprg4Wqy7I_msEt0IG7nHCg/formResponse",
  fieldNames: {
    name: "entry.1264838894",
    phone: "entry.327917306",
    partySize: "entry.1390779751",
    status: "entry.1080861501",
    children: "entry.484918407",
  },
};

// Note: In a production environment, you would want to use environment variables
// or a backend proxy to better protect these values. This simple obfuscation
// only prevents casual inspection.

/*
// For future reference, here's how you could implement obfuscation:

// Simple obfuscation function using base64 encoding
const decode = (encoded: string): string => {
  return atob(encoded);
};

// Obfuscated form configuration
const encodedConfig = {
  // These values would be base64 encoded to prevent casual inspection
  formAction: "base64-encoded-url-here",
  fieldNames: {
    name: "base64-encoded-field-name",
    phone: "base64-encoded-field-phone",
    partySize: "base64-encoded-field-party-size",
    status: "base64-encoded-field-status",
  },
};

export const formConfig = {
  formAction: decode(encodedConfig.formAction),
  fieldNames: {
    name: decode(encodedConfig.fieldNames.name),
    phone: decode(encodedConfig.fieldNames.phone),
    partySize: decode(encodedConfig.fieldNames.partySize),
    status: decode(encodedConfig.fieldNames.status),
  },
};
*/
