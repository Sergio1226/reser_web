export function Icon({ name, style }) {
    return (
        <img src={`/src/assets/icons/${name}.svg`} className={`mr-2 size-icon ${style}`} alt={name} />
    );
}