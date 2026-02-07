
# Add Team Members Section

## Overview
Add a professional "Meet Our Team" section to the About page featuring the 5 STIL leadership team members with their authentic photos and roles.

## Team Members to Add

| Name | Role |
|------|------|
| Engr. Idris Saliu | Founder |
| Engr. Sulaiman | Site Operation Manager |
| Hauwa Idris | Director |
| Mr. Isah Siyaka O. | Board of Trustee |
| Abdul Mumeen | Project Manager |

## Design Approach
- Responsive grid layout: 5 columns on desktop, 3 on tablet, 2 on mobile
- Circular avatar-style photos with professional hover effects
- Clean card design matching the existing site aesthetic
- Subtle animation on scroll using Framer Motion (consistent with other sections)

## Implementation Steps

### 1. Copy Team Member Photos
Copy all 5 uploaded images to `src/assets/images/team/`:
- `engr-idris-saliu.png` (Founder)
- `engr-sulaiman.png` (Site Operation Manager)
- `hauwa-idris.png` (Director)
- `mr-isah-siyaka.png` (Board of Trustee)
- `abdul-mumeen.png` (Project Manager)

### 2. Create TeamMembers Component
Create a new reusable component at `src/components/TeamMembers.tsx`:
- Define team member data array with name, role, and image imports
- Use Framer Motion for staggered fade-in animations
- Circular photo containers with consistent aspect ratio
- Hover effect: slight scale up and shadow increase
- Accessible alt text for each team photo

### 3. Update About Page
Modify `src/pages/About.tsx`:
- Import the new TeamMembers component
- Place the section after "Our Values" and before "Who We Serve"
- Section title: "Meet Our Team"
- Subtitle: "The leadership driving STIL's mission forward"

## Visual Layout

```text
+------------------------------------------------------------------+
|                        Meet Our Team                              |
|     The leadership driving STIL's mission forward                 |
+------------------------------------------------------------------+
|                                                                    |
|  +--------+   +--------+   +--------+   +--------+   +--------+   |
|  |  (O)   |   |  (O)   |   |  (O)   |   |  (O)   |   |  (O)   |   |
|  | Photo  |   | Photo  |   | Photo  |   | Photo  |   | Photo  |   |
|  +--------+   +--------+   +--------+   +--------+   +--------+   |
|   Engr.        Engr.        Hauwa       Mr. Isah     Abdul        |
|   Idris        Sulaiman     Idris       Siyaka O.    Mumeen       |
|   Saliu                                                           |
|   -------       -------      -------     -------      -------     |
|   Founder       Site Ops     Director    Board of     Project     |
|                 Manager                  Trustee      Manager     |
+------------------------------------------------------------------+
```

## Technical Details

### Component Structure
```
TeamMembers.tsx
- teamMembers[] array with static data
- Framer Motion container/item variants
- Responsive grid: grid-cols-2 sm:grid-cols-3 lg:grid-cols-5
- Card design: rounded corners, subtle border, hover shadow
- Photo: 120px circular container, object-cover fit
```

### Styling
- Match existing card styling from Values and Client Types sections
- Use font-heading for names, font-body for roles
- Primary accent color for visual consistency
- Smooth hover transitions (300ms)

## Files to Create/Modify
1. **Create:** `src/assets/images/team/` directory
2. **Copy:** 5 team member photos to the new directory
3. **Create:** `src/components/TeamMembers.tsx`
4. **Modify:** `src/pages/About.tsx` - import and add TeamMembers section
