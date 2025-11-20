import { Icon } from "./Icon.jsx";
import { supabase } from "../utils/supabase.js";

export function Footer() {
  const handleDownloadManual = async () => {
    const { data, error } = await supabase.storage
      .from("Users_Manual")
      .download("MANUAL DE USUARIO (1).pdf");

    if (error) {
      console.error("Error descargando el manual:", error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manual_usuario.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="relative w-full bg-gradient-to-r from-primary_dark via-primary to-primary_dark">
      <div className="container mx-auto py-6 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <Section iconName="mail" text="hospedajefloritoyleo@gmail.com" />
          <Section iconName="phone" text="+57 313 447 0208" />
          <Section iconName="map" text="Cra. 4 #3-13, Monguí, Boyacá" />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleDownloadManual}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-xl shadow-md group"
          >
            <Icon name="help" color="text-white" />
            <span className="text-sm text-white font-semibold group-hover:text-white/90">
              ¿Necesita ayuda? Consulte el Manual de Usuario
            </span>
          </button>
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
  const handleDownloadManual = async () => {
    const { data, error } = await supabase.storage
      .from("Users_Manual")
      .download("MANUAL DE USUARIO (1).pdf");

    if (error) {
      console.error("Error descargando el manual:", error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manual_usuario.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="text-center py-6 text-sm text-gray-600 bg-gradient-to-t from-primary_dark/20 to-transparent">
      © 2025 Reser - Todos los derechos reservados

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDownloadManual}
          className="flex items-center gap-3 bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded-xl shadow-md group text-white"
        >
          <Icon name="help" color="text-white" />
          <span className="text-sm font-semibold group-hover:text-white/90">
            ¿Necesita ayuda? Consulte el Manual de Usuario
          </span>
        </button>
      </div>
    </footer>
  );
}