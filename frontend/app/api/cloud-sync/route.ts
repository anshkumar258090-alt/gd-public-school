import clientPromise from '@/lib/mongodb';
import { put } from '@vercel/blob';

const CLOUD_DB_URL = 'https://rtqcgs4s6w6ojbmc.public.blob.vercel-storage.com/local_db.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Try MongoDB Atlas directly
  try {
    const client = await clientPromise;
    const db = client.db('gdps');
    const doc = await db.collection('master_state').findOne({ key: 'latest' });

    if (doc) {
      const { _id, key, ...cleanData } = doc;
      return Response.json(
        { success: true, source: 'mongodb', data: cleanData },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          },
        }
      );
    }
  } catch (mongoErr) {
    console.warn('[CloudSync] MongoDB GET fallback to Blob:', mongoErr);
  }

  // 2. Fallback to Vercel Blob store
  try {
    const res = await fetch(`${CLOUD_DB_URL}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return Response.json(
        { success: true, source: 'blob', data },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          },
        }
      );
    }
  } catch (blobErr) {
    console.warn('[CloudSync] Blob GET error:', blobErr);
  }

  return Response.json({ success: false, message: 'Database unreachable' }, { status: 500 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Fetch current state from MongoDB Atlas (or fallback to Blob)
    let currentDb: Record<string, any> = {};
    let mongoClient = null;

    try {
      mongoClient = await clientPromise;
      const db = mongoClient.db('gdps');
      const doc = await db.collection('master_state').findOne({ key: 'latest' });
      if (doc) {
        const { _id, key, ...rest } = doc;
        currentDb = rest;
      }
    } catch {
      // Fallback to fetch from Blob
      try {
        const currentRes = await fetch(`${CLOUD_DB_URL}?t=${Date.now()}`, { cache: 'no-store' });
        if (currentRes.ok) {
          currentDb = await currentRes.json();
        }
      } catch {}
    }

    // 2. Intelligently merge updates
    const mergedDb = {
      ...currentDb,
      ...(body.school ? { school: { ...(currentDb.school || {}), ...body.school } } : {}),
      ...(body.stats ? { stats: { ...(currentDb.stats || {}), ...body.stats } } : {}),
      ...(body.team ? { team: body.team } : {}),
      ...(body.notices ? { notices: body.notices } : {}),
      ...(body.media ? { media: body.media } : {}),
      ...(body.enquiries ? { enquiries: body.enquiries } : {}),
    };

    // 3. Persist to MongoDB Atlas
    try {
      if (mongoClient) {
        const db = mongoClient.db('gdps');
        await db.collection('master_state').updateOne(
          { key: 'latest' },
          { $set: { key: 'latest', ...mergedDb, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (saveMongoErr) {
      console.warn('[CloudSync] MongoDB save warning:', saveMongoErr);
    }

    // 4. Also persist backup to Vercel Blob
    try {
      await put('local_db.json', JSON.stringify(mergedDb, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } catch (saveBlobErr) {
      console.warn('[CloudSync] Blob save warning:', saveBlobErr);
    }

    return Response.json({ success: true, data: mergedDb });
  } catch (err: any) {
    console.error('[CloudSync] Error saving state:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

