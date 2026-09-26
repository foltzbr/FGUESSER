# FGUESSER

FGUESSER is a map cheat for GeoGuessr and OpenGuessr that reveals the real location of any round and drops a pin straight on the guess map.

![version](https://img.shields.io/badge/version-1.0-black) ![platform](https://img.shields.io/badge/platform-Tampermonkey-orange)

**Language:** [Português](README.md) • English (this file) • [Español](README.es.md)

![FGUESSER in action](preview-v1.png)

## What it does

- Reveals the true coordinates of the current Street View round
- Shows country, region and city with flag
- Drops a red pin on the guess map at the exact spot
- Embedded map preview of the real location
- Interface in English, Português and Español
- Supports [GeoGuessr](https://www.geoguessr.com) (Classic, Streaks, Duels, Party) and [OpenGuessr](https://openguessr.com) (free, unlimited rounds)

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Create a new userscript
3. Paste the full content of `FGUESSER.user.js`
4. Save with `Ctrl+S` and reload GeoGuessr or OpenGuessr

## How to use

1. Join any game on GeoGuessr or OpenGuessr (OpenGuessr is free with unlimited rounds)
2. Wait for the green dot — the real location appears in the panel
3. Click `PIN ON MAP` or press `6` and the pin lands on the exact spot
4. Confirm your guess in game and collect the 5000
5. Press `1` to hide / show the panel

## Shortcuts

| Key | Action |
|-----|--------|
| `1` | Hide / show panel |
| `6` | Drop pin on map |

## Files

| File | Description |
|------|-------------|
| `FGUESSER.user.js` | Tampermonkey userscript, install this |
| `preview-v1.png` | Panel preview |

## Releases

| Version | Description |
|---------|-------------|
| [v1.0](https://github.com/foltzbr/FGUESSER/releases/tag/v1.0) | Autopin with fast map pin, EN / PT / ES — supports GeoGuessr and OpenGuessr |

Download the ready-to-install file from the [releases page](https://github.com/foltzbr/FGUESSER/releases).
