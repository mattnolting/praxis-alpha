/**
 * YAML Config Loader - Clean, focused YAML file loading
 * Replaces mock data with real project configs
 */

import { readFile } from 'fs/promises';
import { parse } from 'yaml';

/**
 * Load a single YAML config file
 */
export async function loadYamlConfig(filePath: string): Promise<any> {
  try {
    const yamlContent = await readFile(filePath, 'utf8');
    return parse(yamlContent);
  } catch (error) {
    console.warn(`⚠️ Could not load YAML config: ${filePath}`);
    return null;
  }
}

/**
 * Load multiple YAML configs into a Map for semantic engine
 */
export async function loadYamlConfigs(configPaths: Record<string, string>): Promise<Map<string, any>> {
  const configMap = new Map<string, any>();
  
  for (const [key, filePath] of Object.entries(configPaths)) {
    const config = await loadYamlConfig(filePath);
    if (config) {
      configMap.set(key, config);
    }
  }
  
  return configMap;
}

/**
 * Default config paths for a typical praxis project
 */
export const defaultConfigPaths = {
  'root': './praxis.config.yaml',
  'components': './src/components/praxis.config.yaml',
  'button': './src/components/Button/praxis.config.yaml'
};

/**
 * Load default praxis configs
 */
export async function loadPraxisConfigs(): Promise<Map<string, any>> {
  return loadYamlConfigs(defaultConfigPaths);
}
