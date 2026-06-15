document.addEventListener('DOMContentLoaded', async () => {
    // 1. Apply Global Settings
    try {
        const settingsRes = await fetch('/api/settings');
        const settings = await settingsRes.json();
        document.body.style.backgroundColor = settings.globalBgColor || '#ffffff';
    } catch(e) { console.error('Error fetching settings', e); }

    const gridContainer = document.getElementById('dynamic-bento-grid');
    if (!gridContainer) return;

    // Helper to format CSS position values (add px if just a number)
    function formatPos(val) {
        if (!val) return '';
        // If it's just a number or negative number, append px
        if (/^-?\d+$/.test(val.trim())) return `${val.trim()}px`;
        return val;
    }

    // 2. Fetch and render cards
    async function renderCards() {
        try {
            const res = await fetch('/api/cards');
            const cards = await res.json();

            if (cards.length === 0) {
                gridContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 4rem;">No cards yet. Add some from the Admin Dashboard!</p>';
                return;
            }

            gridContainer.innerHTML = cards.map(card => {
                const hasMedia = card.mediaUrl && card.mediaUrl.trim() !== '';
                let mediaHtml = '';

                if (hasMedia) {
                    let styleStr = '';
                    const zIndex = card.imageZIndex !== undefined ? card.imageZIndex : 5;
                    const scale = card.imageScale !== undefined ? card.imageScale : 1;
                    
                    if (card.imageFill) {
                        styleStr = `top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 16px; z-index: ${zIndex}; transform: scale(${scale}); max-width: none; max-height: none;`;
                    } else {
                        if (card.posTop) styleStr += `top: ${formatPos(card.posTop)}; `;
                        if (card.posBottom) styleStr += `bottom: ${formatPos(card.posBottom)}; `;
                        if (card.posLeft) styleStr += `left: ${formatPos(card.posLeft)}; `;
                        if (card.posRight) styleStr += `right: ${formatPos(card.posRight)}; `;
                        if (!styleStr) styleStr = 'bottom: 10%; right: 10%;';
                        styleStr += ` z-index: ${zIndex}; transform: scale(${scale});`;
                    }
                    
                    if (card.mediaType === 'video') {
                        mediaHtml = `<video class="card-media" src="${card.mediaUrl}" style="${styleStr}" autoplay muted loop playsinline></video>`;
                    } else {
                        mediaHtml = `<img class="card-media" src="${card.mediaUrl}" alt="Card Media" style="${styleStr}">`;
                    }
                }

                // Button rendering
                let buttonHtml = '';
                if (card.btnText) {
                    let btnStyle = 'position: absolute; z-index: 20; ';
                    if (card.btnPosTop) btnStyle += `top: ${formatPos(card.btnPosTop)}; `;
                    if (card.btnPosBottom) btnStyle += `bottom: ${formatPos(card.btnPosBottom)}; `;
                    if (card.btnPosLeft) btnStyle += `left: ${formatPos(card.btnPosLeft)}; `;
                    if (card.btnPosRight) btnStyle += `right: ${formatPos(card.btnPosRight)}; `;
                    
                    buttonHtml = `<a href="${card.btnLink || '#'}" class="download-btn" style="${btnStyle}">${card.btnText}</a>`;
                }

                const isDarkBg = isColorDark(card.bgColor);
                const textColor = isDarkBg ? '#ffffff' : '#000000';

                // Ghost mode strips out background and border and padding visually
                // If it's a fill image, we should hide overflow so it stays neatly inside the border radius
                let overflowStyle = card.imageFill ? 'overflow: hidden;' : 'overflow: visible;';
                let cardStyles = `background-color: ${card.bgColor || '#ffffff'}; color: ${textColor}; ${overflowStyle}`;
                let cardClass = `bento-card span-col-${card.colSpan} span-row-${card.rowSpan}`;
                
                if (card.isGhost) {
                    cardStyles = `background: transparent; border: none; box-shadow: none; pointer-events: none; overflow: visible;`;
                }

                return `
                    <div id="card-${card.id}" class="${cardClass}" style="${cardStyles}">
                        ${!card.isGhost ? `<h3 style="z-index: 10; position: relative;">${card.title}</h3>` : ''}
                        ${mediaHtml}
                        ${buttonHtml}
                    </div>
                `;
            }).join('');
        } catch (err) {
            console.error('Failed to load cards:', err);
        }
    }

    await renderCards();

    // 3. Listen for Live Preview messages from Admin
    window.addEventListener('message', (event) => {
        if (event.data.type === 'LIVE_PREVIEW') {
            const data = event.data.card;
            const el = document.getElementById(`card-${data.id}`);
            if (el) {
                // Live update background
                if (!data.isGhost) {
                    el.style.backgroundColor = data.bgColor;
                    el.style.overflow = data.imageFill ? 'hidden' : 'visible';
                } else {
                    el.style.background = 'transparent';
                    el.style.border = 'none';
                    el.style.boxShadow = 'none';
                    el.style.overflow = 'visible';
                }
                
                // Live update image
                const img = el.querySelector('.card-media');
                if (img) {
                    const zIndex = data.imageZIndex !== undefined ? data.imageZIndex : 5;
                    const scale = data.imageScale !== undefined ? data.imageScale : 1;
                    
                    img.style.zIndex = zIndex;
                    img.style.transform = `scale(${scale})`;

                    if (data.imageFill) {
                        img.style.top = '0';
                        img.style.left = '0';
                        img.style.bottom = 'auto';
                        img.style.right = 'auto';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.maxWidth = 'none';
                        img.style.maxHeight = 'none';
                    } else {
                        img.style.width = '';
                        img.style.height = '';
                        img.style.objectFit = 'contain';
                        img.style.maxWidth = '80%';
                        img.style.maxHeight = '80%';
                        img.style.top = formatPos(data.posTop) || 'auto';
                        img.style.bottom = formatPos(data.posBottom) || 'auto';
                        img.style.left = formatPos(data.posLeft) || 'auto';
                        img.style.right = formatPos(data.posRight) || 'auto';
                    }
                }

                // Live update button
                const btn = el.querySelector('.download-btn');
                if (btn) {
                    btn.style.top = formatPos(data.btnPosTop) || 'auto';
                    btn.style.bottom = formatPos(data.btnPosBottom) || 'auto';
                    btn.style.left = formatPos(data.btnPosLeft) || 'auto';
                    btn.style.right = formatPos(data.btnPosRight) || 'auto';
                }
            }
        } else if (event.data.type === 'GLOBAL_BG') {
            document.body.style.backgroundColor = event.data.color;
        }
    });
});

function isColorDark(hex) {
    if (!hex) return false;
    const color = hex.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16) || 255;
    const g = parseInt(color.substr(2, 2), 16) || 255;
    const b = parseInt(color.substr(4, 2), 16) || 255;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq < 128);
}