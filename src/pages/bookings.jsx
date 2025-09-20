import { Footer } from "../components/Footer.jsx";
import { BookingsMenu } from "../components/BookingsMenu.jsx";
import { BookingSearch } from "../components/BookingSearch.jsx";
import { Header } from "../components/Header.jsx";

export default function Bookings() {

    return (
        <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
            <Header></Header>

            <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-center p-8 space-y-8">
                <BookingsMenu />
                <div className="w-[1000px] h-auto flex flex-col border border-black">
                    <BookingSearch />
                </div>
            </main>

            <Footer/>

        </div>
    );

}