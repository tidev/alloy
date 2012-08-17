/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiBase.h"

#ifdef USE_TI_UIIPADSPLITWINDOW

// if we use a split window, we need to include the ipad popover
#ifndef USE_TI_UIIPADPOPOVER
#define USE_TI_UIIPADPOPOVER
#endif

#import "TiUIView.h"
#import "MGSplitViewController.h"

@class TiUIiPadPopoverProxy;

@interface TiUIiPadSplitWindow : TiUIView<UISplitViewControllerDelegate,MGSplitViewControllerDelegate> {

@private
	MGSplitViewController *controller;
}

-(UIViewController*)controller;
-(void)setToolbar:(id)items withObject:(id)properties;
-(void)setMasterPopupVisible_:(id)value;

@end

#endif
