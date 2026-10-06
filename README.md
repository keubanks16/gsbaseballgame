# GS Baseball: Play As Yourself

A 3D baseball game for GS Baseball players. Each player picks himself from the GS roster, sets up his player card (bats, throws, position, look, walk-up song) and plays with his name and number on his jersey.

## Game modes
- **Play Ball**: control the whole GS team against the Rivals (3, 6 or 9 innings).
- **My Player**: only your own at-bats and plays. Everything else simulates, and you can skip ahead.
- **Home Run Derby**: 10 outs, any swing that isn't a homer is an out. Personal bests and a team leaderboard are saved.

## What's in it
- A 3D ballpark with crowd, scoreboard, light towers, and GS logos on the grass, wall and batter's eye.
- Real pitch physics: fastball, changeup, curveball and slider with speed and break.
- Batted-ball physics with drag and backspin, plus exit velocity, launch angle and distance readouts.
- Fielders run down the ball on their own. Runners tag up, take extra bases and slide.
- Real rules: force and tag outs, double plays, sac flies, ground-rule doubles, fouls, walks, walk-offs and extra innings.
- PA announcer and walk-up songs (Bring That Sting, Built Different, Buzzin', One Shot).
- Three difficulty levels: Rookie, Pro and All-Star.
- Career stats are saved on each device.

## Controls
- **Hitting:** tap the ball as it reaches the plate. POWER swings hit harder but are harder to time. BUNT squares around.
- **Pitching:** tap the zone to aim, pick a pitch, then tap when the ring lines up.
- **Fielding:** tap the base to throw to. The glowing base is the smart play.

## Hosting with GitHub Pages
1. Put all of these files at the root of the repo (`index.html` at the top level).
2. Go to **Settings → Pages**. Choose **Deploy from a branch**, pick **main** and **/ (root)**, then save.
3. Share the link: `https://<username>.github.io/<repo>/`

## Installing on a phone
- **iPhone:** open the link in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** open the link in Chrome, tap **⋮**, then **Install app**.

Once installed it opens full-screen and works offline.

## Updating
After changing any file, bump `VERSION` in `sw.js` so phones pick up the new version.

## Files
| Path | What it is |
|---|---|
| `index.html`, `style.css` | App shell, menus and HUD |
| `js/engine.js` | Game rules, AI fielders, runners, pitchers and batters |
| `js/physics.js` | Pitch and batted-ball physics, swing contact model |
| `js/player.js` | 3D player models and animations |
| `js/field.js` | The ballpark |
| `js/data.js` | GS roster, Rivals roster and saved stats |
| `js/audio.js` | Sound effects, announcer and team music |
| `music/` | Team songs (compressed from the original WAVs) |
| `img/`, `icons/` | GS logos and app icons |
