# Earth & sky textures — sources & licenses

Textures under `public/textures/` are used by the Space / Earth Dive scenes
(`Earth.tsx`, `CloudLayer.tsx`, `CloudFlight.tsx`, `MilkyWay.tsx`).

## Solar System Scope (CC BY 4.0)

**Confirmed source:** [Solar System Scope — Solar Textures](https://www.solarsystemscope.com/textures/)  
**License:** [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)

From the pack notes: maps are based on NASA elevation and imagery data;
colors may be slightly more saturated; some unmapped gaps are filled with
matching fictional terrain. Earth maps draw on NASA Blue Marble and related
geo-data.

**Required attribution (CC BY 4.0):**

> Earth and space textures by [Solar System Scope](https://www.solarsystemscope.com/textures/)
> (INOVE), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
> Based on NASA elevation and imagery data.

| Project file | Pack map (typical name) | Role | In use? |
| --- | --- | --- | --- |
| `earth/earth-day.jpg` | Earth Day Map | Day albedo | Yes |
| `earth/earth-night.jpg` | Earth Night Map | Night city lights | Yes |
| `earth/earth-clouds.jpg` | Earth Clouds | Cloud layer | Yes |
| `earth/milky-way.jpg` | Stars + Milky Way | Milky Way backdrop | Yes |
| `2k_earth_normal_map.tif` | Earth Normal Map | Normal map | No — unused in current shaders |
| `2k_earth_specular_map.tif` | Earth Specular Map | Specular / ocean mask | No — unused in current shaders |

Filenames under `earth/` are project renames of the downloaded pack maps.
The unused `2k_earth_*` files keep the pack’s original naming style.

If you replace any texture, update this table and the root README attribution.
