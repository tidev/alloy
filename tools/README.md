## Tools

### create_test.js

Use this command to create a new test app in the test/apps/testing folder. You should create a test app for every new feature or improvement ticket (and in some cases for bugs).

```javascript
node tools/create_test.js ALOY-1234
```

### create_generated_code.js

Every test app should have "known good" code in the test/apps/testing/ALOY-1234/_generated folder. Once your ticket is done and you're ready to push changes, generate that code using:

```javascript
node tools/create_generated_code.js testing/ALOY-1234
```

The script contains arrays of tests known to have issues with testing generated code. If your app tests a compile error, contains date functions, or should otherwise be skipped, please add the app's name to the appropriate array.

### checkmap.js

Generates and outputs a source code map file that you can use for manual verification of the map.

### compiles.js

Stub (unfinished) file for compiling test app code.
