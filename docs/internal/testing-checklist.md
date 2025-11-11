# Testing Checklist

This document provides a comprehensive testing checklist for the Stream architecture implementation.

## Stream Page (`/app/stream`)

### Text Drops
- [ ] Create a text drop via input field
- [ ] Verify optimistic update appears immediately
- [ ] Verify drop appears in stream after API call completes
- [ ] Verify tags are automatically applied
- [ ] Test with empty content (should be prevented)
- [ ] Test with very long content (should handle gracefully)
- [ ] Test Enter key submits, Shift+Enter creates new line

### File Uploads
- [ ] Upload a single image file (JPEG, PNG, GIF, WebP)
- [ ] Upload a PDF file
- [ ] Upload multiple files at once
- [ ] Verify file preview appears in stream
- [ ] Test file size limit (10MB) - should show error for oversized files
- [ ] Test unsupported file types - should show error
- [ ] Test drag-and-drop file upload
- [ ] Verify file URL is stored correctly
- [ ] Test file deletion from stream

### Voice Notes
- [ ] Click record button - should request microphone permission
- [ ] Record a voice note (5-10 seconds)
- [ ] Stop recording - should process and upload
- [ ] Verify voice note appears in stream with duration
- [ ] Test microphone permission denied - should show error
- [ ] Test recording cancellation
- [ ] Verify audio file is uploaded to Supabase Storage

### Search and Filtering
- [ ] Search by content text
- [ ] Search by filename
- [ ] Search by tag
- [ ] Verify debounced search (300ms delay)
- [ ] Test empty search results
- [ ] Test search with special characters
- [ ] Verify search results are clickable

### Pagination
- [ ] Load initial page of drops (50 items)
- [ ] Scroll to bottom - should load more
- [ ] Verify pagination metadata is correct
- [ ] Test with empty stream

### Error Handling
- [ ] Test network error - should show retry button
- [ ] Test API error response - should show error message
- [ ] Test error boundary - should show error UI
- [ ] Test authentication error - should handle gracefully
- [ ] Verify error messages are user-friendly

### Loading States
- [ ] Verify skeleton loader on initial load
- [ ] Verify loading indicator during file upload
- [ ] Verify processing state for voice notes
- [ ] Test loading state during search

### Keyboard Shortcuts
- [ ] Test Cmd+K (Mac) / Ctrl+K (Windows) - should open search
- [ ] Test Cmd+N (Mac) / Ctrl+N (Windows) - should focus input
- [ ] Verify shortcuts don't conflict with browser shortcuts

## Boards Page (`/app/boards`)

### Board Listing
- [ ] Verify boards load on page mount
- [ ] Verify pinned boards appear first
- [ ] Verify boards sorted by last activity
- [ ] Test empty state (no boards)
- [ ] Verify loading state with skeleton

### Board Creation
- [ ] Click "Create Board" button
- [ ] Enter board name and description
- [ ] Verify board appears in list after creation
- [ ] Test with empty name (should be prevented)
- [ ] Test with very long name (should be truncated)

### Board Actions
- [ ] Pin/unpin a board - verify state updates
- [ ] Click board - should navigate to detail page
- [ ] Delete board - verify confirmation dialog
- [ ] Verify board deletion removes from list
- [ ] Test board update (name, description)

### Error Handling
- [ ] Test API error on board creation
- [ ] Test network error on board list
- [ ] Verify retry mechanism works

## Search Page (`/app/search`)

### Search Functionality
- [ ] Enter search query - verify debounced search
- [ ] Verify search results appear after 300ms
- [ ] Test search with no results
- [ ] Test search with special characters
- [ ] Verify search results use StreamMessage component
- [ ] Test clearing search query

### Empty States
- [ ] Verify "Start typing to search" message
- [ ] Verify "No results found" message
- [ ] Test with empty query

### Loading States
- [ ] Verify loading indicator during search
- [ ] Verify search results appear after loading

## Settings Page (`/app/settings`)

### Profile Section
- [ ] View current profile information
- [ ] Update name field
- [ ] Verify email is disabled (cannot be changed)
- [ ] Test avatar upload (if implemented)
- [ ] Verify save button updates profile

### Preferences Section
- [ ] Switch theme (Light/Dark/System)
- [ ] Verify theme persists across page reloads
- [ ] Verify theme applies to all pages

### Privacy Section
- [ ] Toggle analytics switch
- [ ] Toggle error reporting switch
- [ ] Verify switches persist state
- [ ] Verify privacy alert message displays

### Data Section
- [ ] Click "Export Data" - verify export starts
- [ ] Verify export completes and downloads JSON
- [ ] Test "Delete Account" dialog
- [ ] Verify delete confirmation requires explicit action
- [ ] Test canceling delete account

## API Routes

### Stream API
- [ ] `POST /api/stream/create` - Create text drop
- [ ] `POST /api/stream/create` - Create file drop
- [ ] `POST /api/stream/create` - Create voice drop
- [ ] `GET /api/stream/list` - List drops with pagination
- [ ] `GET /api/stream/list?dropType=file` - Filter by type
- [ ] `GET /api/stream/search?q=query` - Search drops
- [ ] `POST /api/stream/upload` - Upload file
- [ ] `DELETE /api/stream/[id]` - Delete drop
- [ ] Test rate limiting (20 requests per 15 minutes)
- [ ] Test validation errors (empty content, invalid types)
- [ ] Test authentication required

### Boards API
- [ ] `GET /api/boards/list` - List all boards
- [ ] `POST /api/boards/create` - Create board
- [ ] `GET /api/boards/[id]` - Get board details
- [ ] `PATCH /api/boards/[id]` - Update board
- [ ] `DELETE /api/boards/[id]` - Delete board
- [ ] Test authorization (user can only access own boards)
- [ ] Test validation errors

## Error Boundaries

- [ ] Trigger error in Stream component - verify boundary catches it
- [ ] Verify error boundary shows user-friendly message
- [ ] Verify reload button works
- [ ] Test error recovery

## Authentication

### Authenticated User
- [ ] Verify user ID is retrieved correctly
- [ ] Verify file uploads use correct user ID
- [ ] Verify voice notes use correct user ID
- [ ] Test with different authenticated users
- [ ] Verify user-specific data isolation

### Unauthenticated User
- [ ] Test behavior when user is not authenticated
- [ ] Verify appropriate error messages
- [ ] Test fallback to anonymous user (if applicable)

## File Uploads

### File Types
- [ ] Test JPEG image upload
- [ ] Test PNG image upload
- [ ] Test GIF image upload
- [ ] Test WebP image upload
- [ ] Test PDF upload
- [ ] Test text file upload
- [ ] Test audio file upload (MP3, WAV, WebM)
- [ ] Test unsupported file type (should reject)

### File Size
- [ ] Test file under 10MB (should succeed)
- [ ] Test file exactly 10MB (should succeed)
- [ ] Test file over 10MB (should fail with error)

### Upload Process
- [ ] Verify file uploads to Supabase Storage
- [ ] Verify file URL is returned
- [ ] Verify file is accessible via public URL
- [ ] Test upload progress indicator (if implemented)
- [ ] Test upload cancellation (if implemented)

## Performance

- [ ] Test initial page load time
- [ ] Test pagination performance with large datasets
- [ ] Test search performance with many results
- [ ] Verify debounced search reduces API calls
- [ ] Test optimistic updates don't cause flicker

## Responsive Design

- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Verify sidebar collapses on mobile
- [ ] Verify Stream input is accessible on all sizes
- [ ] Test touch interactions on mobile

## Accessibility

- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify ARIA labels on interactive elements
- [ ] Test focus management
- [ ] Verify color contrast meets WCAG standards

## Integration Tests

- [ ] Test complete flow: create drop → tag → organize into board
- [ ] Test search → click result → view in context
- [ ] Test file upload → view in stream → search by filename
- [ ] Test voice note → transcription (if implemented) → search by content

## Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify Web Audio API works in all browsers

## Notes

- All tests should be performed in both development and production environments
- Test with real Supabase Storage bucket (not just mocks)
- Test with real database (not just mocks)
- Verify error messages are user-friendly and actionable
- Check console for errors and warnings
- Verify no memory leaks during extended use

