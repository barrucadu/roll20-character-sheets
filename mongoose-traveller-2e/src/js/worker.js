/* Toggle attributes, used to show / hide other parts of the sheet */
["character", "biography"].forEach(button => on(`clicked:${button}`, function () {
    setAttrs({ "toggle_tab": button });
}));

["species", "culture"].forEach(attr => on(`change:character_${attr}`, function () {
    getAttrs([`character_${attr}`], (values) => setAttrs({ [`toggle_${attr}`]: values[`character_${attr}`] }))
}));

/* Set characteristic roll modifier based on culture */
on("sheet:opened change:character_culture", function() {
    getAttrs(["character_culture"], (values) => {
        switch(values["character_culture"]) {
        case "aslan_hierate":
            setAttrs({
                "characteristic_rollmod": "?{Characteristic|None, 0|Strength, @{characteristics_dm_str}|Dexterity, @{characteristics_dm_dex}|Endurance, @{characteristics_dm_end}|Intellect, @{characteristics_dm_int}|Education, @{characteristics_dm_edu}|Social, @{characteristics_dm_soc}|Aslan Territory, @{characteristics_dm_ter}}"
            });
            break;
        case "vargr_extents":
            setAttrs({
                "characteristic_rollmod": "?{Characteristic|None, 0|Strength, @{characteristics_dm_str}|Dexterity, @{characteristics_dm_dex}|Endurance, @{characteristics_dm_end}|Intellect, @{characteristics_dm_int}|Education, @{characteristics_dm_edu}|Vargr Charisma, @{characteristics_dm_cha}}"
            });
            break;
        default:
            setAttrs({
                "characteristic_rollmod": "?{Characteristic|None, 0|Strength, @{characteristics_dm_str}|Dexterity, @{characteristics_dm_dex}|Endurance, @{characteristics_dm_end}|Intellect, @{characteristics_dm_int}|Education, @{characteristics_dm_edu}|Social, @{characteristics_dm_soc}}"
            });
        }
    });
});

/* TER and CHA from the Aliens of Charted Space vol. 1; LCK from the Traveller Companion */
["str", "dex", "end", "int", "edu", "soc", "ter", "cha", "lck"].forEach(characteristic => on(`sheet:opened change:characteristics_current_${characteristic}`, function() {
    getAttrs([`characteristics_current_${characteristic}`], (values) => {
        /* extended attribute DM formula from the Traveller Companion */
        const val = values[`characteristics_current_${characteristic}`];
        if(val == 0) {
            setAttrs({
                [`characteristics_dm_${characteristic}`]: -3
            });
        } else {
            setAttrs({
                [`characteristics_dm_${characteristic}`]: Math.floor((val - 6) / 3)
            });
        }
    });
}));

on("sheet:opened change:joat", function() {
    getAttrs(["joat"], (values) => {
        setAttrs({ "untrained_dm": Math.min(0, values["joat"] - 3) });
    });
});
