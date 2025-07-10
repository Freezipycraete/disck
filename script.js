document.addEventListener('DOMContentLoaded', () => {
    // Dil verileri
    const translations = {
        tr: {
            supportServer: "Destek Sunucusu",
            webhookUrl: "Webhook URL",
            messageContent: "Mesaj İçeriği",
            embedBuilder: "Gömülü Mesaj Oluşturucu",
            embedTitle: "Başlık",
            embedColor: "Renk",
            embedDescription: "Açıklama",
            embedAuthor: "Yazar",
            embedAuthorIcon: "Yazar İkon URL",
            embedFooter: "Altbilgi",
            embedFooterIcon: "Altbilgi İkon URL",
            addTimestamp: "Zaman Damgası Ekle",
            sendMessage: "Mesajı Gönder",
            resetFields: "Temizle",
            preview: "Önizleme",
            notificationSuccess: "Mesaj başarıyla gönderildi!",
            notificationError: "Hata: Webhook URL'si geçersiz veya bir sorun oluştu.",
            notificationWebhookRequired: "Lütfen bir Webhook URL'si girin.",
        },
        en: {
            supportServer: "Support Server",
            webhookUrl: "Webhook URL",
            messageContent: "Message Content",
            embedBuilder: "Embed Builder",
            embedTitle: "Title",
            embedColor: "Color",
            embedDescription: "Description",
            embedAuthor: "Author",
            embedAuthorIcon: "Author Icon URL",
            embedFooter: "Footer",
            embedFooterIcon: "Footer Icon URL",
            addTimestamp: "Add Timestamp",
            sendMessage: "Send Message",
            resetFields: "Reset",
            preview: "Preview",
            notificationSuccess: "Message sent successfully!",
            notificationError: "Error: Webhook URL is invalid or an issue occurred.",
            notificationWebhookRequired: "Please enter a Webhook URL.",
        }
    };

    // Element referansları
    const elementsToUpdate = {
        messageContent: document.getElementById('message-content'),
        embedTitle: document.getElementById('embed-title'),
        embedDescription: document.getElementById('embed-description'),
        embedAuthor: document.getElementById('embed-author'),
        embedAuthorIcon: document.getElementById('embed-author-icon'),
        embedFooter: document.getElementById('embed-footer'),
        embedFooterIcon: document.getElementById('embed-footer-icon'),
        embedColor: document.getElementById('embed-color'),
        embedColorHex: document.getElementById('embed-color-hex'),
        embedTimestamp: document.getElementById('embed-timestamp'),
        webhookUrlInput: document.getElementById('webhook-url'),
    };

    const previewElements = {
        content: document.getElementById('preview-content'),
        embedContainer: document.getElementById('embed-preview-container'),
        embed: document.getElementById('preview-embed'),
        authorContainer: document.getElementById('preview-embed-author'),
        authorIcon: document.getElementById('preview-embed-author-icon'),
        authorName: document.getElementById('preview-embed-author-name'),
        title: document.getElementById('preview-embed-title'),
        description: document.getElementById('preview-embed-description'),
        footerContainer: document.getElementById('preview-embed-footer'),
        footerIcon: document.getElementById('preview-embed-footer-icon'),
        footerText: document.getElementById('preview-embed-footer-text'),
        timestamp: document.getElementById('preview-embed-timestamp'),
        timestampSeparator: document.getElementById('preview-embed-timestamp-separator'),
        botTimestamp: document.getElementById('preview-timestamp-bot'),
    };

    const buttons = {
        send: document.getElementById('send-message'),
        reset: document.getElementById('reset-fields'),
        langSwitcher: document.getElementById('language-switcher'),
    };

    const notification = document.getElementById('notification');
    let currentLang = 'tr';

    // Dili ayarla ve arayüzü güncelle
    function setLanguage(lang) {
        currentLang = lang;
        buttons.langSwitcher.value = lang;
        document.documentElement.lang = lang;
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        updatePreview(); // Zaman damgası formatını güncellemek için
    }

    // Önizlemeyi güncelle
    function updatePreview() {
        const hasEmbedContent = elementsToUpdate.embedTitle.value || elementsToUpdate.embedDescription.value || elementsToUpdate.embedAuthor.value || elementsToUpdate.embedFooter.value;

        previewElements.content.textContent = elementsToUpdate.messageContent.value;

        if (hasEmbedContent) {
            previewElements.embedContainer.classList.remove('hidden');
        } else {
            previewElements.embedContainer.classList.add('hidden');
        }

        // Renk
        previewElements.embed.style.borderColor = elementsToUpdate.embedColor.value;

        // Yazar
        if (elementsToUpdate.embedAuthor.value) {
            previewElements.authorContainer.classList.remove('hidden');
            previewElements.authorName.textContent = elementsToUpdate.embedAuthor.value;
            previewElements.authorIcon.src = elementsToUpdate.embedAuthorIcon.value || 'https://cdn.discordapp.com/embed/avatars/0.png';
        } else {
            previewElements.authorContainer.classList.add('hidden');
        }

        // Başlık
        previewElements.title.textContent = elementsToUpdate.embedTitle.value;

        // Açıklama
        previewElements.description.textContent = elementsToUpdate.embedDescription.value;

        // Altbilgi ve Zaman Damgası
        const hasFooter = !!elementsToUpdate.embedFooter.value;
        const hasTimestamp = elementsToUpdate.embedTimestamp.checked;

        if (hasFooter || hasTimestamp) {
            previewElements.footerContainer.classList.remove('hidden');
            previewElements.footerText.textContent = elementsToUpdate.embedFooter.value;
            previewElements.footerIcon.src = elementsToUpdate.embedFooterIcon.value || '';
            previewElements.footerIcon.style.display = elementsToUpdate.embedFooterIcon.value ? 'block' : 'none';

            if (hasTimestamp) {
                previewElements.timestamp.classList.remove('hidden');
                previewElements.timestamp.textContent = new Date().toLocaleString(currentLang);
                previewElements.timestampSeparator.style.display = hasFooter ? 'inline' : 'none';
            } else {
                previewElements.timestamp.classList.add('hidden');
                previewElements.timestampSeparator.style.display = 'none';
            }
        } else {
            previewElements.footerContainer.classList.add('hidden');
        }
    }

    // Bildirim göster
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.classList.remove('error');
        if (isError) {
            notification.classList.add('error');
        }
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Mesajı gönder
    async function sendMessage() {
        const webhookUrl = elementsToUpdate.webhookUrlInput.value.trim();
        if (!webhookUrl) {
            showNotification(translations[currentLang].notificationWebhookRequired, true);
            return;
        }

        const payload = {
            content: elementsToUpdate.messageContent.value || null,
        };

        const embed = {
            title: elementsToUpdate.embedTitle.value,
            description: elementsToUpdate.embedDescription.value,
            color: parseInt(elementsToUpdate.embedColor.value.substring(1), 16),
            author: {
                name: elementsToUpdate.embedAuthor.value,
                icon_url: elementsToUpdate.embedAuthorIcon.value,
            },
            footer: {
                text: elementsToUpdate.embedFooter.value,
                icon_url: elementsToUpdate.embedFooterIcon.value,
            },
        };

        if (elementsToUpdate.embedTimestamp.checked) {
            embed.timestamp = new Date().toISOString();
        }

        // Sadece dolu alanları ekle
        const hasEmbedContent = embed.title || embed.description || embed.author.name || embed.footer.text;
        if (hasEmbedContent) {
            payload.embeds = [embed];
        }

        if (!payload.content && !payload.embeds) {
            // Gönderilecek bir şey yoksa gönderme
            return;
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showNotification(translations[currentLang].notificationSuccess);
            } else {
                showNotification(`${translations[currentLang].notificationError} (Status: ${response.status})`, true);
            }
        } catch (error) {
            showNotification(translations[currentLang].notificationError, true);
            console.error("Fetch error:", error);
        }
    }

    // Alanları temizle
    function resetFields() {
        for (const key in elementsToUpdate) {
            if (elementsToUpdate[key].type === 'checkbox') {
                elementsToUpdate[key].checked = false;
            } else if (elementsToUpdate[key].id !== 'webhook-url') { // Webhook URL'sini temizleme
                elementsToUpdate[key].value = '';
            }
        }
        elementsToUpdate.embedColor.value = '#5865f2';
        elementsToUpdate.embedColorHex.value = '#5865f2';
        updatePreview();
    }

    // Olay dinleyicileri
    Object.values(elementsToUpdate).forEach(el => el.addEventListener('input', updatePreview));
    buttons.send.addEventListener('click', sendMessage);
    buttons.reset.addEventListener('click', resetFields);
    buttons.langSwitcher.addEventListener('change', (e) => setLanguage(e.target.value));

    elementsToUpdate.embedColor.addEventListener('input', () => {
        elementsToUpdate.embedColorHex.value = elementsToUpdate.embedColor.value;
        updatePreview();
    });
    elementsToUpdate.embedColorHex.addEventListener('input', (e) => {
        let hex = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            elementsToUpdate.embedColor.value = hex;
            updatePreview();
        }
    });

    // Başlangıç ayarları
    previewElements.botTimestamp.textContent = `Bugün ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    setLanguage('tr');
    updatePreview();
});

