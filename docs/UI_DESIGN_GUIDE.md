# 🎨 ERP UI Design Guide (Gold/Zinc Edition)

This guide defines the design system for the ERP project, ensuring consistency between the standalone `inv/` templates and the Next.js `app/`.

---

## 💎 Design Philosophy
- **Premium Aesthetics**: High-end feel using Gold accents and Deep Zinc surfaces.
- **Modular Structure**: Components are designed to be independent and reusable.
- **Information Density**: Compact data presentation for efficient operations.

---

## 🎨 Color Palette

| Name | Hex | CSS/Tailwind Token | Usage |
|---|---|---|---|
| **Gold** | `#D4AF37` | `--primary` / `bg-primary` | Primary CTAs, Active States |
| **Gold Dark** | `#B49020` | `--primary-dark` | Hover States, Secondary Accents |
| **Zinc 950** | `#18181B` | `--sidebar` | Sidebar Background |
| **Zinc 900** | `#27272A` | `--sidebar-accent` | Sidebar Inset/Border |
| **Slate 50** | `#F8FAFC` | `--background` | Main App Background |
| **Slate 200** | `#E2E8F0` | `--border` | Default Dividers/Lines |
| **Slate 700** | `#334155` | `--muted-foreground` | Secondary Text |
| **Slate 950** | `#0F172A` | `--foreground` | Main Headings/Body Text |

---

## 🔠 Typography
- **Primary Typeface**: `Plus Jakarta Sans`
  - *Body*: 13px (Default)
  - *Small/Muted*: 10-11px
  - *Headings*: 18-26px (Semi-bold to Extra-bold)
- **Monospace Typeface**: `IBM Plex Mono`
  - Used for SKUs, reference numbers, and code-like data.

---

## 🧩 Component Patterns

### 1. Sidebar (`Sidebar.tsx`)
- **Background**: Zinc 950.
- **Navigation**:
  - `padding: 10px 13px`, `radius: 12px`.
  - Active: `bg-gradient-to-r from-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.08)]` + `shadow-[inset_2px_0_0_#D4AF37]`.
  - Hover: `hover:bg-white/5 hover:translate-x-[2px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]`.

### 2. Cards (`Card.tsx`)
- **Radius**: Large (`18px`).
- **Styles**:
  - Border: 1px solid Slate 200.
  - Shadow: `shadow-[0_10px_20px_rgba(15,23,42,0.06)]`.
  - Padding: `p-5` or `p-6` for standard cards.

### 3. Data Tables (`Table.tsx`)
- **Style**: No vertical borders.
- **Headers**: Sticky, Slate 50 background, small uppercase text (9px).
- **Cells**: Standard 11px text, white-space: nowrap (with overflow control).

### 4. Forms & Inputs
- **Radius**: `10px`.
- **Labels**: `uppercase`, `text-[10px]`, `font-extrabold`, `text-muted-foreground`.
- **Buttons**:
  - Primary: Gold background, white text, 10px radius.
  - Ghost: White background, Slate 200 border.

---

## 🚀 Implementation Rules
1. **Always use Tailwind CSS**: Avoid custom CSS in `.module.css` files.
2. **Prioritize Shadcn**: Use existing Shadcn components and customize their themes via `globals.css`.
3. **No Placeholders**: Use `generate_image` or actual assets for UI demonstrations.
4. **Consistency**: Ensure all new modules follow this guide strictly.
