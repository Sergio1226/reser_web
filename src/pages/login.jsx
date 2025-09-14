import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../components/HeaderForm.jsx";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-500 min-h-screen flex flex-col font-kameron">
            <HeaderForm />
            <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-1 items-center justify-center p-20">
                <div className="w-[500px] h-[450px] bg bg-primary rounded-lg flex flex-col items-center space-y-4">
                    <div className="text-center justify-start text-black text-4xl font-bold pt-4">
                        Iniciar Sesión
                    </div>
                    <input
                        type="email"
                        placeholder="correo@dominio.com"
                        className="w-96 h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-500 text-xl font-medium leading-loose focus:outline-primary p-5"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-96 h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-500 text-xl font-medium leading-loose focus:outline-primary p-2"
                    />
                    <Button
                        text="Continuar"
                        style=" w-[200px] h-[50px] bg-secondary"
                        onClick={() => navigate("/")}
                        iconName="Next"
                    />
                    <div className="self-stretch text-center justify-start text-black text-base font-normal font-['Inter'] leading-normal">
                        ¿No esta registrado?
                    </div>
                    <Button
                        text="Registrarse"
                        style=" w-[200px] h-[50px] bg-secondary"
                        onClick={() => navigate("/")}
                        iconName="Contact form"
                    />
                    <div className="self-stretch text-center justify-start">
                        <span class="text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
                        Haciendo click en continuar, usted acepta nuestros {" "}
                        </span>
                        <span class="text-black text-base font-normal font-['Inter'] leading-normal">
                        Terminos de servicio {" "}
                        </span>
                        <span class="text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
                        y {" "}
                        </span>
                        <span class="text-black text-base font-normal font-['Inter'] leading-normal">
                        Politicas de Privacidad
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );

}