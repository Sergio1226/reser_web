import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [role, setRole] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: currentSession , error} = await supabase.auth.getSession();
      
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
        if (errorRol) throw errorRol;
      }

    };

    initializeAuth();

    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   async (event, currentSession) => {
    //     console.log("Auth state changed:", event);

    //     if (currentSession) {
    //       try {
    //         const { data: userRole, error: errorRol } = await supabase.rpc(
    //           "get_role",
    //           {
    //             uid: currentSession.user.id,
    //           }
    //         );

    //         if (errorRol) throw errorRol;

    //         setSession(currentSession);
    //         setRole(userRole);
    //       } catch (error) {
    //         console.error("Error al obtener rol:", error);
    //       }
    //     } else {
    //       setSession(null);
    //       setRole(null);
    //     }

    //     setLoading(false);
    //   }
    // );

    // return () => {
    //   authListener?.subscription?.unsubscribe();
    // };
  }, []);

  const signUpNewUser = async ({ user, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) throw error;
    user.user_id = data.user.id;
    await addUser({ user });
    return data;
  };

  const addUser = async ({ user }) => {
    const { data, error } = await supabase
      .from("clientes")
      .insert(user)
      .select();
    if (error) throw error;
    await supabase.from("roles_users").insert({id_rol: 1, user_id: user.user_id});
    return data;
  };

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login exitoso, datos:", data);
      console.log("aca", data.user.id);
      
      const { data: userRole, error: errorRol } = await supabase.rpc(
        "get_role",
        {
          uid: data.user.id,
        }
      );
      console.log("aca2", userRole);

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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setRole("");
  };

  return (
    <AuthContext.Provider
      value={{ session, role, signUpNewUser, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
