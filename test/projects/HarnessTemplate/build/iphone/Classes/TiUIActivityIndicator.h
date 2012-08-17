/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIACTIVITYINDICATOR

#import "TiUIView.h"

@class WebFont;
@interface TiUIActivityIndicator : TiUIView<LayoutAutosizing> {
@private
	UIActivityIndicatorView *indicatorView;
	UIActivityIndicatorViewStyle style;
	
	WebFont * fontDesc;
	UIColor * textColor;
	UILabel * messageLabel;
}

-(UIActivityIndicatorView*)indicatorView;
-(UILabel *)messageLabel;

@end

#endif