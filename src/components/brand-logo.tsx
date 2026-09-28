interface BrandLogoProps {
  iconClassName: string;
  textClassName: string;
}

export function BrandLogo({ iconClassName, textClassName }: BrandLogoProps) {
  return (
    <div className="flex items-center">
      <img src="/favicon.svg" alt="" className={iconClassName} />
      <span className={`font-semibold tracking-[-0.035em] text-text-primary ${textClassName}`}>
        Meisy
      </span>
    </div>
  );
}
