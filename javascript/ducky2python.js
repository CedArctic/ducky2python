// Inject bellow notes and ASCII art as default value of output element in web app

/*	 

 duck2python converts DuckyScript scripts for the USB Rubber Ducky by hak5 to python scripts that function the same way
thus offering a convenient way of testing a script without requiring to load it on a Rubber Ducky each time.

*/

/*

# Print Ascii Art:
print("     _            _          ____              _   _                 ")
print("  __| |_   _  ___| | ___   _|___ \\ _ __  _   _| |_| |__   ___  _ __  ")
print(" / _` | | | |/ __| |/ / | | | __) | '_ \\| | | | __| '_ \\ / _ \\| '_ \\ ")
print("| (_| | |_| | (__|   <| |_| |/ __/| |_) | |_| | |_| | | | (_) | | | |")
print(" \\__,_|\\__,_|\\___|_|\\_\\\\__, |_____| .__/ \\__, |\\__|_| |_|\\___/|_| |_|")
print("                       |___/      |_|    |___/ \tby CedArctic                 ")
print("\n\n")

*/

function convert(){
	// Declare and load Ducky Script and Python Script output:
	var duckyScript = document.getElementById('inputBox').value;
	var pythonScript = "";

	// Write module imports to output file:
	pythonScript += "# Converted using ducky2python by CedArctic (https://github.com/CedArctic/ducky2python) \n";
	pythonScript +="import pyautogui\n";
	pythonScript += "import time\n";

	// Convert the Ducky Script lines to a list and stip whitespaces:
	duckyScript = duckyScript.split(/\r\n|\r|\n/g);
	/* Ducky Statements fall into one of the following 6 categories:
	1. Default Delay	2.Comment	3.Delay 	4.String	5.Repeat	6.Command */

	// Check if there is a default delay:
	var defaultDelay = 0;
	if (duckyScript[0].slice(0,7) == "DEFAULT"){
		// Divide by 1000 because the time.sleep command takes seconds as an argument, not ms
		defaultDelay = parseInt(duckyScript[0].slice(7)) / 1000;
	}


	// Variables:
	var previousStatement = "";	
		
	// Parallel command lists: 
	// The first list contains the ducky commands and the second contains the corresponding pyautogui commands
	var duckyCommands = ["WINDOWS", "GUI", "APP", "MENU", "SHIFT", "ALT", "CONTROL", "CTRL", "DOWNARROW", "DOWN",
	"LEFTARROW", "LEFT", "RIGHTARROW", "RIGHT", "UPARROW", "UP", "BREAK", "PAUSE", "CAPSLOCK", "DELETE", "END",
	"ESC", "ESCAPE", "HOME", "INSERT", "NUMLOCK", "PAGEUP", "PAGEDOWN", "PRINTSCREEN", "SCROLLLOCK", "SPACE", 
	"TAB", "ENTER", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
	"u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
	"Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

	var pyautoguiCommands = ["win", "win", "optionleft", "optionleft", "shift", "alt", "ctrl", "ctrl", "down", "down",
	"left", "left", "right", "right", "up", "up", "pause", "pause", "capslock", "delete", "end",
	"esc", "escape", "home", "insert", "numlock", "pageup", "pagedown", "printscreen", "scrolllock", "space",
	"tab", "enter", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
	"u", "v", "w", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
	"q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

	// Process each line from the Ducky Script:
	for (line = 0; line < duckyScript.length; line++){

		// Check if the statement is a comment
		if(duckyScript[line].slice(0,3) == "REM"){
			previousStatement = duckyScript[line].replace("REM","#");
		}else if (duckyScript[line].slice(0,5) == "DELAY"){
			previousStatement = "time.sleep(" + (parseFloat(duckyScript[line].slice(6)) / 1000) + ")";
		}else if (duckyScript[line].slice(0,6) == "STRING") {
			previousStatement = "pyautogui.typewrite(\"" + duckyScript[line].slice(7) + "\", interval=0.02)";
		}else if (duckyScript[line].slice(0,6) == "STRING") {
			previousStatement = "pyautogui.typewrite(\"" + duckyScript[line].slice(7) + "\", interval=0.02)";
		}else if (duckyScript[line].slice(0,6) == "REPEAT"){
			document.write("YEAH");
			for (i in parseInt(duckyScript[line].slice(7) - 1)){
				pythonScript += previousStatement;
				pythonScript += "\n";

				// Write Default Delay between the commands if it exists:
				if (defaultDelay != 0){
					pythonScript = "time.sleep(" + defaultDelay + ")" + "\n";
				}
			}
		}else{
			// Write beginning of command:
			previousStatement = "pyautogui.hotkey(";
			// Go through the parallel array and check if the examined key is in the command
			for (j = 0; j < pyautoguiCommands.length; j++){
				if (new RegExp("\\b"+duckyCommands[j]+"\\b").test(duckyScript[line])) {
					previousStatement = previousStatement + "\'" + pyautoguiCommands[j] + "\',"; 
				}
			}
			// Remove last comma and add a parenthesis
			previousStatement = previousStatement.slice(0, previousStatement.length - 1) + ")";
		}

		// Write command to output file and add a new line \n :
		pythonScript += previousStatement;
		pythonScript += "\n";

		// Write Default Delay if it exists:
		if (defaultDelay != 0){
			pythonScript = "time.sleep(" + defaultDelay + ")" + "\n";
		}
	}
	// Write Output
	document.getElementById('outputBox').value = pythonScript;
}