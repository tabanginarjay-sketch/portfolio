'use client';

import { useEffect } from 'react';

const SESSION_KEY = 'arjay_portfolio_view_notified_v1';
const OWNER_IGNORE_KEY = 'arjay_portfolio_owner_ignore';

export default function VisitTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Optional owner toggle: visit ?me=1 to ignore your own device, ?me=0 to re-enable
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('me') === '1') {
        window.localStorage.setItem(OWNER_IGNORE_KEY, '1');
        return;
      }
      if (params.get('me') === '0') {
        window.localStorage.removeItem(OWNER_IGNORE_KEY);
      }
      if (window.localStorage.getItem(OWNER_IGNORE_KEY) === '1') {
        return;
      }
    } catch {
      // Ignore storage access errors in private browsing modes
    }

    // Never send emails during local development
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
      return;
    }

    // Prevent duplicate counts & emails on refresh within the same browser session
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        return;
      }
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Continue if sessionStorage is unavailable
    }

    // Wait briefly so tracking never competes with hero image & animation loading
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        });

        if (!res.ok) return;
        const data = await res.json();
        if (!data?.tracked) return;

        const viewLabel = typeof data.count === 'number' ? `#${data.count}` : 'New View';
        const referrer = document.referrer ? document.referrer : 'Direct Link';
        const screenSize = `${window.screen.width}x${window.screen.height}`;

        // Silently notify Ar-jay via email (invisible on website UI)
        await fetch('https://formsubmit.co/ajax/tabanginarjay@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          keepalive: true,
          body: JSON.stringify({
            _subject: `Portfolio View ${viewLabel} — ${data.location} (${data.device})`,
            Total_Views: viewLabel,
            Location: data.location,
            Device: data.device,
            Screen_Size: screenSize,
            Source_Referrer: referrer,
            Visited_Link: window.location.href,
            Time_PH: data.timestampPHT,
            _template: 'table',
            _captcha: 'false',
          }),
        });
      } catch {
        // Silent failure — never affect visitor experience
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  // Completely invisible on the website UI
  return null;
}
