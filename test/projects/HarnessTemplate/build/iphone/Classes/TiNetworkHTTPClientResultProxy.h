/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_NETWORK

#import "TiProxy.h"
#import "TiNetworkHTTPClientProxy.h"

@interface TiNetworkHTTPClientResultProxy : TiProxy {
@private
	TiNetworkHTTPClientProxy *delegate;
	NSDictionary* responseHeaders;
}

-(id)initWithDelegate:(TiNetworkHTTPClientProxy*)proxy;

@end


#endif