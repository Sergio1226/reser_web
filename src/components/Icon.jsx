export function Icon({ name, style,onClick, alt }) {
    return (
        <img src={`/src/assets/icons/${name}.svg`} className={`mr-2 size-icon ${style}`} alt={alt?alt:name} onClick={onClick} />
    );
}