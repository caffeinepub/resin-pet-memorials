# Specification

## Summary
**Goal:** Add an admin-only Image Manager panel that allows uploading custom images to replace static assets across the site, with those images stored in the backend canister and served dynamically.

**Planned changes:**
- Extend the backend actor with stable storage for named image blobs, and expose `uploadImage`, `getImage`, and `listImageKeys` endpoints (admin-only for uploads)
- Add `useImageSlot` and `useUploadImage` React Query hooks for fetching and uploading image blobs by slot key
- Create an admin-only Image Manager panel listing all image slots (hero, shape-square, shape-heart, shape-hexagon, shape-headstone, about-resin, order-photo-preview) with current previews and file-picker upload buttons
- Update `Hero.tsx`, `ShapeShowcases.tsx`, and `AboutResin.tsx` to fetch their respective image slots from the backend, falling back to existing static assets when no custom image is uploaded

**User-visible outcome:** Admins can open the Image Manager panel, upload their own photos for any image slot on the site, and see those images immediately reflected on the live site without a page reload. Non-admin visitors continue to see the default static images until an admin replaces them.
