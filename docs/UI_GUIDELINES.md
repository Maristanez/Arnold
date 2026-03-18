# UI Guidelines

The Arnold app aims to provide a rich, premium, and clean aesthetic. 

## 1. Color Palette

- **Primary Colors**
  - **Brand Active**: `#4CAF50` (Green)
  - **Brand Dark**: `#2E7D32` (Dark Green)
- **Backgrounds**
  - **Light Mode App Background**: `#F8F9FA` (Soft White/Gray)
  - **Dark Mode App Background**: `#121212` (Deep Dark)
  - **Card/Surface Color Light**: `#FFFFFF`
  - **Card/Surface Color Dark**: `#1E1E1E`
- **Text**
  - **Primary Text Light Mode**: `#212121`
  - **Secondary Text Light Mode**: `#757575`
  - **Primary Text Dark Mode**: `#E0E0E0`
  - **Secondary Text Dark Mode**: `#9E9E9E`
- **Utility / Accent Colors**
  - **Error/Destructive**: `#D32F2F`
  - **Success**: `#388E3C`
  - **Warning**: `#F57C00`
  - **Information**: `#1976D2`

## 2. Typography

We use standard, legible typography prioritizing readibility and modern feel.

- **Headers**: Bold weights (700) with generous tracking and line height.
- **Body**: Regular weights (400) for standard content. Lines separated by good vertical margins.
- **Button/Labels**: Medium (500), slightly more tightly letter-spaced for focus.

## 3. Styling Rules & Practices

1. **Flexbox**: Use Flexbox for layout to guarantee fluid adaptation to devices.
   - Example padding and margins should use safe, standard, repeatable intervals (`4, 8, 12, 16, 24, 32`).
2. **Components**:
   - `Buttons`: Minimum 48px height to conform to mobile tap target standards. Rounded corners (`borderRadius: 8` or `12`).
   - `Inputs`: Keep borders minimal. Highlight active state borders using the Primary Brand Color.
   - `Cards`: Add subtle shadowing or elevation across light themes. In dark mode, rely heavily on structural separation through backgrounds (`#1E1E1E`) rather than shadows.
3. **Animations**: Keep page transitions minimal but utilize slight interaction micro-animations (like scaling on presses with `Pressable`). 
4. **Icons**: Standardize around vector icons (e.g. `lucide-react-native` or `expo-vector-icons`), ensuring equal sizing (e.g., `24x24`) unless emphasized otherwise.

## 4. SafeArea & Devices
- Always wrap main application scaffolding in `SafeAreaView`.
- Make use of `KeyboardAvoidingView` natively to handle form inputs on different OS behaviors (iOS padding, Android height).
