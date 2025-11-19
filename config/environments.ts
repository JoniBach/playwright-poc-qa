/**
 * Environment Configuration
 */

export type Environment = 'local' | 'dev' | 'staging' | 'production';

export interface EnvironmentConfig {
  baseURL: string;
  apiURL?: string;
  timeout: number;
  retries: number;
}

export const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    baseURL: 'http://localhost:5173',
    timeout: 30000,
    retries: 0
  },
  dev: {
    baseURL: 'https://dev.example.com',
    apiURL: 'https://api-dev.example.com',
    timeout: 30000,
    retries: 1
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://api-staging.example.com',
    timeout: 30000,
    retries: 2
  },
  production: {
    baseURL: 'https://example.com',
    apiURL: 'https://api.example.com',
    timeout: 30000,
    retries: 2
  }
};

export function getEnvironmentConfig(env?: string): EnvironmentConfig {
  const environment = (env || process.env.TEST_ENV || 'local') as Environment;
  return environments[environment] || environments.local;
}
