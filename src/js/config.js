/**
 * TooGood - Gestionnaire de Configuration
 * 
 * Classe singleton pour gérer la configuration de l'application
 * Utilise LocalStorage pour la persistence des données
 * 
 * @author TooGood Team
 * @version 1.0.0
 */

class SiteConfig {
    /**
     * Constructeur - Initialise la configuration par défaut
     */
    constructor() {        
        // Configuration par défaut
        this.defaultConfig = {
            nom: "Mon Commerce",
            adresse: "Adresse du commerce",
            date: new Date().toISOString().split('T')[0], // Date du jour
            heure: "16:00 - 18:30",
            prix: "4.99",
            logo: "assets/logo/starbucks-logo.png",
            hasCollectionInfo: false,
            collectionInfo: "",
            // Métadonnées
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            theme: "default"
        };
        
        this.config = { ...this.defaultConfig };
        this.loadConfig();
    }

    /**
     * Charge la configuration depuis localStorage
     * Fusionne avec la configuration par défaut
     */
    loadConfig() {
        try {
            const saved = localStorage.getItem('toogood_config');
            if (saved) {
                const parsedConfig = JSON.parse(saved);
                this.config = { ...this.defaultConfig, ...parsedConfig };
                console.info('Configuration chargée depuis localStorage');
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la configuration:', error);
            this.resetToDefault();
        }
    }

    /**
     * Sauvegarde la configuration dans localStorage
     */
    saveConfig() {
        try {
            this.config.lastUpdated = new Date().toISOString();
            localStorage.setItem('toogood_config', JSON.stringify(this.config));
            console.info('Configuration sauvegardée');
            
            // Déclencher un événement personnalisé pour notifier les changements
            window.dispatchEvent(new CustomEvent('configUpdated', {
                detail: this.config
            }));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    }

    /**
     * Obtient une valeur de configuration
     * @param {string} key - Clé de configuration
     * @returns {*} Valeur de configuration
     */
    get(key) {
        return this.config[key];
    }

    /**
     * Définit une valeur de configuration
     * @param {string} key - Clé de configuration
     * @param {*} value - Nouvelle valeur
     */
    set(key, value) {
        if (key in this.defaultConfig) {
            this.config[key] = value;
            this.saveConfig();
        } else {
            console.warn(`Clé de configuration inconnue: ${key}`);
        }
    }

    /**
     * Obtient toute la configuration
     * @returns {Object} Configuration complète
     */
    getAll() {
        return { ...this.config };
    }

    /**
     * Définit toute la configuration
     * @param {Object} newConfig - Nouvelle configuration
     */
    setAll(newConfig) {
        // Validation des données
        if (typeof newConfig !== 'object' || newConfig === null) {
            console.error('Configuration invalide');
            return;
        }
        
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
    }

    /**
     * Remet la configuration par défaut
     */
    resetToDefault() {
        this.config = { ...this.defaultConfig };
        this.saveConfig();
        console.info('Configuration remise par défaut');
    }

    /**
     * Valide la configuration actuelle
     * @returns {Object} Résultat de validation
     */
    validate() {
        const errors = [];
        const warnings = [];

        // Validation des champs obligatoires
        if (!this.config.nom || this.config.nom.trim() === '') {
            errors.push('Le nom du commerce est requis');
        }
        
        if (!this.config.adresse || this.config.adresse.trim() === '') {
            errors.push('L\'adresse est requise');
        }
        
        if (!this.config.prix || isNaN(parseFloat(this.config.prix))) {
            errors.push('Le prix doit être un nombre valide');
        }

        // Validation de la date
        if (!this.config.date || isNaN(Date.parse(this.config.date))) {
            errors.push('La date doit être valide');
        }

        // Avertissements
        if (this.config.prix && parseFloat(this.config.prix) <= 0) {
            warnings.push('Le prix devrait être supérieur à 0');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Obtient la liste des logos disponibles
     * Charge automatiquement tous les fichiers images du dossier assets/logo/
     * @returns {Array} Liste des logos avec métadonnées
     */
    getAvailableLogos() {
        // Liste des logos trouvés automatiquement dans le dossier assets/logo/
        const logoFiles = [
            "la-croissanterie.jpg",
            "les-halles-du-lavandiers.jpeg", 
            "starbucks-logo.png",
            "monoprix.png"
        ];
        
        // Formats d'images supportés
        const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
        
        return logoFiles
            .filter(filename => {
                const extension = filename.split('.').pop().toLowerCase();
                return supportedFormats.includes(extension);
            })
            .map(filename => {
                // Génère le nom d'affichage à partir du nom de fichier
                const baseName = filename.split('.')[0];
                const displayName = this.formatLogoName(baseName);
                
                return {
                    path: `assets/logo/${filename}`,
                    name: displayName,
                    filename: filename,
                    category: this.detectLogoCategory(baseName),
                    description: `Logo ${displayName}`,
                    extension: filename.split('.').pop().toLowerCase()
                };
            });
    }
    
    /**
     * Formate le nom de fichier en nom d'affichage lisible
     * @param {string} baseName - Nom de fichier sans extension
     * @returns {string} Nom formaté pour l'affichage
     */
    formatLogoName(baseName) {
        return baseName
            .replace(/[-_]/g, ' ')  // Remplace tirets et underscores par des espaces
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Met en forme titre
            .join(' ')
            .trim();
    }
    
    /**
     * Détecte automatiquement la catégorie d'un logo basé sur son nom
     * @param {string} baseName - Nom de fichier sans extension
     * @returns {string} Catégorie détectée
     */
    detectLogoCategory(baseName) {
        const name = baseName.toLowerCase();
        
        // Mots-clés pour déterminer la catégorie
        const categories = {
            'café': ['starbucks', 'cafe', 'coffee', 'espresso'],
            'boulangerie': ['croissanterie', 'boulangerie', 'pain', 'bakery'],
            'alimentation': ['halles', 'marche', 'epicerie', 'supermarche', 'grocery'],
            'restaurant': ['restaurant', 'bistrot', 'brasserie', 'resto'],
            'fastfood': ['mcdo', 'burger', 'kfc', 'quick', 'subway'],
            'autre': []
        };
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => name.includes(keyword))) {
                return category;
            }
        }
        
        return 'commerce'; // Catégorie par défaut
    }

    /**
     * Exporte la configuration au format JSON
     * @returns {string} Configuration en JSON
     */
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    /**
     * Importe une configuration depuis JSON
     * @param {string} jsonConfig - Configuration en JSON
     * @returns {boolean} Succès de l'import
     */
    importConfig(jsonConfig) {
        try {
            const importedConfig = JSON.parse(jsonConfig);
            this.setAll(importedConfig);
            console.info('Configuration importée avec succès');
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            return false;
        }
    }

    /**
     * Obtient les statistiques de la configuration
     * @returns {Object} Statistiques
     */
    getStats() {
        return {
            version: this.config.version,
            lastUpdated: this.config.lastUpdated,
            fieldsConfigured: Object.keys(this.config).filter(key => 
                this.config[key] !== this.defaultConfig[key]
            ).length,
            totalFields: Object.keys(this.config).length
        };
    }
}

/**
 * Instance globale singleton
 * Accessible via window.siteConfig
 */
if (typeof window !== 'undefined') {
    window.siteConfig = new SiteConfig();
    
    // Debug en mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.siteConfig.debug = true;
        console.info('TooGood Config initialized in debug mode');
    }
}

// Export pour modules ES6 si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteConfig;
}
