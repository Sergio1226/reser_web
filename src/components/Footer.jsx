import { Icon } from "./Icon.jsx";

export function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-r from-primary_dark via-primary to-primary_dark">
      <div className="container mx-auto  py-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
          <Section iconName="mail" text="hospedajefloritoyleo@gmail.com" />
          <Section iconName="phone" text="+57 313 447 0208" />
          <Section iconName="map" text="Cra. 4 #3-13, Monguí, Boyacá" />
        </div>
      </div>
    </footer>
  );
}

function Section({ iconName, text }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex-shrink-0 w-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/15 transition-colors">
        <Icon name={iconName} color="text-header_text_accent" />
      </div>
      <p className="text-sm text-white/90 font-medium">{text}</p>
    </div>
  );
}

export function SmallFooter() {
  return (
    <footer className="text-center py-4 text-sm text-gray-600 bg-gradient-to-t from-primary_dark/20 to-transparent">
      © 2025 Reser - Todos los derechos reservados
    </footer>
  );
}