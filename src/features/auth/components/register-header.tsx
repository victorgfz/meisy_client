import { REGISTER_CONSTANTS } from '../constants/register.constants';

export function RegisterHeader() {
  const { title, subtitle } = REGISTER_CONSTANTS.header;

  return (
    <header className="flex flex-col items-center text-center w-full mt-4 md:mt-0">
      <h1 className="text-3xl md:text-5xl font-extrabold text-text-on-gradient m-0 mb-3 tracking-tight drop-shadow-sm">
        {title}
      </h1>

      <p className="text-base md:text-xl text-white/90 max-w-xs md:max-w-md font-medium leading-relaxed m-0 md:mt-2">
        {subtitle}
      </p>
    </header>
  );
}
