const fs = require("fs/promises");

/*
Read the file and sort the data to get the data in date order
Create an array of guard objects:
    Guard Id
    Array of all minutes to incremenet when they slept
    Count of the total number of minutes they slept for
    The minute they slept the most for
*/

const reposeRecord = async () => {
	const rawData = await fs.readFile("./puzzleInput.txt", "utf-8");
	const sortedData = arrayifyAndSort(rawData);
	const guardsArray = createGuardsArray(sortedData);
	populateSleepyMinutes(sortedData, guardsArray);
	minuteCalculator(guardsArray);
	findSleepiestGuardData(guardsArray);
	console.log(guardsArray[0]);
	findSleepiestMinuteGuardData(guardsArray);
	console.log(guardsArray[0]);
};

const arrayifyAndSort = (data) => {
	return data.split("\n").sort();
};

const createGuardsArray = (sortedData) => {
	let guardsArray = [];
	const idRegex = /#[0-9]+/g;

	/*
    If we get back an id from our .match
    use the id to create initial guard object
    */

	for (let i = 0; i < sortedData.length; i++) {
		const lineWithFoundGuard = sortedData[i].match(idRegex);
		if (lineWithFoundGuard) {
			const guardId = Number(lineWithFoundGuard[0].split("#")[1]);
			// Add the guard to the guardArray but only if we don't already have them in
			if (
				guardsArray.findIndex((guard) => {
					return guard.id === guardId;
				}) < 0
			) {
				guardsArray.push({
					id: guardId,
					sleepyMinutes: new Array(60).fill(0),
					totalMinutes: 0,
					bestMinute: 0,
					bestMinuteValue: 0,
				});
			}
		}
	}
	return guardsArray;
};

const populateSleepyMinutes = (sortedData, guardsArray) => {
	/*
    Function to populate sleepyMinutes array
    Each minute in the array is incremented by one each time the guard is found to be asleep
    */
	for (let i = 0; i < sortedData.length; i++) {
		/*
        Extract any begin shift lines from the data
        Then extract the guard Ids from those lines
        */
		const shiftStart = sortedData[i].match(/#[0-9]+ begins shift/g);
		const currentGuardId = shiftStart[0].match(/[0-9]+/g);

		/*
        For each line in the sorted data
        if a start of shift is found then
        begin a sequence to determine sleepyMinutes
        */
		if (shiftStart) {
			let currentlyWorking = true;
			let isSleeping = false;
			let sleepStartMinute = 0;
			let sleepEndMinute = 0;

			/*
            Use currentlyWorking variable to let us check when to stop counting sleepMinutes
            Set to false when the next line in data is another guard starting their shift
            Set to false when there is no next line available
            */
			while (currentlyWorking) {
				i++;
				if (sortedData[i]) {
					const checkForShiftEnd = sortedData[i].match(/begins shift/g);

					if (checkForShiftEnd) {
						currentlyWorking = false;
						i--;
					}

					if (!isSleeping) {
						// Extract minutes from sleepingUpdate message
						const sleepStart = sortedData[i].match(/:[0-9]{2}/g);

						if (sleepStart) {
							sleepStartMinute = Number(sleepStart[0].split(":")[1]);
						}
						isSleeping = true;
					} else {
						const sleepEnd = sortedData[i].match(/:[0-9]{2}/g);

						if (sleepEnd) {
							sleepEndMinute = Number(sleepEnd[0].split(":")[1]);
						}

						const guardIndex = guardsArray.findIndex(
							(item) => item.id === Number(currentGuardId)
						);

						for (let j = sleepStartMinute; j < sleepEndMinute; j++) {
							/*
                            If guardObject doesn't currently have a sleepyMinutes value
                            Initialise it as 1
                            */
							if (!guardsArray[guardIndex].sleepyMinutes[j]) {
								guardsArray[guardIndex].sleepyMinutes[j] = 1;
							} else {
								/*
                                After initialised as 1, increment sleepyMinutes in guardObj
                                until wake up minute is reached. Then set isSleeping to false
                                */
								guardsArray[guardIndex].sleepyMinutes[j]++;
							}
						}
						isSleeping = false;
					}
				} else {
					currentlyWorking = false;
				}
			}
		}
	}
};

const minuteCalculator = (guardsArray) => {
	for (let i = 0; i < guardsArray.length; i++) {
		let innerTotalMinutes = 0;
		let innerBestMinute = 0;
		let innerBestMinuteValue = 0;

		for (let j = 0; j < guardsArray[i].sleepyMinutes.length; j++) {
			// Add each total amount of minutes slept for each guard
			innerTotalMinutes = innerTotalMinutes + guardsArray[i].sleepyMinutes[j];
			/* 
            If current sleepyMinute has value greater than the current bestMinute
            Then replace bestMinute with the sleepyMinute
            */
			if (guardsArray[i].sleepyMinutes[j] > innerBestMinuteValue) {
				innerBestMinute = j;
				innerBestMinuteValue = guardsArray[i].sleepyMinutes[j];
			}
		}
		guardsArray[i].bestMinute = innerBestMinute;
		guardsArray[i].bestMinuteValue = innerBestMinuteValue;
		guardsArray[i].totalMinutes = innerTotalMinutes;
	}
};

const findSleepiestGuardData = (guardsArray) => {
	guardsArray.sort((guard1, guard2) => {
		return guard2.totalMinutes - guard1.totalMinutes;
	});
};

const findSleepiestMinuteGuardData = (guardsArray) => {
	guardsArray.sort((guard1, guard2) => {
		return guard2.bestMinuteValue - guard1.bestMinuteValue;
	});
};

reposeRecord();

console.log(2351 * 36);
console.log(1871 * 49);

/*
STRATEGY 1 sleepiestGuardData
GUARD - 2351
THEIR SLEEPIEST MINUTE - 00:36
FINAL ANSWER - 2351 * 36 = 84636
*/

/*
STRATEGY 2 sleepiestMinuteGuardData
GUARD 1871
THEIR SLEEPIEST MINUTE - 49
FINAL ANSWER - 1871 * 49 = 91679
*/
