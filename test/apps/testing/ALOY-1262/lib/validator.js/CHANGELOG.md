# CHANGELOG

**1.1.2**

  - Added 'NotEqualTo' validator (#26)

**1.1.1**

  - Added `IsString` validator (#33)

**1.1.0**

  - Allowed to run `Constraint` against array (#24)
  - Allowed straight RegExp arguments (#22)

**1.0.1**

  - Fixed distribution build

**1.0.0**

  - Fixed AMD / CommonJS loading
  - [BC BREAK] Moved heavy or rarely used Asserts to extras.js

**0.6.1**

  - Fixed `Required()` assert behavior in constraint list (#15)
  - Allow creating Collection directly with Assert (#16)

**0.6.0**

  - Validator.js now throw errors with all unmatched `Required` Asserts, in
    strict mode or not (#11)

**0.5.8**

  - Required validator fails if validates empty array

**0.5.7**

  - Fixed Regexp validator flag (#7)

**0.5.6**

  - Fixed Range validator that did not accept `0` value (#6)

**0.5.5**

  - Fixed GreaterThanOrEqual and LowerThanOrEqual if value is ""
  - Fixed Range if number as string

**0.5.4**

  - Fixed GreaterThanOrEqual and LowerThanOrEqual Asserts if non numeric value
  is given
  - Range Assert now works with strings, arrays and numbers

**0.5.3**

 - Fixed array validation for Length Validator

**0.5.2**

  - Length validator now accepts arrays too

**0.5.1**

  - Violation now stors whole Assert not only Assert.__class__

**0.5.0**

  - it is now possible to validate string/obj against all Asserts with "Any" group

**0.4.11**

  - allowed Callback Assert to have multiple configuration parameters

**0.4.11**

  - allow groups to be numeric

**0.4.10**

  - named validator AMD define
  - added grunt tasks to automate builds

**0.4.7**

  - renamed `Validator.const` to avoid IE7/8 errors

**0.4.6**

  - validator.js is now AMD compliant to work with requirejs

**0.4.5**

  - bower stuff

**0.4.4**

  - fixed Required validator (#5)
  - updated package scripts

**0.4.3**

  - added Mac() and IPv4() Asserts (#1)

**0.4.2**

  - added `strict` validation option to Constraint

**0.4.1**

  - fixed Required Assert
  - successful validation returns now `true` value, not empty array or object anymore
