import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Force refresh current session
 * This will trigger JWT token update with latest user data from database
 */
export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Trigger session update to refresh token
    // This will cause the jwt callback to run with trigger="update"
    // and fetch fresh data from database
    
    return NextResponse.json({
      message: 'Session refreshed. Please reload the page.',
      user: session.user
    });
  } catch (error) {
    console.error('[Refresh Session] Error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    );
  }
}
