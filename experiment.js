/*VARIABLES*/

let timeline = []; //create timeline
const welcome = { //create welcome message trial
    type: "html-keyboard-response",
    stimulus: "<h1>Welcome to the experiment!</h1>" +
        "</p> Press any key to begin.</p>" +
        "<div class='float: center;'><img src='static/images/memo_logo.jpg' height='100' width='120' alt='Team Logo'/></div>"
};
const instructions1 = { //define instruction trial 1
    type: "html-keyboard-response",
    stimulus: "<p>In this experiment, you will see four circles on the screen.</p>" +
        "<p>An <b>image of a cat</b> will appear in one of the circles.</p>" +
        "<p>Your task will be to press the button corresponding to the position of the cat.</p>" +
        "<p>Press any key to continue!</p>"
};
const instructions2 = { //define instruction trial 2
    type: "html-keyboard-response",
    stimulus: "<p class = 'buttons'>If the cat is in the first position, press the <strong>'S'</strong> button!</p>" +
        "<p>If the cat is in the second position, press the <strong>'D'</strong> button!</p>" +
        "<p>If the cat is in the third position, press the <strong>'J'</strong> button!</p>" +
        "<p>If the cat is in the fourth position, press the <strong>'K'</strong> button!</p>" +
        "<p class = 'alert'><strong>Try to be as fast and as accurate as possible!</strong></p>" +
        "<p>If you are ready, press ANY key to start a practice!</p>"
};

const instructions3 = { //define instruction trial 3
    type: "html-keyboard-response",
    stimulus: "<p>The real task begins now.</p>" +
        "<p>If you are ready, press ANY key to start the task!</p>"
};

const end = { //define end of experiment message
    type: "html-keyboard-response",
    stimulus: "<p>End of the experiment.</p>" +
        "<p>Thank you for participating!</p>"
};

const subject_id = Math.floor(Math.random() * 100000) //generate a random subject number
const usedSequence = shuffleSequence([0, 1, 2, 3]) //the 4 possible positions of the sequence (function shuffles them)
const responseKeys = [['s', 'd', 'j', 'k']]; //response keys settings

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
        if (accuracy < 92) { //if mean accuracy is less than 92, show this message
            message = "<p class='message'><strong>Try to be more accurate!</strong></p>"
        } else if (rt > 500) { //if mean rt is higher than 500, show this message
            message = "<p class='message'><strong>Try to be faster!</strong></p>"
        } else { //if mean accuracy is over 92% and mean rt is smaller than 500 ms, show this message
            message = "<p class='message'><strong>Please continue!</strong></p>"
        }
        return "<h2>End of block " + blockNum + "</h2>" +
            "<p>Your accuracy: " + accuracy + "%</p>" +
            "<p>Your average response time: " + rt + " ms</p>" + message +
            "<h3 class='continue'>Press any key to continue!</h3>";
    }
}

const images = ['static/images/memo_logo.jpg']; //preload memo logo (stimuli images are preloaded automatically)

/*FUNCTIONS*/

/* function for shuffling the sequence positions */

function shuffleSequence(sequence) {
    for (var i = sequence.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = sequence[i];
        sequence[i] = sequence[j];
        sequence[j] = temp;
    }
    return sequence
}

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
    let randomStimulus = [{stimulus: [0, newRandom], data: {tripletType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber}}] //jsPsych.init modifies if necessary
    return {
        timeline: [random],
        timeline_variables: randomStimulus
    }
}

/*function for inserting the same random element after incorrect response*/

function randomRepeat(actualRandom) {
    return {
        timeline: [randomIncorrect],
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

/*TIMELINE*/

timeline.push(welcome);
timeline.push(instructions1);
timeline.push(instructions2);
jsPsych.data.addProperties({subject: subject_id}); //add subject ID to the data

/*set properties of pattern trials*/

let patternTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 120, //RSI in ms
    target_color: "url(static/images/cat.jpg)", //set image for pattern trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
}

let patternIncorrectTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 0, //RSI set to 0 after incorrect response
    target_color: "url(static/images/cat.jpg)", //set image for pattern trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true, //the default target_color, i.e. the "target stimulus" is set in the source code
}

/*set properties of random trials*/

let randomTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 120,
    target_color: "url(static/images/cat2.jpg)", //set image for random trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
};

let randomIncorrectTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 0,
    target_color: "url(static/images/cat2.jpg)", //set image for random trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
};

let random = randomTrialProperties
let randomIncorrect = randomIncorrectTrialProperties

/*set up blocks*/

let actualRandom;

/* practice blocks*/

for (let j = 1; j < 3; j++) { //SET UP NUMBER OF PRACTICE BLOCKS HERE
    for (let l = 1; l < 5; l++) {
        actualRandom = randomStimulusProc(j,l);
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }
    timeline.push(feedback);
}
timeline.push(instructions3);

/* set up pattern protocols */

for (let j = 1; j < 3; j++) { //2 blocks: MODIFY HERE FOR CHANGE IN THE NUMBER OF BLOCKS

    /* first five random stimuli at the beginning of the block*/
    for (let l = 1; l < 6; l++) {
        actualRandom = randomStimulusProc(j,l)
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }

    /*create all remaining block elements*/
    for (let k = 0; k < 2; k++) { //repeat 8-elements sequence 2 times //MODIFY HERE FOR CHANGE IN THE ELEMENTS IN BLOCKS
        for (let n = 0; n < 4; n++) { //repeat pattern + repeat random
            let dataForPattern = {tripletType: "P", block: j, firstResponse: 1, trialNumber: n+n+7+(k*8)} //output parameters for pattern stimuli
            actualRandom = randomStimulusProc(j,n+n+6+(k*8))
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
}

timeline.push(end)

/*start the experiment*/

jsPsych.init({
    timeline: timeline,
    preload_images: images,
    on_data_update: function () {  //if the same trial is presented for the second time (previous response is incorrect) - write 0 in firstResponse
        let lastTrialMinus1 = jsPsych.data.get().last(2).values()[0]
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
    }
        
    },
    on_finish: function () {
        jsPsych.data.displayData(); //display data at the end
        const interactionData = jsPsych.data.getInteractionData();
        console.log(interactionData.json()); //prints out the interaction events
        console.log(jsPsych.data.get().csv()); //prints out experiment output
        jsPsych.data.get().localSave('csv', 'output.csv'); //saves experiment output to .csv file
    }
})
