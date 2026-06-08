import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { assertAdminRequest } from '@/lib/checkout/security';

const IMAGE_BUCKET = 'products';
const VIDEO_BUCKET = 'videos';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

function getExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;

  const fromType = file.type.split('/').pop()?.toLowerCase();
  return fromType && /^[a-z0-9]+$/.test(fromType) ? fromType : 'bin';
}

function getMediaTarget(file: File) {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      bucket: IMAGE_BUCKET,
      folder: 'admin',
      maxBytes: MAX_IMAGE_BYTES,
      type: 'image' as const,
    };
  }

  if (ALLOWED_VIDEO_TYPES.has(file.type)) {
    return {
      bucket: VIDEO_BUCKET,
      folder: 'admin',
      maxBytes: MAX_VIDEO_BYTES,
      type: 'video' as const,
    };
  }

  throw new Error('Unsupported media type.');
}

function adminErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected media upload error.';
  const status = message.includes('Unauthorized') ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      throw new Error('A media file is required.');
    }

    const target = getMediaTarget(file);
    if (file.size <= 0) {
      throw new Error('The media file is empty.');
    }
    if (file.size > target.maxBytes) {
      throw new Error(
        target.type === 'image'
          ? 'Images must be 10 MB or smaller.'
          : 'Videos must be 80 MB or smaller.'
      );
    }

    const extension = getExtension(file);
    const storagePath = `${target.folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseServer.storage
      .from(target.bucket)
      .upload(storagePath, bytes, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseServer.storage
      .from(target.bucket)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      url: data.publicUrl,
      type: target.type,
      bucket: target.bucket,
      path: storagePath,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
