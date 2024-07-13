document.getElementById('datapack-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const format = document.getElementById('format').value;
    const author = document.getElementById('author').value;
    const features = Array.from(document.querySelectorAll('#features input:checked')).map(input => input.value);

    const zip = new JSZip();

    // Create pack.mcmeta file
    const packMcmeta = {
        'pack': {
            'pack_format': parseInt(format, 10),
            'description': description
        }
    };
    zip.file('pack.mcmeta', JSON.stringify(packMcmeta, null, 2));

    // Function to add functions to the datapack
    const allFeaturesFunction = {};

    function addFunction(name, content) {
        allFeaturesFunction[name] = content;
    }

    function generateFunctionFile(path, content) {
        zip.file(`data/mydatapack/functions/${path}`, content);
    }

    // Generate functions based on selected features
    if (features.includes('night_vision')) {
        addFunction('night_vision.mcfunction', `
            effect give @p night_vision 999999 1 true
        `);
    }

    if (features.includes('speed_boost')) {
        addFunction('speed_boost.mcfunction', `
            effect give @p speed 999999 5 true
        `);
    }

    if (features.includes('auto_smelt')) {
        addFunction('auto_smelt.mcfunction', `
            enchant @p fortune 999999
        `);
    }

    if (features.includes('custom_recipes')) {
        addFunction('custom_recipes.json', `
            {
                "type": "minecraft:crafting_shaped",
                "pattern": [
                    "LLL",
                    "LRL",
                    "LLL"
                ],
                "key": {
                    "L": {
                        "item": "minecraft:oak_leaves",
                        "count": 8
                    },
                    "R": {
                        "item": "minecraft:redstone",
                        "count": 8
                    }
                },
                "result": {
                    "item": "minecraft:emerald",
                    "count": 16
                }
            }
        `);
    }

    if (features.includes('rainbow_sheep')) {
        addFunction('rainbow_sheep.mcfunction', `
            summon minecraft:sheep ~ ~ ~ {Color:14,Tags:["rainbow"]}
            data merge entity @e[type=minecraft:sheep,tag=rainbow] {Color:14,Tags:["rainbow"]}
        `);
        addFunction('tick.mcfunction', `
            execute as @e[type=minecraft:sheep,tag=rainbow] run data merge entity @s {Color:14}
        `);
        zip.file('data/minecraft/tags/functions/tick.json', JSON.stringify({
            values: ["mydatapack:tick"]
        }, null, 2));
    }

    Object.entries(allFeaturesFunction).forEach(([path, content]) => {
        generateFunctionFile(path, content);
    });

    // Generate the zip file and initiate download
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `${name}.zip`;
        a.click();
    });
});

// JavaScript für das Dropdown-Menü und zum Anwenden des ausgewählten Themes
function applyTheme() {
    var themeSelect = document.getElementById('theme-select');
    var selectedTheme = themeSelect.value;

    document.body.className = ''; // Reset all classes
    document.body.classList.add(selectedTheme);

    // Speichere das ausgewählte Thema in localStorage für zukünftige Besuche
    localStorage.setItem('theme', selectedTheme);
}

// Anwenden des gespeicherten Themas bei Seitenaufruf
document.addEventListener('DOMContentLoaded', function () {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        document.getElementById('theme-select').value = savedTheme;
    }
});
