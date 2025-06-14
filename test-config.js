// Test du système de configuration dynamique

// Test de la classe SiteConfig
console.log('🧪 Tests du système de configuration dynamique');

// Simuler le chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM chargé');
    
    // Vérifier que la configuration est disponible
    if (window.siteConfig) {
        console.log('✅ SiteConfig chargé');
        console.log('📋 Configuration actuelle:', window.siteConfig.getAll());
        
        // Tester les logos disponibles
        console.log('🖼️ Logos disponibles:', window.siteConfig.getAvailableLogos());
        
        // Test de sauvegarde/chargement
        const testConfig = {
            nom: "Test Restaurant",
            adresse: "123 Rue de Test",
            date: "2025-12-25",
            heure: "10:00 - 20:00",
            prix: "15.99",
            logo: "logo/test-logo.png",
            hasCollectionInfo: true,
            collectionInfo: "Test des informations de collecte"
        };
        
        window.siteConfig.setAll(testConfig);
        console.log('✅ Configuration de test sauvegardée');
        
        // Vérifier que la configuration a été sauvegardée
        const savedConfig = window.siteConfig.getAll();
        console.log('📥 Configuration rechargée:', savedConfig);
        
        // Comparer les configurations
        const configMatches = JSON.stringify(testConfig) === JSON.stringify({
            ...savedConfig,
            nom: savedConfig.nom,
            adresse: savedConfig.adresse,
            date: savedConfig.date,
            heure: savedConfig.heure,
            prix: savedConfig.prix,
            logo: savedConfig.logo,
            hasCollectionInfo: savedConfig.hasCollectionInfo,
            collectionInfo: savedConfig.collectionInfo
        });
        
        if (configMatches) {
            console.log('✅ Test de sauvegarde/chargement réussi');
        } else {
            console.log('❌ Problème avec la sauvegarde/chargement');
        }
        
    } else {
        console.log('❌ SiteConfig non disponible');
    }
});

// Fonction pour tester les éléments de l'interface
function testUI() {
    console.log('🎨 Test de l\'interface utilisateur');
    
    // Vérifier les éléments de la page d'administration
    const adminElements = [
        'input-nom',
        'input-adresse', 
        'input-date',
        'input-heure',
        'input-prix',
        'logoSelector',
        'hasCollectionInfo',
        'collectionInfo'
    ];
    
    adminElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ Élément ${id} trouvé`);
        } else {
            console.log(`❌ Élément ${id} manquant`);
        }
    });
    
    // Vérifier les éléments de la page de réservation
    const reservationElements = [
        'shopLogo',
        'shopName',
        'shopAddress',
        'eventDate',
        'eventTime', 
        'eventPrice',
        'collectionInfoSection'
    ];
    
    reservationElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ Élément ${id} trouvé dans reservation.html`);
        } else {
            console.log(`❌ Élément ${id} manquant dans reservation.html`);
        }
    });
}

// Exporter les fonctions de test
window.testSiteConfig = testUI;
