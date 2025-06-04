# Example: Using Praxis in Your Project

## Installation

```bash
npm install praxis-system
```

## Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import praxis from 'praxis-system/plugin';

export default defineConfig({
  plugins: [
    react(),
    praxis(), // 🔧 Enables .praxis.ts processing
  ],
});
```

## Component Configuration

```typescript
// src/components/Button/Button.praxis.ts
import type { PraxisConfig } from 'praxis-system';

const buttonConfig: PraxisConfig = {
  component: 'Button',
  props: {
    variant: {
      type: 'string',
      description: 'Button style variant',
      default: 'primary',
      validation: { enum: ['primary', 'secondary', 'danger'] }
    },
    size: {
      type: 'string',
      description: 'Button size',
      default: 'default', 
      validation: { enum: ['sm', 'default', 'lg'] }
    },
    isDisabled: {
      type: 'boolean',
      description: 'Disable the button',
      default: false
    }
  }
};

export default buttonConfig;
```

## Generated Props (Automatic)

```typescript
// src/components/Button/ButtonProps.ts (auto-generated)
export interface ButtonProps {
  /** Button style variant */
  variant?: string;
  /** Button size */
  size?: string;
  /** Disable the button */
  isDisabled?: boolean;
}

export default ButtonProps;
```

## Component Implementation

```typescript
// src/components/Button/Button.tsx
import React from 'react';
import type ButtonProps from './ButtonProps'; // Generated!

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  isDisabled = false,
  children
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
```

## Usage

```typescript
// src/App.tsx
import { Button } from './components/Button/Button';

export default function App() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Primary Large Button
      </Button>
      
      <Button variant="danger" isDisabled>
        Disabled Danger Button  
      </Button>
    </div>
  );
}
```

## Development Workflow

1. Edit `Button.praxis.ts` configuration
2. Save file → Praxis auto-generates `ButtonProps.ts`
3. Import generated types in your component
4. Full type safety + HMR updates

That's it! 🎉
