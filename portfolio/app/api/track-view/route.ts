import { NextRequest, NextResponse } from 'next/server';

const BOT_PATTERN =
  /bot|crawler|spider|slurp|headless|puppeteer|playwright|lighthouse|facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegrambot|discordbot|vercel|curl|wget|python|node-fetch|axios/i;

function parseDevice(ua: string): string {
  if (/iPhone/i.test(ua)) return 'Mobile (iOS / iPhone)';
  if (/iPad/i.test(ua)) return 'Tablet (iPadOS)';
  if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? 'Mobile (Android)' : 'Tablet (Android)';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Desktop (macOS)';
  if (/Windows/i.test(ua)) return 'Desktop (Windows)';
  if (/Linux/i.test(ua)) return 'Desktop (Linux)';
  return 'Unknown Device';
}

function safeDecode(value: string | null): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent || BOT_PATTERN.test(userAgent)) {
      return NextResponse.json({ tracked: false, reason: 'bot_filtered' });
    }

    // Increment persistent total view count via Abacus counter service
    let count: number | null = null;
    try {
      const counterRes = await fetch(
        'https://abacus.jasoncameron.dev/hit/tabanginarjay-portfolio-v1/views',
        { cache: 'no-store' }
      );
      if (counterRes.ok) {
        const counterData = await counterRes.json();
        if (typeof counterData?.value === 'number') {
          count = counterData.value;
        }
      }
    } catch {
      // Continue gracefully even if counter service momentarily times out
    }

    // Extract visitor location from Vercel geolocation headers (automatic on Vercel)
    const city = safeDecode(request.headers.get('x-vercel-ip-city'));
    const region = safeDecode(request.headers.get('x-vercel-ip-country-region'));
    const country = safeDecode(request.headers.get('x-vercel-ip-country'));
    const locationParts = [city, region, country].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location';

    const device = parseDevice(userAgent);
    const timestampPHT = new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());

    return NextResponse.json({
      tracked: true,
      count,
      location,
      device,
      timestampPHT: `${timestampPHT} (PHT)`,
    });
  } catch {
    return NextResponse.json({ tracked: false }, { status: 200 });
  }
}
