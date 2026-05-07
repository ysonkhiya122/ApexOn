# APexOn API Layer

## Overview

This directory contains the API abstraction layer for APexOn. It provides:

1. **Type definitions** for all API responses
2. **Client abstraction** for external API calls
3. **Future backend proxy** integration points

## Current Architecture

```
External APIs (Jolpica, OpenF1)
         ↓
RTK Query Services (src/store/services/)
         ↓
API Client Layer (src/api/) ← Future backend proxy integration point
         ↓
Modules (src/modules/)
```

## Migration Path (Phase 8+)

### Current State
- Direct external API calls via RTK Query
- No authentication required
- No rate limiting on frontend

### Future State (Backend Proxy)
1. Create internal backend API
2. Update `src/api/client.ts` base URLs to point to internal backend
3. Backend handles:
   - External API proxying
   - Rate limiting
   - Caching
   - Authentication (if needed)
   - AI key protection

### Steps to Enable Backend Proxy

1. Update `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

2. Modify `src/api/client.ts`:
   ```typescript
   private getBaseUrl(): string {
     return import.meta.env.VITE_API_BASE_URL || this.getExternalBaseUrl();
   }
   ```

3. Backend implements same response format as external APIs

## Type Safety

All API responses are typed in `src/api/types.ts`. Use these types for:
- Component props
- Redux state
- Service responses

## Error Handling

All API errors are caught and normalized. Components should handle:
- Loading states
- Error states
- Empty states
- Timeout scenarios
