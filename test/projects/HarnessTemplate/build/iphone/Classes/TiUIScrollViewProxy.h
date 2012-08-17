/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UISCROLLVIEW

#import "TiViewProxy.h"

@interface TiUIScrollViewProxy : TiViewProxy<UIScrollViewDelegate> 
{
    TiPoint * contentOffset;
}
-(void) setContentOffset:(id)value withObject:(id)animated;
-(void)layoutChildrenAfterContentSize:(BOOL)optimize;

@end

#endif