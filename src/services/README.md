# 📡 APexOn Services Layer

**Purpose:** Centralized data access layer with proper separation of concerns.

---

## 🏗️ Architecture

```
services/
├── api/
│   ├── types/           # Type definitions
│   │   ├── base.types.ts      # Raw API types (internal only)
│   │   ├── normalized.types.ts # Normalized models (for components)
│   │   └── index.ts
│   │
│   ├── adapters/        # Data transformers
│   │   ├── driver.adapter.ts   # Driver transformations
│   │   ├── team.adapter.ts     # Team transformations
│   │   ├── race.adapter.ts     # Race transformations
│   │   └── index.ts
│   │
│   └── README.md
│
└── index.ts             # Main export
```

---

## 🎯 Key Principles

### 1. Components Never Know Raw API Shapes

#### ❌ BEFORE (Bad):

```typescript
// Component knows API structure
const driver = data.MRData.DriverTable.Drivers[0];
return <div>{driver.givenName} {driver.familyName}</div>;
```

#### ✅ AFTER (Good):

```typescript
// Component knows normalized model
const driver = useDriver(id); // Returns normalized Driver
return <div>{driver.fullName}</div>;
```

---

### 2. All Transformations in Adapters

#### ❌ BEFORE (Bad):

```typescript
// Component does transformation
const fullName = `${driver.givenName} ${driver.familyName}`;
const points = parseFloat(driver.points);
```

#### ✅ AFTER (Good):

```typescript
// Adapter does transformation
const driver = transformDriver(rawDriver);
// driver.fullName already formatted
// driver.points already parsed
```

---

### 3. Centralized Formatting Logic

#### ❌ BEFORE (Bad):

```typescript
// Each component formats differently
component1: `${d.givenName} ${d.familyName}`;
component2: `${driver.givenName}  ${driver.familyName}`;
component3: `${data.givenName} ${data.familyName}`;
```

#### ✅ AFTER (Good):

```typescript
// Single source of truth
formatDriverName(driver, 'full'); // "Max Verstappen"
formatDriverName(driver, 'last'); // "Verstappen"
formatDriverName(driver, 'code'); // "VER"
```

---

## 📖 Usage Examples

### Example 1: Fetching Drivers

```typescript
// ✅ GOOD - Using services layer
import { useGetDriversQuery } from '@/services';
import { transformDrivers } from '@/services';

const { data } = useGetDriversQuery('2024');
const drivers = transformDrivers(data?.MRData?.DriverTable?.Drivers || []);

// drivers is now normalized Driver[]
drivers[0].fullName; // "Max Verstappen"
```

### Example 2: Driver Card Component

```typescript
// ✅ GOOD - Component only knows normalized types
import { Driver } from '@/services';

interface DriverCardProps {
  driver: Driver; // Normalized model
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  return (
    <div>
      <h3>{driver.fullName}</h3> {/* Already formatted */}
      <p>{driver.nationality}</p>
      <span>#{driver.number}</span>
    </div>
  );
};
```

### Example 3: Custom Hook with Transformation

```typescript
// ✅ GOOD - Hook handles transformation
import { useGetDriversQuery } from '@/services';
import { transformDrivers } from '@/services';

export const useDrivers = (year: string) => {
  const { data, isLoading, isError } = useGetDriversQuery(year);

  const drivers = useMemo(() => {
    return transformDrivers(data?.MRData?.DriverTable?.Drivers || []);
  }, [data]);

  return { drivers, isLoading, isError };
};

// Component usage:
const { drivers } = useDrivers('2024');
// drivers is normalized Driver[]
```

---

## 🔧 Available Adapters

### Driver Adapter

| Function                    | Purpose          | Input             | Output           |
| --------------------------- | ---------------- | ----------------- | ---------------- |
| `transformDriver()`         | Single driver    | `JolpicaDriver`   | `Driver`         |
| `transformDrivers()`        | Multiple drivers | `JolpicaDriver[]` | `Driver[]`       |
| `transformDriverStanding()` | Standing entry   | `JolpicaStanding` | `DriverStanding` |
| `calculateDriverStats()`    | Career stats     | `JolpicaResult[]` | `DriverStats`    |
| `formatDriverName()`        | Name formatting  | `Driver, format`  | `string`         |
| `getNationalityFlag()`      | Flag emoji       | `nationality`     | `string`         |

### Team Adapter

| Function                         | Purpose         | Input                  | Output                |
| -------------------------------- | --------------- | ---------------------- | --------------------- |
| `transformTeam()`                | Single team     | `JolpicaConstructor`   | `Team`                |
| `transformTeams()`               | Multiple teams  | `JolpicaConstructor[]` | `Team[]`              |
| `transformConstructorStanding()` | Standing entry  | `JolpicaStanding`      | `ConstructorStanding` |
| `formatTeamName()`               | Name formatting | `Team, format`         | `string`              |

### Race Adapter

| Function                | Purpose         | Input            | Output       |
| ----------------------- | --------------- | ---------------- | ------------ |
| `transformCircuit()`    | Single circuit  | `JolpicaCircuit` | `Circuit`    |
| `transformRace()`       | Single race     | `JolpicaRace`    | `Race`       |
| `transformRaceResult()` | Race result     | `JolpicaResult`  | `RaceResult` |
| `formatRaceDate()`      | Date formatting | `date, format`   | `string`     |
| `formatLapTime()`       | Lap time format | `timeMs`         | `string`     |
| `formatRaceTime()`      | Time formatting | `time, timezone` | `string`     |

---

## 📝 Migration Guide

### Step 1: Import from Services

**Before:**

```typescript
import { useGetDriversQuery } from '../../../store/services/jolpicaService';
```

**After:**

```typescript
import { useGetDriversQuery } from '@/services';
```

### Step 2: Use Adapters

**Before:**

```typescript
const drivers = data.MRData.DriverTable.Drivers;
const fullName = `${drivers[0].givenName} ${drivers[0].familyName}`;
```

**After:**

```typescript
const drivers = transformDrivers(data.MRData.DriverTable.Drivers);
const fullName = drivers[0].fullName;
```

### Step 3: Use Normalized Types

**Before:**

```typescript
interface Props {
  driver: any; // Raw API object
}
```

**After:**

```typescript
import { Driver } from '@/services';

interface Props {
  driver: Driver; // Normalized model
}
```

---

## 🎯 Benefits

| Benefit             | Description                                    |
| ------------------- | ---------------------------------------------- |
| **Type Safety**     | Full TypeScript support with normalized models |
| **Maintainability** | Changes to API structure only affect adapters  |
| **Consistency**     | Single source of truth for formatting          |
| **Testability**     | Adapters can be unit tested independently      |
| **Scalability**     | Easy to add new data sources                   |
| **Backend Ready**   | Easy to swap API sources when backend is built |

---

## 🚀 Next Steps

After this refactor is complete:

1. **Backend Migration**: When backend is built, only adapters need updating
2. **Caching Layer**: Add Redis caching without touching components
3. **Real-time Data**: Add WebSocket support alongside REST
4. **Offline Support**: Add service worker with cached normalized data

---

**Last Updated:** 2026-02-XX  
**Maintained By:** Development Team
