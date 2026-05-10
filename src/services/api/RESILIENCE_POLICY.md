# 🛡️ Data Resilience Policy

**Purpose:** Define application-wide handling for missing/incomplete data.

**Context:** Realtime F1 systems ALWAYS have incomplete payloads, delayed updates, and inconsistent schemas.

---

## 📋 Resilience Strategies

### Strategy 1: Fallback Values (Default)

**When:** Missing non-critical data

**Examples:**
```typescript
// Driver code missing
code: raw.code || ''

// Nationality flag missing
return flagMap[nationality] || '🏁'

// Team not available
team: undefined
```

**Use For:**
- Display names
- Optional metadata
- Non-critical UI elements

---

### Strategy 2: Skeleton UI

**When:** Data loading or temporarily unavailable

**Examples:**
```typescript
if (isLoading) {
  return <Skeleton className="h-12 w-full" />;
}
```

**Use For:**
- Initial page loads
- Data refetching
- Network delays

---

### Strategy 3: Omit Component

**When:** Data fundamentally missing (not just delayed)

**Examples:**
```typescript
if (!driver || !driver.fullName) {
  return null; // Don't render broken UI
}
```

**Use For:**
- Critical data missing
- Would show misleading information
- Better to show nothing than wrong data

---

### Strategy 4: Retry Fetch

**When:** Temporary network failure

**Implementation:**
```typescript
// RTK Query handles this automatically
{
  retry: 3, // 3 retry attempts
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
}
```

**Use For:**
- Network timeouts
- Temporary API failures
- Intermittent connectivity

---

## 📊 Decision Matrix

| Data Type | Missing Data Strategy | Fallback |
|-----------|----------------------|----------|
| **Driver Name** | Fallback Value | "Unknown Driver" |
| **Driver Code** | Fallback Value | "" (empty string) |
| **Nationality** | Fallback Value | "Unknown" |
| **Nationality Flag** | Fallback Value | "🏁" |
| **Team Name** | Fallback Value | "Unknown Team" |
| **Position** | Omit Component | Hide from standings |
| **Points** | Fallback Value | 0 |
| **Lap Time** | Skeleton UI | Show loading |
| **Telemetry** | Omit Component | Hide gauge |
| **Race Control** | Retry Fetch | Poll again |
| **Weather** | Fallback Value | Last known value |
| **Session Status** | Retry Fetch | Poll again |

---

## 🎯 Critical vs Non-Critical Data

### Critical (Never Show Wrong Data)
- Race position
- Session status (live/completed)
- Safety car/VSC status
- Driver identity

**Strategy:** Omit or Retry, NEVER guess

### Non-Critical (Safe to Fallback)
- Driver code
- Nationality flag
- Team colors
- Statistics

**Strategy:** Fallback values acceptable

---

## 🔄 Realtime-Specific Policies

### Policy 1: Stale Data is Better Than No Data

For live timing:
```typescript
// Keep showing last known position
// Even if update is 5s old
const leaderboard = useLiveLeaderboard(); // Shows stale data gracefully
```

### Policy 2: Graceful Degradation on Connection Loss

```typescript
// When offline:
// 1. Show last known state
// 2. Display "Connection lost" indicator
// 3. Auto-reconnect when back online
```

### Policy 3: Prioritize Critical Updates

```typescript
// Race control messages: Always show immediately
// Telemetry updates: Can be delayed/throttled
// Weather updates: Low priority, can be stale
```

---

## 📝 Implementation Guidelines

### DO:
- ✅ Use fallback values for non-critical data
- ✅ Show skeleton for loading states
- ✅ Omit components for critical missing data
- ✅ Retry failed requests automatically
- ✅ Display "last updated" timestamps
- ✅ Show connection status indicators

### DO NOT:
- ❌ Show "Unknown" for everything
- ❌ Crash on missing data
- ❌ Display stale data without timestamp
- ❌ Hide connection issues from user
- ❌ Retry infinitely (use max attempts)
- ❌ Guess critical data (positions, status)

---

## 🔧 RTK Query Configuration

```typescript
export const jolpicaService = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getLiveTiming: builder.query({
      query: () => '/live-timing',
      transformResponse: (response) => transformLiveTiming(response),
      // Resilience config
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    }),
  }),
});
```

---

## 🚨 Error Boundaries

For critical failures:
```typescript
<ErrorBoundary fallback={<ErrorMessage />}>
  <LiveTimingComponent />
</ErrorBoundary>
```

---

**Last Updated:** 2026-02-XX  
**Maintained By:** Development Team  
**Review Cadence:** Per major feature addition
