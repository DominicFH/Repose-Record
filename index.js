/*
TASK - FIND THE GUARD WITH THE MOST MINUTES SLEEP

ALL ASLEEP TIMES ARE BETWEEN 00:00 and 01:00

NOT SORTED BY TIMESTAMP - DEALT WITH

IF ARRAY CONTAINS 'GUARD' AND NEXT ARRAY DOESN'T THEN ADD THE TIME



ARRAY OF GUARD OBJECTS
GUARD ID WITH TIME SLEPT

*/
const fs = require("fs").promises;

const reposeRecord = () => {
	fs.readFile("./puzzleInput.txt", "utf8").then((fileData) => {
		const arrayifiedData = fileData.split("\n").sort();

		const stringPreppedData = arrayifiedData.map((element) => {
			return element + "\n";
		});

		const output = stringPreppedData.toString();
		fs.writeFile("./result.txt", output, "utf8");
	});
};

// 	console.log(readAndSort());
// 	// { guardId: 967, timeSlept: 34}
// 	let guardsArray = [];

// 	fs.readFile("./puzzleInput.txt", "utf8")
// 		.then((response) => {
// 			const splitData = response.split("\n");
// 			return splitData.sort();
// 		})
// 		.then((sortedData) => {
// 			// Find any guards who don't fall asleep to remove them from the array
// 			let professionalGuards = [];
// 			for (let i = 0; i < sortedData.length; i++) {
// 				const currentData = sortedData[i];
// 				const nextData = sortedData[i + 1];
// 				if (sortedData[i].includes("#2441")) {
// 				}
// 			}
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };

reposeRecord();
