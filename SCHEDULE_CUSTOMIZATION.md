# Schedule Color Customization Guide

## 🎨 How to Customize Colors

Your DetailedSchedule component now supports fully customizable colors matching the reference design!

### Location
Find the `levelColors` object at the top of the `DetailedSchedule` component (around line 77):

```javascript
const levelColors = {
  0: { bg: "#d1f5e8", bar: "#4a5568" }, // Project level
  1: { bg: "#80e5b4", bar: "#38b87c" }, // Level 1 - green
  2: { bg: "#ffb84d", bar: "#ff9f40" }, // Level 2 - orange
  3: { bg: "#5b9aff", bar: "#5b9aff" }, // Level 3 - blue
  4: { bg: "#ff6b6b", bar: "#ff6b6b" }, // Level 4 - red/coral
  5: { bg: "#b4e7ff", bar: "#00b5e5" }, // Level 5+ - light blue
};
```

### Color Properties
Each level has two colors:
- **`bg`**: Background color for the table row
- **`bar`**: Color for the timeline Gantt bar

### Example Customizations

#### Option 1: Corporate Blue Theme
```javascript
const levelColors = {
  0: { bg: "#e3f2fd", bar: "#1565c0" },
  1: { bg: "#bbdefb", bar: "#1976d2" },
  2: { bg: "#90caf9", bar: "#1e88e5" },
  3: { bg: "#64b5f6", bar: "#2196f3" },
  4: { bg: "#42a5f5", bar: "#42a5f5" },
  5: { bg: "#2196f3", bar: "#1976d2" },
};
```

#### Option 2: Warm Earth Tones
```javascript
const levelColors = {
  0: { bg: "#fff3e0", bar: "#6d4c41" },
  1: { bg: "#ffe0b2", bar: "#8d6e63" },
  2: { bg: "#ffcc80", bar: "#a1887f" },
  3: { bg: "#ffb74d", bar: "#bcaaa4" },
  4: { bg: "#ffa726", bar: "#d7ccc8" },
  5: { bg: "#ff9800", bar: "#efebe9" },
};
```

#### Option 3: Monochrome Professional
```javascript
const levelColors = {
  0: { bg: "#f5f5f5", bar: "#212121" },
  1: { bg: "#e0e0e0", bar: "#424242" },
  2: { bg: "#bdbdbd", bar: "#616161" },
  3: { bg: "#9e9e9e", bar: "#757575" },
  4: { bg: "#757575", bar: "#9e9e9e" },
  5: { bg: "#616161", bar: "#bdbdbd" },
};
```

## 📊 Current Design Features

✅ **Purple gradient header** matching reference image  
✅ **Customizable row backgrounds** per hierarchy level  
✅ **Matching timeline bar colors** for each level  
✅ **Professional table styling** with clean borders  
✅ **Automatic text contrast** (dark text on light backgrounds)  
✅ **Smooth hover effects** on bars and rows  
✅ **PDF export** with full color preservation  

## 🔧 Design Specifications

### Header
- Gradient: `#5546d4` → `#7160e8`
- Font: 16px, uppercase, letter-spacing

### Table
- Background: White (`#ffffff`)
- Border: Light gray (`#e5e7eb`)
- Header: Light gray background (`#f9fafb`)

### Timeline Bars
- Height: 20px
- Border-radius: 4px
- Opacity: 0.95 (normal), 1.0 (hover)
- Shadow: `0 1px 3px rgba(0,0,0,0.12)`

### Row Hover
- Opacity reduces to 0.95 for visual feedback

## 💡 Tips

1. **Matching bars to rows**: Set both `bg` and `bar` to the same color for unified look
2. **High contrast bars**: Use darker `bar` colors on lighter `bg` for clear visibility
3. **Accessibility**: Ensure sufficient contrast between text and backgrounds
4. **Consistency**: Use color scales (lighter to darker) for hierarchical clarity

## 🚀 Quick Start

1. Open `src/components/DetailedSchedule.jsx`
2. Find the `levelColors` object (line ~77)
3. Change hex color values to your brand colors
4. Save and refresh - changes appear instantly!

---

**Need help?** The component automatically handles text contrast, so you can focus on choosing colors that match your brand.
