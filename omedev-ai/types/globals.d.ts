// CSS module declarations
declare module '*.css' {
  const styles: Record<string, string>
  export default styles
}

// Global CSS import (Next.js)
declare module '*/globals.css'

// SVG as React components
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

// Image imports
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}
