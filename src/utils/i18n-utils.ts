/**
 * Formats a template string by replacing placeholders with values
 * @param template The template string containing {placeholder} tokens
 * @param values Object containing key-value pairs for replacement
 * @returns Formatted string with replaced values
 */
export function formatText(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value.toString()),
    template
  );
}
