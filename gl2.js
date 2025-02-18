// Обработчик события для вставки изображений через Ctrl + V
document.getElementById("messageForm").addEventListener("paste", function(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            const photosInput = document.getElementById("photos");
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photosInput.files = dataTransfer.files; // Обновляем список файлов
            break;
        }
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