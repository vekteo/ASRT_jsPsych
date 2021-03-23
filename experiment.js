/* 
Created by Teodora Vekony (vekteo@gmail.com)
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Supervised and optimized by Szonja Weigl
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Github:https://github.com/vekteo/ASRT_jSPsych
*/


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
        <div class='float: center;'><img src='static/images/keyboard.bmp' height='10%' alt='Hand'/></div>
        <p>${language.instruction2.ifClear}</p>`
    ],
    show_clickable_nav: true,
    button_label_next: `${language.button.next}`,
    button_label_previous: `${language.button.previous}`
}

const startPracticeInstruction = { //define instruction at the start of the practice
    type: "html-keyboard-response",
    stimulus: `<p>${language.practice.startPractice}</p>`
};

const startInstruction = { //define instruction at the start of the experiment
    type: "html-keyboard-response",
    stimulus: `<p>${language.task.realTask}</p><p>${language.task.startTask}</p>`
};

const end = { //define end of experiment message
    type: "html-keyboard-response",
    stimulus: `<p>${language.end.endTask}</p><p>${language.end.thankYou}</p>`
};

const subject_id = jsPsych.randomization.randomID(15); //generate a random subject ID
const usedSequence = jsPsych.randomization.shuffle([0,1,2,3]) //the 4 possible positions of the sequence (function shuffles them)
const responseKeys = [['s', 'f', 'j', 'l']]; //response keys settings
const usedSequenceString = usedSequence.map(v=> v+1).join().replace(/,/g, ""); //the sequence positions from 1-4 converted to string
let actualTriplet;
let actualRandom;
const numberOfPracticeBlocks = 3;
const numberOfBlocks = 20;
const numberOfBlockElements = 85;
const numberOfSequenceRepetitions = 10;
const patternTrialImage = "url(static/images/dalmata.jpg)";
const randomTrialImage = "url(static/images/dalmata.jpg)";
const rsi = 120;
const initialDelay = 1000;

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
    stimulus: function () {
        let trials = jsPsych.data.get();
        let blockNum = jsPsych.data.get().last(1).values()[0].block; //relies only on the performance in the last block
        let correct_trials = trials.filter({correct: true, block: blockNum, firstResponse: 1}); //only: correct response, last block, first button press for a given trial
        let numberOfTrials = trials.filter({block: blockNum, firstResponse: 1}).count(); //number of DIFFERENT trials
        let accuracy = Math.round(correct_trials.count() / numberOfTrials * 100); //mean accuracy in the given block
        let rt = Math.round(correct_trials.select('rt').mean()); //mean rt of the given block
        let message;
        if (accuracy < 90) { //if mean accuracy is less than 90, show this message
            message = `<p class='message'><strong>${language.feedback.moreAccurate}</strong></p>`
        } else if (accuracy >= 93 && rt > 200) { //if mean rt is higher than 200 ms, and accuracy than 92%, show this message
            message = `<p class='message'><strong>${language.feedback.faster}</strong></p>`
        } else { //if mean accuracy is over 92% and mean rt is smaller than 500 ms, show this message
            message = `<p class='message'><strong>${language.feedback.continue}</strong></p>`
        }
        return `<h2>${language.feedback.endBlock}${blockNum}</h2><br><p>${language.feedback.yourAccuracy}${accuracy}%</p><p>${language.feedback.yourRt}${rt} ms</p><br>${message}`
    }
}

const blockStart = {
    type: "html-keyboard-response",
    stimulus: `<p>${language.task.nextBlock}</p>`
};

const images = ["static/images/hand.jpg", "static/images/circles.png", "static/images/dalmata.jpg"]; //preload memo logo (stimuli images are preloaded automatically)

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

function randomStimulusProc(block, trialNumber) {
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{stimulus: [0, newRandom], data: {trialType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber, sequence: usedSequenceString, isPractice: 0}}] //jsPsych.init modifies if necessary
    return {
        timeline: [randomTrialProperties],
        timeline_variables: randomStimulus
    }
}

/*function for first stimulus generation in the practice session*/

function firstStimulusProcPractice(block, trialNumber) {
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{stimulus: [0, newRandom], data: {trialType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber, sequence: usedSequenceString, isPractice: 1}}] //jsPsych.init modifies if necessary
    return {
        timeline: [firstTrialProperties],
        timeline_variables: randomStimulus
    }
}

/*function for first stimulus generation*/

function firstStimulusProc(block, trialNumber) {
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{stimulus: [0, newRandom], data: {trialType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber, sequence: usedSequenceString, isPractice: 0}}] //jsPsych.init modifies if necessary
    return {
        timeline: [firstTrialProperties],
        timeline_variables: randomStimulus
    }
}

/*function for random stimulus generation in the practice session*/

function randomStimulusProcPractice(block, trialNumber) {
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{stimulus: [0, newRandom], data: {trialType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber, sequence: usedSequenceString, isPractice: 1}}] //jsPsych.init modifies if necessary
    return {
        timeline: [randomTrialProperties],
        timeline_variables: randomStimulus
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
timeline.push(startPracticeInstruction)
jsPsych.data.addProperties({subject: subject_id}); //add subject ID to the data

/* practice blocks*/

for (let j = 1; j < numberOfPracticeBlocks+1; j++) {
    actualRandom = firstStimulusProcPractice(j,1) //longer delay before first element
    timeline.push(actualRandom);
    insertRepetition(randomRepeat(actualRandom));
    for (let l = 2; l < (numberOfBlockElements+1); l++) { //now 85 practice element in one block
        actualRandom = randomStimulusProcPractice(j,l);
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }
    timeline.push(feedback);
    timeline.push(blockStart);
}
timeline.push(startInstruction);

/* sequence protocol */

for (let j = 1; j < numberOfBlocks+1; j++) {

    /* first five random stimuli at the beginning of the block*/

    actualRandom = firstStimulusProc(j,1) //before first element, longer delay
    timeline.push(actualRandom);
    insertRepetition(randomRepeat(actualRandom));
    for (let l = 2; l < 6; l++) {
        actualRandom = randomStimulusProc(j,l)
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }

    /*create all remaining block elements*/
   
    for (let k = 0; k < numberOfSequenceRepetitions; k++) { //repeat 8-elements sequence 10 times
        for (let n = 0; n < 4; n++) { //repeat pattern + repeat random
            let dataForPattern = {trialType: "P", block: j, firstResponse: 1, trialNumber: n+n+7+(k*8), sequence: usedSequenceString, isPractice: 0} //output parameters for pattern stimuli
            actualRandom = randomStimulusProc(j,n+n+6+(k*8),0)
            timeline.push(actualRandom);
            insertRepetition(randomRepeat(actualRandom));
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

        let lastTrialMinus1 = jsPsych.data.get().last(2).values()[0] //if the same trial is presented for the second time (previous response is incorrect) - write 0 in firstResponse
        let lastTrial = jsPsych.data.get().last(1).values()[0]
        if (typeof (lastTrial.target) != "undefined") {
            if (lastTrialMinus1.correct === false) {
                if (lastTrial.target === lastTrialMinus1.target) {
                    lastTrial.firstResponse = 0
                }
            }
        lastTrial.correctPos = parseInt(lastTrial.target[3])+1 //write the correct position in a separate column (1-4, from left to right)
        lastTrial.correctRespButton = responseKeys[0][parseInt(lastTrial.target[3])] //write the name of the correct response button in a separate column
        lastTrial.respButton = String.fromCharCode(lastTrial.key_press).toLowerCase() //write the name of the response button in a separate column
        if (lastTrial.trialNumber == lastTrialMinus1.trialNumber){ //write cumulative RT in a separate column (the RT from stimulus appeared to CORRECT response)
            lastTrial.cumulativeRT = lastTrial.rt + lastTrialMinus1.cumulativeRT
        }
        else {
            lastTrial.cumulativeRT = lastTrial.rt
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

        if(lastTrial.trialNumber == 1) {
            actualTriplet = ["","",lastTrial.correctPos]
        }
        else if (lastTrial.trialNumber == 2) {
            actualTriplet = ["",jsPsych.data.get().last(lengthOfTrials-secondTripletElementIndex).values()[0].correctPos, lastTrial.correctPos]
        }
        else {
            actualTriplet = [jsPsych.data.get().last(lengthOfTrials-thirdTripletElementIndex).values()[0].correctPos,jsPsych.data.get().last(lengthOfTrials-secondTripletElementIndex).values()[0].correctPos, lastTrial.correctPos];
        }

        lastTrial.actualTriplet = actualTriplet.join().replace(/,/g, ""); //write the actual triplet to a separate column as a string

        /*define actual triplet as x, high, low, repetition or trill*/

        if (lastTrial.isPractice == 1 || lastTrial.trialNumber <= 7) { //if practice block or first 7 element
            lastTrial.tripletType = "X" //trials to exclude
        }
        else if ((usedSequenceString.includes(lastTrial.actualTriplet[0] + lastTrial.actualTriplet[2])) || (usedSequenceString[3] + usedSequenceString[0] === lastTrial.actualTriplet[0] + lastTrial.actualTriplet[2])){ //if the 1st and the 3rd element of the triplet is part of the usedSequenceString
            lastTrial.tripletType = "H" //high-probability triplet
        }
        else if (actualTriplet[0] == actualTriplet[1] && actualTriplet[1] == actualTriplet[2]) { //if all 3 elements are identical
            lastTrial.tripletType = "R" //repetition
        }
        else if (actualTriplet[0] == actualTriplet[2] && actualTriplet[0] != actualTriplet[1]) { //if 1st and 3rd elements are identical
            lastTrial.tripletType = "T" //trill
        }
        else {
            lastTrial.tripletType = "L" //low-probability triplet
        }

    }
        /*add browser events in JSON format*/

        let interactionData = jsPsych.data.getInteractionData()
        const interactionDataOfLastTrial = interactionData.filter({'trial': lastTrial.trial_index}).values();
        if (interactionDataOfLastTrial) {
            lastTrial.browserEvents = JSON.stringify(interactionDataOfLastTrial)
         }
     },
 
     on_finish: function () {
        jsPsych.data.get().localSave("csv", "output.csv"); //saves experiment output to .csv file
    }
})