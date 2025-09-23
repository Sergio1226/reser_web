import { Footer } from "../components/Footer.jsx";
import { BookingsMenu } from "../components/BookingsMenu.jsx";
import { BookingSearch } from "../components/BookingSearch.jsx";
import { Header } from "../components/Header.jsx";
import  ProfileButton  from "../components/ProfileButton.jsx";
import RoomCard from "../components/RoomCard.jsx";

export default function Bookings() {

    const rooms = [
        {
            id: 1,
            name: "Habitación Pericos",
            price: 160000,
            image: "/pericos.png",
            services: [
            { icon: "bath", label: "Baño Privado" },
            { icon: "wifi", label: "Wifi" },
            { icon: "tv", label: "Televisión" },
            ],
            description: "Disfruta de una estadía cómoda y tranquila con todas las comodidades que necesitas",
            details: [
            "Baño privado con ducha de agua caliente",
            "WiFi gratuito de alta velocidad",
            "Televisión por cable",
            "Limpieza diaria bajo solicitud",
            "Cama cómoda y ropa de cama limpia",
            "Buena ventilación e iluminación",
            "Artículos de aseo incluidos",
            ],
        },
        {
            id: 2,
            name: "Habitación Duzgua",
            price: 120000,
            image: "/duzgua.png",
            services: [
            { icon: "bath", label: "Baño compartido" },
            { icon: "wifi", label: "Wifi" },
            { icon: "tv", label: "Televisión" },
            ],
            description: "Ideal para quienes buscan comodidad a buen precio",
            details: [
            "Vista a la montaña",
            "Camas dobles con sábanas limpias",
            "Espacio ventilado",
            ],
        },
    ];

    return (
        <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
            <Header>
                <ProfileButton/>
            </Header>

            <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-center p-8 space-y-8">
                <BookingsMenu 
                    state="realizar"
                />
                <div className="w-[1000px] h-auto flex flex-col border border-black space-y-5">
                    <BookingSearch />
                    <div className="grid md:grid-cols-2 gap-6">
                        {rooms.map((r) => (
                            <RoomCard key={r.id} {...r} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer/>

        </div>
    );

}