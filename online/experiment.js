/*************** VARIABLES ***************/

let timeline = []; //create timeline
const instruction = {
    type: "instructions",
    pages: [
        `<h1>${language.welcomePage.welcome}</h1></p>${language.welcomePage.clickNext}</p>`,
        `<p>${language.instruction.fourCircles}</p>
        <p>${language.instruction.dog}</p>
        <p>${language.instruction.yourTask}
        <div class='float: center;'>${language.instruction.img}</div>
        <p>${language.instruction.restBetweenBlocks}`,
        `<p>${language.instruction2.firstButton}</p>
        <p>${language.instruction2.secondButton}</p>
        <p>${language.instruction2.thirdButton}</p>
        <p>${language.instruction2.fourthButton}</p>
        <div class='float: center;'><img src='../static/images/keyboard.bmp' height='10%' alt='Hand'/></div>
        <p>${language.instruction2.ifClear}</p>`
    ],
    show_clickable_nav: true,
    button_label_next: `${language.button.next}`,
    button_label_previous: `${language.button.previous}`
}

const startPracticeInstruction = { //define instruction at the start of the practice
    type: "html-keyboard-response",
    stimulus: 
        `<h2>${language.practice.practiceSoon}</h2>
        <p>${language.task.place}</p>
        <img src="../static/images/keyboard.bmp" height='10%'>
        <p><strong>${language.practice.startPractice}</strong></p>`
};

const blockStart = {
    type: "html-keyboard-response",
    stimulus: `
    <h2>${language.task.nextBlockSoon}</h2>
    <p>${language.task.place}</p>
    <img src="../static/images/keyboard.bmp" height='10%'>
    <p><strong>${language.task.nextBlock}</strong></p>`
};


const startInstruction = { //define instruction at the start of the experiment
    type: "html-keyboard-response",
    stimulus: 
        `<h2>${language.task.realTask}</h2>
        <p>${language.task.place}</p>
        <img src="../static/images/keyboard.bmp" height='10%'>
        <p>${language.task.startTask}</p>`
};

const end = { //define end of experiment message
    type: "html-keyboard-response",
    stimulus: `<h2>${language.end.endTask}</p><p>${language.end.thankYou}</h2>`
};

const subject_id = jsPsych.randomization.randomID(15); //generate a random subject ID
const usedSequence = jsPsych.randomization.shuffle([0,1,2,3]) //the 4 possible positions of the sequence (function shuffles them)
const responseKeys = [['s', 'f', 'j', 'l']]; //response keys settings
const usedSequenceString = usedSequence.map(v=> v+1).join().replace(/,/g, ""); //the sequence positions from 1-4 converted to string
let actualTriplet;
let actualRandom;

/* set up trial properties */

const trialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
}

const patternTrialProperties = {... trialProperties, pre_target_duration: rsi, target_color: patternTrialImage};
const patternIncorrectTrialProperties = {... trialProperties, pre_target_duration: 0, target_color: patternTrialImage};
const randomTrialProperties = {... trialProperties, pre_target_duration: rsi, target_color: randomTrialImage};
const randomIncorrectTrialProperties = {... trialProperties, pre_target_duration: 0, target_color: randomTrialImage};
const firstTrialProperties = {... trialProperties, pre_target_duration: initialDelay, target_color: randomTrialImage};

/* define feedback message - based on only the first button press for the given stimulus */

const feedback = {
    type: "html-keyboard-response",
    trial_duration: 5000,
    response_ends_trial: false,
    stimulus: function () {
        let trials = jsPsych.data.get();
        let blockNum = jsPsych.data.get().last(1).values()[0].block; //relies only on the performance in the last block
        let correct_trials = trials.filter({correct: true, block: blockNum, first_response: 1}); //only: correct response, last block, first button press for a given trial
        let numberOfTrials = trials.filter({block: blockNum, first_response: 1}).count(); //number of DIFFERENT trials
        let accuracy = Math.round(correct_trials.count() / numberOfTrials * 100); //mean accuracy in the given block
        let rt = Math.round(correct_trials.select('rt').mean()); //mean rt of the given block
        let message;
        if (accuracy < 90) { //if mean accuracy is less than 90, show this message
            message = `<p class='message'><strong>${language.feedback.moreAccurate}</strong></p>`
        } else if (rt > 350) { //if mean rt is higher than 350ms
            message = `<p class='message'><strong>${language.feedback.faster}</strong></p>`
        } else { //else, show this message
            message = `<p class='message'><strong>${language.feedback.continue}</strong></p>`
        }
        return `<h2>${language.feedback.endBlock}${blockNum}</h2><br><p>${language.feedback.yourAccuracy}${accuracy}%</p><p>${language.feedback.yourRt}${rt} ms</p><br>${message}`
    }
}

const images = ["../static/images/ASRT_en.gif", "../static/images/ASRT_hu.gif", "../static/images/keyboard.bmp", "../static/images/dalmata.jpg"]; //preload memo logo (stimuli images are preloaded automatically)

/*************** FUNCTIONS ***************/

/*function for incorrect pattern trial procedures*/

function IncorrectTrialProcs(timeline, timelineVariables) {
    this.timeline = timeline
    this.timeline_variables = timelineVariables
    this.conditional_function = function () { //function only happens is response is not correct!
        const data = jsPsych.data.get().last(1).values()[0];
        return data.correct !== true;
    }
}

/*function for random stimulus generation*/

function randomStimulusProc(block, trialNumber, isFirstTrial, isPractice) {
    let stimuli;
    let trialProp;
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    stimuli = [{stimulus: [0, newRandom], data: {p_or_r: "R", block: block, first_response: 1,  trial_number: trialNumber, sequence: usedSequenceString}}] //jsPsych.init modifies if necessary
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


/*function for inserting the same random element after incorrect response*/

function randomRepeat(actualRandom) {
    return {
        timeline: [randomIncorrectTrialProperties],
        timeline_variables: actualRandom.timeline_variables,
        conditional_function: function () { //function only happens is response is not correct!
            let data = jsPsych.data.get().last(1).values()[0];
            return data.correct !== true;
        }
    }
}

/*function for inserting conditional after incorrect response*/

function insertRepetition(element) {
    for (let i = 0; i < 100; i++) {
        timeline.push(element);
    }
}

/////////////////////////////////////////

/*************** TIMELINE ***************/

timeline.push({type: "fullscreen", fullscreen_mode: true});
timeline.push(instruction);
jsPsych.data.addProperties({subject: subject_id}); //add subject ID to the data

/* practice blocks*/

if (numberOfPracticeBlocks > 0) {
    timeline.push(startPracticeInstruction)
    for (let j = 1; j < numberOfPracticeBlocks+1; j++) {
        actualRandom = randomStimulusProc(j,1,1,1) //longer delay before first element
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
        for (let l = 2; l < (numberOfBlockElements+1); l++) { //now 85 practice element in one block
            actualRandom = randomStimulusProc(j,l,0,1);
            timeline.push(actualRandom);
            insertRepetition(randomRepeat(actualRandom));
        }
        timeline.push(feedback);
    
        if (j!==numberOfPracticeBlocks){
            timeline.push(blockStart);
        }
    }
}

timeline.push(startInstruction);

/* sequence protocol */

for (let j = 1; j < numberOfBlocks+1; j++) {

    /* first five random stimuli at the beginning of the block*/

    actualRandom = randomStimulusProc(j,1,1,0) //before first element, longer delay
    timeline.push(actualRandom);
    insertRepetition(randomRepeat(actualRandom));
    for (let l = 2; l < 6; l++) {
        actualRandom = randomStimulusProc(j,l,0,0)
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }

    /*create all remaining block elements*/
  
    for (let k = 0; k < numberOfSequenceRepetitions; k++) { //repeat 8-elements sequence 10 times
        for (let n = 0; n < 4; n++) { //repeat pattern + repeat random

            actualRandom = randomStimulusProc(j,n+n+6+(k*8), 0, 0)
            timeline.push(actualRandom);
            insertRepetition(randomRepeat(actualRandom));

            let dataForPattern = {p_or_r: "P", block: j, first_response: 1, trial_number: n+n+7+(k*8), sequence: usedSequenceString, is_practice: 0} //output parameters for pattern stimuli
            let patternTrialProc = {
                timeline: [patternTrialProperties],
                timeline_variables: [{stimulus: [0, usedSequence[n]], data: dataForPattern}]
            }
            timeline.push(patternTrialProc)
            ;
            let patternIncorrectTrialProc = new IncorrectTrialProcs([patternIncorrectTrialProperties], [{
                stimulus: [0, usedSequence[n]],
                data: dataForPattern
            }]);
            insertRepetition(patternIncorrectTrialProc)
        }
    }

    /*show feedback after the end of the block*/
    
    timeline.push(feedback);

    /*do not show blockStart event after the last block*/
    
    if (j!==numberOfBlocks){
        timeline.push(blockStart);
    }
}

timeline.push(end)
timeline.push({type: "fullscreen", fullscreen_mode: false});

/*************** EXPERIMENT START AND DATA UPDATE ***************/

jsPsych.init({
    timeline: timeline,
    preload_images: images,
    on_data_update: function () {  

        /*output properties*/

        let lastTrialMinus1 = jsPsych.data.get().last(2).values()[0] //if the same trial is presented for the second time (previous response is incorrect) - write 0 in first_response
        let lastTrial = jsPsych.data.get().last(1).values()[0]
        if (typeof (lastTrial.target) != "undefined") {
            if (lastTrialMinus1.correct === false) {
                if (lastTrial.target === lastTrialMinus1.target) {
                    lastTrial.first_response = 0
                }
            }
        lastTrial.correct_pos = parseInt(lastTrial.target[3])+1 //write the correct position in a separate column (1-4, from left to right)
        lastTrial.correct_resp_button = responseKeys[0][parseInt(lastTrial.target[3])] //write the name of the correct response button in a separate column
        lastTrial.resp_button = String.fromCharCode(lastTrial.key_press).toLowerCase() //write the name of the response button in a separate column
        if (lastTrial.trial_number == lastTrialMinus1.trial_number){ //write cumulative RT in a separate column (the RT from stimulus appeared to CORRECT response)
            lastTrial.cumulative_RT = lastTrial.rt + lastTrialMinus1.cumulative_RT
        }
        else {
            lastTrial.cumulative_RT = lastTrial.rt
        }

    /*calculate triplet types*/

        var areTrialsCorrect = jsPsych.data.get().select("correct").values;
        let lengthOfTrials = areTrialsCorrect.length
        let isCurrentCorrect = lastTrial.correct

        var secondTripletElementIndex = //find last correct response and take its index
            isCurrentCorrect ? areTrialsCorrect.lastIndexOf(true, areTrialsCorrect.lastIndexOf(true)-1) :
            areTrialsCorrect.lastIndexOf(true)

        var thirdTripletElementIndex = areTrialsCorrect.lastIndexOf(true,secondTripletElementIndex-1) //find second last correct response and take its index

        /* define the elements of the triplet*/

        if(lastTrial.trial_number == 1) {
            actualTriplet = ["","",lastTrial.correct_pos]
        }
        else if (lastTrial.trial_number == 2) {
            actualTriplet = ["",jsPsych.data.get().last(lengthOfTrials-secondTripletElementIndex).values()[0].correct_pos, lastTrial.correct_pos]
        }
        else {
            actualTriplet = [jsPsych.data.get().last(lengthOfTrials-thirdTripletElementIndex).values()[0].correct_pos,jsPsych.data.get().last(lengthOfTrials-secondTripletElementIndex).values()[0].correct_pos, lastTrial.correct_pos];
        }

        lastTrial.actual_triplet = actualTriplet.join().replace(/,/g, ""); //write the actual triplet to a separate column as a string

        /*define actual triplet as x, high, low, repetition or trill*/

        if (lastTrial.is_practice == 1 || lastTrial.trial_number <= 7) { //if practice block or first 7 element
            lastTrial.triplet_type = "X" //trials to exclude
        }
        else if ((usedSequenceString.includes(lastTrial.actual_triplet[0] + lastTrial.actual_triplet[2])) || (usedSequenceString[3] + usedSequenceString[0] === lastTrial.actual_triplet[0] + lastTrial.actual_triplet[2])){ //if the 1st and the 3rd element of the triplet is part of the usedSequenceString
            lastTrial.triplet_type = "H" //high-probability triplet
        }
        else if (actualTriplet[0] == actualTriplet[1] && actualTriplet[1] == actualTriplet[2]) { //if all 3 elements are identical
            lastTrial.triplet_type = "R" //repetition
        }
        else if (actualTriplet[0] == actualTriplet[2] && actualTriplet[0] != actualTriplet[1]) { //if 1st and 3rd elements are identical
            lastTrial.triplet_type = "T" //trill
        }
        else {
            lastTrial.triplet_type = "L" //low-probability triplet
        }

    }
        /*add browser events*/

        let interactionData = jsPsych.data.getInteractionData()
        const interactionDataOfLastTrial = interactionData.filter({'trial': lastTrial.trial_index}).values();
        if (interactionDataOfLastTrial) {
            lastTrial.browser_events = JSON.stringify(interactionDataOfLastTrial)

         }
     },
     on_close: function () {
        jsPsych.data.get().localSave("csv", "ASRT_quitted_output.csv"); //saves experiment output to .csv file if quitted earlier
    },
     on_finish: function () {
        jsPsych.data.get().localSave("csv", "ASRT_output.csv"); //saves experiment output to .csv file
    }
})
