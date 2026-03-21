interface DividerWithTextProps {
  text: string;
}

export function DividerWithText({ text }: DividerWithTextProps) {
  return (
    <div className="flex items-center gap-4 w-full">
      <span className="flex-1 h-px bg-border" />
      <span className="text-sm text-text-muted whitespace-nowrap">{text}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}
