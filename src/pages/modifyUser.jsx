import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { TextField } from "../components/TextField.jsx";
import { Button } from "../components/Button.jsx";
import { useRef, useState } from "react";

export default function ModifyUser() {
  const navigate = useNavigate();

  const defaultImage = "src/assets/default.jpg";
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleClickCambiarImagen = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen flex flex-col font-primary bg-white">
      <Header>
          <Button
          text="Atras"
          style=" w-fit bg-button_secondary"
          onClick={() => navigate(-1)}
          iconName="Back"
          />
      </Header>

      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-center p-8 space-y-8">
        
      <h1 className="text-3xl font-bold">Camilin Perra</h1>

      <div className="border border-black/20 w-full flex">

            <div className="flex flex-col">

                <div className="border border-black/20 border-b-0 w-[450px] h-[250px] flex flex-col justify-center items-center">
                    <img
                        className="rounded-[60px] w-[350px] h-[180px] border border-black/20 object-countain"
                        src={image || defaultImage}
                        alt="userImg"
                    />
                </div>

                <div className="border border-black/20 w-[450px] h-[250px] flex flex-col justify-center items-center gap-10">
                    <Button 
                        text="Cambiar Imagen" 
                        style="bg-blue-500 text-white px-4 py-2" 
                        onClick={handleClickCambiarImagen}
                        iconName="image" 
                    />

                    <Button 
                        text="Cambiar de cuenta" 
                        style="bg-green-500 text-white px-4 py-2" 
                        onClick={() =>navigate("/loginAdmin")} 
                        iconName="refresh-cw"
                    />
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="border border-black/20 border-l-0 flex-1 h-[500px] flex flex-col">
            
            <div className="grid grid-cols-2 gap-4 flex-1 p-4">

              <div className="flex items-center justify-center p-6">
                <TextField 
                  placeholder="Ingrese nombre" 
                  className = "bg-white rounded-lg p-[5px] w-[100px]"
                  type="text" 
                  required={true} 
                />
              </div>
              
              <div className="flex items-center justify-center p-6">
                <TextField 
                  placeholder="Tipo de Documento" 
                  className = "bg-white rounded-lg p-[5px] w-[100px]"
                  type="text" 
                  required={true} 
                />
              </div>

              <div className="flex items-center justify-center p-6">
                <TextField 
                  placeholder="Telefono" 
                  className = "bg-white rounded-lg p-[5px] w-[100px]"
                  type="text" 
                  required={true} 
                />
              </div>

              <div className="flex items-center justify-center p-6">
                <TextField 
                  placeholder="Numero de documento" 
                  className = "bg-white rounded-lg p-[5px] w-[100px]"
                  type="text" 
                  required={true} 
                />
              </div>

              <div className="flex items-center justify-center p-6">
                <TextField 
                  placeholder="Correo electronico" 
                  className = "bg-white rounded-lg p-[5px] w-[100px]"
                  type="text" 
                  required={true} 
                />
              </div>

              <div className="flex items-center justify-center p-6">
                <TextField 
                  placeholder="Contraseña" 
                  className = "bg-white rounded-lg p-[5px] w-[100px]"
                  type="text" 
                  required={true} 
                />
              </div>

            </div>

            <div className="p-4 border-t border-black/20 flex justify-end">

              <Button 
                  text="Guardar Cambios" 
                  style="bg-gray-500 text-white px-4 py-2"  
                  iconName="save-all"
              />

            </div>

          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}

