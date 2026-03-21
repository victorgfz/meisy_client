import { ShoppingBag } from 'lucide-react';
import { LOGIN_CONSTANTS } from '../constants/login.constants';

export function LoginHeader() {
  const { title, subtitle } = LOGIN_CONSTANTS.header;

  return (
    <header className="flex flex-col items-center text-center w-full">
      {/* Shopping Bag / Lock Icon */}
      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center mb-5 md:mb-8 shadow-inner border border-white/20 backdrop-blur-sm transition-transform hover:scale-105 duration-300">
        <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-md" strokeWidth={1.8} />
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-text-on-gradient m-0 mb-3 tracking-tight drop-shadow-sm">
        {title}
      </h1>

      <p className="text-base md:text-xl text-white/90 max-w-xs md:max-w-md font-medium leading-relaxed m-0 md:mt-2">
        {subtitle}
      </p>
    </header>
  );
}
