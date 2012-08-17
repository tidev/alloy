/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIWINDOW

#import "TiUIView.h"
#import "TiWindowProxy.h"
#import "KrollBridge.h"
#import "TiViewProxy.h"

//TODO: we probably should split this ViewProxy into a a separate TiUIView like normal

@interface TiUIWindowProxy : TiWindowProxy 
{
@private
	KrollBridge *context;
	BOOL hasToolbar;
	BOOL contextReady;
	BOOL animating;
	UIImageView *barImageView;
	NSURL *oldBaseURL;
	id latch;
}

-(void)_refreshBackButton;
-(void)_updateTitleView;
-(void)boot:(BOOL)timeout args:(id)args;

@end

#endif