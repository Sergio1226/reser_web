import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: currentSession, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (currentSession.session) {
        const { data: userRole, error: errorRol } = await supabase.rpc(
          "get_role",
          {
            uid: currentSession.session.user.id,
          }
        );
        setSession(currentSession.session);
        setRole(userRole);
        setLoading(false);
        if (errorRol) throw errorRol;
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (session === undefined || session === "") {
      setRole("");
      setSession(undefined);
      return;
    }
  }, [session, role]);

  const signUpNewUser = async ({ user, email, password }) => {
    const { data: documentExists } = await supabase.rpc("document_exist", {
      p_documento: user.documento,
      p_tipo: user.tipo_documento,
    });
    if (documentExists) {
      throw new Error("El documento ya está en uso");
    }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error.message);
      if (error.message === "User already registered")
        throw new Error("Correo ya registrado");
      throw new Error("Error al crear el usuario");
    }
    user.user_id = data.user.id;
    await addUser({ user });
    return data;
  };
  const addUser = async ({ user }) => {
    const { data, error } = await supabase
      .from("clientes")
      .insert(user)
      .select();
    if (error) throw new Error("Error al agregar el usuario");
    await supabase
      .from("roles_users")
      .insert({ id_rol: 1, user_id: user.user_id });
    return data;
  };

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: userRole, error: errorRol } = await supabase.rpc(
        "get_role",
        {
          uid: data.user.id,
        }
      );

      if (errorRol) throw errorRol;

      setSession(data.session);
      setRole(userRole);

      return userRole;
    } catch (error) {
      console.error("Error en signIn:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setSession(null);
    setRole("");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getUser = async (user) => {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", user);
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        role,
        loading,
        signUpNewUser,
        signIn,
        signOut,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
