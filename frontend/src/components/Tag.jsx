export default function ColoredTag({ className, children }) {
  return (
    <div className={`${className} rounded-full px-3 py-1 m-1 w-fit `}>
      {children}
    </div>
  );
}
