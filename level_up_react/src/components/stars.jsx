export default function renderEstrellas(puntos) {
    if (puntos === undefined || puntos === null || puntos === 0) {
        return (
            <div className="estrellas">
                <span className="sin-puntuacion">No hay puntuación todavía</span>
            </div>
        );
    }

    const puntuacion = parseInt(puntos);
    
    // Configuración de estrellas por puntuación
    const configEstrellas = {
        1: ['half', 'empty', 'empty', 'empty', 'empty'],
        2: ['full', 'empty', 'empty', 'empty', 'empty'],
        3: ['full', 'half', 'empty', 'empty', 'empty'],
        4: ['full', 'full', 'empty', 'empty', 'empty'],
        5: ['full', 'full', 'half', 'empty', 'empty'],
        6: ['full', 'full', 'full', 'empty', 'empty'],
        7: ['full', 'full', 'full', 'half', 'empty'],
        8: ['full', 'full', 'full', 'full', 'empty'],
        9: ['full', 'full', 'full', 'full', 'half'],
        10: ['full', 'full', 'full', 'full', 'full']
    };

    const estrellas = configEstrellas[puntuacion] || ['empty', 'empty', 'empty', 'empty', 'empty'];

    // Iconos por tipo
    const iconos = {
        'full': 'fa-solid fa-star',
        'half': 'fa-solid fa-star-half-stroke', 
        'empty': 'fa-regular fa-star'
    };

    return (
        <div className="estrellas">
            {estrellas.map((tipo, index) => (
                <i key={index} className={iconos[tipo]}></i>
            ))}
        </div>
    );
}