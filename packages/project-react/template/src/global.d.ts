declare module '*.svg' {
  const value: any
  export default value
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.scss?modules' {
  const content: { [className: string]: string }
  export default content
}
