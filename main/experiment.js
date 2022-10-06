    /*************** EXPERIMENT START ***************/

function expStart() {

    // variable creation

    if (isOffline == true) {
        variableCreation(subject.value, session.value)
    }
    else {
        variableCreation()
    }

    // timeline creation and run

    const timeline = timelineCreation();
    const images = ["../static/images/ASRT_en.gif", "../static/images/ASRT_hu.gif", "../static/images/keyboard.bmp", "../static/images/dalmata.jpg"]; //preload memo logo (stimuli images are preloaded automatically)

    jsPsych.init({
        timeline: timeline,
        preload_images: images,
        on_data_update: function () {
            dataUpdate()
        },
        on_close: function () {
            jsPsych.data.get().localSave("csv", "ASRT_quit_output.csv");
        },
        on_finish: function () {
            jsPsych.data.get().localSave("csv", "ASRT_output.csv");
        }
    })
}