/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIPROGRESSBAR

#import "TiUIView.h"

@class WebFont;
@interface TiUIProgressBar : TiUIView {
@private
	UIProgressView *progress;
	UIProgressViewStyle style;
	CGFloat max;
	CGFloat min;
	
	BOOL requiresLayout;
	UILabel * messageLabel;
}

-(id)initWithStyle:(UIProgressViewStyle)style;

@end

#endif