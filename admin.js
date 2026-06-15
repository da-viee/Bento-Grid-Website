document.addEventListener('DOMContentLoaded', async () => {
    // Globals
    let allCards = [];

    // Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    const iframe = document.getElementById('live-preview-frame');

    document.getElementById('refresh-preview-btn').addEventListener('click', () => {
        iframe.contentWindow.location.reload();
    });

    // Modals
    window.closeModal = (id) => { document.getElementById(id).classList.add('hidden'); };

    // --- CARDS LIVE EDITOR ---
    const viewList = document.getElementById('cards-list-view');
    const viewEdit = document.getElementById('cards-edit-view');
    const form = document.getElementById('card-form');

    document.getElementById('btn-show-add').addEventListener('click', () => {
        form.reset();
        document.getElementById('card-id').value = '';
        document.getElementById('edit-view-title').innerText = 'Add New Card';
        document.getElementById('card-bgcolor').value = '#ffffff';
        viewList.classList.add('hidden');
        viewEdit.classList.remove('hidden');
    });

    document.getElementById('btn-back-to-list').addEventListener('click', () => {
        viewEdit.classList.add('hidden');
        viewList.classList.remove('hidden');
        fetchCards();
    });

    // Live preview postMessage sender
    function sendLivePreviewUpdate() {
        const id = document.getElementById('card-id').value;
        if (!id) return; // Only live preview existing cards currently being edited

        const payload = {
            type: 'LIVE_PREVIEW',
            card: {
                id: id,
                isGhost: document.getElementById('card-is-ghost').checked,
                bgColor: document.getElementById('card-bgcolor').value,
                imageFill: document.getElementById('card-image-fill').checked,
                imageZIndex: document.getElementById('card-image-zindex').value,
                imageScale: document.getElementById('card-image-scale').value,
                posTop: document.getElementById('card-pos-top').value,
                posBottom: document.getElementById('card-pos-bottom').value,
                posLeft: document.getElementById('card-pos-left').value,
                posRight: document.getElementById('card-pos-right').value,
                btnPosTop: document.getElementById('card-btn-pos-top').value,
                btnPosBottom: document.getElementById('card-btn-pos-bottom').value,
                btnPosLeft: document.getElementById('card-btn-pos-left').value,
                btnPosRight: document.getElementById('card-btn-pos-right').value,
            }
        };
        iframe.contentWindow.postMessage(payload, '*');
    }

    // Attach listeners to live inputs
    document.querySelectorAll('.live-input, input[type="color"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('input', sendLivePreviewUpdate);
        input.addEventListener('change', sendLivePreviewUpdate);
    });

    async function fetchCards(reloadIframe = true) {
        try {
            const res = await fetch('/api/cards');
            allCards = await res.json();
            const container = document.getElementById('cards-list');
            container.innerHTML = allCards.map(c => `
                <div class="list-item" style="border-left: 6px solid ${c.bgColor || '#000'}; opacity: ${c.isGhost ? 0.5 : 1}">
                    <div>
                        <strong>${c.title || (c.isGhost ? 'Ghost Card' : 'Untitled')}</strong><br>
                        <small>Span: ${c.colSpan}x${c.rowSpan}</small>
                    </div>
                    <div class="list-item-actions">
                        <button type="button" onclick="editCard('${c.id}')" style="background:#e4e4e7; border:none; padding: 4px 8px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button type="button" class="btn-delete" onclick="deleteCard('${c.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
            
            if (reloadIframe) {
                iframe.contentWindow.location.reload();
            }
        } catch(e) { console.error(e); }
    }

    window.editCard = (id) => {
        const c = allCards.find(card => card.id === id);
        if (!c) return;

        document.getElementById('card-id').value = c.id;
        document.getElementById('card-title').value = c.title || '';
        document.getElementById('card-is-ghost').checked = c.isGhost || false;
        document.getElementById('card-bgcolor').value = c.bgColor || '#ffffff';
        document.getElementById('card-col-span').value = c.colSpan || 1;
        document.getElementById('card-row-span').value = c.rowSpan || 1;
        document.getElementById('card-image-fill').checked = c.imageFill || false;
        document.getElementById('card-image-zindex').value = c.imageZIndex !== undefined ? c.imageZIndex : 5;
        document.getElementById('card-image-scale').value = c.imageScale !== undefined ? c.imageScale : 1;
        document.getElementById('card-pos-top').value = c.posTop || '';
        document.getElementById('card-pos-bottom').value = c.posBottom || '';
        document.getElementById('card-pos-left').value = c.posLeft || '';
        document.getElementById('card-pos-right').value = c.posRight || '';
        document.getElementById('card-btn-text').value = c.btnText || '';
        document.getElementById('card-btn-link').value = c.btnLink || '';
        document.getElementById('card-btn-pos-top').value = c.btnPosTop || '';
        document.getElementById('card-btn-pos-bottom').value = c.btnPosBottom || '';
        document.getElementById('card-btn-pos-left').value = c.btnPosLeft || '';
        document.getElementById('card-btn-pos-right').value = c.btnPosRight || '';

        document.getElementById('edit-view-title').innerText = 'Edit Card';
        viewList.classList.add('hidden');
        viewEdit.classList.remove('hidden');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerText = 'Saving...';
        btn.disabled = true;

        const id = document.getElementById('card-id').value;
        const formData = new FormData();
        
        formData.append('title', document.getElementById('card-title').value);
        formData.append('isGhost', document.getElementById('card-is-ghost').checked);
        formData.append('bgColor', document.getElementById('card-bgcolor').value);
        formData.append('colSpan', document.getElementById('card-col-span').value);
        formData.append('rowSpan', document.getElementById('card-row-span').value);
        formData.append('imageFill', document.getElementById('card-image-fill').checked);
        formData.append('imageZIndex', document.getElementById('card-image-zindex').value);
        formData.append('imageScale', document.getElementById('card-image-scale').value);
        formData.append('posTop', document.getElementById('card-pos-top').value);
        formData.append('posBottom', document.getElementById('card-pos-bottom').value);
        formData.append('posLeft', document.getElementById('card-pos-left').value);
        formData.append('posRight', document.getElementById('card-pos-right').value);
        formData.append('btnText', document.getElementById('card-btn-text').value);
        formData.append('btnLink', document.getElementById('card-btn-link').value);
        formData.append('btnPosTop', document.getElementById('card-btn-pos-top').value);
        formData.append('btnPosBottom', document.getElementById('card-btn-pos-bottom').value);
        formData.append('btnPosLeft', document.getElementById('card-btn-pos-left').value);
        formData.append('btnPosRight', document.getElementById('card-btn-pos-right').value);

        const mediaFile = document.getElementById('card-media').files[0];
        if (mediaFile) formData.append('media', mediaFile);

        try {
            if (id) {
                // Update
                await fetch(`/api/cards/${id}`, { method: 'PUT', body: formData });
            } else {
                // Create
                const newCardRes = await fetch('/api/cards', { method: 'POST', body: formData });
                const newCard = await newCardRes.json();
                document.getElementById('card-id').value = newCard.id; // Set ID so future saves are updates
                document.getElementById('edit-view-title').innerText = 'Edit Card';
            }
            
            // Refresh cards in background but keep form open
            await fetchCards(false); 
            
            btn.innerText = 'Saved Successfully!';
            setTimeout(() => {
                btn.innerText = 'Save to Database';
                btn.disabled = false;
            }, 2000);
        } catch(err) { 
            alert('Error saving'); 
            btn.innerText = 'Save to Database';
            btn.disabled = false;
        }
    });

    window.deleteCard = async (id) => {
        if(confirm('Delete this card?')) {
            await fetch(`/api/cards/${id}`, { method: 'DELETE' });
            fetchCards();
        }
    };

    // --- GLOBAL SETTINGS ---
    async function loadSettings() {
        const res = await fetch('/api/settings');
        const s = await res.json();
        document.getElementById('global-bg-color').value = s.globalBgColor || '#ffffff';
    }

    document.getElementById('global-bg-color').addEventListener('input', (e) => {
        iframe.contentWindow.postMessage({ type: 'GLOBAL_BG', color: e.target.value }, '*');
    });

    document.getElementById('settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ globalBgColor: document.getElementById('global-bg-color').value })
        });
        alert('Global Settings Saved!');
        iframe.contentWindow.location.reload();
    });

    // ... Blog code omitted for brevity but keeping basic functionality ...
    document.getElementById('add-blog-btn').addEventListener('click', () => { document.getElementById('blog-modal').classList.remove('hidden'); });

    // Init
    loadSettings();
    fetchCards();
});
