import type { TemplateContext } from './context.js';

export const renderTemplate = (
  template: string,
  context: TemplateContext,
): string =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = (context as Record<string, string | undefined>)[key];
    return val !== undefined ? val : `{{${key}}}`;
  });

export const renderFileContent = (
  content: string,
  context: TemplateContext,
): string => renderTemplate(content, context);
