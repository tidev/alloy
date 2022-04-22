# Assets
Any assets you put in this directory will be compiled to Android only. 

Put any images you need in your app in the `assets/images` directory following Android naming schemes. Recommended is to put images with `1x`, `2x` and `3x` resolutions (like on iOS) in the following directories

- 1x images in `/assets/android/images/mdpi`
- 2x images in `/assets/android/images/xhdpi`
- 3x images in `/assets/android/images/xxhdpi`

Put any fonts in the `assets/android/fonts` directory.

Any images or fonts you want to access for both platforms can be put outside the `android` directory, but keep in mind any images you've resized for Android specifically will also be compiled to iOS. So recommended flow is to keep these files in the Android directory.