function getBiografiaIrrelevante(recortar) {
    
    // complete biography
    let BiografiaIrrelevante = `Jorge David Cumberbatch Navarro, better known as J DaProd, is a Cuban music producer and DJ born in 2002. Originally from Havana, he spent about 8 years of his childhood in New York, United States, where he grew up with the influence of African-American music, especially Rap and R&B. Later, in 2019, at the age of 17, he began making his first productions and DJ events in small venues, already back in Cuba. He initially started making electronic music, due to his taste for genres like future bass and melodic dubstep. From 2021, he began developing in genres from his past influences like trap, drill, R&B. Recently, after having lived about a year in Burkina Faso, J has also acquired influences from urban creation in Francophone Africa and France itself. J's goal is to establish a communication bridge between Hispanic, Anglophone and Francophone artists, no matter where they are from. Through collaboration and production credits, DaProd seeks to make a place for himself as a multilingual and polyfunctional producer in the industry. Today, known by some as 'TrapProd', he specializes in the development of trap, drill and R&B in any of their forms and derivatives, (being able to fuse in collaboration with artists and producers who wish to) although for technical processes like mixing and mastering, he can participate in other genres, the same when he acts as a DJ.`


    if(recortar !== true){return BiografiaIrrelevante} // if the recortar parameter is false, send the complete biography

                                                    // otherwise -----

    // Cut the first 200 characters
    let BiografiaIrrelevante_recortada = BiografiaIrrelevante.slice(0, 200);
    
    // Function to ensure the last line has at least X number of words
    function ajustarUltimaLinea(texto) {

        // Split the text into words
        const palabras = texto.split(' ');
        
        // If there are less than 3 words, do nothing
        if (palabras.length <= 3) {
            return texto;
        }

        // otherwise
        
        // Find the last space that leaves at least 3 words at the end
        for (let i = palabras.length - 1; i >= 0; i--) {
            const textoAjustado = palabras.slice(0, i).join(' ');
            const ultimasPalabras = palabras.slice(i);
            
            // Verify that the last 3 words don't cross to the next line
            if (ultimasPalabras.length >= 3) {
                return textoAjustado;
            }
        }
        
        return texto;
    }
    
    // Apply last line adjustment
    BiografiaIrrelevante_recortada = ajustarUltimaLinea(BiografiaIrrelevante_recortada);
    BiografiaIrrelevante_recortada = BiografiaIrrelevante_recortada + `...Read More`

    // save text length
    const longitud = BiografiaIrrelevante_recortada.length;

    // Split the text into parts
    const parteNormal = BiografiaIrrelevante_recortada.slice(0, longitud - 55);
    const parteDifuminada = BiografiaIrrelevante_recortada.slice(longitud - 55, longitud - 11);
    const parteNegrita = BiografiaIrrelevante_recortada.slice(longitud - 8); // read more (8 characters counting the space)

    // transparency effect
    let parteDifuminadaHTML = '';
    const caracteresDifuminados = parteDifuminada.split('');
    const totalCaracteres = caracteresDifuminados.length;
    
    caracteresDifuminados.forEach((caracter, index) => {
        // Calculate transparency according to the number of characters
        const progresion = index / (totalCaracteres - 1);
        
        // fade from 1 (completely visible) to 0.3 (very transparent) -- each character
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

// Function to insert the biography anywhere
function mostrarBiografia(eID, recortar) { // the eID parameter is the ID of the Element where the bio should be inserted and the other is to get the shortened or complete biography
    const biografiaHTML = getBiografiaIrrelevante(recortar);

    const elemento = document.getElementById(eID);
    if (elemento) {
        elemento.innerHTML = biografiaHTML;
    }

    return biografiaHTML;
};