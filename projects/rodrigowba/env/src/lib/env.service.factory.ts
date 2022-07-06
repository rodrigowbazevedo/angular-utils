import { EnvService } from './env.service';

declare const __env: Record<string, unknown>;

export const EnvServiceFactory = () => new EnvService(__env || {});
