export type RepoStats = { stars: number; updated: string };

export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, name] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// Public repo stats from the GitHub API, cached for an hour. Returns null for private
// repos or when GitHub is unreachable. Set GITHUB_TOKEN to avoid the anonymous rate limit.
export async function getRepoStats(repo?: string): Promise<RepoStats | null> {
  if (!repo) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-site",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const d = (await res.json()) as { stargazers_count?: number; pushed_at?: string };
    if (!d.pushed_at) return null;
    return { stars: d.stargazers_count ?? 0, updated: timeAgo(d.pushed_at) };
  } catch {
    return null;
  }
}
