/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#if defined(USE_TI_XML) || defined(USE_TI_NETWORK)

#import "TiDOMNodeProxy.h"
#import "GDataXMLNode.h"

@interface TiDOMAttrProxy : TiDOMNodeProxy {
@private
	NSString *name;
	NSString *value;
    BOOL isSpecified;
	GDataXMLElement *owner;
}

@property(nonatomic,readonly) id name;
@property(nonatomic,copy,readwrite) id value;
@property(nonatomic,readonly) id ownerElement;
@property(nonatomic,readonly) id specified;

-(void)setAttribute:(NSString*)name value:(NSString*)value owner:(GDataXMLElement*)owner;
-(void)setIsSpecified:(BOOL)isSpecified_;

@end

#endif