/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#if defined(USE_TI_UIIOSCOVERFLOWVIEW) || defined(USE_TI_UICOVERFLOWVIEW)
	

#import "TiUIView.h"
#import "AFOpenFlow/AFOpenFlowView.h"
#import "ImageLoader.h"

@interface TiUIiOSCoverFlowView : TiUIView <AFOpenFlowViewDataSource,AFOpenFlowViewDelegate,ImageLoaderDelegate>
{
@private
	AFOpenFlowView *view;
	NSMutableDictionary* toLoad;
	NSMutableDictionary* loading;
	NSRecursiveLock* loadLock;
	int previous;
}

-(void)setImage:(id)image forIndex:(NSInteger)index;

@end

#endif