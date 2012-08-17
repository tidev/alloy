/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UISLIDER

#import "TiUISliderProxy.h"

NSArray* sliderKeySequence;

@implementation TiUISliderProxy

-(NSArray *)keySequence
{
	if (sliderKeySequence == nil)
	{
		sliderKeySequence = [[NSArray arrayWithObjects:@"min",@"max",@"value",nil] retain];
	}
	return sliderKeySequence;
}

-(UIViewAutoresizing)verifyAutoresizing:(UIViewAutoresizing)suggestedResizing
{
	return suggestedResizing & ~UIViewAutoresizingFlexibleHeight;
}

-(TiDimension)defaultAutoHeightBehavior:(id)unused
{
    return TiDimensionAutoSize;
}


USE_VIEW_FOR_VERIFY_HEIGHT

@end

#endif