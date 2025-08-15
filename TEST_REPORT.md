# Test Report — Herbal & Ayurvedic Remedy Guide PWA

**Date:** 2025-08-15 15:10:23 IST

## Scope
- Offline-first PWA with i18n (English/Tamil), country selection, search, favorites.

## Devices Tested
- Android (mobile Chrome)
- Desktop Chrome

## Tests
1. Installable PWA (manifest + SW) — **PASS**
2. Offline caching (index, JS, JSON, i18n) — **PASS**
3. Language switch EN↔TA updates UI text — **PASS**
4. Country selection persists in localStorage — **PASS**
5. Search by herb and symptom — **PASS**
6. Add/Remove favorites — **PASS**
7. Accessibility: keyboard focus on cards — **PASS (basic)**

## Notes
- Icons generated at 192px and 512px.
- Data is sample; you can extend `data/herbs.json`.
