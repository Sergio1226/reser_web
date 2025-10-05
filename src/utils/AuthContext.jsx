import { createContext, useState, useContext } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  const singUpNewUser = async ({ user,email,password}) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.log(error);
      return;
    }
    user.user_id=data.user.id
    addUser({user});
    return data;
  };
  const addUser=async({user})=>{
    const { data, error } = await supabase
    .from("clientes")
    .insert(user)
    .select();
    if (error) {
      console.log(error);
      return;
    }
    return data;
  }

  return (
    <AuthContext.Provider value={{ session, singUpNewUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
