/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIMASKEDIMAGE

#import "TiUIMaskedImageProxy.h"
#import "TiUIMaskedImage.h"

#import "TiUtils.h"

@implementation TiUIMaskedImageProxy

-(void)_initWithProperties:(NSDictionary *)properties
{
	[self replaceValue:NUMINT(kCGBlendModeSourceIn) forKey:@"mode" notification:NO];
	[super _initWithProperties:properties];
}


@end

#endif