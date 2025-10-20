export function Icon({ name, style,onClick, alt }) {
    return (
        <img src={`/src/assets/icons/${name}.svg`} className={`${style}  size-icon`} alt={alt?alt:name} onClick={onClick} />
    );
}