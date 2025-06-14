// Configuration dynamique du site
class SiteConfig {
    constructor() {        this.config = {
            nom: "Les Halles du Lavandier",
            adresse: "81 Av. de la Marne, 56000 Vannes, France",
            date: "2025-06-11",
            heure: "16:00 - 18:30",
            prix: "4.99",
            logo: "logo/les-halles-du-lavandiers.jpeg",
            hasCollectionInfo: true,
            collectionInfo: "Récupération sur place uniquement. Merci de vous présenter avec une pièce d'identité."
        };
        this.loadConfig();
    }

    // Charger la configuration depuis localStorage
    loadConfig() {
        const saved = localStorage.getItem('siteConfig');
        if (saved) {
            this.config = { ...this.config, ...JSON.parse(saved) };
        }
    }

    // Sauvegarder la configuration
    saveConfig() {
        localStorage.setItem('siteConfig', JSON.stringify(this.config));
    }

    // Obtenir une valeur de configuration
    get(key) {
        return this.config[key];
    }

    // Définir une valeur de configuration
    set(key, value) {
        this.config[key] = value;
        this.saveConfig();
    }

    // Obtenir toute la configuration
    getAll() {
        return { ...this.config };
    }

    // Définir toute la configuration
    setAll(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }

    // Obtenir la liste des logos disponibles
    getAvailableLogos() {
        return [
            { 
                path: "logo/starbucks-logo.png", 
                name: "Starbucks Logo",
                filename: "starbucks-logo.png"
            },
            { 
                path: "logo/les-halles-du-lavandiers.jpeg", 
                name: "Les Halles du Lavandier",
                filename: "les-halles-du-lavandiers.jpeg"
            }
        ];
    }
}

// Instance globale
window.siteConfig = new SiteConfig();
