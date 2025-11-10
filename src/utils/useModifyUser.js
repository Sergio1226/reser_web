import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase.js";
import { usePopup } from "../utils/PopupContext.jsx";

export function useModifyUser() {
  const { openPopup } = usePopup();

  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    setIsChanged(
      primerNombre !== originalData.primerNombre ||
      segundoNombre !== originalData.segundoNombre ||
      primerApellido !== originalData.primerApellido ||
      segundoApellido !== originalData.segundoApellido ||
      email !== originalData.email ||
      password !== ""
    );
  }, [primerNombre, segundoNombre, primerApellido, segundoApellido, email, password, originalData]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        const { data: clienteData, error: clienteError } = await supabase
          .from("clientes")
          .select(`
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            email,
            documento,
            tipos_documento(nombre)
          `)
          .eq("user_id", user.id)
          .single();

        if (clienteError) throw clienteError;

        setPrimerNombre(clienteData.primer_nombre);
        setSegundoNombre(clienteData.segundo_nombre ?? "");
        setPrimerApellido(clienteData.primer_apellido);
        setSegundoApellido(clienteData.segundo_apellido ?? "");
        setEmail(clienteData.email ?? "");
        setTipoDocumento(clienteData.tipos_documento?.nombre ?? "");
        setNumeroDocumento(clienteData.documento);

        setOriginalData({
          primerNombre: clienteData.primer_nombre,
          segundoNombre: clienteData.segundo_nombre ?? "",
          primerApellido: clienteData.primer_apellido,
          segundoApellido: clienteData.segundo_apellido ?? "",
          email: clienteData.email ?? "",
        });
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        openPopup("Error al cargar datos del usuario", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return;

      const { error: updateError } = await supabase
        .from("clientes")
        .update({
          primer_nombre: primerNombre,
          segundo_nombre: segundoNombre,
          primer_apellido: primerApellido,
          segundo_apellido: segundoApellido,
          email,
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      if (password) {
        const { error: passError } = await supabase.auth.updateUser({ password });
        if (passError) throw passError;
      }

      openPopup("Cambios guardados con éxito!", "success");
      setPassword("");
      setOriginalData({ primerNombre, segundoNombre, primerApellido, segundoApellido, email });
      setIsChanged(false);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      openPopup("No se pudieron guardar los cambios", "error");
    }
  };

  return {
    primerNombre, setPrimerNombre,
    segundoNombre, setSegundoNombre,
    primerApellido, setPrimerApellido,
    segundoApellido, setSegundoApellido,
    email, setEmail,
    password, setPassword,
    tipoDocumento, numeroDocumento,
    loading, isChanged, handleSave
  };
}