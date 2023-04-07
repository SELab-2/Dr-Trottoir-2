export function ColoredTag({ text, color }) {
  return (
    <div
      className={"inline-block text-center px-2 py-1 rounded-full text-sm"}
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
}
