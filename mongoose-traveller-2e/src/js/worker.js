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
        const val = parseInt(values[`characteristics_current_${characteristic}`]);
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

/* Untrained DM = Jack of All Trades - 3 */
on("sheet:opened change:joat", function() {
    getAttrs(["joat"], (values) => {
        const cJOAT = parseInt(values["joat"]);
        setAttrs({ "untrained_dm": Math.min(0, cJOAT - 3) });
    });
});

/* Max Total Skill Level = 3 * (EDU + INT) */
on("sheet:opened change:characteristics_current_edu change:characteristics_current_int", function() {
    getAttrs(["characteristics_current_edu", "characteristics_current_int"], (values) => {
        const cEDU = parseInt(values["characteristics_current_edu"]);
        const cINT = parseInt(values["characteristics_current_int"]);
        setAttrs({ "max_skill_level": 3 * (cEDU + cINT) });
    });
});

/* Current Total Skill Level = sum of nonzero skills */
on("sheet:opened change:repeating_skills:skill_level remove:repeating_skills", function() {
    getSectionIDs("repeating_skills", (idArray) => {
        const attrNames = idArray.reduce((acc, id) => [...acc, `repeating_skills_${id}_skill_level`], []);
        getAttrs(attrNames, (values) => {
            const totalSkillLevel = Object.values(values).reduce((acc, x) => acc + parseInt(x), 0);
            setAttrs({ "total_skill_level": totalSkillLevel });
        });
    });
});

/* Add "Unarmed" weapon when sheet is first opened */
on("sheet:opened", function() {
    getSectionIDs("repeating_weapons", (idArray) => {
        if(idArray.length == 0) {
            const newRowId = generateRowID();
            setAttrs({
                [`repeating_weapons_${newRowId}_weapon_type`]: "Unarmed",
                [`repeating_weapons_${newRowId}_weapon_range`]: "Melee",
                [`repeating_weapons_${newRowId}_weapon_damage`]: "1d6",
                [`repeating_weapons_${newRowId}_weapon_skill_level`]: -3,
            });
        }
    });
});
