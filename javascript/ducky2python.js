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
		duckyScript.shift();
	}


	// Variables:
	var previousStatement = "";	
	var keys = [];
		
	// Dictionary containing Duckyscript and their corresponding pyautogui keys
	var duckyCommands = {"WINDOWS":"win", "GUI":"win", "APP":"optionleft", "MENU":"optionleft",	"SHIFT":"shift",
	"ALT":"alt", "CONTROL":"ctrl", "CTRL":"ctrl",	"DOWNARROW":"down", "DOWN":"down", "LEFTARROW":"left",
	"LEFT":"left", "RIGHTARROW":"right", "RIGHT":"right", "UPARROW":"up",	"UP":"up", "BREAK":"pause",
	"PAUSE":"pause", "CAPSLOCK":"capslock", "DELETE":"delete", "END":"end", "ESC":"esc", "ESCAPE":"esc",
	"HOME":"home", "INSERT":"insert", "NUMLOCK":"numlock", "PAGEUP":"pageup", "PAGEDOWN":"pagedown",
	"PRINTSCREEN":"printscreen", "SCROLLLOCK":"scrolllock", "SPACE":"space", "TAB":"tab", "ENTER":"enter",
	"F1":"f1", "F2":"f2", "F3":"f3", "F4":"f4", "F5":"f5", "F6":"f6", "F7":"f7", "F8":"f8", "F9":"f9",
	"F10":"f10", "F11":"f11", "F12":"f12", "a":"A", "b":"B", "c":"C", "d":"D", "e":"E", "f":"F", "g":"G",
	"h":"H", "i":"I", "j":"J", "k":"K", "l":"L", "m":"M", "n":"N", "o":"O", "p":"P", "q":"Q", "r":"R",
	"s":"S", "t":"T", "u":"U", "v":"V", "w":"W", "x":"X", "y":"Y", "z":"Z", "A":"A", "B":"B", "C":"C", "D":"D",
	"E":"E", "F":"F", "G":"G", "H":"H", "I":"I", "J":"J", "K":"K", "L":"L", "M":"M", "N":"N", "O":"O", "P":"P",
	"Q":"Q", "R":"R", "S":"S", "T":"T", "U":"U", "V":"V", "W":"W", "X":"X", "Y":"Y", "Z":"Z", "1":"1", "2":"2",
	"3":"3", "4":"4", "5":"5", "6":"6", "7":"7", "8":"8", "9":"9", "0":"0", "!":"!", "\"":"\"", "#":"#", "$":"$",
	"%":"%", "&":"&", "\'":"\'", "(":"(", ")":")", "*":"*", "+":"+", ",":",", "-":"-", ".":".", "/":"/", ":":":",
	";":";", "<":"<", "=":"=", ">":">", "?":"?", "@":"@", "[":"[", "]":"]", "^":"^", "_":"_", "`":"`", "{":"{",
	"|":"|", "}":"}", "~":"~"};

	// Process each line from the Ducky Script:
	for (line = 0; line < duckyScript.length; line++){

		// Check if the statement is a comment
		if(duckyScript[line].slice(0,3) == "REM"){
			previousStatement = duckyScript[line].replace("REM","#");
		}else if (duckyScript[line].slice(0,5) == "DELAY"){
			previousStatement = "time.sleep(" + (parseFloat(duckyScript[line].slice(6)) / 1000) + ")";
		}else if (duckyScript[line].slice(0,6) == "STRING") {
			previousStatement = "pyautogui.typewrite(\"" + duckyScript[line].slice(7) + "\", interval=0.02)";
		}else if (duckyScript[line].slice(0,6) == "REPEAT"){
			var repetitions = parseInt(duckyScript[line].slice(7)) - 1;
			for (i = 0; i < repetitions; i++){
				pythonScript += previousStatement;
				pythonScript += "\n";

				// Write Default Delay between the commands if it exists:
				if (defaultDelay != 0){
					pythonScript += "time.sleep(" + defaultDelay + ")\n";
				}
			}
		}else{
			// Write beginning of command:
			previousStatement = "pyautogui.hotkey(";
			// Split statement into keys
			keys = duckyScript[line].split(" ");
			// Go through the keys matching them through the dictionary to pyautogui keys
			for (j = 0; j < keys.length; j++){
				if (keys[j] in duckyCommands){
					previousStatement += "\"" + duckyCommands[keys[j]] + "\",";
				}else{
					// If it is not in the dictionary
					previousStatement += "UNDEFINED_KEY" + ",";
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
			pythonScript += "time.sleep(" + defaultDelay + ")" + "\n";
		}
	}
	// Write Output
	document.getElementById('outputBox').value = pythonScript;
}