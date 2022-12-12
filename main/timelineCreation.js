    /*************** TIMELINE CREATION ***************/

function timelineCreation() {

    let timeline = [];
    timeline.push({type: "fullscreen", fullscreen_mode: true});
    timeline.push(instruction);
    jsPsych.data.addProperties({subject: variables.subject_id});
    jsPsych.data.addProperties({session: variables.session_number});

    /* PRACTICE BLOCKS */

    if (numberOfPracticeBlocks > 0) {

        //start with practice instructions

        timeline.push(startPracticeInstruction)

        //push practice trials to timeline (first with longer delay)

        for (let practiceBlockNum = 1; practiceBlockNum < numberOfPracticeBlocks+1; practiceBlockNum++) {
            randomStimulusToTimeline(timeline, practiceBlockNum,1,1,1)
            for (let practiceTrialNum = 2; practiceTrialNum < (variables.numberOfBlockElements+1); practiceTrialNum++) {
                randomStimulusToTimeline(timeline, practiceBlockNum,practiceTrialNum,0,1)
            }

            //show feedback after the end of the practice block

            timeline.push(feedback);
            if (overallWarning == true) {
                timeline.push(warning)
            } 

            //do not show blockStart event after the last practice block

            if (practiceBlockNum !== numberOfPracticeBlocks){
                timeline.push(blockStart);
            }
        }
    }

    timeline.push(startInstruction);

    /* SEQUENCE PROTOCOL */

    for (let blockNum = 1; blockNum < numberOfBlocks+1; blockNum++) {    

        //first five random stimuli at the beginning of the block if necessary

        if (isFirstFiveRandom == true) {

            //before first element, longer delay

            randomStimulusToTimeline(timeline, blockNum, 1, 1, 0)

            //rest of the first random elements

            for (let randomElement = 2; randomElement < 6; randomElement++) {
                randomStimulusToTimeline(timeline, blockNum, randomElement, 0, 0)
            }
        }

        // if we do not want the first five to be random, just start with one random with longer delay

        else {
            randomStimulusToTimeline(timeline, blockNum, 1, 1, 0)
        }
  
        //repeat 8-elements sequence 10 times

        for (let sequenceRepetition = 0; sequenceRepetition < numberOfSequenceRepetitions; sequenceRepetition++) { 

            //push pattern and random elements alternating

            for (let sequencePosition = 0; sequencePosition < 4; sequencePosition++) { 
                if (isFirstFiveRandom == true) {
                    randomStimulusToTimeline(timeline, blockNum, sequencePosition+sequencePosition+6+(sequenceRepetition*8), 0, 0)
                }
                dataForPattern = patternStimulusToTimeline(timeline, blockNum, sequencePosition, sequenceRepetition)
                    if (isFirstFiveRandom == false && dataForPattern.trial_number !== 80) {
                        randomStimulusToTimeline(timeline, blockNum, sequencePosition+sequencePosition+3+(sequenceRepetition*8), 0, 0)
                }
            }
        }

        //show feedback after the end of the block

        timeline.push(feedback);

        //do not show blockStart event after the last block

        if (blockNum !== numberOfBlocks){
            if (overallWarning == true) {
                timeline.push(warning)
            }
            timeline.push(blockStart);
        }
    }

    timeline.push(end)
    timeline.push({type: "fullscreen", fullscreen_mode: false});
    return timeline
}