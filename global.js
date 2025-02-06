document.getElementById("messageForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Генерация случайного Лот №
    const lotNumber = generateLotNumber();

    // Получение значений из формы
    const token = "7617087572:AAGUoDl8RN4ZusU50GPuFc-rTCOWWJoi8jE";
    const chatId = "-1002482588195";

    const warning = document.getElementById("warning").value;
    const customWarning = document.getElementById("customWarning").value;
    const status = document.getElementById("status").value;
    const productTitle = document.getElementById("productTitle").value;
    const productDescription = document.getElementById("productDescription").value;
    const price = document.getElementById("price").value;
    const weight = document.getElementById("weight").value;
    const purchaseStatus = document.getElementById("purchaseStatus").value;
    const warehouse = document.getElementById("warehouse").value;
    const customWarehouse = document.getElementById("customWarehouse").value;
    const productLink = document.getElementById("productLink").value;
    const photosInput = document.getElementById("photos");
    const photos = photosInput ? photosInput.files : [];

    const finalWarning = warning === "Другое" ? "⚠️ <b>Внимание:</b> " + customWarning : warning.replace("⚠️ Внимание:", "⚠️ <b>Внимание:</b>");
    const finalWarehouse = warehouse === "Другое" ? customWarehouse : warehouse;

    let message = `
${finalWarning}

<b>Лот №:</b> ${lotNumber}

<b>🔔 ${productTitle}</b>
`;

    // Добавление описания товара, если оно есть
    if (productDescription) {
        message += `<b>📝 описание:</b> ${productDescription}\n`;
    }

    // Добавление цены товара, если она есть
    if (price) {
        message += `<b>💲 Цена товара:</b> ${price}\n`;
    }

    // Добавление веса, если он есть
    if (weight) {
        message += `<b>📦 Вес груза:</b> ${weight}\n`;
    }

    // Статус покупки
    message += `${purchaseStatus}\n`;

    // Добавление склада, если он есть
    message += `<b>📍 Склад:</b> ${finalWarehouse}\n`;

    // Добавление ссылки на товар, если она есть
    if (productLink) {
        message += `<b>🔗 <a href="${productLink}" target="_blank">Ссылка на товар</a></b>\n`;
    }

    message += `<b>💬 Предлагайте свои цены на перевозку в личные сообщения:</b> @TORGGB

<b>${status === "🟢 Перевозчик найден" ? "🟢🟢🟢 Перевозчик найден 🟢🟢🟢" : "🚛 Ищем перевозчика"}</b> 
`;

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
            .then(data => {
                if (data.ok) {
                    showMessage();
                    resetForm();
                }
            })
            .catch(error => console.error("Ошибка:", error));
    } else {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    showMessage();
                    resetForm();
                }
            })
            .catch(error => console.error("Ошибка:", error));
    }
});

// Функция отображения сообщения об отправке
function showMessage() {
    let msgBox = document.getElementById("messageSent");
    if (!msgBox) {
        msgBox = document.createElement("div");
        msgBox.id = "messageSent";
        msgBox.style.color = "green";
        msgBox.style.marginTop = "10px";
        msgBox.textContent = "Сообщение отправлено!";
        document.getElementById("messageForm").appendChild(msgBox);
    } else {
        msgBox.textContent = "Сообщение отправлено!";
    }

    // Через 5 секунд удаляем сообщение
    setTimeout(() => {
        msgBox.remove();
    }, 5000);
}


// Генерация Лот №
function generateLotNumber() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Поля "Другое" при выборе
document.getElementById("warning").addEventListener("change", function() {
    toggleCustomField("warning", "customWarning");
});

document.getElementById("warehouse").addEventListener("change", function() {
    toggleCustomField("warehouse", "customWarehouse");
});

// Функция для скрытия/показа поля ввода "Другое"
function toggleCustomField(selectId, customFieldId) {
    const selectElement = document.getElementById(selectId);
    const customField = document.getElementById(customFieldId);
    customField.style.display = selectElement.value === "Другое" ? "block" : "none";
}

// Сброс всех полей формы
function resetForm() {
    const form = document.getElementById("messageForm");
    form.reset();

    // Скрытие полей "Другое" после сброса
    document.getElementById("customWarning").style.display = "none";
    document.getElementById("customWarehouse").style.display = "none";
}
