export default function ScatteredReveal({ children, className = '', ...props }) {
  // Neutralized to remove artificial scatter/rotation/blur animations
  // Provides clean, dignified luxury rendering
  return (
    <div className={className} style={props.style}>
      {children}
    </div>
  );
}
