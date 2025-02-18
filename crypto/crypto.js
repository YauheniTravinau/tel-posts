document.getElementById("messageForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Получение значений формы
    const warning = document.getElementById("warning").value;
    const customWarning = document.getElementById("customWarning").value;
    const projectDescription = document.getElementById("projectDescription").value;
    const personalOpinion = document.getElementById("personalOpinion").value;
    const cryptoName = document.getElementById("cryptoName").value;
    const cryptoLink = document.getElementById("cryptoLink").value;
    const marketCap = document.getElementById("marketCap").value;
    const profitStandard = document.getElementById("profitStandard").value;
    const profitCustom = document.getElementById("profitCustom").value;
    const growthPrediction = document.getElementById("growthPrediction").value;
    const tagsInput = document.getElementById("tags").value;
    const photosInput = document.getElementById("photos");
    const photos = photosInput.files;

    let exchanges = "";
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const exchangeName = checkbox.value;
        const exchangeLink = checkbox.getAttribute("data-link");
        exchanges += `<a href="${exchangeLink}" target="_blank">${exchangeName}</a> | `;
    });

    // Убираем лишнюю "плитку" в конце строки
    exchanges = exchanges.slice(0, -2);

    // Обработка тегов (до 5 тегов, разделенных пробелами)
    const tagsArray = tagsInput.split(/\s+/).map(tag => `#${tag.trim()}`).slice(0, 5); // Разделяем по пробелам
    const tags = tagsArray.join(' ');

    const message = ` 
${warning !== "Другое" ? `⚠️ <b>Внимание:</b> ${warning.replace("⚠️ Внимание:", "").trim()}` : "⚠️ <b>" + customWarning + "</b>"}

${projectDescription ? `<b>💭</b> ${projectDescription}` : ""}
${personalOpinion ? `<b>🔥</b> ${personalOpinion}` : ""}
${tags ? `${tags}` : ""}

${cryptoName && cryptoLink ? `<b>💎</b> <a href="${cryptoLink}" target="_blank">${cryptoName}</a>` : ""}
${marketCap ? `<b>💰 MCap:</b> ${marketCap}` : ""}
${growthPrediction ? `<b>🔹</b> ${growthPrediction}` : ""}

${profitStandard || ""}
${profitCustom ? `<b>✅</b> ${profitCustom}` : "✅ х... - Ваш выбор - Ваша прибыль!"}

${exchanges || ""}

🌐 <a href="https://toaric.com/" target="_blank">TOARIC.COM</a>

🍀 Удачи.
`.replace(/\n{2,}/g, '\n\n').trim();

    const token = "6474294962:AAEsSW6tuiENb4nal8porTs4Ts97YJFKiSQ";
    const chatId = "@CRYPTOMANETI";

    const sendMessage = () => {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            })
        })
            .then(response => response.json())
            .then(() => {
                document.getElementById("messageForm").reset();
                showMessage(); // Вызов функции для показа сообщения об отправке
            })
            .catch(error => console.error("Ошибка:", error));
    };

    if (photos.length > 0) {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("caption", message);
        formData.append("parse_mode", "HTML");

        for (let i = 0; i < photos.length; i++) {
            formData.append("photo", photos[i]);
        }

        fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(() => {
                document.getElementById("messageForm").reset();
                showMessage(); // Вызов функции для показа сообщения об отправке
            })
            .catch(error => console.error("Ошибка:", error));
    } else {
        sendMessage();
    }
});

// Показывать поле "Другое"
document.getElementById("warning").addEventListener("change", function() {
    document.getElementById("customWarning").style.display = this.value === "Другое" ? "block" : "none";
});
