-- Add user roles for admin access control
-- Created: 2025-11-17

-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = TRUE;

-- Comment for documentation
COMMENT ON COLUMN users.is_admin IS 'Admin flag for users with access to admin portal and AI Engine controls';

