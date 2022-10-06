    /*************** STIMULI ***************/

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

    const startPracticeInstruction = {
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


    const startInstruction = {
        type: "html-keyboard-response",
        stimulus: 
            `<h2>${language.task.realTask}</h2>
            <p>${language.task.place}</p>
            <img src="../static/images/keyboard.bmp" height='10%'>
            <p>${language.task.startTask}</p>`
    };

    const end = {
        type: "html-keyboard-response",
        stimulus: `<h2>${language.end.endTask}</p><p>${language.end.thankYou}</h2>`
    };

    const feedback = {
        type: "html-keyboard-response",
        trial_duration: 5000,
        response_ends_trial: false,
        stimulus: function () {
            let trials = jsPsych.data.get();
            let blockNum = jsPsych.data.get().last(1).values()[0].block;
            let correct_trials = trials.filter({correct: true, block: blockNum, first_response: 1});
            let numberOfTrials = trials.filter({block: blockNum, first_response: 1}).count();
            let accuracy = Math.round(correct_trials.count() / numberOfTrials * 100);
            let rt = Math.round(correct_trials.select('rt').mean());
            let message;
            if (accuracy < 90) {
                message = `<p class='message'><strong>${language.feedback.moreAccurate}</strong></p>`
            } else if (rt > 350) {
                message = `<p class='message'><strong>${language.feedback.faster}</strong></p>`
            } else {
                message = `<p class='message'><strong>${language.feedback.continue}</strong></p>`
            }
            return `<h2>${language.feedback.endBlock}${blockNum}</h2><br><p>${language.feedback.yourAccuracy}${accuracy}%</p><p>${language.feedback.yourRt}${rt} ms</p><br>${message}`
        }
    }

    const warningStimulus = {
        type: "html-keyboard-response",
        response_ends_trial: true,
        data: {is_warning: "warning"},
        stimulus: function () {
            let trials = jsPsych.data.get().filter({trial_type: "serial-reaction-time"});
            let correctTrials = trials.filter({correct: true, first_response: 1});
            let numberOfTrials = trials.filter({first_response: 1}).count();
            let allAccuracy = Math.round(correctTrials.count() / numberOfTrials * 100);
            return `<h2 class="warning">${language.warning.warning}</h2>
                <p>${language.warning.accuracy}</p><p style="color:red; font-size:50px">${allAccuracy}%</p>
                <p><strong>${language.warning.onlyValid}</strong></p>
                <p><strong>${language.warning.moreAccurate}</strong></p><br>
                <p>${language.warning.pressButton}</p>`
        },
    }

    const warning = {
        timeline: [warningStimulus],
        timeline_variables: warningStimulus.data,
        conditional_function: function() {
            let trial = jsPsych.data.get().filter({trial_type: "serial-reaction-time"});
            let correctTrials = trial.filter({correct: true, first_response: 1});
            let numberOfTrials = trial.filter({first_response: 1}).count();
            let allAccuracy = Math.round(correctTrials.count() / numberOfTrials * 100);
            return allAccuracy < 80;
        }
    }

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


