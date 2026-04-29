# Game Tracking Matrix

Use this matrix to verify Steam app IDs and tracking behavior during implementation.

| Game | Key | Steam App ID | Status | Tracking Notes |
|---|---:|---:|---|---|
| Apex Legends | `apex_legends` | `1172470` | Needs verification | Steam-backed. Track build/news. |
| Battlefield 6 | `battlefield_6` | `VERIFY` | Needs verification | Confirm final Steam app ID/title naming. |
| Call of Duty | `call_of_duty` | `1938090` | Needs verification | COD hub can be complex. Validate update/news behavior. |
| Counter-Strike 2 | `cs2` | `730` | Known | Track build/news. |
| DayZ | `dayz` | `221100` | Known | Track build/news. |
| Dead by Daylight | `dead_by_daylight` | `381210` | Known | Track build/news. |
| Deadlock | `deadlock` | `1422450` | Needs verification | Validate app ID and public Steam data behavior. |
| Escape from Tarkov | `escape_from_tarkov` | `VERIFY` | Needs verification | User notes it is on Steam now. Confirm exact app ID. |
| Marvel Rivals | `marvel_rivals` | `2767030` | Needs verification | Track build/news. |
| Overwatch | `overwatch` | `2357570` | Needs verification | Track build/news. |
| Path of Exile 2 | `path_of_exile_2` | `2694490` | Needs verification | Track build/news. |
| Rainbow Six Siege | `rainbow_six_siege` | `359550` | Known | Track build/news. |
| Rust | `rust` | `252490` | Known | Track build/news. |

## Verification Process

For every game:

1. Confirm the Steam store page/app ID.
2. Confirm Steam news endpoint returns useful update entries.
3. Confirm build ID can be retrieved reliably.
4. Decide whether build ID or news ID is the primary tracker.
5. Add fallback patch notes URL if needed.
6. Add image/banner URL.
7. Run force-check.
8. Confirm no duplicate posting.

## Notes

Some games use launchers, hubs, or multiple app IDs. Do not force unreliable behavior into a single tracking method. The implementation should support fallbacks and overrides per game.
