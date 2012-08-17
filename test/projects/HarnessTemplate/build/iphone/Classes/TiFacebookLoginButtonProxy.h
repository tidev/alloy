/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2011 by HarnessTemplate, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_FACEBOOK
#import "TiViewProxy.h"
#import "FacebookModule.h"
#import "TiFacebookLoginButton.h"

@interface TiFacebookLoginButtonProxy : TiViewProxy {

	FacebookModule *module;
}

-(id)_initWithPageContext:(id<TiEvaluator>)context_ args:(id)args module:(FacebookModule*)module_;

@property(nonatomic,readonly) FacebookModule *_module;

-(void)internalSetWidth:(id)width;
-(void)internalSetHeight:(id)height;

@end
#endif