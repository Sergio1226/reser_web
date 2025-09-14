import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../components/HeaderForm.jsx";
import { Footer } from "../components/Footer.jsx";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-500 min-h-screen flex flex-col font-kameron">
            <HeaderForm />
            <main className="bg-gradient-to-b from-secondary to-gradient_1 flex-1">
                
            </main>
        </div>
    );

}