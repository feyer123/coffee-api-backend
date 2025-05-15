import { DateTime } from 'luxon';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://essentialservices.coffee');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8VZ4mppZjFZC2_Zv-MOAYamh0aHWSoefekLDwJvZUksr_Q-z7dVVs_XIKZcjFJ7dqDZ8GCx_B4EzC/pub?output=csv';
    const response = await fetch(csvUrl);
    const csv = await response.text();

    const rows = csv.trim().split('\n').slice(1); // skip header
    const today = DateTime.now().setZone('America/Denver').startOf('day');

    console.log(`🕒 Today is: ${today.toISODate()}`);

    const upcomingDates = rows
      .map(line => {
        const [dateStr] = line.split(',');
        const parsed = DateTime.fromISO(dateStr.trim(), { zone: 'America/Denver' });
        console.log(`📅 Parsed: "${dateStr}" → ${parsed.isValid ? parsed.toISODate() : 'Invalid'}`);
        return parsed.isValid ? parsed : null;
      })
      .filter(dt => dt && dt > today)
      .sort((a, b) => a.toMillis() - b.toMillis());

    if (upcomingDates.length === 0) {
      console.log('⚠️ No upcoming dates found.');
      return res.status(200).json({ next_roast_date: null });
    }

    const next = upcomingDates[0].toISODate();
    console.log(`✅ Next roast date selected: ${next}`);
    return res.status(200).json({ next_roast_date: next });

  } catch (err) {
    console.error('❌ Error fetching or parsing sheet:', err);
    res.status(500).json({ error: 'Failed to load roast dates' });
  }
}
