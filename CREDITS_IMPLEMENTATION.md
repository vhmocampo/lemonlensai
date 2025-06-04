# Credits Implementation Summary

## Changes Made

### 1. Updated User Interface (AuthContext.tsx)
- Added `credits?: number` field to the User interface
- Added `updateUserCredits: (credits: number) => void` method to AuthContextType
- Implemented `updateUserCredits` function to update user credits in context and localStorage
- Updated login and register functions to extract and store credits from API responses

### 2. Created useUserCredits Hook (hooks/useUserCredits.ts)
- Created a custom React Query hook that polls the `/me` endpoint every 30 seconds
- Automatically updates user credits in the auth context when new data is received
- Only runs when user is authenticated
- Continues polling in the background to keep credits current
- Uses `staleTime: 0` to always fetch fresh data

### 3. Updated Header Component (Header.tsx)
- Added import for `useUserCredits` hook and `Coins` icon from lucide-react
- Integrated the polling hook to fetch user credits
- Enhanced user menu dropdown to display credits with coin icon
- Added credits section with proper styling in the user menu
- Displays credits from either the auth context or the polling hook data
- Shows loading indicator ("...") while credits are being fetched

## Key Features

### Automatic Polling
- Credits are automatically updated every 30 seconds by polling the `/me` endpoint
- Polling continues even when the browser tab is in the background
- No manual refresh needed to see updated credit balances

### Fallback Display
- Credits are shown from the auth context (user.credits) when available
- Falls back to polling hook data (userData?.credits) if context doesn't have credits
- Shows "..." while credits are loading

### Responsive UI
- Credits display includes a coin icon for visual clarity
- Integrated seamlessly into the existing user menu design
- Uses consistent styling with the rest of the application

## API Integration
- Login and register endpoints now extract credits from `data.user.credits`
- The `/me` endpoint is polled to keep credits current
- All API calls use the existing authentication and session handling

## Usage
When a user is logged in, their current credit balance will be displayed in the user menu dropdown in the header. The balance updates automatically every 30 seconds without requiring any user action.
