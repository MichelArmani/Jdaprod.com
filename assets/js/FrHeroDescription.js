function getBiografiaIrrelevante(recortar) {
    
    // biographie complète
    let BiografiaIrrelevante = `Jorge David Cumberbatch Navarro, plus connu sous le nom de J DaProd, est un producteur musical et DJ cubain né en 2002. Originaire de La Havane, il a passé environ 8 ans de son enfance à New York, aux États-Unis, où il a grandi sous l'influence de la musique afro-américaine, notamment le Rap et le R&B. Plus tard, en 2019, à l'âge de 17 ans, il a commencé à faire ses premières productions et événements de DJ dans de petits établissements, déjà de retour à Cuba. Il a initialement commencé par faire de la musique électronique, en raison de son goût pour des genres comme le future bass et le melodic dubstep. À partir de 2021, il s'est développé dans des genres de ses influences passées comme le trap, le drill, le R&B. Récemment, après avoir vécu environ un an au Burkina Faso, J a également acquis des influences de la création urbaine en Afrique francophone et en France même. L'objectif de J est d'établir un pont de communication entre les artistes hispanophones, anglophones et francophones, peu importe d'où ils viennent. À travers la collaboration et les crédits de production, DaProd cherche à se faire une place en tant que producteur multilingue et polyfonctionnel dans l'industrie. Aujourd'hui, connu par certains comme le 'TrapProd', il se spécialise dans le développement du trap, du drill et du R&B sous toutes leurs formes et dérivés, (pouvant fusionner en collaboration avec les artistes et producteurs qui le souhaitent) bien que pour les processus techniques comme le mixage et le mastering, il puisse participer à d'autres genres, de même lorsqu'il agit en tant que DJ.`


    if(recortar !== true){return BiografiaIrrelevante} // si le paramètre recortar est false, envoyer la biographie complète

                                                    // sinon -----

    // Couper les premiers 200 caractères
    let BiografiaIrrelevante_recortada = BiografiaIrrelevante.slice(0, 200);
    
    // Fonction pour s'assurer que la dernière ligne ait au moins X nombre de mots
    function ajustarUltimaLinea(texto) {

        // Diviser le texte en mots
        const palabras = texto.split(' ');
        
        // S'il y a moins de 3 mots, ne rien faire
        if (palabras.length <= 3) {
            return texto;
        }

        // sinon
        
        // Trouver le dernier espace qui laisse au moins 3 mots à la fin
        for (let i = palabras.length - 1; i >= 0; i--) {
            const textoAjustado = palabras.slice(0, i).join(' ');
            const ultimasPalabras = palabras.slice(i);
            
            // Vérifier que les 3 derniers mots ne passent pas à la ligne suivante
            if (ultimasPalabras.length >= 3) {
                return textoAjustado;
            }
        }
        
        return texto;
    }
    
    // Appliquer l'ajustement de dernière ligne
    BiografiaIrrelevante_recortada = ajustarUltimaLinea(BiografiaIrrelevante_recortada);
    BiografiaIrrelevante_recortada = BiografiaIrrelevante_recortada + `...Lire Plus`

    // sauvegarder la longueur du texte
    const longitud = BiografiaIrrelevante_recortada.length;

    // Diviser le texte en parties
    const parteNormal = BiografiaIrrelevante_recortada.slice(0, longitud - 55);
    const parteDifuminada = BiografiaIrrelevante_recortada.slice(longitud - 55, longitud - 11);
    const parteNegrita = BiografiaIrrelevante_recortada.slice(longitud - 8); // lire plus (8 caractères comptant l'espace)

    // effet de transparence
    let parteDifuminadaHTML = '';
    const caracteresDifuminados = parteDifuminada.split('');
    const totalCaracteres = caracteresDifuminados.length;
    
    caracteresDifuminados.forEach((caracter, index) => {
        // Calculer la transparence selon le nombre de caractères
        const progresion = index / (totalCaracteres - 1);
        
        // estomper de 1 (complètement visible) à 0.3 (très transparent) -- chaque caractère
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

// Fonction pour insérer la biographie n'importe où
function mostrarBiografia(eID, recortar) { // le paramètre eID est l'ID de l'Élément où la bio doit être insérée et l'autre est pour obtenir la biographie raccourcie ou complète
    const biografiaHTML = getBiografiaIrrelevante(recortar);

    const elemento = document.getElementById(eID);
    if (elemento) {
        elemento.innerHTML = biografiaHTML;
    }

    return biografiaHTML;
};