/**
 * Session Discovery Utility
 *
 * Detects active F1 session and determines polling strategy.
 */

export type SessionType = 'practice' | 'qualifying' | 'race' | 'ended' | 'none';
export type SessionStatus = 'live' | 'ended' | 'upcoming';

export interface Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end?: string;
  gmt_offset: string;
}

const ESTIMATED_SESSION_DURATION_MS: Record<string, number> = {
  race: 4 * 60 * 60 * 1000,
  qualifying: 3 * 60 * 60 * 1000,
  practice: 2.5 * 60 * 60 * 1000,
};

const normalizeSessionType = (sessionType?: string): SessionType => {
  const normalized = sessionType?.toLowerCase() || 'none';

  if (normalized.includes('race')) return 'race';
  if (normalized.includes('qualifying')) return 'qualifying';
  if (normalized.includes('practice')) return 'practice';
  if (normalized.includes('ended')) return 'ended';

  return 'none';
};

/**
 * OpenF1 historical/latest session payloads can occasionally omit `date_end`.
 * Treating missing `date_end` as an infinitely live session causes old sessions
 * to poll forever and quickly triggers public API 429s. Use a conservative
 * session-type duration fallback instead.
 */
const getSessionEnd = (session: Session): Date => {
  if (session.date_end) {
    return new Date(session.date_end);
  }

  const start = new Date(session.date_start).getTime();
  const type = normalizeSessionType(session.session_type);
  const fallbackDuration = ESTIMATED_SESSION_DURATION_MS[type] ?? 2 * 60 * 60 * 1000;

  return new Date(start + fallbackDuration);
};

/**
 * Find the active, upcoming, or most recent completed session.
 */
export function findActiveSession(sessions: Session[]): Session | null {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  const now = new Date();

  const activeSessions = sessions.filter((session) => {
    const start = new Date(session.date_start);
    const end = getSessionEnd(session);

    return now >= start && now <= end;
  });

  if (activeSessions.length > 0) {
    const priority: Record<SessionType, number> = {
      race: 3,
      qualifying: 2,
      practice: 1,
      ended: 0,
      none: 0,
    };

    return activeSessions.sort((a, b) => {
      const priorityA = priority[normalizeSessionType(a.session_type)] ?? 0;
      const priorityB = priority[normalizeSessionType(b.session_type)] ?? 0;
      return priorityB - priorityA;
    })[0];
  }

  const upcomingSessions = sessions
    .filter((session) => {
      const start = new Date(session.date_start);
      return now < start;
    })
    .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());

  if (upcomingSessions[0]) {
    return upcomingSessions[0];
  }

  const completedSessions = sessions
    .filter((session) => getSessionEnd(session) <= now)
    .sort((a, b) => getSessionEnd(b).getTime() - getSessionEnd(a).getTime());

  return completedSessions[0] || null;
}

/**
 * Determine session status based on current time.
 */
export function getSessionStatus(session: Session | null): SessionStatus {
  if (!session) {
    return 'ended';
  }

  const now = new Date();
  const start = new Date(session.date_start);
  const end = getSessionEnd(session);

  if (now >= start && now <= end) {
    return 'live';
  }

  if (now < start) {
    return 'upcoming';
  }

  return 'ended';
}

/**
 * Get polling interval based on session type.
 */
export function getPollingInterval(sessionType: SessionType, isTabVisible: boolean = true): number {
  if (!isTabVisible) {
    return 30000;
  }

  switch (sessionType) {
    case 'race':
      return 3000;
    case 'qualifying':
      return 5000;
    case 'practice':
      return 10000;
    case 'ended':
      return 15000;
    case 'none':
    default:
      return 30000;
  }
}

/**
 * Get human-readable session name.
 */
export function getSessionName(session: Session | null): string {
  if (!session) {
    return 'No active session';
  }

  const type = normalizeSessionType(session.session_type);

  const typeMap: Record<SessionType, string> = {
    practice: 'Practice',
    qualifying: 'Qualifying',
    race: 'Race',
    ended: 'Completed Session',
    none: session.session_name || 'Session',
  };

  return typeMap[type] || session.session_name;
}

/**
 * Calculate time until session starts.
 */
export function getTimeUntilSession(session: Session): number {
  const now = new Date().getTime();
  const start = new Date(session.date_start).getTime();
  return start - now;
}

/**
 * Format countdown time.
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) {
    return 'Starting soon...';
  }

  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }

  return `${minutes}m`;
}
