# Assets
Any assets you put in this directory will be compiled to iOS only. 

Put any images you need in your app in the `assets/iphone/images` directory following iOS naming schemes (`file.png`, `file@2x.png`, `file@3x.png`)

Put any fonts in the `assets/iphone/fonts` directory.

Any images or fonts you want to access for both platforms can be put outside the `iphone` directory. but keep in mind the @2x and @3x files for iOS will be compiled to Android too in that case, so best practice is to keep images in both Android and iOS directories to prevent a bigger app size.