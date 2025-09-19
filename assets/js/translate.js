const fetch = require("node-fetch");
const fs = require("fs");

// Función para traducir un texto
async function translateText(text, source = "es", target = "en") {
    const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        body: JSON.stringify({
            q: text,
            source,
            target,
            format: "text"
        }),
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    return data.translatedText;
}

// Ejemplo: traducir un JSON de español a inglés
async function translateFile() {
    // Leer archivo en español
    const esData = JSON.parse(fs.readFileSync("./locales/es/translation.json", "utf8"));
    const enData = {};

    for (const key of Object.keys(esData)) {
        enData[key] = await translateText(esData[key], "es", "en");
        console.log(`✔️ ${esData[key]} → ${enData[key]}`);
    }

    // Guardar traducción en inglés
    fs.writeFileSync("./locales/en/translation.json", JSON.stringify(enData, null, 2));
    console.log("✅ Traducción completa: locales/en/translation.json generado");
}

translateFile();