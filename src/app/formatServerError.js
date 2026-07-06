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

  const match = message.match(/validation failed:\s*(.+)/i);
  if (!match) return message;

  const parts = match[1].split(/,\s*(?=\w+:)/);
  const labels = parts
    .map((p) => p.match(/^(\w+):/)?.[1])
    .filter(Boolean)
    .map((field) => overrides[field] || humanizeFieldName(field));

  if (!labels.length) return "Please fill in all required fields.";
  return `Please fill in the required fields: ${labels.join(", ")}.`;
}