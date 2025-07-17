class AIPlanetAP {


    constructor() {
        this.apikey = localStorage.getItem('gemeniApiBey') || '';

        this.initializeElements();

        this.bindEvents();

        this.loadApiKey();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('api-key');
        this.saveApiKeyButton = document.getElementById('save-api-key');
        this.biomesInput = document.getElementById('biome');
        this.sizeInput = document.getElementById('size');
        this.lifeInput = document.getElementById('life');
        this.storyInput = document.getElementById('story');
        this.generateButton = document.getElementById('generate-planet');
        this.loading = document.getElementById('loading');
        this.planetOutput = document.getElementById('planet-section');
        this.planetContent = document.getElementById('planetContent');
    }

    bindEvents() {
        this.saveApiKeyButton.addEventListener('click', () => this.saveApiKey());
        this.generateButton.addEventListener('click', () => this.generatePlanet());
        this.apiKeyInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.saveApiKey();
            }
        });
        this.biomesInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && event.ctrlKey) {
                this.generatePlanet();
            }
        });
        
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('gemeniApiBey', apiKey);
            this.apikey = apiKey;
            this.updateApiKeyStatus(true);
            this.showSuccess('API Key saved successfully!');
        } else {
            this.showError('Please enter a valid API key.');
        }
    }
        

    loadApiKey() {
        if (this.apikey) {
            this.apiKeyInput.value = this.apikey;
            this.updateApiKeyStatus(true);
        } else {
            this.updateApiKeyStatus(false);
        }
    }

    updateApiKeyStatus(isValid) {
        const btn = this.saveApiKeyButton;
        if (isValid) {
            btn.textContent = 'Saved ✅';
            btn.style.background = '#28a745';
        } else {
            btn.textContent = 'Save';
            btn.style.background = '#dc3545';
        }
        

    }

    async generatePlanet() {
        if (!this.apikey) {
            this.showError('Please enter a valid API key.');
            return;
        }

        const biomes = this.biomesInput.value.trim();
        const size = this.sizeInput.value.trim();
        const life = this.lifeInput.value.trim();
        const story = this.storyInput.value.trim();

        this.showLoading(true);
        this.hideGeneration();

        try {
            const recipe = await this.callGemeniAPI(biomes, size, life, story);
            this.displayPlanet(recipe);
        } catch (error) {
            this.showLoading(false);
            this.showError(error);
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    async callGemeniAPI(biomes, size, life, story) {
        let prompt = `Generate a detailed planet with a cool scientific name and designation that has these biomes: ${biomes}, and is: ${size},`;

        if (life) {
            prompt += ` write about how the plane has life,`;
        }

        if (story) {
            prompt += ` and make sure it has a cool story!`;
        }

        prompt += ` please format your response as follows: 
        - Planet Name
        - Planet Designation
        - Distance from Earth (get creative!)
        - Description
        - Story
        `;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apikey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    topK: 40,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${errorData.error?.message || 'Unkown Error'}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }    
    
    showError(message) {
        alert(message);
    }

    showSuccess(message) {
        alert(message);
    }

    showGeneration() {
        
        this.planetContent.classList.add('show');
        this.planetContent.scrollIntoView({ behavior: 'smooth' });
    }

    displayPlanet(recipe) {
        const formattedRecipe = this.formatRecipe(recipe);
        this.planetOutput.innerHTML = formattedRecipe;
        this.showGeneration();
    }

    formatRecipe(text) {
        text = text.replace(/(^| ) +/gm, '$1');
        text = text.replace(/^- */gm, '');
        text = text.replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>');
        text = text.replace(/^(.+)/g, '<h3>$1</h3>');
        text = text.replace(/^\*/gm, '•');
        text = text.replace(/^(.+)/gm, '<p>$1</p>');
        return text;
    }


    hideGeneration() {
        this.planetContent.style.display = 'none';
    }

    showLoading(show) {
        if (show) {
            this.loading.classList.add('show');
            this.generateButton.disabled = true;
            this.generateButton.textContent = 'Generating...';
        } else {
            this.loading.classList.remove('show');
            this.generateButton.disabled = false;
            this.generateButton.textContent = 'Generate Planet';
        }
    }

}

document.addEventListener('DOMContentLoaded', () => new AIPlanetAP());