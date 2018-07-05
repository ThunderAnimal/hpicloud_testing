const ETagTable = {
    ADJA:"ADJA",  //attributives Adjektiv
    ADJD:"ADJD",  //adverbiales oder prädikatives Adjektiv

    ADV:"ADV",  //Adverb

    APPR:"APPR",  //Präposition; Zirkumposition links
    APPRART:"APPRART",  //Präposition mit Artikel
    APPO:"APPO",  //Postposition
    APZR:"APZR",  //Zirkumposition rechts

    ART:"ART",  //bestimmter oder unbestimmter Artikel

    CARD:"CARD",  //Kardinalzahl

    FM:"FM",  //Fremdsprachliches Material

    ITJ:"ITJ",  //Interjektion

    KOUI:"KOUI",  //unterordnende Konjunktion mit ``zu'' und Infinitiv
    KOUS:"KOUS",  //unterordnende Konjunktion mit Satz
    KON:"KON",  //nebenordnende Konjunktion
    KOKOM:"KOKOM",  //Vergleichskonjunktion

    NN:"NN",  //normales Nomen
    NE:"NE",  //Eigennamen

    PDS:"PDS",  //substituierendes Demonstrativpronomen
    PDAT:"PDAT",  //attribuierendes Demonstrativpronomen

    PIS:"PIS",  //substituierendes Indefinitpronomen
    PIAT:"PIAT",  //attribuierendes Indefinitpronomen ohne Determiner
    PIDAT:"PIDAT",  //attribuierendes Indefinitpronomen mit Determiner

    PPER:"PPER",  //irreflexives Personalpronomen

    PPOSS:"PPOSS",  //substituierendes Possessivpronomen
    PPOSAT:"PPOSAT",  //attribuierendes Possessivpronomen

    PRELS:"PRELS",  //substituierendes Relativpronomen
    PRELAT:"PRELAT",  //attribuierendes Relativpronomen

    PRF:"PRF",  //reflexives Personalpronomen

    PWS:"PWS",  //substituierendes Interrogativpronomen
    PWAT:"PWAT",  //attribuierendes Interrogativpronomen
    PWAV:"PWAV",  //adverbiales Interrogativ- oder Relativpronomen

    PAV:"PAV",  //Pronominaladverb

    PTKZU:"PTKZU",  //``zu'' vor Infinitiv
    PTKNEG:"PTKNEG",  //Negationspartikel
    PTKVZ:"PTKVZ",  //abgetrennter Verbzusatz
    PTKANT:"PTKANT",  //Antwortpartikel
    PTKA:"PTKA",  //Partikel bei Adjektiv oder Adverb

    TRUNC:"TRUNC",  //Kompositions-Erstglied

    VVFIN:"VVFIN",  //finites Verb, voll
    VVIMP:"VVIMP",  //Imperativ, voll
    VVINF:"VVINF",  //Infinitiv, voll
    VVIZU:"VVIZU",  //Infinitiv mit ``zu'', voll
    VVPP:"VVPP",  //Partizip Perfekt, voll
    VAFIN:"VAFIN",  //finites Verb, aux
    VAIMP:"VAIMP",  //Imperativ, aux
    VAINF:"VAINF",  //Infinitiv, aux
    VAPP:"VAPP",  //Partizip Perfekt, aux
    VMFIN:"VMFIN",  //finites Verb, modal
    VMINF:"VMINF",  //Infinitiv, modal
    VMPP:"VMPP",  //Partizip Perfekt, modal

    XY:"XY",  //Nichtwort, Sonderzeichen enthaltend

    $Koma:"$,",  //Komma
    $Punkt:"$.",  //Satzbeendende Interpunktion
    $Klammer:"$(",  //sonstige Satzzeichen; satzintern


};

module.exports = ETagTable;