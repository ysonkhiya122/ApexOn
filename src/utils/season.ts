/**
 * Season handling — single source of truth.
 *
 * Previously the season was hardcoded per-page and had drifted: Home fetched
 * '2026' while Drivers/Teams/Circuits fetched '2024', so the app showed two
 * different grids at once. Every season-scoped query now flows through here.
 */

/**
 * Jolpica/Ergast resolves `current` server-side to the live season, so the app
 * never goes stale on 1 January. Prefer this for "what's happening now" views.
 */
export const CURRENT_SEASON_TOKEN = 'current';

/** First season with data in the Ergast/Jolpica dataset. */
export const FIRST_SEASON = 1950;

/**
 * Calendar year, for UI that must show a concrete number (dropdown defaults,
 * headings). Falls back sensibly if the device clock is wrong.
 */
export const currentSeasonYear = (): number => {
  const year = new Date().getFullYear();
  return year >= FIRST_SEASON ? year : FIRST_SEASON;
};

export const CURRENT_SEASON = String(currentSeasonYear());

/**
 * Descending list of seasons for year pickers: newest first, back to 1950.
 * Replaces the `2026 - i` literal duplicated in Results and Schedule.
 */
export const seasonOptions = (): Array<{ label: string; value: string }> => {
  const latest = currentSeasonYear();
  return Array.from({ length: latest - FIRST_SEASON + 1 }, (_, i) => {
    const year = String(latest - i);
    return { label: year, value: year };
  });
};

export const isCurrentSeason = (season: string): boolean =>
  season === CURRENT_SEASON || season === CURRENT_SEASON_TOKEN;
