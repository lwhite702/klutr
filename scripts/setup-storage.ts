// Helper script to set up Supabase Storage buckets
// Run this via Supabase SQL Editor or Edge Function

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupStorageBuckets() {
  const buckets = [
    { id: 'images', name: 'images', public: true },
    { id: 'voice-memos', name: 'voice-memos', public: true },
    { id: 'files', name: 'files', public: true },
  ]

  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: 52428800, // 50MB
      })

      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating bucket ${bucket.id}:`, error)
      } else {
        console.log(`Bucket ${bucket.id} created successfully`)
      }
    } catch (error) {
      console.error(`Error creating bucket ${bucket.id}:`, error)
    }
  }
}

export { setupStorageBuckets }
