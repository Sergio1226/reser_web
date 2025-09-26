import ExtraServices from "../components/ExtraServices";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function AddServices(){

    const navigate = useNavigate();
    
    return(
        <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
            <Header>
                <Button
                    text="Atras"
                    style=" w-fit bg-button_secondary"
                    onClick={() => navigate("/bookings")}
                    iconName="Back"
                />
            </Header>

            <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-center p-8 space-y-8">

                <ExtraServices/>

            </main>

        </div>
    
    );

}