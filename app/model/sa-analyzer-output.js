class SAAnalyzerOutput {
    constructor(){
        this.sa = {
            erhebungsphase: {
                beschreibung_tagged: undefined,
                interpretation_tagged: undefined,
                verhalten_tagged: undefined,
                kiesler_kreis: undefined,
                ergebnis_real_tagged: undefined,
                ergebnis_wunsch_tagged: undefined,
                ziel_erreicht: undefined,
                ziel_nicht_erreicht_grund_tagged: undefined,
            },
            loesungsphase: {
                revision_tagged: undefined,
                schlachtrufe_tagged: undefined,
                zielfuehrendes_verhalten_tagged: undefined,
                take_home_message_tagged: undefined,
                transfer_tagged: undefined
            }
        };
        this.result = {
            emotion: "", //ekel, freude, furcht, trauer, ueberraschung, verachtung, wut
            polarity: "", // negative, neutral, positive
            weight: 0, // -1 - 1
            senseRateOverAll: 0, // 0 - 1
            senseRateInspectedList: 0, // 0 - 1
            korrektur_list: []
        };
    }
}

module.exports = SAAnalyzerOutput;