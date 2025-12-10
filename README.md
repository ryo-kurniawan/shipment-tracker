# 🚚 Transport Shipment Tracker

A modern, responsive web application for tracking and managing transport shipments. Built with Vue 3, TypeScript, and Pinia, featuring real-time status updates and intelligent transporter assignment.

## 📋 Overview

This application provides a comprehensive solution for managing shipments and transporters with the following key features:

### ✨ Core Features

- **📦 Shipment Management**: View, track, and manage all shipments in a responsive grid layout
- **🚗 Transporter Assignment**: Assign transporters to shipments with intelligent validation
- **🔄 Real-Time Updates**: Optional real-time status update simulation (5-second intervals)
- **✅ Business Rule Validation**:
  - Vehicle type matching between shipments and transporters
  - Prevent double-booking transporters
  - Status-based assignment restrictions
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🔔 Toast Notifications**: Visual feedback for status changes and operations
- **🧪 Comprehensive Testing**: 27 unit tests covering all business logic

### 🎯 Status Workflow

```
not-assigned → assigned → in-transit → delivered
                  ↓
              cancelled
```

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: Vue 3 with Composition API (`<script setup>`)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **Mock API**: Mirage.js
- **Testing**: Vitest
- **Build Tool**: Vite

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ShipmentCard.vue
│   ├── StatusBadge.vue
│   └── StatusUpdateNotification.vue
├── mocks/              # Mock API server and data
│   ├── server.ts       # Mirage.js configuration
│   └── data.ts         # Sample data
├── stores/             # Pinia state management
│   └── shipmentStore.ts
├── types/              # TypeScript type definitions
│   └── notification.ts
│   ├── shipment.ts
│   └── transporter.ts
├── views/              # Page components
│   ├── ShipmentListView.vue
│   └── ShipmentDetailView.vue
├── router/             # Vue Router configuration
│   └── index.ts
└── main.ts            # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shipment-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server with hot-reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing

```bash
npm run test:unit         # Run tests in watch mode
npm run test:unit -- --run  # Run tests once
```

### Code Quality

```bash
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
npm run format       # Format code with Prettier (if configured)
```

## 📚 User Guide

### Viewing Shipments

1. Navigate to the home page to see all shipments in a grid layout
2. Each card shows:
   - Shipment ID
   - Origin and destination
   - Vehicle type required
   - Current status (color-coded badge)
3. Click "View Details" to see full shipment information

### Assigning a Transporter

1. Click on a shipment with "Not Assigned" status
2. Select a transporter from the dropdown
   - Only transporters with matching vehicle types are shown
   - Unavailable transporters (already assigned) are listed below
3. Click "Assign Transporter"
4. Success message confirms the assignment

### Re-assigning a Transporter

1. Open a shipment with "Assigned" status
2. Select a different transporter from available options
3. Click "Re-assign Transporter"
4. The new transporter is assigned and previous one becomes available

### Real-Time Updates

1. Toggle "Real-time Updates" switch in the shipment list
2. Status updates occur every 5 seconds automatically
3. Toast notifications appear in top-right corner for each change
4. Status transitions follow realistic workflow:
   - `not-assigned` → stays until assigned
   - `assigned` → may transition to `in-transit` (30% chance)
   - `in-transit` → may transition to `delivered` (20% chance)
   - `delivered` / `cancelled` → terminal states (no changes)

## 🔧 Business Rules

### Vehicle Type Matching

- **Rule**: Transporter's vehicle type must exactly match shipment's required vehicle type
- **Why**: Ensures proper equipment is used for each shipment
- **Example**: A shipment requiring a "Truck" cannot be assigned a "Van" transporter

### Transporter Availability

- **Rule**: A transporter can only be assigned to one shipment at a time
- **Why**: Prevents double-booking and ensures realistic logistics
- **Example**: If "Budi Santoso" is assigned to SHP-001, he cannot be assigned to SHP-002 until SHP-001 is completed or reassigned

### Status-Based Restrictions

- **Rule**: Transporter assignment/re-assignment is locked for shipments with status: `in-transit`, `delivered`, or `cancelled`
- **Why**: Maintains data integrity once shipment is actively moving or completed
- **Allowed Operations**:
  - ✅ `not-assigned` → Can assign transporter
  - ✅ `assigned` → Can re-assign transporter
  - ❌ `in-transit` → Locked (cannot change)
  - ❌ `delivered` → Locked (cannot change)
  - ❌ `cancelled` → Locked (cannot change)

## 🧪 Testing

The project includes comprehensive test coverage:

### Test Files

- `src/stores/__tests__/shipmentStore.spec.ts` - Basic store tests (2 tests)
- `src/stores/__tests__/shipmentStore.comprehensive.spec.ts` - Store comprehensive tests (13 tests)
- `src/__tests__/business-logic.spec.ts` - Business logic validation tests (12 tests)

### Test Coverage

- ✅ Shipment filtering and computed getters
- ✅ Transporter availability checking
- ✅ API fetch operations and error handling
- ✅ Transporter assignment with validation
- ✅ Real-time update simulation
- ✅ Vehicle type matching validation
- ✅ Double-booking prevention
- ✅ Status-based restriction enforcement

### Running Tests

```bash
# Run all tests once
npm run test:unit -- --run

# Watch mode for development
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage
```

## 📖 Code Documentation

All code includes comprehensive JSDoc comments explaining:

- Purpose and functionality of each component/function
- Business rules and validation logic
- Parameter descriptions and return types
- Usage examples and important notes

### Key Files to Review

1. **`src/stores/shipmentStore.ts`** - Core state management and business logic
2. **`src/mocks/server.ts`** - API endpoints and validation rules
3. **`src/views/ShipmentDetailView.vue`** - Assignment UI and user interactions
4. **`src/types/`** - TypeScript type definitions with detailed documentation

## 🎨 Design Decisions

### Why Pinia?

- Type-safe state management with excellent TypeScript support
- Simpler API compared to Vuex (no mutations)
- Better DevTools integration
- Composition API-first design

### Why Mirage.js?

- Full-featured mock API server
- No backend required for development
- Simulates realistic network delays
- Easy to add/modify endpoints

### Why TailwindCSS?

- Utility-first approach for rapid development
- Consistent design system
- Excellent responsive design utilities
- Small production bundle (unused classes purged)

### Component Structure

- **Atomic Design**: Small, reusable components (StatusBadge, ShipmentCard)
- **Smart/Dumb Pattern**: Views handle logic, components handle presentation
- **Composition API**: Modern Vue 3 syntax with `<script setup>`

## 🔍 Troubleshooting

### Mock API Not Working

- Ensure Mirage.js server starts in development mode
- Check browser console for initialization messages
- Verify `import.meta.env.DEV` is true

### Tests Failing

- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and reinstall if needed
- Check for TypeScript errors: `npm run type-check`

### Real-Time Updates Not Showing

- Verify the toggle is turned ON (green indicator)
- Check browser console for update messages
- Ensure at least one shipment exists in the list

## 👥 For Developers

### Adding New Features

1. **New Shipment Status**
   - Update type in `src/types/shipment.ts`
   - Add color in `StatusBadge.vue`
   - Update status transitions in `shipmentStore.ts`

2. **New Vehicle Type**
   - Add to mock data in `src/mocks/data.ts`
   - No code changes needed (dynamic)

3. **New API Endpoint**
   - Add route handler in `src/mocks/server.ts`
   - Create corresponding store action
   - Add unit tests

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Vue**: Composition API with `<script setup>` syntax
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Comments**: JSDoc for public APIs, inline for complex logic
- **Testing**: Write tests for all business logic

## 📄 License

This project is for educational/demonstration purposes.

## 🙏 Acknowledgments

Built as a demonstrating Vue 3, TypeScript, and modern frontend development practices.

```sh
npm run lint
```
