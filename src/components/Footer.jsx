import { Icon } from "./Icon.jsx";

export function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-r from-primary_dark via-primary to-primary_dark border-t border-white/10 shadow-inner text-white">
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-center md:justify-around items-center px-4 py-6 space-y-4 md:space-y-0 font-primary relative z-10">
        <Section iconName="mail" text="hospedajefloritoyleo@gmail.com" />
        <Section iconName="phone" text="+57 313 447 0208" />
        <Section iconName="map" text="Cra. 4 #3-13, Monguí, Boyacá" />
      </div>
    </footer>
  );
}

function Section({ iconName, text }) {
  return (
    <div className="flex flex-row items-center gap-3 hover:scale-105 transition-transform duration-300">
      <Icon name={iconName} color="text-header_text_accent" />
      <h2 className="text-base  tracking-wide">{text}</h2>
    </div>
  );
}

export function     SmallFooter(){
    return ( <footer className="text-center py-4 text-sm text-gray-600 bg-gradient-to-t from-primary_dark/20 to-transparent">
        © 2025 SiRest - Todos los derechos reservados
      </footer>);
}