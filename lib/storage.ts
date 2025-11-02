// Supabase Storage helper functions

import { createSupabaseClient, getSupabaseServerClient } from './supabase'

export interface UploadFileOptions {
  file: File | Blob
  bucket: string
  path: string
  userId?: string
  contentType?: string
}

/**
 * Upload a file to Supabase Storage (client-side)
 */
export async function uploadFile(options: UploadFileOptions): Promise<{ path: string; url: string }> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(options.path, options.file, {
      contentType: options.contentType || options.file.type,
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(options.bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    url: urlData.publicUrl,
  }
}

/**
 * Upload a file to Supabase Storage (server-side)
 */
export async function uploadFileServer(options: UploadFileOptions): Promise<{ path: string; url: string }> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error('Supabase server client not initialized')
  }

  // Convert File/Blob to ArrayBuffer
  const arrayBuffer = await options.file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(options.path, uint8Array, {
      contentType: options.contentType || (options.file instanceof File ? options.file.type : 'application/octet-stream'),
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get public URL (for public buckets) or signed URL (for private buckets)
  const { data: urlData } = supabase.storage.from(options.bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    url: urlData.publicUrl,
  }
}

/**
 * Delete a file from Supabase Storage (client-side)
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Delete a file from Supabase Storage (server-side)
 */
export async function deleteFileServer(bucket: string, path: string): Promise<void> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error('Supabase server client not initialized')
  }

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Get a signed URL for private file access (expires in 1 hour)
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`)
  }

  return data.signedUrl
}

/**
 * Get a signed URL for private file access (server-side)
 */
export async function getSignedUrlServer(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    throw new Error('Supabase server client not initialized')
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`)
  }

  return data.signedUrl
}

/**
 * List files in a bucket (with optional path prefix)
 */
export async function listFiles(bucket: string, path?: string): Promise<Array<{ name: string; id: string; updated_at: string }>> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.storage.from(bucket).list(path || '', {
    limit: 100,
    offset: 0,
  })

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`)
  }

  return (
    data?.map((file) => ({
      name: file.name,
      id: file.id,
      updated_at: file.updated_at || file.created_at || '',
    })) || []
  )
}
