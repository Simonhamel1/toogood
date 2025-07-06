/**
 * TooGood - Tests de Configuration
 * 
 * Fichier de tests pour la configuration
 * Ce fichier peut être utilisé pour tester les fonctionnalités
 * 
 * @author TooGood Team
 * @version 1.0.0
 */

// Tests optionnels pour la configuration
if (typeof window !== 'undefined' && window.siteConfig) {
    console.log('✅ Module de configuration chargé avec succès');
    
    // Test basique de la configuration
    const testConfig = () => {
        try {
            const config = window.siteConfig.getAll();
            console.log('📋 Configuration actuelle:', config);
            
            const logos = window.siteConfig.getAvailableLogos();
            console.log(`🖼️ ${logos.length} logo(s) disponible(s):`, logos);
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors du test de configuration:', error);
            return false;
        }
    };
    
    // Exécuter les tests au chargement
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            console.log('🧪 Exécution des tests de configuration...');
            const success = testConfig();
            if (success) {
                console.log('✅ Tous les tests de configuration ont réussi');
            }
        }, 100);
    });
} else {
    console.warn('⚠️ Module de configuration non disponible pour les tests');
}
