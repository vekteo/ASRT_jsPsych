/*************** ASRT FUNCTIONS ***************/

//function for random stimulus generation

function randomStimulusProc(block, trialNumber, isFirstTrial, isPractice) {
    let stimuli;
    let trialProp;
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    stimuli = [{stimulus: [0, newRandom], data: {p_or_r: "R", block: block, first_response: 1,  trial_number: trialNumber, sequence: variables.usedSequenceString}}] //jsPsych.init modifies if necessary
    if (isFirstTrial == 1 && isPractice == 1) {
        stimuli[0].data.is_practice = 1;
        trialProp = firstTrialProperties;
    }
    else if (isPractice == 1) {
        stimuli[0].data.is_practice = 1;
        trialProp = randomTrialProperties
    } 
    else if (isFirstTrial == 1){
        stimuli[0].data.is_practice = 0;
        trialProp = firstTrialProperties
    }
    else {
        stimuli[0].data.is_practice = 0;
        trialProp = randomTrialProperties
    }
    return {
        timeline: [trialProp],
        timeline_variables: stimuli
    }
}

//function for inserting element after incorrect response

function insertRepetition(timeline, element) {
    for (let i = 0; i < 15; i++) {
        timeline.push(element);
    }
}

//function for inserting the same random element after incorrect response

function randomRepeat(actualRandom) {
    return {
        timeline: [randomIncorrectTrialProperties],
        timeline_variables: actualRandom.timeline_variables,
        conditional_function: function () {
            let data = jsPsych.data.get().last(1).values()[0];
            return data.correct !== true;
        }
    }
}

//function for incorrect pattern trial procedures

function IncorrectTrialProcs(timeline, timelineVariables) {
    this.timeline = timeline
    this.timeline_variables = timelineVariables
    this.conditional_function = function () {
        const data = jsPsych.data.get().last(1).values()[0];
        return data.correct !== true;
    }
}

//function for adding random stimulus to timeline

function randomStimulusToTimeline(timeline, block, trialNumber, isFirstTrial, isPractice) {
    actualRandom = randomStimulusProc(block, trialNumber, isFirstTrial, isPractice) //longer delay before first element
    timeline.push(actualRandom);
    insertRepetition(timeline, randomRepeat(actualRandom));
}

//function for adding pattern stimulus to timeline

function patternStimulusToTimeline(timeline, block, sequencePosition, sequenceRepetition) {
    let dataForPattern = {p_or_r: "P", block: block, first_response: 1, trial_number: sequencePosition+sequencePosition+variables.firstValidTrial+(sequenceRepetition*8), sequence: variables.usedSequenceString, is_practice: 0} //output parameters for pattern stimuli
    let patternTrialProc = {
        timeline: [patternTrialProperties],
        timeline_variables: [{stimulus: [0, variables.usedSequence[sequencePosition]], data: dataForPattern}]
    }
    timeline.push(patternTrialProc);
    let patternIncorrectTrialProc = new IncorrectTrialProcs([patternIncorrectTrialProperties], [{
        stimulus: [0, variables.usedSequence[sequencePosition]],
        data: dataForPattern
    }]);
    insertRepetition(timeline, patternIncorrectTrialProc)

    return dataForPattern;
}