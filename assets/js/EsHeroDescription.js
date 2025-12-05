function getBiografiaIrrelevante(recortar) {
    
    // la biografia completa
    let BiografiaIrrelevante = `Jorge David Cumberbatch Navarro, más conocido como J DaProd, es un productor musical y DJ cubano nacido en 2002. Originario de La Habana, pasó alrededor de 8 años de su infancia en Nueva York, Estados Unidos, donde creció con la influencia de la música afroamericana, especialmente el Rap y Rnb. Posteriormente, en 2019, a la edad de 17 años, comenzó a hacer sus primeras producciones y eventos de DJ en pequeños locales, ya de regreso en Cuba. Inicialmente comenzó haciendo música electrónica, por su gusto por géneros como el future bass y el melodic dubstep, a partir de 2021, empezó a desarrollarse en géneros de su pasada influencia como el trap, drill, rnb. Recientemente, luego de haber vivido alrededor de un año en Burkina Faso, J ha adquirido también influencias de la creación urbana en el África francófona y Francia misma. El objetivo de J es establecer un puente comunicacional entre los artistas hispanos, anglófonos y francófonos, sin importar de donde sean. A través de la colaboración y los créditos de producción, DaProd busca hacerse un lugar como un productor multilingüe y polifuncional en la industria. Hoy, conocido por algunos como el 'TrapProd', se especializa en el desarrollo del trap, drill y rnb en cualquiera de sus formas y derivados, (pudiendo fusionar en colaboración con los artistas y productores que lo deseen) aunque para procesos técnicos como mezcla y masterización, puede participar en otros géneros, lo mismo cuando actúa de DJ.`


    if(recortar !== true){return BiografiaIrrelevante} // si el paramtro recortar es false, se envia la biografia completa

                                                    // caso contrario -----

    // Recortamos los primeros 200 caracteres
    let BiografiaIrrelevante_recortada = BiografiaIrrelevante.slice(0, 200);
    
    // Función para asegurar que la última línea tenga al menos X cantidad de palabras
    function ajustarUltimaLinea(texto) {

        // Dividir el texto en palabras
        const palabras = texto.split(' ');
        
        // Si hay menos de 3 palabras, no hacer nada
        if (palabras.length <= 3) {
            return texto;
        }

        // caso contrario
        
        // Encontrar el último espacio que deja al menos 3 palabras al final
        for (let i = palabras.length - 1; i >= 0; i--) {
            const textoAjustado = palabras.slice(0, i).join(' ');
            const ultimasPalabras = palabras.slice(i);
            
            // Verificar que las últimas 3 palabras no crucen al siguiente renglon
            if (ultimasPalabras.length >= 3) {
                return textoAjustado;
            }
        }
        
        return texto;
    }
    
    // Aplicar el ajuste de última línea
    BiografiaIrrelevante_recortada = ajustarUltimaLinea(BiografiaIrrelevante_recortada);
    BiografiaIrrelevante_recortada = BiografiaIrrelevante_recortada + `...Leer Más`

    // guardar cuanto mide el texto
    const longitud = BiografiaIrrelevante_recortada.length;

    // Dividir el texto en partes
    const parteNormal = BiografiaIrrelevante_recortada.slice(0, longitud - 55);
    const parteDifuminada = BiografiaIrrelevante_recortada.slice(longitud - 55, longitud - 11);
    const parteNegrita = BiografiaIrrelevante_recortada.slice(longitud - 8); // leer más (8 caracteres contando el espacio)

    // efecto de transparencia
    let parteDifuminadaHTML = '';
    const caracteresDifuminados = parteDifuminada.split('');
    const totalCaracteres = caracteresDifuminados.length;
    
    caracteresDifuminados.forEach((caracter, index) => {
        // Calcular la transparencia segun la cantidad de caracters
        const progresion = index / (totalCaracteres - 1);
        
        // transparentar desde 1 (completamente visible) a 0.3 (muy transparente) -- cada caracter
        const opacityAmount = 1 - (progresion * 0.7);
        
        parteDifuminadaHTML += `<span style="opacity: ${opacityAmount}; display: inline;">${caracter}</span>`;
    });

    BiografiaIrrelevante_recortada = `
            ${parteNormal}
            ${parteDifuminadaHTML}<br>
            <a href="#about" class="nav-link"><strong>${parteNegrita}</strong></a>
            
        `;

    return BiografiaIrrelevante_recortada;
}

// Función para insertar la biografia en cualquier parta
function mostrarBiografia(eID, recortar) { // el parametro eID es el ID de el Elemento donde debe insertarse la bio y el otro es para obtener la biografia recortada o completa
    const biografiaHTML = getBiografiaIrrelevante(recortar);

    const elemento = document.getElementById(eID);
    if (elemento) {
        elemento.innerHTML = biografiaHTML;
    }

    return biografiaHTML;
};