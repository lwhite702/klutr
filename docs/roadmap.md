---
title: "Development Roadmap"
author: cursor-agent
updated: 2025-10-29
---

# Development Roadmap

## Overview

This roadmap outlines the phased development approach for migrating Noteornope (MindStorm) from its current Neon-based architecture to a fully Supabase-powered system. Each phase builds upon the previous one, ensuring continuous functionality while transitioning to the target architecture.

## Phase 1: Neon-backed MVP (Current)

### Goal

Complete the core functionality using Neon Postgres as the database, ensuring all features work end-to-end before migration.

### Status

**In Progress** - Core features implemented, UI complete, data wiring in progress

### Deliverables

- [x] Next.js 16 app with App Router and TypeScript
- [x] shadcn/ui component library integration
- [x] Basic page structure (Notes, MindStorm, Stacks, Vault, Insights, Memory, Nope)
- [x] QuickCaptureBar component for note creation
- [x] Prisma schema with core models (User, Note, Cluster, Stack, VaultNote, Insight)
- [x] OpenAI API integration for note classification
- [x] pgvector setup for embeddings
- [x] Manual cron API routes with CRON_SECRET validation
- [ ] Complete CRUD operations for all features
- [ ] AI clustering implementation
- [ ] Vault encryption working end-to-end
- [ ] Weekly insights generation
- [ ] Memory timeline view

### Technical Stack

- **Database:** Neon Postgres + pgvector
- **ORM:** Prisma
- **AI:** OpenAI API (gpt-4o-mini)
- **Cron:** Manual API routes
- **Auth:** None (development mode)
- **Environment:** Doppler

### Blockers

None - proceeding with development

### Completion Criteria

- All pages render without errors
- Notes can be created, read, updated, deleted
- AI classification works for new notes
- Basic clustering groups similar notes
- Vault encrypts/decrypts notes client-side
- Cron jobs can be triggered manually
- App builds and deploys successfully

### Estimated Completion

**TBD** - Depends on remaining CRUD implementation

---

## Phase 2: Supabase Setup

### Goal

Establish Supabase environment and test connection while maintaining Neon for development.

### Status

**Not Started** - Waiting for Phase 1 completion

### Tasks

- [ ] Create Supabase project
- [ ] Enable pgvector extension in Supabase
- [ ] Set up Supabase Auth (email/password + OAuth providers)
- [ ] Configure Supabase Storage bucket for attachments
- [ ] Create test tables matching current Prisma schema
- [ ] Test Supabase connection from Next.js app
- [ ] Add Supabase environment variables to Doppler
- [ ] Document Supabase setup process

### Deliverables

- Working Supabase project with pgvector enabled
- Test CRUD operations against Supabase
- Auth flow working with Supabase
- Storage bucket configured
- Environment variables documented in DOPPLER.md

### Dependencies

- Phase 1 complete (working MVP with Neon)

### Environment Variables to Add

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

### Success Criteria

- Supabase connection established
- Test data can be created/read/updated/deleted
- Auth flow works with Supabase
- No breaking changes to existing Neon functionality

---

## Phase 3: Schema Migration & RLS

### Goal

Migrate Prisma schema to target Supabase and implement Row-Level Security for multi-user support.

### Status

**Not Started** - Waiting for Phase 2 completion

### Tasks

- [ ] Update Prisma schema to use Supabase connection string
- [ ] Run full migration to create tables in Supabase
- [ ] Implement Row-Level Security (RLS) policies
- [ ] Test user isolation (users can only see their own data)
- [ ] Update API routes to use Supabase auth
- [ ] Test all CRUD operations with RLS enabled
- [ ] Document RLS policies in `/docs/database.md`

### Deliverables

- Prisma schema migrated to Supabase
- RLS policies implemented and tested
- Multi-user data isolation working
- Updated API routes with auth checks
- Documentation of security model

### Security Requirements

```sql
-- Example RLS policies
CREATE POLICY "Users can view own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own notes"
ON notes FOR ALL
USING (auth.uid() = user_id);
```

### Success Criteria

- All data migrated to Supabase
- Users can only access their own notes
- API routes properly authenticate users
- No data leakage between users
- Neon can be removed from environment

---

## Phase 4: Edge Functions & Automation

### Goal

Replace manual cron API routes with Supabase Edge Functions for automated background processing.

### Status

**Not Started** - Waiting for Phase 3 completion

### Tasks

- [ ] Create Supabase Edge Functions for:
  - [ ] `nightly-cluster` - Re-embed notes and regenerate clusters
  - [ ] `nightly-stacks` - Analyze patterns and rebuild smart stacks
  - [ ] `weekly-insights` - Generate AI summary of activity
- [ ] Set up pg_cron to trigger Edge Functions
- [ ] Implement secret validation in Edge Functions
- [ ] Test automated job execution
- [ ] Remove manual cron API routes
- [ ] Update documentation in `/docs/cron.md`

### Deliverables

- Supabase Edge Functions for all background jobs
- Automated scheduling via pg_cron
- Secret validation working
- Manual cron routes removed
- Updated cron documentation

### Job Specifications

- **nightly-cluster:** Runs at 2:00 AM ET daily
- **nightly-stacks:** Runs at 2:30 AM ET daily
- **weekly-insights:** Runs Sundays at 3:00 AM ET

### Success Criteria

- Background jobs run automatically
- No manual cron API routes remain
- Jobs complete successfully without errors
- Secret validation prevents unauthorized access
- Performance is acceptable for production

---

## Phase 5: Full Supabase Cutover

### Goal

Complete migration to Supabase, remove Neon dependencies, and optimize for production.

### Status

**Not Started** - Waiting for Phase 4 completion

### Tasks

- [ ] Remove Neon configuration from codebase
- [ ] Remove Neon environment variables from Doppler
- [ ] Optimize database queries and indexes
- [ ] Implement proper error handling and logging
- [ ] Set up monitoring and alerting
- [ ] Performance testing and optimization
- [ ] Final documentation updates
- [ ] Production deployment verification

### Deliverables

- Fully migrated Supabase application
- Optimized performance
- Production-ready monitoring
- Complete documentation
- Neon dependencies removed

### Documentation Updates

- Final `/docs/architecture.md` update
- Production deployment guide
- Monitoring and alerting setup
- Performance optimization notes

### Success Criteria

- Application runs entirely on Supabase
- Performance meets production requirements
- Monitoring and alerting in place
- Documentation is complete and accurate
- No Neon dependencies remain

---

## Future Features (Post-MVP)

### Collaboration & Sharing

- **Shared Stacks:** Allow users to share note collections
- **Team Workspaces:** Multi-user collaboration on projects
- **Public Insights:** Share insights publicly or with specific users

### Mobile Applications

- **iOS App:** Native mobile experience
- **Android App:** Native mobile experience
- **Offline Support:** Sync when connection restored

### Advanced Visualization

- **Graph View:** Interactive mind map of note relationships
- **Timeline Visualization:** Enhanced temporal view of notes
- **Cluster Visualization:** Visual representation of note groupings

### API & Integrations

- **Public API:** RESTful API for third-party integrations
- **Webhook Support:** Real-time notifications for external systems
- **Import/Export:** Support for various note formats

### Enterprise Features

- **SSO Integration:** Enterprise authentication
- **Admin Dashboard:** User management and analytics
- **Custom Branding:** White-label options

---

## Risk Management

### Technical Risks

- **Migration Complexity:** Supabase migration may introduce bugs
- **Performance Impact:** Edge Functions may be slower than manual cron
- **Data Loss:** Migration process must be carefully tested
- **Auth Complexity:** RLS implementation may break existing functionality

### Mitigation Strategies

- **Phased Approach:** Each phase thoroughly tested before proceeding
- **Rollback Plan:** Ability to revert to previous phase if issues arise
- **Data Backup:** Regular backups before each migration step
- **Staging Environment:** Test all changes in staging before production

### Success Metrics

- **Zero Downtime:** Migration completed without service interruption
- **Performance Maintained:** No degradation in response times
- **Data Integrity:** All data successfully migrated
- **User Experience:** No negative impact on user workflows

---

## Dependencies

### External Dependencies

- **Supabase Service:** Reliable service availability
- **OpenAI API:** Consistent AI service performance
- **Doppler:** Environment variable management
- **Vercel:** Deployment platform stability

### Internal Dependencies

- **Phase Completion:** Each phase must complete before next begins
- **Documentation:** Technical docs must be updated with each change
- **Testing:** Comprehensive testing required for each phase
- **Code Review:** All changes must be reviewed before deployment

---

## Timeline Estimates

- **Phase 1:** 2-3 weeks (current development pace)
- **Phase 2:** 1 week (setup and testing)
- **Phase 3:** 1-2 weeks (migration and RLS implementation)
- **Phase 4:** 1-2 weeks (Edge Functions development)
- **Phase 5:** 1 week (optimization and cleanup)

**Total Estimated Duration:** 6-9 weeks from Phase 1 completion

---

## Success Criteria

The roadmap is considered successful when:

1. **All phases completed** without breaking existing functionality
2. **Performance maintained** or improved throughout migration
3. **Security enhanced** with proper RLS implementation
4. **Documentation complete** and accurate
5. **Production ready** with monitoring and alerting
6. **Team confident** in new architecture and processes
