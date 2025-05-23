document.addEventListener('DOMContentLoaded', () => {
    const modelSelect = document.getElementById('model-select');
    const modelDescription = document.getElementById('model-description');
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loading = document.getElementById('loading');
    const responseContainer = document.getElementById('response-container');
    const responseText = document.getElementById('response-text');
    const copyBtn = document.querySelector('.copy-btn');
    const shareBtn = document.querySelector('.share-btn');

    // Add copy functionality
    copyBtn.addEventListener('click', () => {
        const text = responseText.textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                copyBtn.classList.add('copied');
                setTimeout(() => copyBtn.classList.remove('copied'), 1500);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback for browsers without clipboard API
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            });
    });

    // Add share functionality
    shareBtn.addEventListener('click', () => {
        const text = responseText.textContent;
        if (navigator.share) {
            navigator.share({
                title: 'WebLLM Response',
                text: text
            })
            .catch(err => console.error('Error sharing:', err));
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(text)
                .then(() => {
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-info alert-dismissible fade show mt-3';
                    alert.innerHTML = `
                        Response copied to clipboard
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    responseContainer.appendChild(alert);
                    setTimeout(() => alert.remove(), 3000);
                })
                .catch(err => console.error('Error copying:', err));
        }
    });

    // Update model description when selection changes
    modelSelect.addEventListener('change', () => {
        const selectedOption = modelSelect.options[modelSelect.selectedIndex];
        modelDescription.textContent = selectedOption.dataset.description;
        
        // Add a subtle animation to the description
        modelDescription.style.opacity = '0';
        setTimeout(() => {
            modelDescription.style.opacity = '1';
        }, 100);
    });

    // Initial model description
    modelDescription.textContent = modelSelect.options[modelSelect.selectedIndex].dataset.description;

    // Handle generate button click
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            // Show Bootstrap alert
            const alert = document.createElement('div');
            alert.className = 'alert alert-warning alert-dismissible fade show mt-3';
            alert.innerHTML = `
                Please enter a prompt
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            promptInput.parentNode.insertBefore(alert, promptInput.nextSibling);
            setTimeout(() => alert.remove(), 3000);
            return;
        }

        // Show loading state
        loading.classList.remove('d-none');
        generateBtn.disabled = true;
        responseContainer.classList.add('d-none');

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model_id: modelSelect.value,
                    prompt: prompt
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Display response with animation
                responseText.textContent = data.response;
                responseContainer.classList.remove('d-none');
                responseContainer.style.opacity = '0';
                setTimeout(() => {
                    responseContainer.style.opacity = '1';
                }, 100);
            } else {
                throw new Error(data.error || 'Failed to generate response');
            }
        } catch (error) {
            // Show error alert
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
            alert.innerHTML = `
                Error: ${error.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            promptInput.parentNode.insertBefore(alert, promptInput.nextSibling);
            setTimeout(() => alert.remove(), 5000);
        } finally {
            // Hide loading state
            loading.classList.add('d-none');
            generateBtn.disabled = false;
        }
    });

    // Handle Enter key in prompt input
    promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateBtn.click();
        }
    });

    // Add smooth transitions
    document.querySelectorAll('.card, .btn, .form-control, .form-select').forEach(element => {
        element.style.transition = 'all 0.2s ease-in-out';
    });
});