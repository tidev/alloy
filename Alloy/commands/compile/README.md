Files related to the `alloy compile` command:

* ast - optimizer, compressor, and related AST scripts
* parsers - parsers for specific UI components
* BuildLog.js - generates the build/alloy/build.json file which is used to track files that could be reused by subsequent compile operations
* CompilerMakeFile.js - class used during JMK processing
* compilerUtils.js - utility functions used by the compiler, such as validation of nodes, getting parser arguments, etc. But this script also defines the main code generating functions: CU.generateNode and CU.generateNodeExtended which are used in processing nearly every XML tag.
* index.js - main entry point for the alloy compiler
* optimizer.js - optimizes generated code to speed up compiled apps
* Orphanage.js - class for tracking files that could be re-used by subsequent compile operations
* sourceMapper.js - generates source-code maps for debugging
* styler.js - processes style information for UI components, including merging styles set in XML and TSS
