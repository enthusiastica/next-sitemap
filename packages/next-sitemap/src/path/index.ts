/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type {
  ISitemapChunk,
  IConfig,
  IRuntimePaths,
  ISitemapField,
} from '../interface'
import minimist from 'minimist'
import fs from 'node:fs/promises'
import path from 'node:path'
import { generateUrl } from '../url'

/**
 * Return absolute path from path segments
 * @param pathSegment
 * @returns
 */
export const getPath = (...pathSegment: string[]): string => {
  return path.resolve(process.cwd(), ...pathSegment)
}

/**
 * Resolve sitemap chunk path
 * @param indexSitemapPath
 * @param chunks
 * @param config
 * @returns
 */
export const resolveSitemapChunks = (
  indexSitemapPath: string,
  chunks: ISitemapField[][],
  config: IConfig
): ISitemapChunk[] => {
  // Base directory of export folder
  const folder = path.dirname(indexSitemapPath)

  return chunks.map((chunk, index) => {
    const filename = `${config.sitemapBaseFileName}-${index}.xml`

    return {
      path: `${folder}/${filename}`,
      fields: chunk,
      filename,
    }
  })
}

/**
 * Return all runtime paths
 * @param config
 * @returns
 */
export const getRuntimePaths = (config: IConfig): IRuntimePaths => {
  return {
    BUILD_MANIFEST: getPath(config.sourceDir!, 'build-manifest.json'),
    PRERENDER_MANIFEST: getPath(config.sourceDir!, 'prerender-manifest.json'),
    ROUTES_MANIFEST: getPath(config.sourceDir!, 'routes-manifest.json'),
    EXPORT_MARKER: getPath(config.sourceDir!, 'export-marker.json'),
    ROBOTS_TXT_FILE: getPath(config.outDir!, 'robots.txt'),
    SITEMAP_INDEX_FILE: getPath(
      config.outDir!,
      `${config.sitemapBaseFileName}.xml`
    ),
    SITEMAP_INDEX_URL: generateUrl(
      config?.siteUrl,
      `${config.sitemapBaseFileName}.xml`
    ),
  }
}

/**
 * Get config file path
 * @returns
 */
export const getConfigFilePath = async () => {
  // Extract args from command
  const args = minimist(process.argv.slice(2))

  // Config file path
  const configPath = getPath(args.config || 'next-sitemap.js')

  // Check file stat
  return fs
    .stat(configPath)
    .then(() => configPath)
    .catch(() => {
      throw new Error(`${configPath} does not exist.`)
    })
}
