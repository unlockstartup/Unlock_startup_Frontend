function humanizeFieldName(field) {
  return field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatServerError(message, overrides = {}) {
  if (!message) return "Something went wrong. Please try again.";

  // Mongoose errors often contain newlines — use [\s\S] instead of .
  const match = message.match(/validation failed:\s*([\s\S]*)/i);
  if (!match) {
    return message.length > 150
      ? "Something went wrong. Please review your entries and try again."
      : message;
  }

  const errorBlock = match[1].trim();

  // Extract field names from "Path 'fieldName' is required"
  const pathMatches = [...errorBlock.matchAll(/Path\s+['"`]([^'"`]+)['"`]\s+is required/g)];
  let labels = pathMatches
    .map((m) => m[1])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
    .map((field) => overrides[field] || humanizeFieldName(field));

  // Fallback: look for "fieldName: ..." at the start of a line
  if (!labels.length) {
    const fieldMatches = [...errorBlock.matchAll(/^([a-zA-Z_]\w*):/gm)];
    labels = fieldMatches
      .map((m) => m[1])
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((field) => overrides[field] || humanizeFieldName(field));
  }

  if (!labels.length) return "Please fill in all required fields.";
  if (labels.length === 1) return `Please fill in the required field: ${labels[0]}.`;
  if (labels.length <= 4) return `Please fill in the required fields: ${labels.join(", ")}.`;

  return `Please fill in all required fields. ${labels.length} fields are missing.`;
}