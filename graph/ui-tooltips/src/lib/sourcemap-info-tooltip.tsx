import { type ReactNode } from 'react';
import { ExternalLink } from './external-link';

export interface SourcemapInfoToolTipProps {
  propertyKey: string;
  plugin: string;
  file: string;
  children?: ReactNode | ReactNode[];
}

export function SourcemapInfoToolTip({
  propertyKey,
  plugin,
  file,
  children,
}: SourcemapInfoToolTipProps) {
  // Target property key is in the form `target.${targetName}`
  // Every other property within in the target has the form `target.${targetName}.${propertyName}
  const isTarget = propertyKey.split('.').length === 2;

  const docsUrlSlug: string | undefined = plugin.startsWith('@nx/')
    ? plugin.replace('@nx/', '').split('/')[0]
    : undefined;

  return (
    <div className="text-sm text-slate-700 dark:text-slate-400 max-w-md sm:max-w-full">
      <div className="flex flex-col font-mono border-b py-2">
        <p className="flex grow items-center gap-2">
          <span className="font-bold">{isTarget ? 'Created' : 'Set'} by:</span>
          <span className="inline-flex grow justify-between items-center">
            {docsUrlSlug ? (
              <ExternalLink
                text={plugin}
                href={`https://nx.dev/nx-api/${docsUrlSlug}`}
              />
            ) : (
              `${plugin}`
            )}
          </span>
        </p>
        <p>
          <span className="font-bold">From:</span> {file}
        </p>
      </div>
      <div className="flex py-2">
        <p className={`flex flex-col gap-1`}>
          <ExternalLink
            text="Learn more about how projects are configured"
            href="https://nx.dev/concepts/inferred-tasks"
          />
        </p>
      </div>
    </div>
  );
}
