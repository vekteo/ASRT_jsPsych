# Alternating Serial Reaction Time Task created with jsPsych

<i>Created by the MEMO Team of Lyon Neuroscience Research Center (CRNL) (PI: Dezso Nemeth)</i>

<img src="static/logo_memo.png" height="100">

<h2>Citation</h2>
If you use the script, please include this citation in your manuscript:

Vékony, T. (2021). Alternating Serial Reaction Time Task created with jsPsych (Version 1.0.0) [Computer software]. https://doi.org/10.5281/zenodo.7124730
<a href="https://zenodo.org/badge/latestdoi/258316160"><img src="https://zenodo.org/badge/258316160.svg" alt="DOI"></a>

<h2>About the task</h2>

<p>In the task, four circles are presented on the screen horizontally. A target stimulus (a dog's head) appears in one of the four circles. The task of the user is to press the response key corresponding to the position of the target stimulus as fast and as accurately as they can.</p>

<p>By default, the task begins with one block of practice with random trials (80 stimuli in each block). After that, 20 blocks of ASRT follows. Each block contains 10 repetitions of a randomly chosen 8-element sequence.</p>

<p>The trials are images of dogs. The <strong>'s', 'f', 'j' and 'l'</strong> keys on the keyboard are set as response keys (corresponding to the four positions from left to right).</p>

<p>If correct response is given, the next element is presented after a 120 ms response-to-stimulus interval. If the response is incorrect (but active response key was pressed), the same target stimulus appears on the screen again with an interstimulus interval of 0 ms (i.e., remains on the screen).</p>

<p>Average performance (mean accuracy and mean RT) is presented as a feedback after the end of the block with a personalized instruction:</p>

- if the mean accuracy of the block is less than 90%, it instructs to be more accurate.
- if the mean RT of the block is over 350 ms, it instructs to be faster.
- in other cases, it instructs to continue the task.

<p>The breaks between the blocks are <strong>self-paced</strong>. The user can continue the task when they press a response key.</p>

<p>After the end of the task, output data will be downloaded to the local machine (CSV format). If the user quits before the end of the task, the data will also be downloaded to the local machine.</p>

<h2>Output variables</h2>
<ul>
<li><strong>success:</strong> whether fullscreen mode was successfully started/ended (true or false)</li>
<li><strong>trial_type:</strong> jsPsych trialtype of the given trial (fullscreen, instructions, html-keyboard-response or serial-reaction-time)</li>
<li><strong>trial_index:</strong> the number of the given trials (all events considered, even instructions, feedback!)</li>
<li><strong>time_elapsed:</strong> the time elapsed from the start of the script in ms</li>
<li><strong>internal_code_id:</strong> internal node id of the trial</li>
<li><strong>subject:</strong> a 15-character long random subject ID for the online version, and customized subject number for the offline version</li>
<li><strong>session:</strong> customized session number (for offline version only)</li>
<li><strong>browser_event:</strong> browser events at the given trial (fullscreenenter, fullscreenexit, blur or focus)</li>
<li><strong>view_history:</strong> only relavant at the instructions; the actions and the corresponding RTs during the reading of the instructions</li>
<li><strong>rt:</strong> reaction time (RT) in ms - in the case of first responses to the trial, it shows the rt calculated from the appearence of the stimulus; in the case of not first responses, it shows the rt calculated from the last button press</li>
<li><strong>stimulus:</strong> stimulus on the screen; relevant only if instructions/feedback are present</li>
<li><strong>key_press:</strong> number code of the key pressed</li>
<li><strong>correct:</strong> whether the response was correct (true or false)</li>
<li><strong>grid:</strong> layout of the positions (in a grid)</li>
<li><strong>target:</strong> position of target stimulus (the 4 positions: 1: 0,0; 2: 0,1; 3: 0,2; 4: 0,3)</li>
<li><strong>r_or_p:</strong> random or pattern stimulus (R or P)</li>
<li><strong>block:</strong> number of the block (1-20)</li>
<li><strong>first_response:</strong> if the answer is the first answer to the given trial (yes: 1; no: 0)</li>
<li><strong>trial_number:</strong> number of the trial within the block (1-85)</li>
<li><strong>sequence:</strong> the sequence used during the task (assigned randomly at the beginning)</li>
<li><strong>is_practice:</strong> whether it was a practice trial (yes: 1; 0: no)</li>
<li><strong>correct_pos:</strong> the position of the target stimulus (1-4)</li>
<li><strong>correct_resp_button:</strong> the response key that should be pressed to respond correctly ('s', 'f', 'j' or 'l')</li>
<li><strong>resp_button:</strong> the pressed response key ('s', 'f', 'j' or 'l')</li>
<li><strong>cumulative_RT:</strong> the RT from the beginning of the first appeareance of the trial in ms</li>
<li><strong>actual_triplet:</strong> the triplet to what response was given (three digits indicating the positions of the target stimulus in the last three trials)</li>
<li><strong>triplet_type:</strong> the type of the triplet (high-probability triplet: H; low-probability triplet: L, first trials: X, trill: T, repetition: T)</li>
<li><strong>isWarning:</strong> the string "warning" appears if a warning was shown due to low (<80%) overall performance.</li>
</ul>

<h2>Settings</h2>
In the <i>parameters.js</i> file, several parameters can be modified by the user:
<li><strong>language:</strong> the language of the task. Available languages: english (en), hungarian (hu), french (fr), portuguese (pt)</li>
<li><strong>numberOfPracticeBlocks:</strong> the number of practice blocks at the beginning</li>
<li><strong>numberOfBlocks:</strong> the number of learning blocks (besides the practice blocks)</li>
<li><strong>numberOfSequenceRepetitons:</strong> the number of repetitons of the four-element sequence</li>
<li><strong>patternTrialImage:</strong> the image used for the pattern trials</li>
<li><strong>randomTrialImage:</strong> the image used for the random trials</li>
<li><strong>rsi:</strong> the response-to-stimulus interval after a button press (in ms)</li>
<li><strong>initialDelay:</strong> the delay before the first trial of a block</li>
<li><strong>overallWarning:</strong> a warning can be shown to the participants if their performance drops below 80% throughout the whole task</li>
<li><strong>isOffline:</strong> if true, a screen will appear before the task where we can indicate the subject and session number. In that case, the sequence selected for the participants will depend on the subject number. Always the same sequence will be selected for a specific subject number (in the different sessions). If false, a randomly generated subject number will be allocated to the participant, and the sequence will be selected randomly. In that case, the session number is always 1.</li>
<li><strong>responseKeys:</strong> the response keys</li>
<li><strong>isFirstFiveRandom:</strong> If true, at the beginning of each block, the first five trials will be random (5 random + 80 sequence elements = 85 trials/block). If false, no random trials will be presented at the beginning of the task (80 sequence elements = 80 trials/block)</li>


<h2>How to start the task</h2>
Open the <i>index.html</i> file in the <i>main</i> folder.

<h2>Browser requirements</h2>
<p>Any browser except Safari and Internet Explorer. Recommended: Chrome.</p>
