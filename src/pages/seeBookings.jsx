import { Header } from "../components/Header";
import { BookingsMenu } from "../components/BookingsMenu";
import { Footer } from "../components/Footer";
import ProfileButton from "../components/ProfileButton";
import { BookingsTable } from "../components/BookingsTable";

export default function SeeBookings(){

    return (
        <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
            <Header>
                <ProfileButton/>
            </Header>

            <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-center p-8 space-y-8">
                <BookingsMenu 
                    state="visualizar"
                />
                <div className="w-[1000px] h-auto flex flex-col border border-black">
                    <BookingsTable/>
                </div>
            </main>

            <Footer/>

        </div>
    );

}