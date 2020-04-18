''' 
 duck2python converts DuckyScript scripts for the USB Rubber Ducky by hak5 to python scripts that function the same way
thus offering a convenient way of testing a script without requiring to load it on a Rubber Ducky each time.
'''

# Print Ascii Art:
print("     _            _          ____              _   _                 ")
print("  __| |_   _  ___| | ___   _|___ \\ _ __  _   _| |_| |__   ___  _ __  ")
print(" / _` | | | |/ __| |/ / | | | __) | '_ \\| | | | __| '_ \\ / _ \\| '_ \\ ")
print("| (_| | |_| | (__|   <| |_| |/ __/| |_) | |_| | |_| | | | (_) | | | |")
print(" \\__,_|\\__,_|\\___|_|\\_\\\\__, |_____| .__/ \\__, |\\__|_| |_|\\___/|_| |_|")
print("                       |___/      |_|    |___/ \tby CedArctic                 ")
print("\n\n")

# Load Ducky Script and create Python Output file:
duckyScriptPath = input("Drag and drop the ducky script txt file:\n")
f = open(duckyScriptPath,"r",encoding='utf-8')
pythonScript = open("PythonScript.py", "w", encoding='utf-8')

# Write module imports to output file:
pythonScript.write("# Converted using ducky2python by CedArctic (https://github.com/CedArctic/ducky2python) \n")
pythonScript.write("import pyautogui\n")
pythonScript.write("import time\n")

# Convert the Ducky Script lines to a list and stip whitespaces:
duckyScript = f.readlines()
duckyScript = [x.strip() for x in duckyScript] 

''' Ducky Statements fall into one of the following 6 categories:
1. Default Delay	2.Comment	3.Delay 	4.String	5.Repeat	6.Command '''

# Check if there is a default delay:
defaultDelay = 0
if duckyScript[0][:7] == "DEFAULT":
	# Divide by 1000 because the time.sleep command takes seconds as an argument, not ms
	defaultDelay = int(duckyScript[0][:13]) / 1000

# Variables:
previousStatement = ""	
	
# Parallel command lists: 
# The first list contains the ducky commands and the second contains the corresponding pyautogui commands
duckyCommands = ["WINDOWS", "GUI", "APP", "MENU", "SHIFT", "ALT", "CONTROL", "CTRL", "DOWNARROW", "DOWN",
"LEFTARROW", "LEFT", "RIGHTARROW", "RIGHT", "UPARROW", "UP", "BREAK", "PAUSE", "CAPSLOCK", "DELETE", "END",
"ESC", "ESCAPE", "HOME", "INSERT", "NUMLOCK", "PAGEUP", "PAGEDOWN", "PRINTSCREEN", "SCROLLLOCK", "SPACE", 
"TAB", "ENTER", " a", " b", " c", " d", " e", " f", " g", " h", " i", " j", " k", " l", " m", " n", " o", " p", " q", " r", " s", " t",
" u", " v", " w", " x", " y", " z", " A", " B", " C", " D", " E", " F", " G", " H", " I", " J", " K", " L", " M", " N", " O", " P",
" Q", " R", " S", " T", " U", " V", " W", " X", " Y", " Z"]

pyautoguiCommands = ["win", "win", "optionleft", "optionleft", "shift", "alt", "ctrl", "ctrl", "down", "down",
"left", "left", "right", "right", "up", "up", "pause", "pause", "capslock", "delete", "end",
"esc", "escape", "home", "insert", "numlock", "pageup", "pagedown", "printscreen", "scrolllock", "space",
"tab", "enter", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
"u", "v", "w", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
"q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

	
# Process each line from the Ducky Script:
for line in duckyScript:
	
	# Check if the statement is a comment
	if line[0:3] == "REM" :
		previousStatement = line.replace("REM","#")
		
	# Check if the statement is a delay
	elif line[0:5] == "DELAY" :
		previousStatement = "time.sleep(" + str(float(line[6:]) / 1000) + ")"
		
	# Check if the statement is a string
	elif line[0:6] == "STRING" :
		previousStatement = "pyautogui.typewrite(\"" + line[7:] + "\", interval=0.02)"
	
	# Check if the statement is a repeat command - in which case write the previous command times-1 since
	# we write it once more at the end of the for loop anyways
	elif line[0:6] == "REPEAT" :
		for i in range(int(line[7:]) - 1):
			pythonScript.write(previousStatement)
			pythonScript.write("\n")
	
	# If we reach this point, the statement must be a command
	else:
		# Write beginning of command:
		previousStatement = "pyautogui.hotkey("
		# Go through the parallel array and check if the examined key is in the command
		for j in range(len(pyautoguiCommands)):
			if line.find(duckyCommands[j]) != -1:
				previousStatement = previousStatement + "\'" + pyautoguiCommands[j] + "\'," 
		# Remove last comma and add a parenthesis
		previousStatement = previousStatement[:-1] + ")"
		
	# Write Default Delay if it exists:
	if defaultDelay != 0:
		previousStatement = "time.sleep(" + defaultDelay + ")"
	
	# Write command to output file and add a new line \n :
	pythonScript.write(previousStatement)
	pythonScript.write("\n")

# Close output file before exiting
pythonScript.close()	
input("\nConversion complete!\n\nPress any key to close.")
