<?php
session_start();
// Verificar autenticación
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header("Location: index.php");
    exit;
}

// $inactivity_timeout = 30 * 60;
// if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $inactivity_timeout)) {
//     pass;
// }

$_SESSION['last_activity'] = time();

// Ruta al archivo tracksList.js
$tracksFile = '../tracksList.js';

// Leer y procesar tracks
function getTracksFromFile($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    
    $content = file_get_contents($filePath);
    
    // Solo cristo sabe la magia que hace la siguiente linea (Extrae el array de tracks)
    preg_match('/function getTracks\(\)\s*{\s*return\s*\[(.*?)\];\s*}/s', $content, $matches);
    
    if (empty($matches[1])) {
        return [];
    }
    
    $tracksArrayString = $matches[1];
    
    // Convertir el array de JavaScript a PHP
    $tracks = [];
    $pattern = '/\{([^}]+)\}/s';
    preg_match_all($pattern, $tracksArrayString, $trackMatches);
    
    foreach ($trackMatches[0] as $trackString) {
        $track = [];
        
        // Extraer propiedades básicas
        // me encanta, ME ENCANTA COMPLICARME LA VIDA, DE VERDAD. Todo por no querer hacer las cosas de manera descente.
        // lit no tenia que crear un puto tracklist.js pero que asco la vida
        preg_match('/id:\s*(\d+)/', $trackString, $idMatch);
        preg_match('/title:\s*"([^"]+)"/', $trackString, $titleMatch);
        preg_match('/artist:\s*"([^"]+)"/', $trackString, $artistMatch);
        preg_match('/duration:\s*"([^"]*)"/', $trackString, $durationMatch);
        preg_match('/preview:\s*"([^"]+)"/', $trackString, $previewMatch);
        preg_match('/type:\s*"([^"]+)"/', $trackString, $typeMatch);
        preg_match('/premiumPrice:\s*(\d+)/', $trackString, $premiumPriceMatch);
        preg_match('/basicPrice:\s*(\d+)/', $trackString, $basicPriceMatch);
        preg_match('/premiumPaypalButton:\s*"([^"]*)"/', $trackString, $premiumPaypalMatch);
        preg_match('/basicPaypalButton:\s*"([^"]*)"/', $trackString, $basicPaypalMatch);
        preg_match('/premiumFileForDownload:\s*"([^"]*)"/', $trackString, $premiumFileMatch);
        preg_match('/basicFileForDownload:\s*"([^"]*)"/', $trackString, $basicFileMatch);
        
        if ($idMatch) {
            $track['id'] = (int)$idMatch[1];
            $track['title'] = $titleMatch[1] ?? '';
            $track['artist'] = $artistMatch[1] ?? '';
            $track['duration'] = $durationMatch[1] ?? '';
            $track['preview'] = $previewMatch[1] ?? '';
            $track['type'] = $typeMatch[1] ?? '';
            $track['premiumPrice'] = isset($premiumPriceMatch[1]) ? (float)$premiumPriceMatch[1] : 0;
            $track['basicPrice'] = isset($basicPriceMatch[1]) ? (float)$basicPriceMatch[1] : 0;
            $track['premiumPaypalButton'] = $premiumPaypalMatch[1] ?? 'TN2YM52GDBPLS';
            $track['basicPaypalButton'] = $basicPaypalMatch[1] ?? 'XMMGD24J4K9CA';
            $track['premiumFileForDownload'] = $premiumFileMatch[1] ?? '';
            $track['basicFileForDownload'] = $basicFileMatch[1] ?? '';
            
            $tracks[] = $track;
        }
    }
    
    return $tracks;
}

// Guardar los cambiois en trackslist.js
function saveTracksToFile($tracks, $filePath) {
    $jsContent = "// es facil esto, aunque no sepas js es bastante intuitivo, agregar\n\n";
    $jsContent .= "function getTracks() {\n    return [\n\n";
    
    foreach ($tracks as $track) {
        $jsContent .= "        {\n";
        $jsContent .= "            id: " . $track['id'] . ",\n";
        $jsContent .= "            title: \"{$track['title']}\",\n";
        $jsContent .= "            artist: \"{$track['artist']}\",\n";
        $jsContent .= "            duration: \"{$track['duration']}\",\n";
        $jsContent .= "            preview: \"{$track['preview']}\",\n";
        $jsContent .= "            type: \"{$track['type']}\",\n";
        
        if ($track['type'] === 'shop') {
            $jsContent .= "            premiumPrice: {$track['premiumPrice']},\n";
            $jsContent .= "            basicPrice: {$track['basicPrice']},\n";
            $jsContent .= "            premiumPaypalButton: \"{$track['premiumPaypalButton']}\",\n";
            $jsContent .= "            basicPaypalButton: \"{$track['basicPaypalButton']}\",\n";
            $jsContent .= "            premiumFileForDownload: \"{$track['premiumFileForDownload']}\",\n";
            $jsContent .= "            basicFileForDownload: \"{$track['basicFileForDownload']}\",\n";
        }
        
        $jsContent .= "        },\n\n";
    }
    
    $jsContent .= "    ];\n}";
    
    return file_put_contents($filePath, $jsContent);
}

// Acciones
$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'update_tracks') {
        $tracksData = $_POST['tracks'] ?? [];
        $currentTracks = getTracksFromFile($tracksFile);
        $updatedTracks = [];
        
        foreach ($currentTracks as $index => $track) {
            if (isset($tracksData[$track['id']])) {
                $updatedTrack = $tracksData[$track['id']];
                $currentTracks[$index]['title'] = $updatedTrack['title'];
                $currentTracks[$index]['artist'] = $updatedTrack['artist'];
                $currentTracks[$index]['duration'] = $updatedTrack['duration'];
                $currentTracks[$index]['preview'] = $updatedTrack['preview'];
                
                if ($track['type'] === 'shop') {
                    $currentTracks[$index]['premiumPrice'] = (float)$updatedTrack['premiumPrice'];
                    $currentTracks[$index]['basicPrice'] = (float)$updatedTrack['basicPrice'];
                    $currentTracks[$index]['premiumPaypalButton'] = $updatedTrack['premiumPaypalButton'];
                    $currentTracks[$index]['basicPaypalButton'] = $updatedTrack['basicPaypalButton'];
                    $currentTracks[$index]['premiumFileForDownload'] = $updatedTrack['premiumFileForDownload'] ?? '';
                    $currentTracks[$index]['basicFileForDownload'] = $updatedTrack['basicFileForDownload'] ?? '';
                }
            }
        }
        
        if (saveTracksToFile($currentTracks, $tracksFile)) {
            $message = 'Tracks actualizados correctamente';
            $messageType = 'success';
        } else {
            $message = 'Error al guardar los tracks';
            $messageType = 'error';
        }
    }
    
    elseif ($action === 'add_track') {
        $newTrack = $_POST['new_track'] ?? [];
        $currentTracks = getTracksFromFile($tracksFile);
        
        
        $maxId = 0;
        foreach ($currentTracks as $track) {
            if ($track['id'] > $maxId) {
                $maxId = $track['id'];
            }
        }
        
        $newTrackData = [
            'id' => $maxId + 1,
            'title' => $newTrack['title'] ?? '',
            'artist' => $newTrack['artist'] ?? 'J DaProd',
            'duration' => $newTrack['duration'] ?? '',
            'preview' => $newTrack['preview'] ?? '',
            'type' => $newTrack['type'] ?? 'production',
            'premiumPrice' => (float)($newTrack['premiumPrice'] ?? 65),
            'basicPrice' => (float)($newTrack['basicPrice'] ?? 25),
            'premiumPaypalButton' => $newTrack['premiumPaypalButton'] ?? 'TN2YM52GDBPLS',
            'basicPaypalButton' => $newTrack['basicPaypalButton'] ?? 'XMMGD24J4K9CA',
            'premiumFileForDownload' => $newTrack['premiumFileForDownload'] ?? '',
            'basicFileForDownload' => $newTrack['basicFileForDownload'] ?? '',
        ];
        
        $currentTracks[] = $newTrackData;
        
        if (saveTracksToFile($currentTracks, $tracksFile)) {
            $message = 'Track agregado correctamente';
            $messageType = 'success';
        } else {
            $message = 'Error al agregar el track';
            $messageType = 'error';
        }
    }
    
    elseif ($action === 'delete_track') {
        $trackId = (int)($_POST['track_id'] ?? 0);
        $currentTracks = getTracksFromFile($tracksFile);
        $updatedTracks = array_filter($currentTracks, function($track) use ($trackId) {
            return $track['id'] !== $trackId;
        });
        
        if (saveTracksToFile(array_values($updatedTracks), $tracksFile)) {
            $message = 'Track eliminado correctamente';
            $messageType = 'success';
        } else {
            $message = 'Error al eliminar el track';
            $messageType = 'error';
        }
    }
}

$tracks = getTracksFromFile($tracksFile);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - J DaProd</title>
    <Link href="admin.php.css"></link>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/googleFonts.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="background-animation"></div>
    
    <div class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title">Panel de Administración</h1>
            <p class="admin-subtitle">Gestión de Tracks y Beats</p>
        </div>

        <?php if ($message): ?>
            <div class="message <?php echo $messageType; ?>">
                <i class="fas fa-<?php echo $messageType === 'success' ? 'check-circle' : 'exclamation-circle'; ?>"></i> 
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <div class="admin-actions">
            <button type="button" class="btn btn-primary" onclick="toggleAddTrackForm()">
                <i class="fas fa-plus"></i> Agregar Nuevo Track
            </button>
        </div>

        <!-- Formulario para agregar nuevo track -->
        <div class="add-track-form" id="addTrackForm" style="display: none;">
            <div class="add-track-header">
                <i class="fas fa-plus-circle" style="color: var(--emerald-glow);"></i>
                <h2 class="add-track-title">Agregar Nuevo Track</h2>
            </div>
            
            <form method="POST">
                <input type="hidden" name="action" value="add_track">
                
                <div class="track-form">
                    <div class="form-group">
                        <label class="form-label">Título</label>
                        <input type="text" name="new_track[title]" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Artista</label>
                        <input type="text" name="new_track[artist]" class="form-input" value="J DaProd" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Duración</label>
                        <input type="text" name="new_track[duration]" class="form-input" placeholder="3:45">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Archivo de Preview</label>
                        <input type="text" name="new_track[preview]" class="form-input" placeholder="assets/songs/track.mp3" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tipo</label>
                        <select name="new_track[type]" class="form-select" onchange="toggleShopFields(this, 'new')" required>
                            <option value="production">Producción</option>
                            <option value="shop">Tienda (Beat)</option>
                        </select>
                    </div>
                    
                    <div class="shop-fields" id="newShopFields" style="display: none;">
                        <div class="form-group">
                            <label class="form-label">Precio Premium (€)</label>
                            <input type="number" name="new_track[premiumPrice]" class="form-input" value="65" step="0.01" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Precio Básico (€)</label>
                            <input type="number" name="new_track[basicPrice]" class="form-input" value="25" step="0.01" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Botón PayPal Premium</label>
                            <input type="text" name="new_track[premiumPaypalButton]" class="form-input" value="TN2YM52GDBPLS">
                            <div class="paypal-info">ID del botón PayPal para licencia premium</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Botón PayPal Básico</label>
                            <input type="text" name="new_track[basicPaypalButton]" class="form-input" value="XMMGD24J4K9CA">
                            <div class="paypal-info">ID del botón PayPal para licencia básica</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">URL Descarga Premium</label>
                            <input type="text" name="new_track[premiumFileForDownload]" class="form-input" placeholder="assets/downloads/premium/track.zip">
                            <div class="paypal-info">URL del archivo ZIP para licencia premium</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">URL Descarga Básica</label>
                            <input type="text" name="new_track[basicFileForDownload]" class="form-input" placeholder="assets/downloads/basic/track.zip">
                            <div class="paypal-info">URL del archivo ZIP para licencia básica</div>
                        </div>
                    </div>
                </div>
                
                <div class="track-actions">
                    <button type="button" class="btn btn-secondary" onclick="toggleAddTrackForm()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Agregar Track</button>
                </div>
            </form>
        </div>

        <!-- Formulario principal para editar tracks existentes -->
        <form method="POST">
            <input type="hidden" name="action" value="update_tracks">
            
            <div class="tracks-container">
                <?php foreach ($tracks as $track): ?>
                    <div class="track-card">
                        <div class="track-header">
                            <h3 class="track-title"><?php echo htmlspecialchars($track['title']); ?></h3>
                            <span class="track-type <?php echo $track['type']; ?>">
                                <?php echo $track['type'] === 'shop' ? 'BEAT' : 'PRODUCCIÓN'; ?>
                            </span>
                        </div>
                        
                        <div class="track-form">
                            <div class="form-group">
                                <label class="form-label">Título</label>
                                <input type="text" name="tracks[<?php echo $track['id']; ?>][title]" 
                                       value="<?php echo htmlspecialchars($track['title']); ?>" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Artista</label>
                                <input type="text" name="tracks[<?php echo $track['id']; ?>][artist]" 
                                       value="<?php echo htmlspecialchars($track['artist']); ?>" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Duración</label>
                                <input type="text" name="tracks[<?php echo $track['id']; ?>][duration]" 
                                       value="<?php echo htmlspecialchars($track['duration']); ?>" class="form-input">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Archivo de Preview</label>
                                <input type="text" name="tracks[<?php echo $track['id']; ?>][preview]" 
                                       value="<?php echo htmlspecialchars($track['preview']); ?>" class="form-input" required>
                            </div>
                            
                            <?php if ($track['type'] === 'shop'): ?>
                                <div class="shop-fields">
                                    <div class="form-group">
                                        <label class="form-label">Precio Premium (€)</label>
                                        <input type="number" name="tracks[<?php echo $track['id']; ?>][premiumPrice]" 
                                               value="<?php echo $track['premiumPrice']; ?>" class="form-input" step="0.01" min="0" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Precio Básico (€)</label>
                                        <input type="number" name="tracks[<?php echo $track['id']; ?>][basicPrice]" 
                                               value="<?php echo $track['basicPrice']; ?>" class="form-input" step="0.01" min="0" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Botón PayPal Premium</label>
                                        <input type="text" name="tracks[<?php echo $track['id']; ?>][premiumPaypalButton]" 
                                               value="<?php echo htmlspecialchars($track['premiumPaypalButton']); ?>" class="form-input" required>
                                        <div class="paypal-info">ID del botón PayPal para licencia premium</div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Botón PayPal Básico</label>
                                        <input type="text" name="tracks[<?php echo $track['id']; ?>][basicPaypalButton]" 
                                               value="<?php echo htmlspecialchars($track['basicPaypalButton']); ?>" class="form-input" required>
                                        <div class="paypal-info">ID del botón PayPal para licencia básica</div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">URL Descarga Premium</label>
                                        <input type="text" name="tracks[<?php echo $track['id']; ?>][premiumFileForDownload]" 
                                               value="<?php echo htmlspecialchars($track['premiumFileForDownload']); ?>" class="form-input" placeholder="assets/downloads/premium/track.zip">
                                        <div class="paypal-info">URL del archivo ZIP para licencia premium</div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">URL Descarga Básica</label>
                                        <input type="text" name="tracks[<?php echo $track['id']; ?>][basicFileForDownload]" 
                                               value="<?php echo htmlspecialchars($track['basicFileForDownload']); ?>" class="form-input" placeholder="assets/downloads/basic/track.zip">
                                        <div class="paypal-info">URL del archivo ZIP para licencia básica</div>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="track-actions">
                            <button type="button" class="btn btn-danger" onclick="deleteTrack(<?php echo $track['id']; ?>)">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <?php if (!empty($tracks)): ?>
                <div style="text-align: center; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary" style="min-width: 200px;">
                        <i class="fas fa-save"></i> Guardar Todos los Cambios
                    </button>
                </div>
            <?php endif; ?>
        </form>
    </div>

    <form id="deleteForm" method="POST" style="display: none;">
        <input type="hidden" name="action" value="delete_track">
        <input type="hidden" name="track_id" id="deleteTrackId">
    </form>

    <script>
        function toggleAddTrackForm() {
            const form = document.getElementById('addTrackForm');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
        
        function toggleShopFields(select, type) {
            const shopFields = type === 'new' 
                ? document.getElementById('newShopFields')
                : document.querySelector(`[data-track="${select.dataset.track}"] .shop-fields`);
            
            if (select.value === 'shop') {
                shopFields.style.display = 'grid';
            } else {
                shopFields.style.display = 'none';
            }
        }
        
        function deleteTrack(trackId) {
            if (confirm('¿Estás seguro de que quieres eliminar este track? Esta acción no se puede deshacer.')) {
                document.getElementById('deleteTrackId').value = trackId;
                document.getElementById('deleteForm').submit();
            }
        }
        
        // Inicializar visibilidad de campos shop
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.form-select').forEach(select => {
                if (select.value === 'shop') {
                    const shopFields = select.closest('.track-form').querySelector('.shop-fields');
                    if (shopFields) {
                        shopFields.style.display = 'grid';
                    }
                }
            });
        });
    </script>
</body>
</html>