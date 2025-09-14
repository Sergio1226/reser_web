import { Icon } from "./Icon.jsx";

export function Footer() {
    return (
        <footer className="bg-primary p-2 border-t border-black/20 max-h-[20] flex flex-row justify-around">
            <Section iconName="mail" text="hospedajefloritoyleo@gmail.com"></Section>
            <Section iconName="phone" text="3134470208"></Section>
            <Section iconName="map" text="Cra. 4 #3-13, Monguí, Boyacá"></Section>
            {/* Por agregar picker de idiomas*/}
            <Section iconName="net" text="Español"></Section>
        </footer>
    )
}

function Section({iconName, text}) {
    return (
        <div className="flex flex-row items-center justify-center p-4 font-kameron">
            <Icon name={iconName} />
            <h2 className="text-ls font-normal">{text}</h2>
        </div>
    );
}