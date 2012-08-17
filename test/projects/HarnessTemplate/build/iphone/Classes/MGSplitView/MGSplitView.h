/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2011 by HarnessTemplate, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIIPADSPLITWINDOW

#import <UIKit/UIKit.h>
#import "MGSplitViewController.h"

@interface MGSplitView : UIView {
    MGSplitViewController* controller;
    BOOL layingOut;
    BOOL singleLayout;
}
@property(nonatomic,readwrite,assign) BOOL layingOut;

- (id)initWithFrame:(CGRect)frame controller:(MGSplitViewController*)controller_;
-(void)setSingleLayout;
@end

#endif