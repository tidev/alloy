/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#if defined(USE_TI_XML) || defined(USE_TI_NETWORK)

#import "TiProxy.h"
#import "GDataXMLNode.h"

@interface TiDOMNodeListProxy : TiProxy {
@private
	NSArray *nodes;
}

@property(nonatomic,readonly) NSNumber *length;
-(void)setNodes:(NSArray*)nodes_;
-(id)item:(id)args;
-(NSNumber*)length;



@end

#endif