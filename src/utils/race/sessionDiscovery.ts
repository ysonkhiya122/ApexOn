/**
 * Session Discovery Utility
 * 
 * Detects active F1 session and determines polling strategy.
 * 
 * CRITICAL: This is the foundation for the entire live system.
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

/**
 * Find the currently active session from sessions list.
 * 
 * Priority order:
 * 1. Race (highest priority)
 * 2. Qualifying
 * 3. Practice
 * 4. Upcoming session
 */
export function findActiveSession(sessions: Session[]): Session | null {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  const now = new Date();

  // Find currently running sessions
  const activeSessions = sessions.filter(session => {
    const start = new Date(session.date_start);
    const end = session.date_end ? new Date(session.date_end) : null;
    
    return now >= start && (!end || now <= end);
  });

  if (activeSessions.length > 0) {
    // Priority: race > qualifying > practice
    const priority = {
      race: 3,
      qualifying: 2,
      practice: 1,
    };

    return activeSessions.sort((a, b) => {
      const priorityA = priority[a.session_type as keyof typeof priority] ?? 0;
      const priorityB = priority[b.session_type as keyof typeof priority] ?? 0;
      return priorityB - priorityA;
    })[0];
  }

  // No active session, find upcoming
  const upcomingSessions = sessions.filter(session => {
    const start = new Date(session.date_start);
    return now < start;
  }).sort((a, b) => {
    return new Date(a.date_start).getTime() - new Date(b.date_start).getTime();
  });

  if (upcomingSessions[0]) {
    return upcomingSessions[0];
  }

  // No active/upcoming session from the queried set. Fall back to the most
  // recent completed session so debug and historical views still have a stable
  // session_key to render instead of appearing broken between race weekends.
  const completedSessions = sessions
    .filter((session) => {
      const end = session.date_end ? new Date(session.date_end) : new Date(session.date_start);
      return end <= now;
    })
    .sort((a, b) => {
      const endA = a.date_end ? new Date(a.date_end).getTime() : new Date(a.date_start).getTime();
      const endB = b.date_end ? new Date(b.date_end).getTime() : new Date(b.date_start).getTime();
      return endB - endA;
    });

  return completedSessions[0] || null;
}

/**
 * Determine session status based on time.
 */
export function getSessionStatus(session: Session | null): SessionStatus {
  if (!session) {
    return 'ended';
  }

  const now = new Date();
  const start = new Date(session.date_start);
  const end = session.date_end ? new Date(session.date_end) : null;

  if (now >= start && (!end || now <= end)) {
    return 'live';
  }

  if (now < start) {
    return 'upcoming';
  }

  return 'ended';
}

/**
 * Get polling interval based on session type.
 * 
 * CRITICAL: This prevents API overload while maintaining fresh data.
 */
export function getPollingInterval(sessionType: SessionType, isTabVisible: boolean = true): number {
  // Reduce polling when tab is hidden (battery saving)
  if (!isTabVisible) {
    return 30000; // 30 seconds
  }

  switch (sessionType) {
    case 'race':
      return 3000; // 3 seconds - critical updates
    case 'qualifying':
      return 5000; // 5 seconds - fast changes
    case 'practice':
      return 10000; // 10 seconds - slower changes
    case 'ended':
      return 15000; // 15 seconds - minimal updates
    case 'none':
    default:
      return 30000; // 30 seconds - waiting for session
  }
}

/**
 * Get human-readable session name.
 */
export function getSessionName(session: Session | null): string {
  if (!session) {
    return 'No active session';
  }

  const typeMap: Record<string, string> = {
    practice: 'Practice',
    qualifying: 'Qualifying',
    race: 'Race',
  };

  return typeMap[session.session_type] || session.session_name;
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
