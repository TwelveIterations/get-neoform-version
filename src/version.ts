import { minimatch } from 'minimatch'

export async function findNeoFormVersion(options: {
  version: string
}): Promise<string | undefined> {
  const { version: versionSearch } = options
  if (!versionSearch || typeof versionSearch !== 'string') {
    throw new Error('version is not a string')
  }

  const response = await fetch(
    'https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoform'
  )
  const json = (await response.json()) as { versions: string[] }
  if (!response.ok) {
    throw new Error(
      `NeoForm API request failed: ${response.status} ${response.statusText}`
    )
  }

  const versions = json.versions.filter((it) => minimatch(it, versionSearch))
  if (versions.length === 0) {
    return undefined
  }

  return versions[versions.length - 1]
}
