# audio/ — add the two local audio files here

Drop these two files in this folder, then the sound works again (extension **and** the Vercel site):

- **background-music.mp3** — the background instrumental (Krishna flute / calm instrumental).
  ⚠️ MUST be royalty-free or licensed to you. Do **not** reuse the old JioSaavn/saavncdn track — it's copyrighted (there was a "Listen on Saavn" link to it).
- **rain-sound.mp3** — a royalty-free rain/ambient loop.

## Why this change
The old build streamed audio from `aac.saavncdn.com` (a copyrighted JioSaavn song) and `assets.mixkit.co`. Those remote URLs are the cause of the "sound not working" reports — they rotate/expire, and the saavncdn track is a licensing risk. Serving local files fixes both the Chrome extension and https://geeta-quote-daily.vercel.app, and lets us drop the external host permissions.

Free sources for replacements: Pixabay Music, Mixkit (download the file, don't hotlink), Free Music Archive, YouTube Audio Library.
